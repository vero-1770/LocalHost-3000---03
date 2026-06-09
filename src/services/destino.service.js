import { prisma } from "../prisma/prismaClient.js";

export const getAllDestinos = async (page = 1, limit = 9) => {
    // Calculamos cuántos registros saltear según la página
    const skip = (page - 1) * limit;

    return await prisma.destination.findMany({
        skip: skip,
        take: limit,
    });
};

export const getDestinoById = async (id) => {
    return await prisma.destination.findUnique({
        where: {id},
    });
};

export const createDestino = async (data) => {
    return await prisma.destination.create({
        data: {
            name: data.nombre,
            description: data.descripcion,
            country: data.pais,
            location: data.ciudad,
            budget: Number(data.precio),
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