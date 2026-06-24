import { 
    getAllDestinos, 
    getDestinoById, 
    createDestino,
    updateDestino, 
    deleteDestino,
} from "../services/destino.service.js";

import { validateDestino } from "../validations/destino.validation.js";

export const getDestinos = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;

        let campo = 'todos';
        let filtro = '';

        const { country, location, description, name, search, q } = req.query;

        if (country) {
            campo = 'country';
            filtro = country;
        } else if (location) {
            campo = 'location';
            filtro = location;
        } else if (description) {
            campo = 'description';
            filtro = description;
        } else if (name) {
            campo = 'name';
            filtro = name;
        } else if (search || q) {
            campo = 'todos';
            filtro = search || q; // Para cuando seleccionan "Todos" en el frontend
        }

        const destinos = await getAllDestinos(page, limit, campo, filtro);
        return res.status(200).json(destinos);

    } catch (error) {
        next(error);
    }
};

export const getDestino = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un número válido" });
        }

        const destino = await getDestinoById(id, req.user?.id);

        if (!destino) {
            return res.status(404).json({ error: "Destino no encontrado" });
        }

        return res.status(200).json(destino);
    } catch (error) {
        next(error);
    }
};

export const postDestino = async (req, res, next) => {
    try {
        const errors = validateDestino(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                error: "Datos inválidos",
                details: errors,
            });
        }

        const destino = await createDestino(req.body);
        return res.status(201).json(destino);
    } catch (error) {
        next(error);
    }
};

export const putDestino = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un número válido" });
        }

        const errors = validateDestino(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                error: "Datos inválidos",
                details: errors,
            });
        }

        const existente = await getDestinoById(id);

        if (!existente) {
            return res.status(404).json({ error: "Destino no encontrado" });
        }

        const destino = await updateDestino(id, req.body);
        return res.status(200).json(destino);

    } catch (error) {
        next(error);
    }
};

export const deleteDestinoController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un número válido" });
        }

        const existente = await getDestinoById(id);
        if (!existente) {
            return res.status(404).json({ error: "Destino no encontrado" });
        }

        await deleteDestino(id);
        return res.status(200).json({ message: "Destino eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};