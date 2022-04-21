import { Schema, model, Types } from "mongoose";

export interface IProject {
	title: string;
	shortDescription: string;
	description: string;
	creator: Types.ObjectId;
	chips: Types.Array<Types.ObjectId>,
}

const projectSchema = new Schema<IProject>({
	title: {type: String, required: true},
	shortDescription: {type: String},
	description: {type: String},
	creator: {type: Schema.Types.ObjectId, ref: "User", required: true},
	chips: [{type: Schema.Types.ObjectId, ref: "Chip"}],
});

export const Project = model<IProject>("Project", projectSchema);