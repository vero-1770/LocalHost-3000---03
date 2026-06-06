import { prisma } from "../prisma/prismaClient.js";

export const getAllTransportations = async () => {
  return await prisma.transportation.findMany({
    include: { destinations: true },
  });
};

export const getTransportationById = async (id) => {
  return await prisma.transportation.findUnique({
    where: { id },
    include: { destinations: true },
  });
};

export const createTransportation = async (data) => {
  return await prisma.transportation.create({
    data: {
      type: data.type,
      provider: data.provider,
    },
  });
};

export const updateTransportation = async (id, data) => {
  return await prisma.transportation.update({
    where: { id },
    data: {
      type: data.type,
      provider: data.provider,
    },
  });
};

export const deleteTransportation = async (id) => {
  return await prisma.transportation.delete({
    where: { id },
  });
};