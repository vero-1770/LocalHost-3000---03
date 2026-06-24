export const validateDestino = (body) => {
    const errors = [];

    // Validar objeto vacío
    if (!body || Object.keys(body).length === 0) {
        errors.push({ field: "body", message: "El cuerpo de la solicitud no puede estar vacío" });
        return errors;
    }

    // Validar name
    if (!body.name || body.name.trim() === "") {
        errors.push({ field: "name", message: "El nombre es obligatorio" });
    }

    // Validar description
    if (!body.description || body.description.trim() === "") {
        errors.push({ field: "description", message: "La descripción es obligatoria" });
    }

    // Validar country
    if (!body.country || body.country.trim() === "") {
        errors.push({ field: "country", message: "El país es obligatorio" });
    }

    // Validar location
    if (!body.location || body.location.trim() === "") {
        errors.push({ field: "location", message: "La ubicación (location) es obligatoria" });
    }

    // Validar budget (Precio)
    if (body.budget === undefined || body.budget === null) {
        errors.push({ field: "budget", message: "El presupuesto/precio es obligatorio" });
    } else if (isNaN(Number(body.budget)) || Number(body.budget) <= 0){
        errors.push({ field: "budget", message: "El presupuesto debe ser un número válido mayor a 0" });
    }

    return errors;
};