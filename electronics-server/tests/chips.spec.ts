import supertest from "supertest";
import { main } from "../src/app";

describe("Chips Route", () => {
	const user = {
		username: "TestUser", password: "123",
	};
	let requestHandle;
	let createdIssue: any = {
		title: "Broken LED", 
		description: "The LED broke in room 201's TV"
	};

	beforeEach(async () => {
		const app = await main();
		requestHandle = supertest(app);
	});

	it("should return an array of issues", async () => {
		await requestHandle
			.get("/issue")
			.expect(200);
	});

	it("should create a new issue", async () => {
		const res = await requestHandle
			.post("/issue")
			.send({
				title: "Broken LED", 
				description: "The LED broke in room 201's TV"
			})
			.expect(201)
			.expect((res) => 
				expect(res.body).toMatchObject({...createdIssue}));
		createdIssue._id = res.body._id
	});

	it("should find the new issue created", async () => {
		const res = await requestHandle
			.get(`/issue/${createdIssue._id}`)
			.expect(200)
			.expect({...createdIssue});
	});

	it("should return 404 when not found", async () => {
		const res = await requestHandle
			.get(`/issue/000000000000000000000000`)
			.expect(404)
			.expect("Issue with id 000000000000000000000000 does not exist");
	});

});