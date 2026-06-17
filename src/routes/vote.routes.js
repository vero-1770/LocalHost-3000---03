import { Router } from "express";
import {
  getVotes,
  postVote,
  deleteVote,
} from "../controllers/vote.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", verifyToken, getVotes);
router.post("/",verifyToken, postVote);
router.delete("/",verifyToken, deleteVote);

export default router;