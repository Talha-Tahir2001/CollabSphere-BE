import express from "express";
import { createTask, getTasks, updateTask } from "../controllers/taskController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isWorkspaceMember } from "../middleware/workspaceMemberMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isWorkspaceMember, createTask);
router.get("/:projectId", verifyToken, isWorkspaceMember, getTasks);
router.put("/:taskId", verifyToken, isWorkspaceMember, updateTask);

export default router;
