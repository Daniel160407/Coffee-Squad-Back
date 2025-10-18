import { Router } from "express";
const usersRouter = Router();
import { getUsers } from "../controllers/user.controller.js";
import {deleteExistingUser} from "../controllers/user.controller.js"

usersRouter.get("/", getUsers);
usersRouter.delete("/delete/:id", deleteExistingUser);

export default usersRouter;
