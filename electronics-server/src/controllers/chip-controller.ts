import { Router } from "express";
import { HydratedDocument } from "mongoose";
import { authorize } from "../security/authorize";
import { Chip, IChip } from "../models/chip";
import { UserRole } from "../models/user";
import { passport } from "../security/passport";

export const chipRouter = Router();

function canModifyChip(user: Express.User, chip: HydratedDocument<IChip>) {
	return chip.creator.equals(user.id) || 
			user.role === UserRole.Admin;
}

chipRouter
.get("/", async (req, res) => {
	const chips = await Chip.find();
	res.send(chips);
})
.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const chip = await Chip.findById(id);
		if (!chip)
			throw "Chip not found";
		res.send(chip);
	} catch {
		res.status(404)
			.send(`Chip with id '${req.params.id}' not found.`);
	}
})
.use(passport.authenticate('jwt', {session: false}))
.post("/", authorize(UserRole.User), async (req, res) => {
	try {
		const chip = new Chip({
			code: req.body.code,
			name: req.body.name,
			description: req.body.description,
			pins: req.body.pins,
			creator: req.user.id,
			datasheet: req.body.datasheet,
		})
		await chip.save();
		res.status(201).send(chip);
	} catch {
		res.status(400).send("Bad request");
	}
})
.put("/:id", authorize(UserRole.User), async (req, res) => {
	try {
		const id = req.params.id;
		const chip = await Chip.findById(id);

		if (!canModifyChip(req.user, chip))
			return res.sendStatus(403);

		chip.code = req.body.code || chip.code;
		chip.name = req.body.name || chip.name;
		chip.pins = req.body.pins || chip.pins;
		
		if (req.body.description !== null)
			chip.description = req.body.description;
		
		if (req.body.datasheet !== null)
			chip.datasheet = req.body.datasheet;

		await chip.save();

		res.send(chip);
	} catch {
		res.status(404)
			.send(`Chip with id '${req.params.id}' not found.`);
	}
})
.delete("/:id", authorize(UserRole.User), async (req, res) => {
	try {
		const id = req.params.id;
		const chip = await Chip.findById(id);

		if (!canModifyChip(req.user, chip))
			return res.sendStatus(403);

		chip.delete();

		res.sendStatus(204);
	} catch {
		res.status(404)
			.send(`Chip with id '${req.params.id}' not found.`);
	}
})
;