import { prisma } from "../prisma/prismaClient.js";
// ======================================
// Excluimos passwordHash de la respuesta
// ======================================
export const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
        }
    });
};

export const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
        }
    });
};

export const createUser = async (data) => {
    return await prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            passwordHash: data.passwordHash,
            avatarUrl: data.avatarUrl || null,
        },
    });
};

export const updateUser = async (id, data) => {
    return await prisma.user.update({
        where: { id },
        data: {
            username: data.username,
            email: data.email,
            passwordHash: data.passwordHash,
            avatarUrl: data.avatarUrl || null,
        },
        select: {
            id: true,
            username: true,
            email: true,
            avatarUrl: true,
        }
    });
};

export const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: { id },
    });
};