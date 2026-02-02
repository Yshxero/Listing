import { Request, Response } from "express";
import { userModel } from "../models/auth.model";
import { taskModel } from "../models/task.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await userModel.find().select("email");
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await userModel.findById(req.user.userID).select("username email lastSignIn");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            userID: user._id.toString(),
            userName: user.username,
            userEmail: user.email,
            lastSignIn: user.lastSignIn
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { username, email } = req.body;
        if (!username || !email) {
            return res.status(400).json({ message: "Username and email are required" });
        }

        if (email) {
            const existingUser = await userModel.findOne({
                email,
                _id: { $ne: req.user.userID },
            });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        const user = await userModel.findByIdAndUpdate(req.user.userID, {
            ...(username ? { username } : {}),
            ...(email ? { email } : {}),
        }, { new: true, runValidators: true }).select("username email lastSignIn");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            userID: user._id.toString(),
            userName: user.username,
            userEmail: user.email,
            lastSignIn: user.lastSignIn
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteProfile = async (req: AuthRequest, res: Response) => {

    try {
        if (!req.user?.userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await taskModel.deleteMany({ userId: req.user.userID });

        const user = await userModel.findByIdAndDelete(req.user.userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};




