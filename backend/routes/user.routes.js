import { Router } from "express";
import { createUser, getUser, updateLocation, updateUserImage } from "../controllers/user.controller.js";

const router = Router();

router.post("/create-user", createUser);

router.post("/update-user-image", updateUserImage);

router.post("/get-user", getUser);

router.post("/update-location", updateLocation);

export default router;