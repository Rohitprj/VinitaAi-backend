import mongoose, { Schema } from "mongoose";

const sourceSchema = new Schema(
  {
    sourceUrl: {
      type: String,
      required: true,
    },
    contentPreview: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const chatMessageSchema = new Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
  },
  sources: [sourceSchema],
});

const chatHistorySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    chats: {
      type: [chatMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
