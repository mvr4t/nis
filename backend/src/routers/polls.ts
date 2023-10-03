import express from "express";

import startController from "../controllers/polls/start";
import infoController from "../controllers/polls/info";
import fetchController from "../controllers/polls/fetch";
import statusController from "../controllers/polls/status";
import endController from "../controllers/polls/end";
import resetController from "../controllers/polls/reset";
import votesController from "../controllers/polls/votes";
import voteController, { checkVoteability } from "../controllers/polls/vote";
import dataController from "../controllers/polls/candidateData";

const router = express.Router();

router.get("/", fetchController);
router.get("/status", statusController);
router.get("/votes", votesController);
router.get("/candidateData", dataController);

router.post("/info", infoController);
router.post("/start", startController);
router.post("/end", endController);
router.post("/reset", resetController);
router.post("/check-voteability", checkVoteability);
router.post("/vote", voteController);

export default router;
