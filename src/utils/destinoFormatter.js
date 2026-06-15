//Recibe el destino (con su array translations incluido) y el idioma seleccionado
//Aplana un destino + su traducción en un solo objeto plano para el frontend
export const formatDestino = (destino, lang="es") => {
    //Fallback: idioma pedido -> es -> primera traduccion disponible
    const translation =
        destino.translations.find((t) => t.language === lang) ||
        destino.translations.find((t) => t.language === "es") ||
        destino.translations[0];
    
    //Separamos el array de traducciones del resto de los datos del destino
    const {translations, ...datosDestino} = destino;

    return {
        ...datosDestino,
        name: translation?.name ?? null,
        description: translation?.description ?? null,
        country: translation?.country ?? null,
        location: translation?.location ?? null,
    };
};

