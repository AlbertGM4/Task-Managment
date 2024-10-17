// models/Task.ts

export enum TaskStatus {
  TODO = 'ToDo',
  IN_PROGRESS = 'InProgress',
  DONE = 'Done',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  // On progress
  /* user: any;
  subtasks: Task[];
  priority: number; */
}

export interface TaskListProps {
  tasks: Task[];
}

export type TaskProviderProps = {
  children: React.ReactNode;
  initialTasks: Task[];
};
