import { Router } from "express";
import { addFavorite, createUser, getCity, getUser, updateLocation, updateUserImage } from "../controllers/user.controller.js";

const router = Router();

router.post("/create-user", createUser);

router.post("/update-user-image", updateUserImage);

router.post("/get-user", getUser);

router.post("/update-location", updateLocation);

router.post("/get-city", getCity);

router.post("/add-favorite", addFavorite);

export default router;