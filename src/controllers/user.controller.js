import {  
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../services/user.service.js";
import { validateUser } from "../validations/user.validation.js";
import bcrypt from "bcrypt";
import { prisma } from '../prisma/prismaClient.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un numero valido"});
        }

        const user = await getUserById(id);
        if (!user) {
            return res.status(400).json({error: "Usuario no encontrado"});
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const postUser = async (req, res, next) => {
    try {
        // Validación de datos
        const errors = validateUser(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                error: "Datos inválidos",
                details: errors,
            });
        }

        const { username, email, password } = req.body;

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Creación del usuario en la BD
        const newUser = await prisma.user.create({
            data: { username, email, passwordHash },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        });

        // Respuesta exitosa
        res.status(201).json(newUser);

    } catch (error) {
        // Manejo de errores específicos de Prisma
        if (error.code === "P2002") {
            return res.status(400).json({
                error: "Datos inválidos",
                details: [{ field: "email", message: "El email ya está registrado" }],
            });
        }

        // Delegar otros errores al middleware de Express
        next(error);
    }
};

export const putUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un numero valido"});
        }

        const errors = validateUser(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                error: "Datos invalidos",
                details: errors,
            });
        }

        const existente = await getUserById(id);
        if (!existente) {
            return res.status(404).json({ error: "Usuario no encontrado"});
        }

        const user = await updateUser(id, req.body);
        res.status(200).json(user);
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({
                error: "Datos invalidos",
                details: [{ field: "email", message: "El email ya esta registrado"}],
            });
        }
        next(error);
    }
};

export const deleteUserController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "El ID debe ser un numero valido"});
        }

        const existente = await getUserById(id);
        if (!existente) {
            return res.status(400).json({ error: "Usuario no encontrado"});
        }

        await deleteUser(id);
        res.status(200).json({message: "Usuario eliminado correctamente"});
    } catch (error) {
        next(error);
    }
};