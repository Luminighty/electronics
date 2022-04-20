import { app } from "./app";
import { connectToDatabase } from "./services/database.service";
import * as dotenv from "dotenv";

connectToDatabase()
.then(() => {
	const PORT = process.env.PORT ||  3000;
	
	app.listen(PORT, () => {
		console.log(`Server started on port ${PORT}!`);
	});
})
.catch((error: Error) => {
	console.error(`Database connection failed`, error);
	process.exit();
})
;