const VALID_TYPES = ["Hotel", "Hostel", "Cabaña", "Departamento", "Camping"];

export const validateAccommodation = (body) => {
  const errors = [];

  // Validar objeto vacío
  if (!body || Object.keys(body).length === 0) {
    errors.push({
      field: "body",
      message: "El cuerpo de la solicitud no puede estar vacío",
    });
    return errors;
  }

  // Validar name
  if (!body.name || body.name.trim() === "") {
    errors.push({
      field: "name",
      message: "El nombre es obligatorio",
    });
  }

  // Validar type
  if (!body.type || body.type.trim() === "") {
    errors.push({
      field: "type",
      message: "El tipo de alojamiento es obligatorio",
    });
  } else if (!VALID_TYPES.includes(body.type)) {
    errors.push({
      field: "type",
      message: `El tipo debe ser uno de los siguientes: ${VALID_TYPES.join(", ")}`,
    });
  }

  // Validar description
  if (!body.description || body.description.trim() === "") {
    errors.push({
      field: "description",
      message: "La descripción es obligatoria",
    });
  }

  // Validar pricePerNight
  if (body.pricePerNight === undefined || body.pricePerNight === null) {
    errors.push({
      field: "pricePerNight",
      message: "El precio por noche es obligatorio",
    });
  } else if (isNaN(Number(body.pricePerNight)) || Number(body.pricePerNight) <= 0) {
    errors.push({
      field: "pricePerNight",
      message: "El precio por noche debe ser un número válido mayor a 0",
    });
  }

  // Validar stars (opcional pero si viene debe ser entre 1 y 5)
  if (body.stars !== undefined && body.stars !== null) {
    const stars = Number(body.stars);
    if (isNaN(stars) || !Number.isInteger(stars) || stars < 1 || stars > 5) {
      errors.push({
        field: "stars",
        message: "Las estrellas deben ser un número entero entre 1 y 5",
      });
    }
  }

  // Validar location
  if (!body.location || body.location.trim() === "") {
    errors.push({
      field: "location",
      message: "La ubicación es obligatoria",
    });
  }

  // Validar destinationId
  if (body.destinationId === undefined || body.destinationId === null) {
    errors.push({
      field: "destinationId",
      message: "El ID del destino es obligatorio",
    });
  } else if (isNaN(Number(body.destinationId)) || Number(body.destinationId) <= 0) {
    errors.push({
      field: "destinationId",
      message: "El ID del destino debe ser un número válido",
    });
  }

  return errors;
};