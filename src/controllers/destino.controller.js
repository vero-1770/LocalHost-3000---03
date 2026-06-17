import { getAllDestinos, 
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

        const filtro = req.query.filtro || '';
        const campo = req.query.campo || 'search';

        const destinos = await getAllDestinos(page, limit, campo, filtro);
        res.status(200).json(destinos);

    } catch (error) {
        next(error);
    }
};

export const getDestino = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un numero valido"});
        }

        const destino = await getDestinoById(id, req.user?.id);

        if (!destino) {
            return res.status(404).json({ error: "Destino no encontrado"});
        }

        res.status(200).json(destino);
    } catch (error) {
        next(error);
    }
};

export const postDestino = async (req, res, next) => {
    try {
        const errors = validateDestino(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                error: "Datos invalidos",
                details: errors,
            });
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
            return res.status(400).json({error: "El ID debe ser un numero valido"});
        }

        //Ejecutar validaciones sobre el body
        const errors = validateDestino(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                error: "Datos invalidos",
                details: errors,
            });
        }

        //Verificar que el destino exista
        const existente = await getDestinoById(id);

        if (!existente) {
            return res.status(404).json({error: "Destino no encontrado"});
        }

        //Actualizar destino
        const destino = await updateDestino(id, req.body);

        res.status(200).json(destino);

    } catch (error) {

        next(error);
    }
};

export const deleteDestinoController = async (req, res, next) => {
    try {
        //Obtener y validar el ID
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un numero valido"});
        }

        //Verificar que el destino exista
        const existente = await getDestinoById(id);
        if (!existente) {
            return res.status(404).json({ error: "Destino no encontrado"});
        }

        //Eliminar el destino
        await deleteDestino(id);
        res.status(200).json({message: "Destino eliminado correctamente"});
    } catch (error) {
        next(error);
    }
};