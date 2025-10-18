import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createWorkoutCard,
  getWorkoutCards,
} from "../controllers/workout.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/getcards", getWorkoutCards);
router.post("/createcard", createWorkoutCard);

export default router;
