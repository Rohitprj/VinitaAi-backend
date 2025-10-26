// src/middleware/optionalAuth.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
      const user = await User.findById(decoded.userId);
      if (user) req.user = { id: user._id, email: user.email };
    } catch {
      req.user = null; // ignore invalid token
    }
  } else {
    req.user = null;
  }

  next();
};
