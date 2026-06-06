const VALID_TYPES = ["Avión", "Autobús", "Tren", "Auto", "Barco", "Colectivo", "Micro"];

export const validateTransportation = (body) => {
  const errors = [];

  // Validar objeto vacío
  if (!body || Object.keys(body).length === 0) {
    errors.push({
      field: "body",
      message: "El cuerpo de la solicitud no puede estar vacío",
    });
    return errors;
  }

  // Validar type
  if (!body.type || body.type.trim() === "") {
    errors.push({
      field: "type",
      message: "El tipo de transporte es obligatorio",
    });
  } else if (!VALID_TYPES.includes(body.type)) {
    errors.push({
      field: "type",
      message: `El tipo debe ser uno de los siguientes: ${VALID_TYPES.join(", ")}`,
    });
  }

  // Validar provider
  if (!body.provider || body.provider.trim() === "") {
    errors.push({
      field: "provider",
      message: "El proveedor es obligatorio",
    });
  }

  return errors;
};