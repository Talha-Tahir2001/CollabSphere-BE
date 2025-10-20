import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:roomId", verifyToken, getMessages);
router.post("/", verifyToken, sendMessage);

export default router;
