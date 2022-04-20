import { WithId, ObjectId, Document } from "mongodb";

export interface Issue extends WithId<Document> {
    title: string,
    description: string,
    id?: ObjectId
}
