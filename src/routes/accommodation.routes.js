import { Router } from "express";
import {
  getAccommodations,
  getAccommodation,
  postAccommodation,
  putAccommodation,
  deleteAccommodationController,
} from "../controllers/accommodation.controller.js";

const router = Router();

router.get("/", getAccommodations);
router.get("/:id", getAccommodation);
router.post("/", postAccommodation);
router.put("/:id", putAccommodation);
router.delete("/:id", deleteAccommodationController);

export default router;