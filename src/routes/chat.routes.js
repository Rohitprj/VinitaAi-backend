import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
  getChatHistory,
  handlePythonQuery,
  handlePythonVoice,
} from "../controllers/chat.controller.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";

const router = Router();

router.get("/history", requireAuth, getChatHistory);
router.post("/query", optionalAuth, handlePythonQuery);
router.post("/voice", requireAuth, handlePythonVoice);

export default router;
