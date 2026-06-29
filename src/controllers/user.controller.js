import {  
    getAllUsers,
    getUserById,
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
            return res.status(400).json({ error: "El ID debe ser un número válido"});
        }

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({error: "Usuario no encontrado"});
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const postUser = async (req, res, next) => {
    try {
        const errors = validateUser(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: "Datos inválidos", details: errors });
        }

        const { username, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { username, email, passwordHash },
            select: { id: true, username: true, email: true, createdAt: true }
        });

        res.status(201).json(newUser);
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({
                error: "Datos inválidos",
                details: [{ field: "email", message: "El email ya está registrado" }],
            });
        }
        next(error);
    }
};

export const putUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número válido"});

        // Un usuario solo puede editarse a sí mismo
        if (req.user.id !== id) {
            return res.status(403).json({ error: "Acceso denegado. No puedes modificar otro usuario." });
        }

        const errors = validateUser(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: "Datos inválidos", details: errors });
        }

        const existente = await getUserById(id);
        if (!existente) return res.status(404).json({ error: "Usuario no encontrado"});

        // Hasheamos la nueva contraseña antes de enviarla al servicio
        const { username, email, password, avatarUrl } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const userToUpdate = { username, email, passwordHash, avatarUrl };
        const user = await updateUser(id, userToUpdate);
        
        res.status(200).json(user);
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({
                error: "Datos inválidos",
                details: [{ field: "email", message: "El email ya está registrado"}],
            });
        }
        next(error);
    }
};

export const deleteUserController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número válido"});

        // Un usuario solo puede eliminarse a sí mismo
        if (req.user.id !== id) {
            return res.status(403).json({ error: "Acceso denegado. No puedes eliminar otro usuario." });
        }

        const existente = await getUserById(id);
        if (!existente) return res.status(404).json({ error: "Usuario no encontrado"});

        await deleteUser(id);
        res.status(200).json({message: "Usuario eliminado correctamente"});
    } catch (error) {
        next(error);
    }
};