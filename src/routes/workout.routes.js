import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
// import { createWorkoutCard } from "../controllers/workout.controller.js";

const router = Router();

router.use(protectRoute);

// router.post("/createcard", createWorkoutCard);

export default router;
