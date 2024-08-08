import { Router } from "express";
import { createUser, updateUserImage } from "../controllers/user.controller.js";

const router = Router();

router.post("/create-user", createUser);

router.post("/update-user-image", updateUserImage);

export default router;