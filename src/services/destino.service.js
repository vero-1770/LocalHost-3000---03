import { prisma } from "../prisma/prismaClient.js";

export const getAllDestinos = async (page = 1, limit = 9, filtro = '', campo = 'search') => {
    const skip = (page - 1) * limit;

    return await prisma.destination.findMany({
        skip: skip,
        take: limit,
        include: {
            images: true,
            translations: true,
        },
    });
};

export const getDestinoById = async (id, userId) => {
    const destino = await prisma.destination.findUnique({
        where: { id },
        include: {
            images: true,
            translations: true,
            votes: userId
                ? { where: { userId } }
                : false,
        },
    });

    if (!destino) {
        return null;
    }

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
            translations: true,
        },
    });
};

export const updateDestino = async (id, data) => {
    return await prisma.destination.update({
        where: { id },
        data: {
            budget: Number(data.budget),
            translations: {
                deleteMany: {},
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