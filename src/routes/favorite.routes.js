import { Router } from "express";
import {
  getFavorites,
  postFavorite,
  deleteFavorite,
} from "../controllers/favorite.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/",verifyToken, getFavorites);
router.post("/",verifyToken, postFavorite);
router.delete("/:id",verifyToken, deleteFavorite);

export default router;