import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Obtenemos el token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // El formato es "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado: Token no proporcionado" });
    }

    try {
        // Verificamos el token con la misma clave secreta que usamos para crearlo
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Adjuntamos los datos del usuario al objeto request para usarlos en el controlador
        req.user = verified; 
        
        next(); // Continuamos al siguiente middleware o controlador
    } catch (error) {
        res.status(403).json({ error: "Acceso denegado: Token inválido o expirado" });
    }
};