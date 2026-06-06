import { Router } from "express";
import {
  getFavorites,
  postFavorite,
  deleteFavorite,
} from "../controllers/favorite.controller.js";

const router = Router();

router.get("/users/:userId", getFavorites);
router.post("/", postFavorite);
router.delete("/", deleteFavorite);

export default router;