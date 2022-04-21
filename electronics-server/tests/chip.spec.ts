import supertest from "supertest";
import { main } from "../src/app";
import { user, otherUser, admin } from "./test_users";

describe("Chips Route", () => {
	let requestHandle;
	let createdChip: any = {
		"code": "NE555",
		"name": "Single Timer",
		"description": "The LM555/NE555/SA555 is a highly stable controller capable of producing accurate timing pulses",
		"datasheet": "https://www.hestore.hu/prod_getfile.php?id=15",
		"pins": ["GND", "Trigger", "OUT", "RESET", "CONT", "THRES", "DISCH", "VCC"]
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
	})

	beforeEach(async () => {
		userToken = await getUserToken(user);
		otherUserToken = await getUserToken(otherUser);
		adminToken = await getUserToken(admin);
	});

	it("should return an array of chips", async () => {
		await requestHandle
			.get("/chip")
			.expect(200);
	});

	it("should create a new chip", async () => {
		const res = await requestHandle
			.post("/chip")
			.set("Authorization", userToken)
			.send({
				"code": "NE555",
				"name": "Single Timer",
				"description": "The LM555/NE555/SA555 is a highly stable controller capable of producing accurate timing pulses",
				"datasheet": "https://www.hestore.hu/prod_getfile.php?id=15",
				"pins": ["GND", "Trigger", "OUT", "RESET", "CONT", "THRES", "DISCH", "VCC"]
			})
			.expect(201)
			.expect((res) => 
				expect(res.body).toMatchObject({...createdChip}));
		createdChip._id = res.body._id
	});

	it("should find the new chip created", async () => {
		await requestHandle
			.get(`/chip/${createdChip._id}`)
			.expect(200)
			.expect((res) =>
				expect(res.body).toMatchObject({...createdChip}));
	});

	it("should return 404 when not found", async () => {
		await requestHandle
			.get(`/chip/-1`)
			.expect(404)
			.expect("Chip with id '-1' not found.");
	});

	it("should return the updated the chip", async () => {
		await requestHandle
			.put(`/chip/${createdChip._id}`)
			.set("Authorization", userToken)
			.send({
				description: "The NE555 is a highly stable controller capable of producing accurate timing pulses",
			})
			.expect(200)
			.expect((res) =>
				expect(res.body.description)
					.toBe("The NE555 is a highly stable controller capable of producing accurate timing pulses"));
	});

	it("should not allow chip update without authorization", async () => {
		await requestHandle
			.put(`/chip/${createdChip._id}`)
			.send({
				description: "The NE555 is a highly stable controller capable of producing accurate timing pulses",
			})
			.expect(401);
	});

	it("should not allow chip update as other user", async () => {
		await requestHandle
			.put(`/chip/${createdChip._id}`)
			.set("Authorization", otherUserToken)
			.send({
				description: "The NE555 is a highly stable controller capable of producing accurate timing pulses",
			})
			.expect(403);
	});

	it("should find the updated chip", async () => {
		await requestHandle
			.get(`/chip/${createdChip._id}`)
			.set("Authorization", userToken)
			.expect(200)
			.expect((res) =>
				expect(res.body.description)
					.toBe("The NE555 is a highly stable controller capable of producing accurate timing pulses"));
	});

	it("should allow admin to update other user's chip", async () => {
		await requestHandle
			.put(`/chip/${createdChip._id}`)
			.set("Authorization", userToken)
			.send({
				description: "[Removed by admin]",
			})
			.expect(200)
			.expect((res) =>
				expect(res.body.description)
					.toBe("[Removed by admin]"));
	})

	it("should not allow chip deletion without authorization", async () => {
		await requestHandle
			.delete(`/chip/${createdChip._id}`)
			.expect(401)
	});

	it("should not allow chip deletion as other user", async () => {
		await requestHandle
			.delete(`/chip/${createdChip._id}`)
			.set("Authorization", otherUserToken)
			.expect(403);
	});

	it("should delete the chip", async() => {
		await requestHandle
			.delete(`/chip/${createdChip._id}`)
			.set("Authorization", userToken)
			.expect(204);
	});
});
