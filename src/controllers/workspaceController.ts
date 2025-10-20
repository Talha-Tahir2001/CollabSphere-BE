import { Request, Response } from "express";
import userModel from "../models/userModel.js";
import { Workspace } from "../models/workspaceModel.js";


interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

interface WorkspaceBody {
    name: string;
    description?: string;
}

export const createWorkspace = async (req: AuthenticatedRequest & { body: WorkspaceBody },
    res: Response) => {
    try {
        const { name, description } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const workspace = await Workspace.create({
            name,
            description,
            owner: userId,
            members: [userId],
        });

        if (!workspace) {
            throw new Error("Failed to create workspace");
        }

        const user = await userModel.findByIdAndUpdate(userId, { $push: { workspaces: workspace._id } });

        if (!user) {
            throw new Error("Failed to update user");
        }

        res.status(201).json(workspace);
    } catch (err: any) {
        console.error("Error creating workspace:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getWorkspaces = async (req: AuthenticatedRequest & { body: WorkspaceBody },
    res: Response) => {
    try {
        const workspaces = await Workspace.find({ owner: req.user?.id })
            .populate("owner", "username email")
            .populate("members", "username email role");

        res.json(workspaces);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};