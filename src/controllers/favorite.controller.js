import {
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
} from "../services/favorite.service.js";
import { prisma } from "../prisma/prismaClient.js";

export const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const lang = req.query.lang || "es"; 

    if (isNaN(userId)) {
      return res.status(400).json({ error: "El ID de usuario debe ser un número válido" });
    }

    const favorites = await getFavoritesByUser(userId, lang); 
    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};

export const postFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { destinationId } = req.body;

    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ error: "El ID de usuario es obligatorio y debe ser un número válido" });
    }

    if (!destinationId || isNaN(Number(destinationId))) {
      return res.status(400).json({ error: "El ID de destino es obligatorio y debe ser un número válido" });
    }

    // Verificar que el usuario exista
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar que el destino exista
    const destination = await prisma.destination.findUnique({
      where: { id: Number(destinationId) },
    });
    if (!destination) {
      return res.status(404).json({ error: "Destino no encontrado" });
    }

    const favorite = await addFavorite(Number(userId), Number(destinationId));
    res.status(201).json(favorite);
  } catch (error) {
    // Favorito duplicado
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "El destino ya está en favoritos de este usuario",
      });
    }
    next(error);
  }
};

export const deleteFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: destinationId } = req.params;

    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ error: "El ID de usuario es obligatorio y debe ser un número válido" });
    }

    if (!destinationId || isNaN(Number(destinationId))) {
      return res.status(400).json({ error: "El ID de destino es obligatorio y debe ser un número válido" });
    }

    const result = await removeFavorite(Number(userId), Number(destinationId));

    if (result.count === 0) {
      return res.status(404).json({ error: "El favorito no existe" });
    }

    res.status(200).json({ message: "Favorito eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};