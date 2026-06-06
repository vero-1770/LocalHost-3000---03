import { prisma } from "../prisma/prismaClient.js";

export const addImage = async (destinationId, url) => {
  return await prisma.image.create({
    data: {
      url,
      destinationId,
    },
  });
};

export const removeImage = async (id) => {
  return await prisma.image.delete({
    where: { id },
  });
};

export const getImagesByDestination = async (destinationId) => {
  return await prisma.image.findMany({
    where: { destinationId },
  });
};

export const getImageById = async (id) => {
  return await prisma.image.findUnique({
    where: { id },
  });
};