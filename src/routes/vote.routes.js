import { Router } from "express";
import {
  getVotes,
  postVote,
  deleteVote,
} from "../controllers/vote.controller.js";

const router = Router();

router.get("/users/:userId", getVotes);
router.post("/", postVote);
router.delete("/", deleteVote);

export default router;