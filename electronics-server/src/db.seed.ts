import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { IUser, User, UserRole } from "./models/user";
import { IChip, Chip } from "./models/chip";
import { hashPassword } from "./security/password-utils";

const defaultUsers: IUser[] = [

];

const defaultChips = [
	{
		code: "NE555",
		name: "Single Timer",
		pins: [ "GND", "Trigger", "OUT", "RESET", "CONT", "THRES", "DISCH", "VCC" ],
		description: `The LM555/NE555/SA555 is a highly stable controller
		capable of producing accurate timing pulses. With a
		monostable operation, the time delay is controlled by one
		external resistor and one capacitor. With an astable
		operation, the frequency and duty cycle are accurately
		controlled by two external resistors and one capacitor.`,
		datasheet: "https://www.hestore.hu/prod_getfile.php?id=15",
	},
	{
		code: "74HC163",
		name: "Presettable Counter",
		pins: [ "MR", "CP", "P0", "P1", "P2", "P3", "PE", "GND", "SPE", "TE", "Q3", "Q2", "Q1", "Q0", "TC", "VCC" ],
		description: `The 'HC161, 'HCT161, 'HC163, and 'HCT163 are
			presettable synchronous counters that feature look-ahead
			carry logic for use in high-speed counting applications. The
			'HC161 and 'HCT161 are asynchronous reset decade and
			binary counters, respectively; the 'HC163 and 'HCT163
			devices are decade and binary counters, respectively, that
			are reset synchronously with the clock. Counting and
			parallel presetting are both accomplished synchronously
			with the negative-to-positive transition of the clock.
		`,
		datasheet: "https://www.hestore.hu/prod_getfile.php?id=15",
	},
	{
		code: "74HC595",
		name: "8-Bit Shift Register",
		pins: [ "QB", "QC", "QD", "QE", "QF", "QG", "QH", "GND", "QH'", "SRCLR", "SRCLK", "RCLK", "OE", "SER", "QA", "VCC" ],
		description: `The SNx4HC595 devices contain an 8-bit, serial-in,
		parallel-out shift register that feeds an 8-bit D-type storage register. 
		The storage register has parallel 3-state outputs. 
		Separate clocks are provided for both the shift and storage register. 
		The shift register has a direct overriding clear (SRCLR) input, 
		serial (SER) input, and serial outputs for cascading. 
		When the output-enable (OE) input is high, the outputs are in
		the high-impedance state.
		`,
		datasheet: "https://www.hestore.hu/prod_getfile.php?id=15",
	},
];


(async() => {
	dotenv.config();

	await mongoose.connect(process.env.DB_CONN_STRING, {
		dbName: process.env.DB_NAME,
	});

	console.log("Seeding database");

	await Promise.all(defaultUsers.map(createUser));
	await Promise.all(defaultChips.map(createChip));

	process.exit(0);
})();

async function createChip(chip) {
	const newChip = new Chip({...chip});
	await newChip.save();
}

async function createUser(data) {
	data.password = await hashPassword(data.password);
	const user = new User({...data});
	await user.save();
}
