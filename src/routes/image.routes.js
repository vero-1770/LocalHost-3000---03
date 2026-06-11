import { Router } from "express";
import {
  getImages,
  postImage,
  deleteImage,
} from "../controllers/image.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/destinations/:destinationId", getImages);
router.post("/",verifyToken, postImage);
router.delete("/:id",verifyToken, deleteImage);

export default router;