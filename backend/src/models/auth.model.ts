import { Schema, model, Document } from "mongoose";

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    lastSignIn: Date;
}

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastSignIn: { type: Date, default: Date.now }
});

export const userModel = model<User>("User", userSchema);



