import { Router } from "express";
import { createEvent, getEvent } from "../controllers/event.controller.js";

const router = Router();

router.post("/create-event", createEvent);

router.get("/get-event/:id", getEvent);

export default router;