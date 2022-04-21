import supertest from "supertest";
import { main } from "../src/app";

describe("Users Route", () => {

	let testUser = {
		username: "Foo",
		password: "Bar",
	};

	beforeEach(async () => {
		const app = await main();
		requestHandle = supertest(app);
	});

	let requestHandle;
	describe("Authentication", () => {
		it("should register", async () => {
            await requestHandle
				.post("/user/register")
				.send(testUser)
				.expect(200);
		});
		it("should fail on same user registration", async () => {
            await requestHandle
				.post("/user/register")
				.send(testUser)
				.expect(409);
		});
		it("should login with registered user", async () => {
            await requestHandle
				.post("/user/login")
				.send(testUser)
				.expect(200);
		});
	});
});