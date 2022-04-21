import supertest from "supertest";
import { main } from "../src/app";
import { user, otherUser, admin } from "./test_users";


describe("Projects Route", () => {
	let requestHandle;
	let createdProject: any = {
		title: "Short Project",
		shortDescription: "Just having fun",
		description: "I'm trying to make an LED blink every 1 second for 0.5 second",
		chips: [],
	};
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

	it("should create a new project", async () => {
		const res = await requestHandle
			.post("/project")
			.set("Authorization", userToken)
			.send({
				title: "Short Project",
				shortDescription: "Just having fun",
				description: "I'm trying to make an LED blink every 1 second for 0.5 second",
				chips: [],
			})
			.expect(201)
			.expect((res) => 
				expect(res.body).toMatchObject({...createdProject}));
				createdProject._id = res.body._id
	});

	it("should find the new project created", async () => {
		await requestHandle
			.get(`/project/${createdProject._id}`)
			.expect(200)
			.expect((res) =>
				expect(res.body).toMatchObject({...createdProject}));
	});

	it("should return 404 when not found", async () => {
		await requestHandle
			.get(`/project/-1`)
			.expect(404)
			.expect("Project with id '-1' not found.");
	});

	it("should return the updated the project", async () => {
		await requestHandle
			.put(`/project/${createdProject._id}`)
			.set("Authorization", userToken)
			.send({
				description: "I'm trying to make an LED blink every 3 second for 1 second",
			})
			.expect(200)
			.expect((res) =>
				expect(res.body.description)
					.toBe("I'm trying to make an LED blink every 3 second for 1 second"));
	});

	it("should not allow project update without authorization", async () => {
		await requestHandle
			.put(`/project/${createdProject._id}`)
			.send({
				description: "I'm trying to make an LED blink every 3 second for 1 second",
			})
			.expect(401);
	});

	it("should not allow project update as other user", async () => {
		await requestHandle
			.put(`/project/${createdProject._id}`)
			.set("Authorization", otherUserToken)
			.send({
				description: "I'm trying to make an LED blink every 3 second for 1 second",
			})
			.expect(403);
	});

	it("should find the updated project", async () => {
		await requestHandle
			.get(`/project/${createdProject._id}`)
			.set("Authorization", userToken)
			.expect(200)
			.expect((res) =>
				expect(res.body.description)
					.toBe("I'm trying to make an LED blink every 3 second for 1 second"));
	});

	it("should allow admin to update other user's project", async () => {
		await requestHandle
			.put(`/project/${createdProject._id}`)
			.set("Authorization", userToken)
			.send({
				description: "[Removed by admin]",
			})
			.expect(200)
			.expect((res) =>
				expect(res.body.description)
					.toBe("[Removed by admin]"));
	})

	it("should not allow project deletion without authorization", async () => {
		await requestHandle
			.delete(`/project/${createdProject._id}`)
			.expect(401)
	});

	it("should not allow project deletion as other user", async () => {
		await requestHandle
			.delete(`/project/${createdProject._id}`)
			.set("Authorization", otherUserToken)
			.expect(403);
	});

	it("should delete the project", async() => {
		await requestHandle
			.delete(`/project/${createdProject._id}`)
			.set("Authorization", userToken)
			.expect(204);
	});

});