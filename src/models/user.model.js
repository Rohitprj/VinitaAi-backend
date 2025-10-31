import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // password: {
    //   type: String,
    // },
    phone: {
      type: String,
      required: [true, "Phone no is required"],
      unique: true,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "पुरुष", "महिला", "अन्य"],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    authToken: {
      type: String,
      select: false,
    },
    booksRead: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.isCorrectPassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

export const User = mongoose.model("User", userSchema);
