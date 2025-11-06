import { User } from "../models/user.model.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-authToken");
    return res.status(200).json({
      success: true,
      users,
      count: users.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log("userId", userId);

    const user = await User.findById(userId).select("-authToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
export { getAllUsers, getUserById };
