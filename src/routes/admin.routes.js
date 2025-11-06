import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { getAllUsers, getUserById } from "../controllers/admin.controller.js";

const router = Router();

// Admin routes
router.get("/", requireAuth, getAllUsers);
router.get("/:userId", requireAuth, getUserById);

export default router;
