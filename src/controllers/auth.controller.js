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

// Configuración de cookie compartida para Producción (Vercel) y Local
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,        // Forzado en true porque Vercel maneja HTTPS sí o sí
    sameSite: 'none',    // VITAL: Permite enviar cookies entre el dominio de Vercel y tu localhost:5173
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
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

        // Guardar refreshToken en la BD
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        // Enviar refreshToken en cookie con las nuevas opciones para Vercel
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

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

        // CORRECCIÓN: Volvemos a inyectar la cookie renovada en el navegador
        res.cookie('refreshToken', newTokens.refreshToken, COOKIE_OPTIONS);

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

        // Limpiamos la cookie usando la misma configuración de origen cruzado
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });

        return res.status(200).json({ message: "Logout exitoso" });

    } catch (error) {
        console.error(error);
        return res.status(200).json({ message: "Logout forzado" });
    }
};