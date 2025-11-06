import { Router } from "express";
import {
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

export default router;
