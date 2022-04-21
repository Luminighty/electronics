import { Router } from "express";
import { HydratedDocument } from "mongoose";
import { IProject, Project } from "../models/project";
import { UserRole } from "../models/user";
import { authorize } from "../security/authorize";
import { passport } from "../security/passport";

export const projectRouter = Router();

function canModifyProject(user: Express.User, project: HydratedDocument<IProject>) {
	return project.creator.equals(user.id) || 
			user.role === UserRole.Admin;
}

projectRouter
.get("/", async (req, res) => {
	const projects = await Project.find();
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
		project.chips = req.body.chips || project.chips;

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
;