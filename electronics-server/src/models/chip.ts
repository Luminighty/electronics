import { Schema, model, Types } from "mongoose";

export interface IChip {
    code: string;
    name: string;
    pins: Types.Array<string>;
    description?: string;
    datasheet?: string;
    creator: Types.ObjectId;
}

const chipSchema = new Schema<IChip>({
    code: { type: String, required: true },
    name: { type: String, required: true },
    pins: { type: [String], required: true },
    description: { type: String },
    datasheet: { type: String },
    creator: {type: Schema.Types.ObjectId, ref: "User"},
});

export const Chip = model<IChip>("Chip", chipSchema);