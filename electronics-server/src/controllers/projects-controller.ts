import { Router } from "express";
import { ObjectId } from "mongodb";
import { HydratedDocument } from "mongoose";
import { Chip } from "../models/chip";
import { IProject, Project } from "../models/project";
import { UserRole } from "../models/user";
import { authorize } from "../security/authorize";
import { passport } from "../security/passport";

export const projectRouter = Router();

function canModifyProject(user: Express.User, project: HydratedDocument<IProject>) {
	return project.creator.equals(user.id) || 
			user.role === UserRole.Admin;
}

function getFilter(query: any) {
	if (query.creator && ObjectId.isValid(query.creator)) {
		query.creator = new ObjectId(query.creator);
	} else {
		delete query.creator;
	}
	return query;
}

projectRouter
.get("/", async (req, res) => {
	const filter = getFilter(req.query);
	const projects = await Project.find(filter);
	res.send(projects);
})
.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const project = await Project.findById(id);
		res.send(project);
	} catch {
		res.status(404)
			.send(`Project with id '${req.params.id}' not found.`);
	}
})
.use(passport.authenticate('jwt', {session: false}))
.post("/", authorize(UserRole.User), async (req, res) => {
	try {
		const project = new Project({
			title: req.body.title,
			description: req.body.description,
			shortDescription: req.body.shortDescription,
			creator: req.user.id,
			chips: req.body.chips,
		});

		await project.save();
		res.status(201).send(project);
	} catch {
		res.status(400).send("Bad request");
		
	}
})
.put("/:id", authorize(UserRole.User), async (req, res) => {
	try {
		const id = req.params.id;
		const project = await Project.findById(id);
		
		if (!canModifyProject(req.user, project))
			return res.sendStatus(403);

		project.title = req.body.title || project.title;

		if (req.body.chips)
			project.chips = req.body.chips.filter((chip) => chip.amount > 0);

		if (req.body.description !== null)
			project.description = req.body.description;

		if (req.body.shortDescription !== null)
			project.shortDescription = req.body.shortDescription;
		
		await project.save();
		res.send(project);
	} catch {
		res.status(404)
			.send(`Project with id '${req.params.id}' not found.`);
	}
})
.delete("/:id", authorize(UserRole.User), async (req, res) => {
	try {
		const id = req.params.id;
		const project = await Project.findById(id);

		if (!canModifyProject(req.user, project))
			return res.sendStatus(403);

		project.delete();
		res.sendStatus(204);
	} catch {
		res.status(404)
			.send(`Project with id '${req.params.id}' not found.`);
		
	}
})
.post("/:id/chip", authorize(UserRole.User), async (req, res) => {
	try {
		const id = req.params.id;
		const project = await Project.findById(id);

		if (!canModifyProject(req.user, project))
			return res.sendStatus(403);

		const chipId = req.body.chip;
		const amount = req.body.amount;
		const index = project.chips.findIndex((val) => val.chip.equals(chipId));
		
		if (index == -1) {
			const chip = await Chip.findById(chipId);
			if (chip && amount > 0)
				project.chips.push({chip: new ObjectId(chipId), amount});
		} else {
			project.chips[index].amount += amount;
		}
		await project.save();
		res.send(project);
	} catch(error) {
		console.error(error);
		res.status(404)
			.send(`Project with id '${req.params.id}' not found.`);
		
	}
})
.put("/:id/chip", authorize(UserRole.User), async (req, res) => {
	try {
		const id = req.params.id;
		const project = await Project.findById(id);

		if (!canModifyProject(req.user, project))
			return res.sendStatus(403);

		const chipId = req.body.chip;
		const amount = req.body.amount;
		const index = project.chips.findIndex((val) => val.chip.equals(chipId));
		console.log({method: "put", chipId, index});

		if (index == -1) {
			const chip = await Chip.findById(chipId);
			if (chip && amount > 0)
				project.chips.push({chip: new ObjectId(chipId), amount});
		} else if(amount > 0) {
			project.chips[index].amount = amount;
		} else {
			project.chips.splice(index, 1);
		}
		console.log(project.chips);
		await project.save();
		res.send(project);
	} catch {
		res.status(404)
			.send(`Project with id '${req.params.id}' not found.`);
		
	}
})
;