import express from "express";
import { createProject, getProjects } from "../controllers/projectController.js";
import { isWorkspaceMember } from "../middleware/workspaceMemberMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new project in a workspace
router.post("/:workspaceId", verifyToken, isWorkspaceMember, createProject);

// Get all projects in a workspace
router.get("/:workspaceId", verifyToken, isWorkspaceMember, getProjects);

export default router;
