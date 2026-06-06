import { Router } from "express";
import { getDestinos, 
         getDestino,
         postDestino,
         putDestino,
         deleteDestinoController,
        } from "../controllers/destino.controller.js";

const router = Router();

router.get("/", getDestinos);
router.get("/:id", getDestino);
router.post("/", postDestino);
router.put("/:id", putDestino);
router.delete("/:id", deleteDestinoController);

export default router;