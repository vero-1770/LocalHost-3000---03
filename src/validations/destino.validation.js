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

// Idiomas que la app soporta
const LANGUAGES_VALIDOS = ["es", "en"];

export const validateTranslations = (translations) => {
  const errors = [];

  // 1. translations debe existir y ser un array
  if (!translations || !Array.isArray(translations)) {
    errors.push({
      field: "translations",
      message: "translations es obligatorio y debe ser un array",
    });
    return errors; // si no es array, no tiene sentido seguir validando
  }

  // 2. El array no puede estar vacío
  if (translations.length === 0) {
    errors.push({
      field: "translations",
      message: "Debe existir al menos una traducción",
    });
    return errors;
  }

  // 3. Validar cada traducción del array
  const idiomasVistos = [];

  translations.forEach((t, index) => {
    // Campos de texto obligatorios
    const camposObligatorios = ["language", "name", "description", "country", "location"];

    camposObligatorios.forEach((campo) => {
      if (!t[campo] || typeof t[campo] !== "string" || t[campo].trim() === "") {
        errors.push({
          field: `translations[${index}].${campo}`,
          message: `El campo ${campo} es obligatorio y debe ser un texto no vacío`,
        });
      }
    });

    // Validar que el idioma sea uno soportado
    if (t.language && !LANGUAGES_VALIDOS.includes(t.language)) {
      errors.push({
        field: `translations[${index}].language`,
        message: `El idioma debe ser uno de: ${LANGUAGES_VALIDOS.join(", ")}`,
      });
    }

    // Detectar idiomas duplicados
    if (t.language) {
      if (idiomasVistos.includes(t.language)) {
        errors.push({
          field: `translations[${index}].language`,
          message: `El idioma "${t.language}" está duplicado`,
        });
      } else {
        idiomasVistos.push(t.language);
      }
    }
  });

  return errors;
};