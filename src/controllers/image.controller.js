import {
  addImage,
  removeImage,
  getImagesByDestination,
  getImageById,
} from "../services/image.service.js";
import { prisma } from "../prisma/prismaClient.js";

export const getImages = async (req, res, next) => {
  try {
    const destinationId = parseInt(req.params.destinationId);
    if (isNaN(destinationId)) {
      return res.status(400).json({ error: "El ID de destino debe ser un número válido" });
    }

    const images = await getImagesByDestination(destinationId);
    res.status(200).json(images);
  } catch (error) {
    next(error);
  }
};

export const postImage = async (req, res, next) => {
  try {
    const { url, destinationId } = req.body;

    //Validar url
    if (!url || url.trim() === "") {
      return res.status(400).json({ error: "La URL de la imagen es obligatoria" });
    }

    //Validar destinationId
    if (!destinationId || isNaN(Number(destinationId))) {
      return res.status(400).json({ error: "El ID de destino es obligatorio y debe ser un número válido" });
    }

    //Verificar que el destino exista
    const destination = await prisma.destination.findUnique({
      where: { id: Number(destinationId) },
    });
    if (!destination) {
      return res.status(404).json({ error: "Destino no encontrado" });
    }

    const image = await addImage(Number(destinationId), url.trim());
    res.status(201).json(image);
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido" });
    }

    const existente = await getImageById(id);
    if (!existente) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    await removeImage(id);
    res.status(200).json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};