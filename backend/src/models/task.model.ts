import { Schema, model, Document, Types } from "mongoose";

export interface Task extends Document {
    userId: Types.ObjectId;
    title: string;
    description?: string;
    category: string;
    status: boolean;
    deadline?: Date;
}

const taskSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    category: { type: String, required: true },
    status: { type: Boolean, default: false },
    deadline: { type: Date, required: false }
},
    {
        timestamps: true,
    }
);

export const taskModel = model<Task>("Task", taskSchema);
