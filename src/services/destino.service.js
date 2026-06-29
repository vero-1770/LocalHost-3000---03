import { prisma } from "../prisma/prismaClient.js";

export const getAllDestinos = async (page = 1, limit = 9, campo = 'todos', filtro = '', lang = 'es') => {
    const skip = (page - 1) * limit;

    // Si no hay filtro, traemos todo. Si hay, filtramos dentro de las traducciones.
    let whereClausula = {};

    if (filtro) {
        if (campo === 'todos') {
            // Buscamos en cualquier campo de la traducción actual
            whereClausula = {
                translations: {
                    some: {
                        language: lang,
                        OR: [
                            { name: { contains: filtro, mode: 'insensitive' } },
                            { country: { contains: filtro, mode: 'insensitive' } },
                            { location: { contains: filtro, mode: 'insensitive' } },
                            { description: { contains: filtro, mode: 'insensitive' } }
                        ]
                    }
                }
            };
        } else {
            // Buscamos solo en el campo específico que eligió el usuario
            whereClausula = {
                translations: {
                    some: {
                        language: lang,
                        [campo]: { contains: filtro, mode: 'insensitive' }
                    }
                }
            };
        }
    }

    return await prisma.destination.findMany({
        where: whereClausula,
        skip: skip,
        take: limit,
        include: {
            images: true,
            translations: true,
        },
    });
};


export const getDestinoById = async (id, userId, lang = 'es') => { // Agregamos lang

    const destino = await prisma.destination.findUnique({
        where: { id },
        include: {
            
            images: true,
            accommodations: true,
            transportations: true,
            votes: userId ? { where: { userId } } : false,
            translations: { 
                where: { language: lang }
            }
        }

    });

    if (!destino) return null;

    return {
        ...destino,
        userVote: destino.votes?.[0]?.score ?? null,
    };
};

export const createDestino = async (data) => {
    return await prisma.destination.create({
        data: {
            budget: Number(data.budget),

            translations: {
                create: data.translations.map((t) => ({
                    language: t.language,
                    name: t.name,
                    description: t.description,
                    country: t.country,
                    location: t.location,
                })),
            },
        },
        include: {

            translations: true, //devolvemos el destino con sus traducciones creadas

        },
    });
};

export const updateDestino = async (id, data) => {
    return await prisma.destination.update({
        where: { id },
        data: {
            budget: Number(data.budget),
            translations: {

                deleteMany: {},  // borra TODAS las traducciones actuales del destino

                create: data.translations.map((t) => ({
                    language: t.language,
                    name: t.name,
                    description: t.description,
                    country: t.country,
                    location: t.location,
                })),
            },
        },
        include: {
            translations: true,
        },
    });
};

export const deleteDestino = async (id) => {
    return await prisma.destination.delete({
        where: { id },
    });
};