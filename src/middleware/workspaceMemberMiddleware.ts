import { Workspace } from "../models/workspaceModel.js";
import { AuthRequest } from "../types/express";
import { Response, NextFunction } from "express";

export const isWorkspaceMember = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const workspaceId = req.params.workspaceId || req.body.workspaceId;
        if (!workspaceId) {
            return res.status(400).json({ message: "Workspace ID is required" });
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Convert ObjectId to string before comparing
        const memberIds = workspace.members.map((m) => m.toString());
        const userId = req.user?.id?.toString();


        if (!memberIds.includes(userId!)) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    } catch (error: any) {
        console.error("isWorkspaceMember error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
