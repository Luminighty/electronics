import { IUser, User } from "../models/user";
import jsonwebtoken from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();

export function generateJwt(user) {
	const payload = {
		sub: user._id,
		role: user.role,
		username: user.username,
	};

	const token = jsonwebtoken.sign(payload, process.env.PAYLOAD_SECRET);
	return token;
}