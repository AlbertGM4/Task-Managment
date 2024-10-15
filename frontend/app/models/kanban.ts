import { Task, TaskStatus } from "./task";


export interface KanbanTaskProps {
    task: Task;
    index: number;
    handleUpdateTask: (newTask: Task) => void;
    handleDeleteTask: (taskID: number) => void;
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
    handleDeleteTask: (taskID: number) => void;
}

// Definir las columnas como un registro, donde cada estado de tarea tiene una columna asociada
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
