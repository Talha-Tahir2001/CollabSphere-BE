import { Response } from "express";
import User from "../models/userModel.js";
import { AuthRequest } from "../types/express";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email } = req.body;
    const updateData: any = { username, email };

    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`; 
    }

    const updatedUser = await User.findByIdAndUpdate(req.user!.id, updateData, {
      new: true,
    }).select("-password");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
