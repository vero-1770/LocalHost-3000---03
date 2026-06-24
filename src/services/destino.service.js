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