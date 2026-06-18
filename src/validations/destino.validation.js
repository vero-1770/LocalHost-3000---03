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