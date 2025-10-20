import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "Todo" | "In Progress" | "Done";
  progress: number;
  assignedTo?: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  dueDate?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: Date,
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
