import mongoose, { Schema, model, Document } from "mongoose";

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    lastSignIn: Date;

    resetPasswordOtpHash?: string;
    resetPasswordOtpExpiresAt?: Date;
    resetPasswordOtpVerifyAttempts: number;
    resetPasswordOtpLastSentAt?: Date;

    resetPasswordTokenHash?: string;
    resetPasswordExpiresAt?: Date;
}

const userSchema = new Schema<User>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastSignIn: { type: Date, default: Date.now },

    resetPasswordOtpHash: { type: String },
    resetPasswordOtpExpiresAt: { type: Date },
    resetPasswordOtpVerifyAttempts: { type: Number, default: 0 },
    resetPasswordOtpLastSentAt: { type: Date },

    resetPasswordTokenHash: { type: String },
    resetPasswordExpiresAt: { type: Date },
});

export const UserModel = mongoose.models.User || model<User>("User", userSchema);
