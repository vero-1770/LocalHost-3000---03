import jwt from 'jsonwebtoken';

/**
 * Middleware estricto: bloquea el acceso si el token no es válido o no hay token
 * (votar, guardar favoritos, etc)
*/
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
        
        // Adjuntamos los datos (payload) del usuario al objeto request para usarlos en el controlador
        req.user = verified; 
        
        return next(); // Continuamos al siguiente middleware o controlador
    } catch (error) {
        res.status(403).json({ error: "Acceso denegado: Token inválido o expirado" });
    }
};

/**
 * Middleware opcional: no bloquea al usuario si no está autenticado.
 * Identifica si es un usuario registrado o un invitado.
 * Ejemplo: GET /api/destinos/:id
*/
export const optionalAuthenticate = (req, res, next) => {
    // Obtenemos el token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // INVITADO
    if(!token){
        req.user = null;
        return next();
    }

    // AUTENTICADO
    try{
        // Verificamos el token con la misma clave secreta que usamos para crearlo
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Adjuntamos los datos (payload) del usuario al objeto request para usarlos en el controlador
        req.user = verified;

        return next(); // Continuamos al siguiente middleware o controlador
    }catch (error){
        // En un middleware opcional, si el token está corrupto o expirado, 
        // tratamos al usuario como invitado en lugar de romper la app
        req.user = null;
        return next();
    }
};