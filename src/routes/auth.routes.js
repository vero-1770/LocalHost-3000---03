import { Router } from "express";
import jwt from "jsonwebtoken";
import { login, refreshToken, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { prisma } from "../prisma/prismaClient.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", verifyToken, logout);

// Diferenciamos entre Invitados y Usuarios expirados
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const hasRefreshToken = req.cookies?.refreshToken;

        // INVITADO
        if (!token && !hasRefreshToken) {
            return res.status(200).json(null);
        }

        // FALTA TOKEN PERO HAY COOKIE
        if (!token && hasRefreshToken) {
            return res.status(401).json({ message: "Requiere renovar token" });
        }

        // HAY TOKEN
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, username: true, email: true, role: true }
        });
        
        if (!user) {
            return res.status(200).json(null); 
        }

        // SESIÓN VALIDA
        return res.status(200).json(user);

    } catch (error) {
        // Si el jwt.verify falla (ej: expiró) pero el usuario tiene cookie de refresco,
        // disparamos el 401 para que Axios inicie el flujo de renovación automática.
        if (req.cookies?.refreshToken) {
            return res.status(401).json({ message: "Token expirado, iniciando refresco..." });
        }
        
        // Si falló y no hay cookie, es simplemente un invitado.
        return res.status(200).json(null);
    }
});

export default router;