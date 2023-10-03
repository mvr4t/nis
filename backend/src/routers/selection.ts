import { Router } from "express";
import curatorController from "../controllers/selection/choicecurator";
import subjectController from "../controllers/selection/choicesubject";
import getstudentsController from "../controllers/selection/getstudents";
import getsubjectController from "../controllers/selection/getsubject";
import getcitizenshipNumber from "../controllers/selection/getcitizenshipNumber";
import feedbackController from "../controllers/selection/feedback";

const router = Router();

router.post("/choicecurator", curatorController);
router.post("/choicesubject", subjectController);
router.post("/feedback", feedbackController);

router.get("/getstudents", getstudentsController);
router.get("/getsubject", getsubjectController);
router.get("/getcitizenshipNumber", getcitizenshipNumber)

export default router;
