import { Router } from "express";
import { User, UserRole } from "../models/user";
import { generateJwt } from "../security/jwt-generator";
import { hashPassword } from "../security/password-utils";


export const userRouter = Router();


userRouter
.post("/register", async (req, res) => {
	
	const username = req.body.username;
	let user = await User.findOne({username});
	if (user) {
		return res.sendStatus(409);
	}

	const password = await hashPassword(req.body.password);
	user = new User({
		username: req.body.username,
		role: UserRole.User,
		password,
	})
	user.save();
	res.send(user);
})
.post("/login", async (req, res) => {
	const user = await User.findOne({username: req.body.username});
	if (!user)
		return res.status(404).send("Not found.")
	
	const password = await hashPassword(req.body.password);
	if (password != user.password)
		return res.status(404).send("Not found.");

	res.send({token: generateJwt(user), ...user.toJSON()});
})
;
