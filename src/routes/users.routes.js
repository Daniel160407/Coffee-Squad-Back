import { Router } from "express";
const usersRouter = Router();
import { getUsers } from "../controllers/user.controller.js";

usersRouter.get("/", getUsers);

export default usersRouter;
