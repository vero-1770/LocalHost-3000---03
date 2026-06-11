import { Router } from "express";
import { login, refreshToken, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout",verifyToken, logout);

export default router;