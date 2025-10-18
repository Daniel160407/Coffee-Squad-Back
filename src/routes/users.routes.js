import { Router } from "express";
const usersRouter = Router();
import { getUsers, updateUserStats } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

import {
  deleteExistingUser,
  getUserInfo,
} from "../controllers/user.controller.js";

usersRouter.get("/", getUsers);
usersRouter.get("/getuserinfo", protectRoute, getUserInfo);
usersRouter.delete("/delete/:id", protectRoute, deleteExistingUser);
usersRouter.put("/updatestats:id", protectRoute, updateUserStats);

export default usersRouter;
