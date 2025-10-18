import { Router } from "express";
const usersRouter = Router();
import { getUsers, updateUserStats } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

import {
  deleteExistingUser,
  getUserInfo,
} from "../controllers/user.controller.js";

usersRouter.use(protectRoute);

usersRouter.get("/", getUsers);
usersRouter.get("/getuserinfo", protectRoute, getUserInfo);
usersRouter.delete("/delete/:id", deleteExistingUser);
usersRouter.put("/updatestats:id", updateUserStats);

export default usersRouter;
