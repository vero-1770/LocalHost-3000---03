import { prisma } from "../prisma/prismaClient.js";

export const getAllDestinos = async (
    page = 1,
    limit = 9,
    campo = 'todos',
    filtro = ''
) => {
    // Calculamos cuántos registros saltear según la página
    const skip = (page - 1) * limit;

    let whereClausula = {};

    // Si hay un texto para buscar, armamos el filtro
    if (filtro) {
        if (campo === 'todos') {
            // Utilizamos el operador OR que busca en todas las columnas a la vez
            whereClausula = {
                OR: [
                    { name: { contains: filtro, mode: 'insensitive' } },
                    { country: { contains: filtro, mode: 'insensitive' } },
                    { location: { contains: filtro, mode: 'insensitive' } },
                    { description: { contains: filtro, mode: 'insensitive' } }
                ]
            };
        } else {
            // Si el campo no es 'todos', buscamos en la columna específica (ej: location, country)
            whereClausula = {
                [campo]: { contains: filtro, mode: 'insensitive' }
            };
        }
    }

    return await prisma.destination.findMany({
        where: whereClausula,
        skip: skip,
        take: limit,
        include: {
            images: true
        }
    });
};

export const getDestinoById = async (id, userId) => {
    const destino = await prisma.destination.findUnique({
        where: {
            id
        },
        include: {
            translations: true,
            images: true,
            votes: userId 
                ? {
                    where: {
                        userId
                    }
                }
                : false
        }
    });

    if (!destino) {
        return null;
    }

    return {
        ...destino,
        userVote: destino.votes?.[0]?.score ?? null
    };
};

export const createDestino = async (data) => {
    return await prisma.destination.create({
        data: {
            budget: Number(data.budget),
            // Si el body trae más campos propios del destino tenemos que agregarlos aca
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