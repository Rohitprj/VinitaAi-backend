import { ChatHistory } from "../models/chat.model.js";

export const getFullChatHistory = async (userId) => {
  try {
    const historyDoc = await ChatHistory.findOne(
      { userId: userId },
      { chats: 1, _id: 0 }
    );
    return historyDoc ? historyDoc.chats : [];
  } catch (error) {
    console.error(error);
  }
};
