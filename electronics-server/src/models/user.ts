import { Schema, model, Types } from "mongoose";

export interface IUser {
	username: string;
	password: string;
}

const userSchema = new Schema<IUser>({
	username: {type: String, required: true},
	password: {type: String, required: true},
});

export const User = model<IUser>("User", userSchema);