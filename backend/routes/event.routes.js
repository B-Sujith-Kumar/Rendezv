import { Router } from "express";
import { createEvent, getEvent, getEvents, getFreeEvents, getOnlineEvents } from "../controllers/event.controller.js";

const router = Router();

router.post("/create-event", createEvent);

router.get("/get-event/:id", getEvent);

router.get("/get-free-events", getFreeEvents);

router.get("/get-online-events", getOnlineEvents);

router.get("/get-events", getEvents);

export default router;