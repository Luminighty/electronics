import { Router } from "express";
import { issueRouter } from "./issueRouter";

export const controllers = Router();

controllers.use('/issue', issueRouter);