import { Task, TaskStatus } from "./task";
import { User } from "./user";


export interface KanbanTaskProps {
    task: Task;
    subtasks: { [taskTitle: string]: { id: string, subtasks: { id: string, title: string }[] } };
    users: User[];
    index: number;
    handleUpdateTask: (newTask: Task) => void;
    handleDeleteTask: (taskID: string) => void;
}

export interface KanbanColumnScheme {
    id: TaskStatus;
    title: string;
    tasks: Task[];
    subtasks: { [taskTitle: string]: { id: string, subtasks: { id: string, title: string }[] } }
}

export interface KanbanColumnProps {
    column: KanbanColumnScheme;
    users: User[];
    handleAddTask: (newTask: Task) => void;
    handleUpdateTask: (newTask: Task) => void;
    handleDeleteTask: (taskID: string) => void;
}

export interface KanbanBoardProps {
    tasks: Task[];
    users: User[];
    fetcher: any;
  }

export const columns: Record<TaskStatus, KanbanColumnScheme> = {
    [TaskStatus.TODO]: {
        id: TaskStatus.TODO,
        title: 'Por Hacer',
        tasks: [],
        subtasks: {}
    },
    [TaskStatus.IN_PROGRESS]: {
        id: TaskStatus.IN_PROGRESS,
        title: 'En Progreso',
        tasks: [],
        subtasks: {}
    },
    [TaskStatus.DONE]: {
        id: TaskStatus.DONE,
        title: 'Completadas',
        tasks: [],
        subtasks: {}
    },
};
