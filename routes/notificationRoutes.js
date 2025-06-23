import express from "express";
import { createNotification } from "../controllers/notificationController.js";

const router = express.Router();

// POST /api/notifications/send
router.post("/send", createNotification);

export default router;
