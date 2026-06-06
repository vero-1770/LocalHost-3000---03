import { prisma } from "../prisma/prismaClient.js";

export const getAllAccommodations = async () => {
    return await prisma.accommodation.findMany();
};

export const getAccommodationById = async (id) => {
    return await prisma.accommodation.findUnique({
        where: { id },
    });
};

export const createAccommodation = async (data) => {
  return await prisma.accommodation.create({
    data: {
      name: data.name,
      type: data.type,
      description: data.description,
      pricePerNight: Number(data.pricePerNight),
      stars: data.stars ? Number(data.stars) : null,
      location: data.location,
      destinationId: Number(data.destinationId),
    },
  });
};

export const updateAccommodation = async (id, data) => {
  return await prisma.accommodation.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type,
      description: data.description,
      pricePerNight: Number(data.pricePerNight),
      stars: data.stars ? Number(data.stars) : null,
      location: data.location,
      destinationId: Number(data.destinationId),
    },
  });
};

export const deleteAccommodation = async (id) => {
  return await prisma.accommodation.delete({
    where: { id },
  });
};