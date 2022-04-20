import supertest from "supertest";
import { app } from "../src/app";

describe("Issue Manager", () => {
	const user = {
		username: "TestUser", password: "123",
	};
	let createdIssue: object;
	let requestHandle: supertest.SuperTest<supertest.Test>;

	beforeEach(() => {
		requestHandle = supertest(app);
		createdIssue = {
			title: "Broken LED",
			desciption: "The LED broke in room 201's TV"
		};
	});

	it("should create a new issue", async () => {
		await requestHandle
			.post("/issue")
			.send({title: "Broken LED", desciption: "The LED broke in room 201's TV"})
			.expect(200)
			.expect({
				...createdIssue
			});
	});


});