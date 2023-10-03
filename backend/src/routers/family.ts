import { Router } from "express";
import loginController from "../controllers/family/login";
import singupController from "../controllers/family/signup";
import handleController from "../controllers/family/handlegoal";
import checkController from "../controllers/family/checkgoal";
import famController from "../controllers/family/getfam";
import passController from "../controllers/family/getpass";
import memberController from "../controllers/family/membersign";
import isfirstController from "../controllers/family/isfirst";
import taskfetchController from "../controllers/family/fetchtask";
import tasksetController from "../controllers/family/taskset";
import declineController from "../controllers/family/declinetask";
import acceptController from "../controllers/family/accepttask";
import completedController from "../controllers/family/completed";
import deleteController from "../controllers/family/deletetask";
import donateController from "../controllers/family/donate";

const router = Router();

router.post("/famlogin", loginController);
router.post("/famsign", singupController);
router.post("/handlegoal", handleController);
router.get("/checkgoal", checkController);
router.get("/getfam", famController);
router.get("/getpass", passController);
router.post("/membersign", memberController);
router.get("/isfirst", isfirstController);
router.get("/fetchtask", taskfetchController);
router.post("/taskset", tasksetController)
router.post("/declinetask", declineController);
router.post("/accepttask", acceptController);
router.post("/completed", completedController);
router.delete("/deletetask", deleteController);
router.post("/donate", donateController);
export default router;
