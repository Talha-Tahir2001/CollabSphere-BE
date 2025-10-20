import {  Response } from "express";
import Message from "../models/messageModel.js";
import { AuthRequest } from "../types/express.js";
import mongoose from "mongoose";

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const messages = await Message.find({ workspace: roomId })
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, content, workspaceId } = req.body;
    const senderId = req.user?.id;

    if (!content || !senderId) {
      return res.status(400).json({ message: "Missing content or sender" });
    }

    const message = new Message({
      sender: new mongoose.Types.ObjectId(senderId),
      receiver: receiverId ? new mongoose.Types.ObjectId(receiverId) : null,
      workspace: workspaceId ? new mongoose.Types.ObjectId(workspaceId) : null,
      content,
    });

    await message.save();
    const populatedMessage = await message.populate("sender", "username email");

    res.status(201).json(populatedMessage);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

