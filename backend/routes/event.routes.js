import { Router } from "express";
import { createEvent } from "../controllers/event.controller.js";

const router = Router();

router.post("/create-event", createEvent)

export default router;