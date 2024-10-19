// models/task.ts

import { FetcherWithComponents } from "@remix-run/react";
import { User } from "./user";

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
  subtasks?: string[];
  priority: TaskPriority;
}

export interface TaskListProps {
  tasks?: Task[];
  users?: User[];
  fetcher: FetcherWithComponents<unknown>;
}

export type TaskProviderProps = {
  children: React.ReactNode;
  initialTasks: Task[];
};
