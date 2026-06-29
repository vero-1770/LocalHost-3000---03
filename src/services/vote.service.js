import { prisma } from "../prisma/prismaClient.js";

export const addVote = async (userId, destinationId, score) => {
  return await prisma.$transaction(async (tx) => {
    // Verificar si ya existe
    const existe = await tx.vote.findUnique({
      where: {
        userId_destinationId: {
          userId,
          destinationId
        }
      }
    });

    if (existe) {
      throw new Error("Ya votaste este destino");
    }

    // Crear el voto
    const vote = await tx.vote.create({
      data: {
        userId,
        destinationId,
        score,
      },
    });

    // Actualizar matemáticamente totalScore y votesCount
    const destination = await tx.destination.update({
      where: { id: destinationId },
      data: {
        totalScore: {
          increment: score
        },
        votesCount: {
          increment: 1
        }
      }
    });

    // Recalcular el rating y hacer actualización final
    const newRating = destination.totalScore / destination.votesCount;
    
    const destinoActualizado = await tx.destination.update({
      where: { id: destinationId },
      data: { rating: newRating }
    });

    return {
      vote,
      destination: destinoActualizado
    };
  });
};

export const removeVote = async (userId, destinationId) => {
  return await prisma.$transaction(async (tx) => {
    // Buscar el voto para obtener el score
    const vote = await tx.vote.findUnique({
      where: {
        userId_destinationId: { userId, destinationId },
      },
    });

    if (!vote) return null;

    // Eliminar voto
    await tx.vote.delete({
      where: {
        userId_destinationId: { userId, destinationId },
      },
    });

    // Actualizar totalScore y votesCount descontando el voto eliminado
    const destination = await tx.destination.update({
      where: { id: destinationId },
      data: {
        totalScore: { decrement: vote.score },
        votesCount: { decrement: 1 },
      },
    });

    // Recalcular rating (evitamos división por cero)
    const newRating = destination.votesCount > 0
      ? destination.totalScore / destination.votesCount
      : 0;

    await tx.destination.update({
      where: { id: destinationId },
      data: { rating: newRating },
    });

    return vote;
  });
};

export const getVotesByUser = async (userId) => {
  return await prisma.vote.findMany({
    where: { userId },
    include: { destination: true },
  });
};