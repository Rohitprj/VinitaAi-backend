import { UserClicks } from "../models/clicks.model.js";
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

const getUserClicks = async (req, res) => {
  try {
    const userClicks = await UserClicks.find().populate(
      "userId",
      "username email"
    );
    // console.log("user clicks", userClicks);
    return res.status(200).json({
      success: true,
      data: userClicks,
    });
  } catch (error) {
    console.log("user click", error);
    return res.status(500).json({
      message: "Users data gets successfully",
    });
  }
  // try {
  //   const clicks = await UserClicks.find().populate("userId", "username email");
  //   res.status(200).json(clicks);
  // } catch (err) {
  //   res.status(500).json({ message: err.message });
  // }
};
export { getAllUsers, getUserById, getUserClicks };
