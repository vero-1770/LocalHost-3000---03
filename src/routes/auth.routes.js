import { Router } from "express";
import { login, refreshToken, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { prisma } from "../prisma/prismaClient.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout",verifyToken, logout);
router.get("/me", verifyToken, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {id: req.user.id},
        select: {id: true, username: true, email: true}
    });
    
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
});

export default router;