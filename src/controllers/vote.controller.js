import {
  addVote,
  removeVote,
  getVotesByUser,
} from "../services/vote.service.js";
import { prisma } from "../prisma/prismaClient.js";

export const getVotes = async (req, res, next) => {
  try {
    // Extraemos el ID del token verificado
    const userId = req.user.id; 
    
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Usuario no autenticado de forma válida" });
    }

    const votes = await getVotesByUser(userId);
    return res.status(200).json(votes);
  } catch (error) {
    next(error);
  }
};

export const postVote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { destinationId, score } = req.body;

    if (!destinationId || isNaN(Number(destinationId))) {
      return res.status(400).json({ error: "Destino inválido" });
    }

    if (score == null || isNaN(Number(score))) {
      return res.status(400).json({ error: "Puntaje inválido" });
    }

    if (Number(score) < 0 || Number(score) > 5) {
      return res.status(400).json({ error: "El puntaje debe estar entre 0 y 5" });
    }

    const destination = await prisma.destination.findUnique({
      where: { id: Number(destinationId) },
    });

    if (!destination) {
      return res.status(404).json({ error: "Destino no encontrado" });
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_destinationId: {
          userId: Number(userId),
          destinationId: Number(destinationId),
        },
      },
    });

    if (existingVote) {
      return res.status(400).json({
        error: "El usuario ya votó este destino",
      });
    }

    const vote = await prisma.vote.create({
      data: {
        userId: Number(userId),
        destinationId: Number(destinationId),
        score: Number(score),
      },
    });

    // Recalcular promedios
    const votes = await prisma.vote.findMany({
      where: { destinationId: Number(destinationId) },
    });

    const votesCount = votes.length;
    const totalScore = votes.reduce((acc, v) => acc + v.score, 0);
    const rating = votesCount === 0 ? 0 : totalScore / votesCount;

    await prisma.destination.update({
      where: { id: Number(destinationId) },
      data: {
        rating,
        votesCount,
        totalScore,
      },
    });

    const updatedDestination = await prisma.destination.findUnique({
      where: { id: Number(destinationId) },
    });

    return res.status(201).json({
      destination: updatedDestination,
      userVote: score,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVote = async (req, res, next) => {
  try {
    // userId del token y destinationId de los params de la URL
    const userId = req.user.id;
    const { destinationId } = req.params;

    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ error: "Usuario no autenticado" });
    }

    if (!destinationId || isNaN(Number(destinationId))) {
      return res.status(400).json({ error: "El ID de destino debe ser un número válido" });
    }

    // Ejecutamos la eliminación en el servicio
    const vote = await removeVote(Number(userId), Number(destinationId));

    if (!vote || vote.count === 0) {
      return res.status(404).json({ error: "El voto no existe o ya fue eliminado" });
    }

    return res.status(200).json({ message: "Voto eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};