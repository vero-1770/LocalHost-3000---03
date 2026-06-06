export const validateDestino = (body) => {
    const errors = [];

    //Validar objeto vacio
    if (!body || Object.keys(body).length === 0) {
        errors.push({
            field: "body",
            message: "El cuerpo de la solicitud no puede estar vacio",
        });
        return errors;
    }

    //Validar nombre
    if (!body.nombre || body.nombre.trim() === "") {
        errors.push({
            field: "nombre",
            message: "El nombre es obligatorio",
        });
    }

    //Validar descripcion
    if (!body.descripcion || body.descripcion.trim() === "") {
        errors.push({
            field: "descripcion",
            message: "La descripcion es obligatoria",
        });
    }

    //Validar pais
    if (!body.pais || body.pais.trim() === "") {
        errors.push({
            field: "pais",
            message: "El pais es obligatorio",
        });
    }

    //Validar ciudad
    if (!body.ciudad || body.ciudad.trim() === "") {
        errors.push({
            field: "ciudad",
            message: "La ciudad es obligatoria",
        });
    }

    //Validar Precio
    if (body.precio === undefined || body.precio === null) {
        errors.push({
            field: "precio",
            message: "El precio es obligatorio",
        });
    } else if (isNaN(Number(body.precio)) || Number(body.precio) <= 0){
        errors.push({
            field: "precio",
            message: "El precio debe ser un numero valido mayor a 0",
        });
    }

    return errors;
};