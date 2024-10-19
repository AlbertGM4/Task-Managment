// components/kanbanBoard/kanbanBoard.tsx
import { useEffect, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { Task, TaskStatus } from '~/models/task';
import { DragDropContext } from 'react-beautiful-dnd';
import { useAddTask, useUpdateTask, useDeleteTask } from '~/hooks/useTask';
import { KanbanBoardProps, KanbanColumnScheme, columns as predefinedColumns } from '~/models/kanban';
import KanbanColumn from './kanbanColumn';



const KanbanBoard : React.FC<KanbanBoardProps> = ({ tasks, users, fetcher }) => {
    const [columns, setColumns] = useState<Record<TaskStatus, KanbanColumnScheme>>(predefinedColumns);

    const filteredTasks = (status: TaskStatus) => {
        return tasks.filter(task => task.status === status);
    };

    useEffect(() => {
        setColumns({
            [TaskStatus.TODO]: {
                ...predefinedColumns[TaskStatus.TODO],
                tasks: filteredTasks(TaskStatus.TODO),
            },
            [TaskStatus.IN_PROGRESS]: {
                ...predefinedColumns[TaskStatus.IN_PROGRESS],
                tasks: filteredTasks(TaskStatus.IN_PROGRESS),
            },
            [TaskStatus.DONE]: {
                ...predefinedColumns[TaskStatus.DONE],
                tasks: filteredTasks(TaskStatus.DONE),
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
        console.log("Creating task:", taskData);
        fetcher.submit({
            action: 'add',
            title: taskData.title,
            description: taskData.description,
            status: taskData.status || TaskStatus.TODO
        }, { method: 'post' });
    };

    const handleUpdateTask = async (taskToUpdate: Task) => {
        console.log("Updating task:", taskToUpdate);

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
            id: taskToUpdate.id,
            title: taskToUpdate.title,
            description: taskToUpdate.description,
            status: taskToUpdate.status
        }, { method: 'post' });
    };

    const handleDeleteTask = async (taskId: string) => {
        console.log("Deleting task:", taskId);
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
