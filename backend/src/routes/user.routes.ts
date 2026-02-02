import { Router } from "express";
import { Authenticate } from "../middleware/auth.middleware";
import { getAllUsers, getProfile, updateProfile, deleteProfile } from "../controllers/user.controller";

const router = Router();

router.get("/getAllUsers", Authenticate, getAllUsers);
router.get("/profile", Authenticate, getProfile);
router.patch("/updateProfile", Authenticate, updateProfile);
router.delete("/deleteProfile", Authenticate, deleteProfile);

export default router;
