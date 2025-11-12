import mongoose, { Schema } from "mongoose";

const userClicksSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clicks: {
    Shop: { type: Number, default: 0 },
    Books: { type: Number, default: 0 },
    Follow: { type: Number, default: 0 },
    Meet: { type: Number, default: 0 },
  },
});

export const UserClicks = mongoose.model("Clicks", userClicksSchema);
