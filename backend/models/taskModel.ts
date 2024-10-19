// models/taskModel.ts
import mongoose, { Schema } from 'mongoose';
import { IUser } from './user';

export enum TaskStatus {
  TODO = 'ToDo',
  IN_PROGRESS = 'InProgress',
  DONE = 'Done',
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

// Define la interfaz para la tarea
export interface ITask extends Document {
  _id: String,
  title: string;
  description?: string;
  status: TaskStatus;
  user?: IUser;
  subtasks?: ITask[];
  priority?: TaskPriority;
  createdAt: Date;
}

const subtaskSchema = new Schema<ITask>({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  status: { type: String, default: TaskStatus.TODO },
  user: { type: Schema.Types.Mixed, default: undefined },
  subtasks: { type: [Schema.Types.Mixed], default: [] },
  priority: { type: String, enum: Object.values(TaskPriority), required: false },
  createdAt: { type: Date, default: Date.now },
});

const taskSchema = new Schema<ITask>({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  status: { type: String, default: TaskStatus.TODO },
  user: { type: Schema.Types.Mixed, default: undefined },
  subtasks: { type: [subtaskSchema], default: [] },
  priority: { type: String, enum: Object.values(TaskPriority), required: false },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;