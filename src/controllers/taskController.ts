import { Response } from "express";
import { AuthRequest } from "../types/express";
import { Task } from "../models/taskModel.js";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    // Get from URL params
    const { workspaceId, projectId } = req.params;
    
    // Get from request body
    const { title, description, assignedTo, dueDate, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    // Set initial progress based on status
    let progress = 0;
    if (status === "In Progress") progress = 50;
    if (status === "Done") progress = 100;

    const task = await Task.create({
      title,
      description,
      status: status || "Todo",
      progress,
      project: projectId,
      workspace: workspaceId,
      assignedTo,
      createdBy: req.user.id,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err: any) {
    console.error("createTask error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { workspaceId, projectId } = req.params;
    
    const tasks = await Task.find({ 
      project: projectId,
      workspace: workspaceId 
    })
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err: any) {
    console.error("getTasks error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { workspaceId, projectId, taskId } = req.params;
    const { title, description, status, progress, assignedTo, dueDate } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const task = await Task.findOneAndUpdate(
      { 
        _id: taskId,
        project: projectId,
        workspace: workspaceId 
      },
      updateData,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err: any) {
    console.error("updateTask error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { workspaceId, projectId, taskId } = req.params;

    const task = await Task.findOneAndDelete({ 
      _id: taskId,
      project: projectId,
      workspace: workspaceId 
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err: any) {
    console.error("deleteTask error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};