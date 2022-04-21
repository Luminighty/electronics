import supertest from "supertest";
import { main } from "../src/app";
import { user, otherUser, admin } from "./test_users";


describe("Projects Route", () => {
	let requestHandle;
	let createdProject: any = {};
	let userToken;
	let otherUserToken;
	let adminToken;

	async function getUserToken(user) {
		const loginResponse = await requestHandle
			.post("/user/login")
			.send(user);
		return `Bearer ${loginResponse.body.token}`;
	}

	beforeAll(async () => {
		const app = await main();
		requestHandle = supertest(app);
	});

	beforeEach(async () => {
		userToken = await getUserToken(user);
		otherUserToken = await getUserToken(otherUser);
		adminToken = await getUserToken(admin);
	});

	it("should return an array of projects", async () => {
		await requestHandle
			.get("/project")
			.expect(200);
	});


});