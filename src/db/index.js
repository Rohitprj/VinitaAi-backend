import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/Vinita-Ai`
    );
    console.log("MongoDB connected", connectionInstance.connection.host);
  } catch (error) {
    console.log("Error while connecting :", error);
    process.exit(1);
  }
};

export default connectDB;
