import pythonApiService from "../services/pythonApiService.js";
import { ChatHistory } from "../models/chat.model.js";
import { getFullChatHistory } from "../utils/chatHistoryService.js";
import {
  createGuestSession,
  incrementGuestChat,
  getGuestSession,
  GUEST_CHAT_LIMIT,
} from "../services/guestSessionService.js";

const getChatHistory = async (req, res) => {
  const userId = req.user.id;

  console.log("Authenticated userId from JWT:", userId);

  try {
    const chatHistory = await ChatHistory.find({ userId: userId }).sort({
      timestamp: 1,
    });

    if (!chatHistory || chatHistory.length === 0) {
      return res
        .status(200)
        .json({ message: "No chat history found for this user.", history: [] });
    }

    res.json({ history: chatHistory });
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    res.status(500).json({
      message: "Failed to retrieve chat history.",
      error: error.message,
    });
  }
};

// const handlePythonQuery = async (req, res) => {
//   const { question, vector_store } = req.body;
//   const userId = req.user.id;
//   const guestId = req.headers["x-guest-id"];
//   console.log("GUEST:::", guestId);

//   const user = req.user;
//   console.log("USER :::", user);

//   console.log("UserId-Extract", userId);

//   if (!question) {
//     return res.status(400).json({ message: "Question is required." });
//   }

//   try {
//     const pythonResponse = await pythonApiService.queryPythonApi(
//       question,
//       vector_store
//     );

//     const newChat = {
//       question: question,
//       answer: pythonResponse.answer,
//       sources: (pythonResponse.sources || []).map((src) => ({
//         sourceUrl: src.source,
//         contentPreview: src.content,
//       })),
//       timestamp: new Date(),
//     };
//     await ChatHistory.updateOne(
//       { userId: userId },
//       { $push: { chats: newChat }, $set: { updatedAt: new Date() } },
//       { upsert: true }
//     );

//     const fullHistory = await getFullChatHistory(userId);

//     const fullResponse = {
//       currentAnswer: pythonResponse,
//       history: fullHistory,
//     };

//     // console.log("handlePythonQuery", fullResponse);
//     res.status(200).json(fullResponse);
//   } catch (error) {
//     console.error("Error in handlePythonQuery:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

const handlePythonQuery = async (req, res) => {
  try {
    const { question, vector_store } = req.body;
    if (!question)
      return res.status(400).json({ message: "Question is required" });

    const user = req.user;
    const isGuest = !user;

    // 🟡 Guest Flow
    let guestId, guestSession, currentCount;
    if (isGuest) {
      guestId = req.headers["x-guest-id"];

      // New guest → create session
      if (!guestId || !getGuestSession(guestId)) {
        guestId = createGuestSession();
        currentCount = 1;
      } else {
        currentCount = incrementGuestChat(guestId);
      }

      // Enforce chat limit
      if (currentCount > GUEST_CHAT_LIMIT) {
        return res.status(403).json({
          message:
            "You've reached your free 5-chat limit. Please register or log in to continue.",
        });
      }

      res.setHeader("x-guest-id", guestId); // send it back to client
    }

    //  Ask Python service
    const pythonResponse = await pythonApiService.queryPythonApi(
      question,
      vector_store
    );

    //  Save only for logged-in users
    if (!isGuest) {
      const newChat = {
        question,
        answer: pythonResponse.answer,
        sources: (pythonResponse.sources || []).map((src) => ({
          sourceUrl: src.source,
          contentPreview: src.content,
        })),
        timestamp: new Date(),
      };

      await ChatHistory.updateOne(
        { userId: user.id },
        { $push: { chats: newChat }, $set: { updatedAt: new Date() } },
        { upsert: true }
      );
    }

    // 🎯 Response
    return res.json({
      currentAnswer: pythonResponse,
      ...(isGuest && {
        remainingFreeChats: GUEST_CHAT_LIMIT - currentCount,
        guestId,
      }),
    });
  } catch (err) {
    console.error("Error in handlePythonQuery:", err);
    res.status(500).json({ message: "Server error in handlePythonQuery" });
  }
};

const handlePythonVoice = async (req, res) => {
  const { question, audio_data, vector_store } = req.body;

  if (!question || !audio_data) {
    return res
      .status(400)
      .json({ message: "Question and audio_data are required." });
  }

  try {
    const audioBuffer = Buffer.from(audio_data, "base64"); // Assuming audio_data is base64 encoded
    const pythonResponse = await pythonApiService.voicePythonApi(
      question,
      audioBuffer,
      vector_store
    );

    res.set({
      "Content-Type": "audio/mp3",
      "Content-Disposition": "attachment; filename=response.mp3",
      "Content-Length": pythonResponse.length,
    });
    res.send(pythonResponse);
  } catch (error) {
    console.error("Error in handlePythonVoice:", error);
    res.status(500).json({ message: error.message });
  }
};

export { getChatHistory, handlePythonQuery, handlePythonVoice };
