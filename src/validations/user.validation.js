export const validateUser = (body) => {
    const errors = [];

    //Validar objeto vacio
    if (!body || Object.keys(body).length === 0) {
        errors.push({
            field: "body",
            message: "El cuerpo de la solicitud no puede estar vacio",
        });
        return errors;
    }

    //Validar username
    if (!body.username || body.username.trim() === "") {
        errors.push({
            field: "username",
            message: "El nombre de usuario es obligatorio",
        });
    }

    //Validar email
    if (!body.email || body.email.trim() === "") {
        errors.push({
            field: "email",
            message: "El email es obligatorio",
        });
    } else if (!body.email.includes("@")) {
        errors.push({
            field: "email",
            message: "El email debe tener un formato valido",
        });
    }

    //Validar avatarUrl si viene
    if (body.avatarUrl !== undefined && body.avatarUrl !==null) {
        if (typeof body.avatarUrl !== "string" || body.avatarUrl.trim() === "") {
            errors.push({
                field: "avatarUrl",
                message: "La URL del avatar debe ser un texto valido",
            });
        }
    }
    return errors;
};

