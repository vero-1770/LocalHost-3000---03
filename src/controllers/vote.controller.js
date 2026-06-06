import {
  addVote,
  removeVote,
  getVotesByUser,
} from "../services/vote.service.js";
import { prisma } from "../prisma/prismaClient.js";

export const getVotes = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
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
    const { userId, destinationId, score } = req.body;

    //Validar userId
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ error: "El ID de usuario es obligatorio y debe ser un número válido" });
    }

    //Validar destinationId
    if (!destinationId || isNaN(Number(destinationId))) {
      return res.status(400).json({ error: "El ID de destino es obligatorio y debe ser un número válido" });
    }

    //Validar score
    if (score === undefined || score === null) {
      return res.status(400).json({ error: "El puntaje es obligatorio" });
    }
    if (isNaN(Number(score)) || Number(score) < 0 || Number(score) > 5) {
      return res.status(400).json({ error: "El puntaje debe ser un número entre 0 y 5" });
    }

    //Verificar que el usuario exista
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    //Verificar que el destino exista
    const destination = await prisma.destination.findUnique({
      where: { id: Number(destinationId) },
    });
    if (!destination) {
      return res.status(404).json({ error: "Destino no encontrado" });
    }

    const vote = await addVote(
      Number(userId),
      Number(destinationId),
      Number(score)
    );
    res.status(201).json(vote);
  } catch (error) {
    // Voto duplicado
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "El usuario ya votó este destino",
      });
    }
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
    if (!destinationId || isNaN(Number(destinationId))) {
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