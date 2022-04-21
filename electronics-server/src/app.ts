import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { controllers } from "./controllers";
import mongoose from "mongoose";


export async function main() {
	dotenv.config();

	await mongoose.connect(process.env.DB_CONN_STRING, {
		dbName: process.env.NODE_ENV == "test" 
			? process.env.TEST_DB_NAME
			: process.env.DB_NAME,
	});
	
	const app = express();
	
	app.use(express.json());
	
	app.use(controllers);
	
	app.get("/", (req, res) => {
		res.send("Hello World!");
	});
	
	app.use((err, req, res, next) => {
		console.error(err.stack);
		return res.status(500).send(err);
	});
	
	return app;
}
