// Importo modulos
import { prisma } from '../prisma/prismaClient.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Genero Tokens
const generateAccessAndRefreshTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("EMAIL:", email);

        const user = await prisma.user.findUnique({
            where: { email }
        });

        console.log("USER:", user);

        if (!user) {
            return res.status(401).json({
                message: "Usuario no encontrado"
            });
        }

        const passwordOk = await bcrypt.compare(
            password,
            user.passwordHash
        );

        console.log("PASSWORD OK:", passwordOk);

        if (!passwordOk) {
            return res.status(401).json({
                message: "Credenciales incorrectas"
            });
        }

        const { accessToken, refreshToken } =
            generateAccessAndRefreshTokens(user.id);

        res.json({
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:");
        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
};

export const refreshToken = async (req, res) => {
    // Obtenemos el token de las cookies que envía el navegador
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: "No autorizado" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Verificar que el token existe en BD para este usuario
        const user = await prisma.user.findFirst({ where: { id: decoded.id, refreshToken: refreshToken } });
        if (!user) return res.status(403).json({ message: "Token inválido" });

        const newTokens = generateAccessAndRefreshTokens(user.id);
        
        // Actualizar refresh token en BD
        await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newTokens.refreshToken } });

        res.json(newTokens);
    } catch (err) {
        res.status(403).json({ message: "Sesión expirada" });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );

            await prisma.user.update({
                where: { id: decoded.id },
                data: { refreshToken: null }
            });
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return res.status(200).json({ message: "Logout exitoso" });

    } catch (error) {
        console.error(error);
        return res.status(200).json({ message: "Logout forzado" });
    }
};