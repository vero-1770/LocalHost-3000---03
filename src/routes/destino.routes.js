import { Router } from "express";
import {
 getDestinos, 
 getDestino,
 postDestino,
 putDestino,
 deleteDestinoController,
} from "../controllers/destino.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/", getDestinos);
router.get("/:id", verifyToken, getDestino);
router.post("/",verifyToken, isAdmin, postDestino);
router.put("/:id",verifyToken, isAdmin, putDestino);
router.delete("/:id",verifyToken, isAdmin, deleteDestinoController);

export default router;