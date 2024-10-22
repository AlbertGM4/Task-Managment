// components/kanbanBoard/kanbanBoard.tsx
import { useEffect, useState } from 'react';
import { Task, TaskStatus } from '~/models/task';
import { DragDropContext } from 'react-beautiful-dnd';
import { KanbanBoardProps, KanbanColumnScheme, columns as predefinedColumns } from '~/models/kanban';
import KanbanColumn from './kanbanColumn';


const KanbanBoard : React.FC<KanbanBoardProps> = ({ tasks, users, fetcher }) => {
    const [columns, setColumns] = useState<Record<TaskStatus, KanbanColumnScheme>>(predefinedColumns);

    const filteredTasks = (status: TaskStatus) => {
        return tasks.filter(task => task.status === status);
    };

    const createTaskMap = (tasks: Task[]) => {
        const taskMap: { [key: string]: Task } = {};
        tasks.forEach(task => {
            taskMap[task.id] = task;
        });
        return taskMap;
    };

    const getSubtasks = (taskMap: { [key: string]: Task }): { [taskTitle: string]: { id: string, subtasks: { id: string, title: string }[] } } => {
        const subtasksMap: { [taskTitle: string]: { id: string, subtasks: { id: string, title: string }[] } } = {};

        // Recorrer todas las tareas para llenar el mapa de subtareas
        for (const taskId in taskMap) {
            const task = taskMap[taskId];
            subtasksMap[task.title] = {
                id: task.id,
                subtasks: task.subtasks?.map(subtaskId => {
                    const subtask = taskMap[subtaskId];
                    return subtask ? { id: subtask.id, title: subtask.title } : { id: '', title: 'Subtarea no encontrada' };
                }) || [],
            };
        }

        return subtasksMap;
    };

    useEffect(() => {
        const taskMap = createTaskMap(tasks);
        const subtasksDict = getSubtasks(taskMap);

        const todoTasks = filteredTasks(TaskStatus.TODO);
        const inProgressTasks = filteredTasks(TaskStatus.IN_PROGRESS);
        const doneTasks = filteredTasks(TaskStatus.DONE);

        // Aquí se configura el estado de las columnas
        setColumns({
            [TaskStatus.TODO]: {
                ...predefinedColumns[TaskStatus.TODO],
                tasks: todoTasks,
                subtasks: subtasksDict,
            },
            [TaskStatus.IN_PROGRESS]: {
                ...predefinedColumns[TaskStatus.IN_PROGRESS],
                tasks: inProgressTasks,
                subtasks: subtasksDict,
            },
            [TaskStatus.DONE]: {
                ...predefinedColumns[TaskStatus.DONE],
                tasks: doneTasks,
                subtasks: subtasksDict,
            },
        });
    }, [tasks]);

    const handleDragEnd = async (result: { source: any; destination: any; draggableId: any; }) => {
        console.log("---- handleDragEnd ----");
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            console.log("La tarea no se ha movido, regresando...");
            return;
        }

        const newStatus = destination.droppableId as TaskStatus;

        const taskToUpdate = tasks.find(task => task.id === draggableId);
        if (taskToUpdate) {
            await handleUpdateTask({ ...taskToUpdate, status: newStatus });
        }
    };

    const handleAddTask = async (taskData: Task) => {
        fetcher.submit({
            action: 'add',
            task: JSON.stringify(taskData),
        }, { method: 'post' });
    };

    const handleUpdateTask = async (taskToUpdate: Task) => {
        // Optimistic Update: actualizar el estado localmente antes de enviar al backend
        const updateState = (task: Task) => {
            setColumns(prev => ({
                ...prev,
                [task.status]: {
                    ...prev[task.status],
                    tasks: prev[task.status].tasks.map(t => t.id === task.id ? task : t),
                },
            }));
        };

        updateState(taskToUpdate);

        fetcher.submit({
            action: 'update',
            task: JSON.stringify(taskToUpdate),
        }, { method: 'post' });
    };

    const handleDeleteTask = async (taskId: string) => {
        fetcher.submit({
            action: 'delete',
            id: taskId
        }, { method: 'post' });
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
                <div id="kanBanBoard" className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-screen-xl justify-items-center">
                    {Object.values(columns).map((column) => (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            users={users}
                            handleAddTask={handleAddTask}
                            handleUpdateTask={handleUpdateTask}
                            handleDeleteTask={handleDeleteTask}
                        />
                    ))}
                </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
