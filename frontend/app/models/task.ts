// models/Task.ts

export enum TaskStatus {
  TODO = 'ToDo',
  IN_PROGRESS = 'InProgress',
  DONE = 'Done',
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  // On progress
  /* user: any;
  subtasks: Task[];
  priority: number; */
}

export interface TaskContextType {
  tasks: Task[];
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: number) => void;
}
