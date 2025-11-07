import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/admin.controller.js";
import { adminAuth } from "../middlewares/adminMiddleware.js";
import { login, logout } from "../controllers/user.controller.js";

const router = Router();

// Admin routes
router.post("/login", login);
router.get("/", adminAuth, getAllUsers);
router.get("/:userId", adminAuth, getUserById);
router.post("/logout", logout);

export default router;
