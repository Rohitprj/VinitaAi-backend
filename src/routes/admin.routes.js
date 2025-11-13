import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  getUserClicks,
  getUserQuestions,
} from "../controllers/admin.controller.js";
import { adminAuth } from "../middlewares/adminMiddleware.js";
import { login, logout } from "../controllers/user.controller.js";

const router = Router();

// Admin routes
router.get("/user-clicks", adminAuth, getUserClicks);
router.post("/login", login);
router.get("/", adminAuth, getAllUsers);
router.post("/logout", logout);
router.get("/user-que/:userId", adminAuth, getUserQuestions);
router.get("/:userId", adminAuth, getUserById);

export default router;
