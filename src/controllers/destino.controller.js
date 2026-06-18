import {
    getAllDestinos,
    getDestinoById,
    createDestino,
    updateDestino,
    deleteDestino,
} from "../services/destino.service.js";
import { validateDestino, validateTranslations } from "../validations/destino.validation.js";
import { formatDestino } from "../utils/destinoFormatter.js";

export const getDestinos = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const lang = req.query.lang || "es";
        const filtro = req.query.filtro || '';
        const campo = req.query.campo || 'search';

        const destinos = await getAllDestinos(page, limit, filtro, campo);
        const destinosFormateados = destinos.map((d) => formatDestino(d, lang));

        res.status(200).json(destinosFormateados);
    } catch (error) {
        next(error);
    }
};

export const getDestino = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un numero valido" });
        }

        const lang = req.query.lang || "es";
        const destino = await getDestinoById(id, req.user?.id);

        if (!destino) {
            return res.status(404).json({ error: "Destino no encontrado" });
        }

        res.status(200).json(formatDestino(destino, lang));
    } catch (error) {
        next(error);
    }
};

export const postDestino = async (req, res, next) => {
    try {
        const { translations, budget } = req.body;
        const errors = validateTranslations(translations);

        if (budget === undefined || budget === null || isNaN(Number(budget)) || Number(budget) <= 0) {
            errors.push({
                field: "budget",
                message: "El presupuesto es obligatorio y debe ser un número mayor a 0",
            });
        }

        if (errors.length > 0) {
            return res.status(400).json({ error: "Datos inválidos", details: errors });
        }

        const destino = await createDestino(req.body);
        res.status(201).json(destino);
    } catch (error) {
        next(error);
    }
};

export const putDestino = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un numero valido" });
        }

        const { translations, budget } = req.body;
        const errors = validateTranslations(translations);

        if (budget === undefined || budget === null || isNaN(Number(budget)) || Number(budget) <= 0) {
            errors.push({
                field: "budget",
                message: "El presupuesto es obligatorio y debe ser un número mayor a 0",
            });
        }

        if (errors.length > 0) {
            return res.status(400).json({ error: "Datos inválidos", details: errors });
        }

        const existente = await getDestinoById(id);
        if (!existente) {
            return res.status(404).json({ error: "Destino no encontrado" });
        }

        const destino = await updateDestino(id, req.body);
        res.status(200).json(destino);
    } catch (error) {
        next(error);
    }
};

export const deleteDestinoController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un numero valido" });
        }

        const existente = await getDestinoById(id);
        if (!existente) {
            return res.status(404).json({ error: "Destino no encontrado" });
        }

        await deleteDestino(id);
        res.status(200).json({ message: "Destino eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};