import {
  addVote,
  removeVote,
  getVotesByUser,
} from "../services/vote.service.js";
import { prisma } from "../prisma/prismaClient.js";

export const getVotes = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (!req.user?.id) {
      return res.status(401).json({ error: "No autenticado" });
    }
    if (isNaN(userId)) {
      return res.status(400).json({ error: "El ID de usuario debe ser un número válido" });
    }

    const votes = await getVotesByUser(userId);
    res.status(200).json(votes);
  } catch (error) {
    next(error);
  }
};

export const postVote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { destinationId, score } = req.body;

    // Validar destinationId
    if (!destinationId || isNaN(Number(destinationId))) {
      return res.status(400).json({ error: "Destino inválido" });
    }

    // Validar score
    if (score == null || isNaN(Number(score))) {
      return res.status(400).json({ error: "Score inválido" });
    }

    if (Number(score) < 0 || Number(score) > 5) {
      return res.status(400).json({ error: "El puntaje debe estar entre 0 y 5" });
    }

    // Verificar destino
    const destination = await prisma.destination.findUnique({
      where: { id: Number(destinationId) },
    });

    if (!destination) {
      return res.status(404).json({ error: "Destino no encontrado" });
    }

    // 
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

    // Crear voto
    const vote = await prisma.vote.create({
      data: {
        userId: Number(userId),
        destinationId: Number(destinationId),
        score: Number(score),
      },
    });

    // Recalcular rating
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
    const { userId, destinationId } = req.body;

    //Validar userId
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ error: "El ID de usuario es obligatorio y debe ser un número válido" });
    }

    //Validar destinationId
    if (destinationId == null || isNaN(Number(destinationId))) {
      return res.status(400).json({ error: "El ID de destino es obligatorio y debe ser un número válido" });
    }

    const vote = await removeVote(Number(userId), Number(destinationId));

    if (!vote) {
      return res.status(404).json({ error: "El voto no existe" });
    }

    res.status(200).json({ message: "Voto eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};