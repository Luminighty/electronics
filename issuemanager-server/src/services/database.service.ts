import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { Issue } from "../models/issue";

export const collections: { issues?: mongoDB.Collection<Issue> } = {};

export async function connectToDatabase() {
	dotenv.config();

	const client: mongoDB.MongoClient = new mongoDB.MongoClient(
		process.env.DB_CONN_STRING || ""
	);

	await client.connect();

	const db: mongoDB.Db = client.db(process.env.DB_NAME);

	//await db.command(validator());

	const issueCollection = db.collection<Issue>(
		process.env.ISSUES_COLLECTION_NAME || "issues"
	);

	collections.issues = issueCollection;

	console.log(
		`Successfully connected to database: ${db.databaseName} and collection: ${issueCollection.collectionName}`
	);
}

function validator() {
	return {
		collMod: process.env.ISSUES_COLLECTION_NAME,
		validator: {
			$jsonSchema: {
				bsonType: "object",
				required: ["title", "description"],
				additionalProperties: false,
				properties: {
					_id: {},
					title: {
						bsonType: "string",
						description: "'title' is required and is a string",
					},
					description: {
						bsonType: "string",
						description:
							"'description' is required and is a string",
					},
				},
			},
		},
	};
}
