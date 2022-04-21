import { IUser } from "./models/user";
import { HydratedDocument } from 'mongoose';

declare global {
	namespace Express {
		interface User extends HydratedDocument<IUser> {}
	}
}