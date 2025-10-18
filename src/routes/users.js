import { Router } from "express";
const usersRouter = Router();
import { getUsers } from "../controllers/controllers.js";

usersRouter.get("/", getUsers);

export default usersRouter