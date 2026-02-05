import { Response, Request, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { taskModel } from "../models/task.model";
import mongoose from "mongoose";

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, category, status, deadline } = req.body;

        if (!req.user?.userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const task = await taskModel.create({
            userId: req.user?.userID,
            title, description,
            category,
            status,
            deadline
        });
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create task" });
    }
};

export const getAllTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.user?.userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const tasks = await taskModel.find({ userId: req.user?.userID }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get tasks" })
    }
};

export const getUpcomingTasks = async (req: AuthRequest, res: Response) => {
    try {

        if (!req.user?.userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const tasks = await taskModel
            .find({
                userId: req.user?.userID,
                status: false,
                deadline: { $gte: start, $lte: end },
            })
            .sort({ deadline: 1 });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch upcoming tasks" });
    }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
    try {

        if (!req.user?.userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
            return res.status(400).json({ message: "Invalid task id" });
        }

        const task = await taskModel.findOne({
            _id: req.params.id as string,
            userId: req.user?.userID,
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get task" });
    }
};


export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.user?.userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
            return res.status(400).json({ message: "Invalid task id" });
        }
        const { title, description, category, deadline, status } = req.body;

        const updatedTask = await taskModel.findOneAndUpdate(
            { _id: req.params.id as string, userId: req.user?.userID },
            {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(category !== undefined && { category }),
                ...(deadline !== undefined && { deadline }),
                ...(status !== undefined && { status }),
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update task" });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.user?.userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
            return res.status(400).json({ message: "Invalid task id" });
        }

        const task = await taskModel.findOneAndDelete({
            _id: req.params.id as string,
            userId: req.user?.userID
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete task" });
    }
};

export const getMissedTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.user?.userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const tasks = await taskModel
            .find({
                userId: req.user?.userID,
                status: false,
                deadline: { $lt: start },
            })
            .sort({ deadline: 1 });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch missed tasks" });
    }
};


