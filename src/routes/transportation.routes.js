import { Router } from "express";
import {
  getTransportations,
  getTransportation,
  postTransportation,
  putTransportation,
  deleteTransportationController,
} from "../controllers/transportation.controller.js";

const router = Router();

router.get("/", getTransportations);
router.get("/:id", getTransportation);
router.post("/", postTransportation);
router.put("/:id", putTransportation);
router.delete("/:id", deleteTransportationController);

export default router;