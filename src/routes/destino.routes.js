import { Router } from "express";
import {
 getDestinos, 
 getDestino,
 postDestino,
 putDestino,
 deleteDestinoController,
} from "../controllers/destino.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getDestinos);
router.get("/:id", verifyToken, getDestino);
router.post("/",verifyToken, postDestino);
router.put("/:id",verifyToken, putDestino);
router.delete("/:id",verifyToken, deleteDestinoController);

export default router;