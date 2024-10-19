// models/task.ts

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

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  // Extra
  user: string | null;
  subtasks?: Task[];
  priority: TaskPriority;
}

export interface TaskListProps {
  tasks?: Task[];
}

export type TaskProviderProps = {
  children: React.ReactNode;
  initialTasks: Task[];
};
