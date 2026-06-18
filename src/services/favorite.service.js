import { prisma } from "../prisma/prismaClient.js";

export const addFavorite = async (userId, destinationId) => {
  return await prisma.favorite.create({
    data: {
      userId,
      destinationId,
    },
  });
};

export const removeFavorite = async (userId, destinationId) => {
  return await prisma.favorite.deleteMany({
    where: {
      userId,
      destinationId,
    },
  });
};

export const getFavoritesByUser = async (userId) => {
  return await prisma.favorite.findMany({
    where: { userId },
      include: {
      destination: {
        include: {
          images: true
        }
      }
    }
  });
};