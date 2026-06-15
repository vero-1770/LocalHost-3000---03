import { Router } from "express";
import {
  getAccommodations,
  getAccommodation,
  postAccommodation,
  putAccommodation,
  deleteAccommodationController,
} from "../controllers/accommodation.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAccommodations);
router.get("/:id", getAccommodation);
router.post("/",verifyToken, postAccommodation);
router.put("/:id",verifyToken, putAccommodation);
router.delete("/:id",verifyToken, deleteAccommodationController);

export default router;