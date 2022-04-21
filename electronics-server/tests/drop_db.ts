import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { User, UserRole } from "../src/models/user";
import { hashPassword } from "../src/security/password-utils";
import * as TestUser from "./test_users";

(async() => {
	dotenv.config();

	await mongoose.connect(process.env.DB_CONN_STRING, {
		dbName: process.env.TEST_DB_NAME,
	});

	console.log("Dropping database");
	await mongoose.connection.dropDatabase();

	console.log("Seeding database");

	await createUser(TestUser.admin, UserRole.Admin);
	await createUser(TestUser.user, UserRole.User);
	await createUser(TestUser.otherUser, UserRole.User);
	
	process.exit(0);
})();


async function createUser(data, role) {
	data.password = await hashPassword(data.password);
	const user = new User({role, ...data});
	await user.save();
}