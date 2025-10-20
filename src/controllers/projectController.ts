import { Response } from "express";
import { Project } from "../models/projectModel.js";
import { AuthRequest } from "../types/express";

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await Project.create({
      name,
      description,
      workspace: workspaceId,
      createdBy: userId,
    });

    res.status(201).json(project);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    // const { workspaceId } = req.params;
    const workspaceId = req.params.workspaceId;
    const projects = await Project.find({ workspace: workspaceId })
      .populate("workspace", "name description")
      .populate("createdBy", "username email role");
    res.json(projects);
  } catch (error) {
    console.error("getProjects error:", error);
    res.status(500).json({ message: "Server error" });
  }
};