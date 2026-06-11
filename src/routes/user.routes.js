import { Router } from "express";
import {  
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUserController,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", postUser);
router.put("/:id",verifyToken, putUser);
router.delete("/:id",verifyToken, deleteUserController);

export default router;