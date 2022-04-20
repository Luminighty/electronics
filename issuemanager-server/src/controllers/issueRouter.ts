import { Router } from "express";
import { ObjectId } from "mongodb";
import { Issue } from "../models/issue";
import { collections } from "../services/database.service";

export const issueRouter = Router();

issueRouter
.get("/", async (req, res) => {
	const issues = (await collections.issues!.find({}).toArray()) as Issue[];
	res.status(200).send(issues);
})
.get("/:id", async (req, res) => {
	const id = req?.params?.id;
	const query = {_id: new ObjectId(id) };
	
	const issue = (await collections.issues!.findOne(query)) as Issue;
	if (issue) {
		res.status(200).send(issue);

	} else {
		res.status(404).send(`Issue with id ${id} does not exist`);
	}

})
.post("/", async (req, res) => {
	const newIssue = req.body as Issue;
	const result = await collections.issues!.insertOne(newIssue);

	if (result) {
		res.status(201).send(result);
	} else {
		res.status(500).send(`Failed to create a new issue`);
	}
})
.put("/:id", async (req, res) => {
	const id = req?.params?.id;

	const updatedIssue = req.body as Issue;
	const query = {_id: new ObjectId(id)};

	const result = await collections.issues!.updateOne(query, {$set: updatedIssue});

	
	if (result) {
		res.status(200).send(result);
	} else {
		res.status(500).send(`Failed to update the issue`);
	}
})
.delete("/:id", async (req, res) => {
	const id = req?.params?.id;

	const query = { _id: new ObjectId(id) };
	const result = await collections.issues!.deleteOne(query);

	if (result && result.deletedCount) {
		res.status(202).send(`Deleted ${id}`);
	} else if (!result) {
		res.status(400).send(`Failed to remove issue with id ${id}`)
	} else if (!result.deletedCount) {
		res.status(404).send(`Issue with id ${id} does not exist`);
	}
})
;