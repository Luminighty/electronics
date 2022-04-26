import supertest from "supertest";
import { main } from "../src/app";
import { UserRole } from "../src/models/user";

describe("Users Route", () => {

	let testUser: any = {
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
            const loginResponse = await requestHandle
					.post("/user/login")
					.send(testUser)
					.expect(200);
			testUser.id = loginResponse._id;
		});

		it("should find the user by id", async() => {
			await requestHandle
				.get(`user/${testUser.id}`)
				.expect(200)
				.expect(res =>
					expect(res.body).toMatchObject({
						...testUser,
						role: UserRole.User,
					}));
		});
	});
});