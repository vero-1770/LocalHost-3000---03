import { Router } from "express";
import {
  getImages,
  postImage,
  deleteImage,
} from "../controllers/image.controller.js";

const router = Router();

router.get("/destinations/:destinationId", getImages);
router.post("/", postImage);
router.delete("/:id", deleteImage);

export default router;