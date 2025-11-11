import mongoose, { Schema } from "mongoose";

const userClicksSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clicks: {
    shop: { type: Number, default: 0 },
    books: { type: Number, default: 0 },
    follow: { type: Number, default: 0 },
    meet: { type: Number, default: 0 },
  },
});

export const UserClicks = mongoose.model("Clicks", userClicksSchema);
