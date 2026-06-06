import { prisma } from "../prisma/prismaClient.js";

export const getAllUsers = async () => {
    return await prisma.user.findMany();
};

export const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

export const createUser = async (data) => {
    return await prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            passwordHash: data.passwordHash || null,
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
            passwordHash: data.passwordHash || null,
            avatarUrl: data.avatarUrl || null,
        },
    });
};

export const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: { id },
    });
};

