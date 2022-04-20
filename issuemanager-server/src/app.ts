import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { controllers } from "./controllers";
import { connectToDatabase } from "./services/database.service";

export const app = express();



app.use(express.json());

app.use(controllers);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	return res.status(500).send(err);
});
