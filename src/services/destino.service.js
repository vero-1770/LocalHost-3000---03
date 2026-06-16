import { prisma } from "../prisma/prismaClient.js";

export const getAllDestinos = async (page = 1, limit = 9) => {
    const skip = (page - 1) * limit;

    return await prisma.destination.findMany({
        skip: skip,
        take: limit,
        include: {
            translations: true,
        },
    });
};

export const getDestinoById = async (id) => {
    return await prisma.destination.findUnique({
        where: { id },
        include: {
            translations: true,
        },
    });
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
            name: data.nombre,
            description: data.descripcion,
            country: data.pais,
            location: data.ciudad,
            budget: Number(data.precio),
        },
    });
};

export const deleteDestino = async (id) => {
    return await prisma.destination.delete({
        where: { id },
    });
};