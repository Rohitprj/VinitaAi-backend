import { Router } from "express";
import {
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);

export default router;
