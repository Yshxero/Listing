import { Request, Response } from "express";
import { userModel } from "../models/auth.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        const user = await userModel.findOne({ email });

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
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

        const user = await userModel.findOne({ email });
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
