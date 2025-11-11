import { Router } from "express";
import { trackClicks } from "../controllers/clicks.controller.js";

const router = Router();

router.post("/track-click", trackClicks);

export default router;
