import {
  getAllTransportations,
  getTransportationById,
  createTransportation,
  updateTransportation,
  deleteTransportation,
} from "../services/transportation.service.js";
import { validateTransportation } from "../validations/transportation.validation.js";

export const getTransportations = async (req, res, next) => {
  try {
    const transportations = await getAllTransportations();
    res.status(200).json(transportations);
  } catch (error) {
    next(error);
  }
};

export const getTransportation = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }

    const transportation = await getTransportationById(id);
    if (!transportation) {
      return res.status(404).json({ error: "Transporte no encontrado" });
    }

    res.status(200).json(transportation);
  } catch (error) {
    next(error);
  }
};

export const postTransportation = async (req, res, next) => {
  try {
    const errors = validateTransportation(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: errors,
      });
    }

    const transportation = await createTransportation(req.body);
    res.status(201).json(transportation);
  } catch (error) {
    next(error);
  }
};

export const putTransportation = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }

    const errors = validateTransportation(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: errors,
      });
    }

    const existente = await getTransportationById(id);
    if (!existente) {
      return res.status(404).json({ error: "Transporte no encontrado" });
    }

    const transportation = await updateTransportation(id, req.body);
    res.status(200).json(transportation);
  } catch (error) {
    next(error);
  }
};

export const deleteTransportationController = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }

    const existente = await getTransportationById(id);
    if (!existente) {
      return res.status(404).json({ error: "Transporte no encontrado" });
    }

    await deleteTransportation(id);
    res.status(200).json({ message: "Transporte eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};