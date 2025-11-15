import express from "express";
import { createProject, deleteProject, getProjects, updateProject } from "../controllers/projectController.js";
import { isWorkspaceMember } from "../middleware/workspaceMemberMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

// // Create a new project in a workspace
// router.post("/:workspaceId", verifyToken, isWorkspaceMember, createProject);

// // Get all projects in a workspace
// router.get("/:workspaceId", verifyToken, isWorkspaceMember, getProjects);


router.post("/", verifyToken, isWorkspaceMember, createProject);
router.get("/", verifyToken, isWorkspaceMember, getProjects);

// Optional: Add single project routes
router.get("/:projectId", verifyToken, isWorkspaceMember, getProjects);
router.put("/:projectId", verifyToken, isWorkspaceMember, updateProject);
router.delete("/:projectId", verifyToken, isWorkspaceMember, deleteProject);

export default router;
