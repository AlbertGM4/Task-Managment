// models/taskModel.ts
import mongoose from 'mongoose';

export enum TaskStatus {
  TODO = 'ToDo',
  IN_PROGRESS = 'InProgress',
  DONE = 'Done',
}
const taskSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  status: { type: String, default: TaskStatus.TODO },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;