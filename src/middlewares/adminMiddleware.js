/**
 * Bloquea el acceso si el usuario no tiene rol ADMIN.
 * DEBE EJECUTARSE SIEMPRE DESPUÉS DE verifyToken(authMiddleware).
 */
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "No autorizado: Autenticación requerida" });
    }

    // Validamos que el rol en el JWT coincida con ADMIN
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ 
            error: "Acceso denegado: Se requieren privilegios de Administrador" 
        });
    }

    return next();
};