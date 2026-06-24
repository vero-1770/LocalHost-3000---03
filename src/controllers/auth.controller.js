import { prisma } from '../prisma/prismaClient.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Generamos tokens
const generateAccessAndRefreshTokens = (userId, username) => {
    // ACCESS TOKEN
    const accessToken = jwt.sign(
        { id: userId, username }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '15m' }// 
    );
    // REFRESH TOKEN
    const refreshToken = jwt.sign(
        { id: userId }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

const isProduction = process.env.NODE_ENV === 'production';

// COOKIE
const COOKIE_OPTIONS = {
    httpOnly: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    // En producción (Vercel) requiere HTTPS y None. En desarrollo (Local) acepta HTTP y Lax
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña requeridos" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        const passwordOk = await bcrypt.compare(password, user.passwordHash);

        if (!passwordOk) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        // Generamos los tokens incluyendo el username en el payload del access
        const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user.id, user.username);

        // Guardar el hash o token en la base de datos Neon
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        // Enviamos el refreshToken mediante cookie segura adaptada al entorno
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        return res.json({
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl
            }
        });

    } catch (error) {
        console.error("❌ Error detectado en Login:", error);
        return res.status(500).json({ error: "Error interno del servidor en el proceso de autenticación" });
    }
};

export const refreshToken = async (req, res) => {
    // Buscamos el token en la cookie
    const tokenFromCookie = req.cookies?.refreshToken;

    if (!tokenFromCookie) {
        return res.status(401).json({ message: "No autorizado: Sesión inexistente" });
    }

    try {
        const decoded = jwt.verify(tokenFromCookie, process.env.REFRESH_TOKEN_SECRET);
        
        // Verificamos estricta coincidencia en la BD
        const user = await prisma.user.findUnique({ 
            where: { id: decoded.id } 
        });
        
        if (!user || user.refreshToken !== tokenFromCookie) {
            return res.status(403).json({ message: "Token inválido o revocado" });
        }

        // Emitimos la nueva pareja de tokens
        const newTokens = generateAccessAndRefreshTokens(user.id, user.username);
        
        await prisma.user.update({ 
            where: { id: user.id }, 
            data: { refreshToken: newTokens.refreshToken } 
        });

        res.cookie('refreshToken', newTokens.refreshToken, COOKIE_OPTIONS);

        return res.json({ accessToken: newTokens.accessToken });
    } catch (err) {
        console.error("❌ Error en renovación de Refresh Token:", err);
        // Si el token falló por expiración, limpiamos la cookie
        res.clearCookie('refreshToken', {
            path: '/',
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        });
        return res.status(403).json({ message: "Sesión expirada, por favor ingrese nuevamente" });
    }
};

// LOGOUT
export const logout = async (req, res) => {
    const clearOptions = {
        path: '/',
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    };

    try {
        const tokenFromCookie = req.cookies?.refreshToken;

        if (tokenFromCookie) {
            try {
                const decoded = jwt.verify(tokenFromCookie, process.env.REFRESH_TOKEN_SECRET);
                // Eliminamos el token de la BD
                await prisma.user.update({
                    where: { id: decoded.id },
                    data: { refreshToken: null }
                });
            } catch (jwtError) {
                // Si el token ya había expirado y jwt.verify falla, ignoramos el error de firma
                // pero permitimos que continúe para limpiar la cookie de todos modos
                console.error("Token inválido o expirado en logout:", jwtError.message);
            }
        }

        res.clearCookie('refreshToken', clearOptions);
        return res.status(200).json({ message: "Logout exitoso" });

    } catch (error) {
        console.error("❌ Error en Logout:", error);
        // Limpiamos la cookie pase lo que pase
        res.clearCookie('refreshToken', clearOptions);
        return res.status(200).json({ message: "Logout forzado" });
    }
};