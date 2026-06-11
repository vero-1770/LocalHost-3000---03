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
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Generar tokens
    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user.id);

    // Guardar Refresh Token en BD
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });

    // Enviar el Refresh Token en una Cookie HttpOnly
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.json({ accessToken});
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
    
    const userId = req.user.id; 

    // Limpiamos el refresh token de la BD
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null }
    });

    // Limpiamos la cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(200).json({ message: "Sesión cerrada correctamente" });
};