import express from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/taskController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isWorkspaceMember } from "../middleware/workspaceMemberMiddleware.js";

const router = express.Router({mergeParams: true});

router.post("/", verifyToken, isWorkspaceMember, createTask);
router.get("/", verifyToken, isWorkspaceMember, getTasks);
router.put("/:taskId", verifyToken, isWorkspaceMember, updateTask);
router.delete("/:taskId", verifyToken, isWorkspaceMember, deleteTask);
export default router;
