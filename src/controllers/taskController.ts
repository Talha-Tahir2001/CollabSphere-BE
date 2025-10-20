import { Response } from "express";
import { AuthRequest } from "../types/express";
import { Task } from "../models/taskModel.js";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const { title, description, assignedTo, projectId, workspaceId, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      project: projectId,
      workspace: workspaceId,
      assignedTo,
      createdBy: req.user.id,
      dueDate,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email")
      .populate("workspace", "name")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, progress, assignedTo } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { title, description, status, progress, assignedTo },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task updated successfully", task });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
