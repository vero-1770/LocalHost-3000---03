export const errorHandler = (err, req, res, next) => {
    //Logear el error en la terminal para debugging
    console.error(err);

    //Determinar el status Code
    const status = err.status || err.statusCode || 500; 

    //Determinar el mensaje segun el error
    let message = "Error interno del servidor";

    if (status === 400) {
        message = err.message || "Datos invalidos";
    } else if (status === 404) {
        message = err.message || "Recurso no encontrado";
    }

    //NUNCA exponer detalles internos de Prisma al cliente
    res.status(status).json({
        success: false,
        status,
        message,
    });
};