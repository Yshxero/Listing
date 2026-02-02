import { Router } from "express";
import { Authenticate } from "../middleware/auth.middleware";
import { createTask, getAllTasks, getUpcomingTasks, getTaskById, updateTask, deleteTask } from "../controllers/task.controller";

const router = Router();

router.use(Authenticate);
router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/upcoming", getUpcomingTasks);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;