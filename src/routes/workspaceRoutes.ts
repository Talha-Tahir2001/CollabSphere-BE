import express from "express";
import { createWorkspace, getWorkspaces } from "../controllers/workspaceController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createWorkspace);
router.get("/", verifyToken, getWorkspaces);

export default router;
