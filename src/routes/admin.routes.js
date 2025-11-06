import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/admin.controller.js";
import { adminAuth } from "../middlewares/adminMiddleware.js";

const router = Router();

// Admin routes
router.get("/", adminAuth, getAllUsers);
router.get("/:userId", adminAuth, getUserById);

export default router;
