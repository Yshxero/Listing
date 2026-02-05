import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendResetPasswordOtp } from "../utils/sendOtp";
import crypto from "crypto";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        const user = await UserModel.findOne({ email });

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            lastSignIn: new Date(),
        });

        const token = jwt.sign(
            {
                userID: newUser._id.toString(),
            },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        res.status(201).json({ token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        user.lastSignIn = new Date();
        await user.save();

        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign(
            {
                userID: user._id.toString(),
                userName: user.username,
                userEmail: user.email,
            },
            jwtSecret!,
            { expiresIn: "1h" }
        );
        res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Login failed" });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const coolDown = 10 * 1000;
        if (user.resetPasswordOtpLastSentAt) {
            const nextAllowed = user.resetPasswordOtpLastSentAt.getTime() + coolDown;
            const now = Date.now();

            if (now < nextAllowed) {
                const retryAfterSeconds = Math.ceil((nextAllowed - now) / 1000);
                return res.status(429).json({
                    message: `Please wait ${retryAfterSeconds}s before resending.`,
                    retryAfterSeconds,
                });
            }
        }

        await sendResetPasswordOtp(email);

        return res.status(200).json({
            message: "A 6-digit code has been sent.",
            resendAvailableInSeconds: 10,
            otpExpiresInSeconds: 10,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const verifyResetPasswordOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.resetPasswordOtpHash || !user.resetPasswordOtpExpiresAt) {
            return res.status(400).json({ message: "No pending reset request" });
        }

        if (user.resetPasswordOtpVerifyAttempts >= 3) {
            return res.status(400).json({ message: "Too many attempts. Request a new code." });
        }

        if (user.resetPasswordOtpExpiresAt < new Date()) {
            return res.status(400).json({ message: "OTP expired. Request a new code." });
        }

        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        if (otpHash !== user.resetPasswordOtpHash) {
            user.resetPasswordOtpVerifyAttempts += 1;
            await user.save();
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const resetTokenPlain = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetTokenPlain).digest("hex");

        user.resetPasswordTokenHash = resetTokenHash;
        user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        user.resetPasswordOtpHash = undefined;
        user.resetPasswordOtpExpiresAt = undefined;
        user.resetPasswordOtpVerifyAttempts = 0;
        user.resetPasswordOtpLastSentAt = undefined;

        await user.save();

        return res.status(200).json({
            message: "OTP verified. You can now reset your password.",
            resetToken: resetTokenPlain,
            resetTokenExpiresAt: user.resetPasswordExpiresAt,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, password, confirm, resetToken } = req.body;

        if (!email || !password || !confirm || !resetToken) return res.status(400).json({ message: "Email and password are required" });

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.resetPasswordTokenHash || !user.resetPasswordExpiresAt) {
            return res.status(400).json({ message: "No pending reset request" });
        }
        if (user.resetPasswordExpiresAt < new Date()) {
            return res.status(400).json({ message: "Reset token expired. Request a new one." });
        }

        const incomingHash = crypto.createHash("sha256").update(String(resetToken)).digest("hex");
        if (incomingHash !== user.resetPasswordTokenHash) {
            return res.status(400).json({ message: "Invalid reset token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordTokenHash = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
