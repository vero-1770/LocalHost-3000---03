import { Router } from "express";
import {
  getTransportations,
  getTransportation,
  postTransportation,
  putTransportation,
  deleteTransportationController,
} from "../controllers/transportation.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getTransportations);
router.get("/:id", getTransportation);
router.post("/",verifyToken, postTransportation);
router.put("/:id",verifyToken, putTransportation);
router.delete("/:id",verifyToken, deleteTransportationController);

export default router;