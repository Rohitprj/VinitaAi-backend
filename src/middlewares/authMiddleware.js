import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId).select("+authToken");
    if (!user)
      return res.status(401).json({ message: "Invalid token (no user)" });
    if (!user.authToken || user.authToken !== token) {
      return res
        .status(401)
        .json({ message: "Token is not active (please login)" });
    }

    req.user = { id: user._id, email: user.email };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error in auth middleware" });
  }
};
