import {
  getAllAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
} from "../services/accommodation.service.js";
import { validateAccommodation } from "../validations/accommodation.validation.js";
import { prisma } from "../prisma/prismaClient.js";

export const getAccommodations = async (req, res, next) => {
  try {
    const accommodations = await getAllAccommodations();
    res.status(200).json(accommodations);
  } catch (error) {
    next(error);
  }
};

export const getAccommodation = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }

    const accommodation = await getAccommodationById(id);
    if (!accommodation) {
      return res.status(404).json({ error: "Alojamiento no encontrado" });
    }

    res.status(200).json(accommodation);
  } catch (error) {
    next(error);
  }
};

export const postAccommodation = async (req, res, next) => {
  try {
    const errors = validateAccommodation(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: errors,
      });
    }

    const destino = await prisma.destination.findUnique({
      where: { id: Number(req.body.destinationId) },
    });
    
    if (!destino) {
      return res.status(404).json({ error: "El destino indicado no existe" });
    }

    const accommodation = await createAccommodation(req.body);
    res.status(201).json(accommodation);
  } catch (error) {
    next(error);
  }
};

export const putAccommodation = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }

    const errors = validateAccommodation(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: errors,
      });
    }

    const existente = await getAccommodationById(id);
    if (!existente) {
      return res.status(404).json({ error: "Alojamiento no encontrado" });
    }

    const destino = await prisma.destination.findUnique({
      where: { id: Number(req.body.destinationId) },
    });
    
    if (!destino) {
      return res.status(404).json({ error: "El destino indicado no existe" });
    }

    const accommodation = await updateAccommodation(id, req.body);
    res.status(200).json(accommodation);
  } catch (error) {
    next(error);
  }
};

export const deleteAccommodationController = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }

    const existente = await getAccommodationById(id);
    if (!existente) {
      return res.status(404).json({ error: "Alojamiento no encontrado" });
    }

    await deleteAccommodation(id);
    res.status(200).json({ message: "Alojamiento eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};