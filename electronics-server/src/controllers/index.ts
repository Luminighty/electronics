import { Router } from "express";
import { chipRouter } from "./chip-controller";
import { projectRouter } from "./projects-controller";
import { userRouter } from "./user-controllers";

export const controllers = Router();

controllers.use("/chip", chipRouter);
controllers.use("/project", projectRouter);
controllers.use("/user", userRouter);