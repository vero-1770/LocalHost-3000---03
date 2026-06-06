import { Router } from "express";
import {  
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUserController,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", postUser);
router.put("/:id", putUser);
router.delete("/:id", deleteUserController);

export default router;