import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { controllers } from "./controllers";
import { connectToDatabase } from "./services/database.service";

export const app = express();

app.use(express.json());

app.use(controllers);

app.use((err : Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send(err);
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});