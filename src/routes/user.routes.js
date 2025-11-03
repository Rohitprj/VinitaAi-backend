import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", requireAuth, logout);
router.get("/", requireAuth, getAllUsers);
router.get("/:userId", requireAuth, getUserById);

export default router;
