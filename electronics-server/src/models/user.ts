import { Schema, model, Types } from "mongoose";

export enum UserRole {
	Guest = "GUEST",
	User = "USER",
	Admin = "ADMIN",
}

export interface IUser {
	username: string;
	password: string;
	role: UserRole,
}

const userSchema = new Schema<IUser>({
	username: {type: String, required: true, index: true},
	password: {type: String, required: true},
	role: {type: String, required: true},
});

userSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj.password;
	return obj;
}

export const User = model<IUser>("User", userSchema);