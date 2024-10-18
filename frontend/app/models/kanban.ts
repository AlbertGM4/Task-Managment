import { Task, TaskStatus } from "./task";


export interface KanbanTaskProps {
    task: Task;
    index: number;
    handleUpdateTask: (newTask: Task) => void;
    handleDeleteTask: (taskID: string) => void;
}

export interface KanbanColumnScheme {
    id: TaskStatus;
    title: string;
    tasks: Task[];
}

export interface KanbanColumnProps {
    column: KanbanColumnScheme;
    handleAddTask: (newTask: Task) => void;
    handleUpdateTask: (newTask: Task) => void;
    handleDeleteTask: (taskID: string) => void;
}

export interface KanbanBoardProps {
    tasks: Task[];
    fetcher: any;
  }

export const columns: Record<TaskStatus, KanbanColumnScheme> = {
    [TaskStatus.TODO]: {
        id: TaskStatus.TODO,
        title: 'Por Hacer',
        tasks: [],
    },
    [TaskStatus.IN_PROGRESS]: {
        id: TaskStatus.IN_PROGRESS,
        title: 'En Progreso',
        tasks: [],
    },
    [TaskStatus.DONE]: {
        id: TaskStatus.DONE,
        title: 'Completadas',
        tasks: [],
    },
};
