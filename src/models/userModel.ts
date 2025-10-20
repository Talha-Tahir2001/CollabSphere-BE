import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "Admin" | "Member";
  avatar: { type: String, default: "" },
  workspaces: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Member"],
    default: "Member", 
  },
  workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }]
});

export default mongoose.model<IUser>("User", userSchema);
