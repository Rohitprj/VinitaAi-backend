import axios from "axios";

// const PYTHON_API_URL = process.env.PYTHON_API_URL;
const PYTHON_API_URL = "http://localhost:8000";

const pythonApiService = {
  queryPythonApi: async (question, vectorStore = "faiss") => {
    try {
      console.log("Started");
      const response = await axios.post(
        `${PYTHON_API_URL}/api/query?vector_store=${vectorStore}`,
        { question }
      );
      console.log("Worked", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error querying Python API:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to get response from Python query API.");
    }
  },

  voicePythonApi: async (question, audioData, vectorStore = "faiss") => {
    try {
      // For voice, the Python API expects 'question' and 'audio_data' in the body.
      // 'audioData' would typically be a Buffer or Blob.
      const response = await axios.post(
        `${PYTHON_API_URL}/api/voice?vector_store=${vectorStore}`,
        { question, audio_data: audioData },
        {
          responseType: "arraybuffer", // Important for handling binary data like audio
        }
      );
      return response.data; // This will be the audio buffer
    } catch (error) {
      console.error(
        "Error calling Python voice API:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to get response from Python voice API.");
    }
  },
};

// module.exports = pythonApiService;
export default pythonApiService;
