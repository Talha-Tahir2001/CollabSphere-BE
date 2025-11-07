import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Allow only one Admin (optional security measure)
    // const adminExists = await User.exists({ role: "Admin" });
    
    const normalizedRole = role && role.toLowerCase() === "admin" ? "Admin" : "Member";
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: normalizedRole,
    });
     const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    console.log("User registered:", newUser);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser, token });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    // JWT is stateless, so you "logout" by clearing it on the client side.
    // Optionally, you can blacklist tokens in DB or Redis if needed.
    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error("❌ Logout error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};