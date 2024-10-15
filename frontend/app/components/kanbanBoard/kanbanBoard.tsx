// components/kanbanBoard/kanbanBoard.tsx
import { DragDropContext } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import { Task, TaskStatus } from '~/models/task';
import { useAddTask, useDeleteTask, useTask, useUpdateTask } from '~/hooks/useTask';
import { KanbanColumnScheme, columns as predefinedColumns } from '~/models/kanban';
import KanbanColumn from './kanbanColumn';


const KanbanBoard = () => {
    const { tasks } = useTask(); // Usar el hook para obtener las tareas
    const { updateTaskDetails } = useUpdateTask(); // Usar el hook para actualizar tareas
    const { addTask } = useAddTask(); // Obtener la función para añadir la tarea desde el hook
    const { deleteTask } = useDeleteTask(); // Obtener la función para añadir la tarea desde el hook

    // const [isMounted, setIsMounted] = useState(false); // Nueva variable para controlar el montaje del componente

    const filteredTasks = (status: TaskStatus) => {
        return tasks.filter(task => task.status === status);
    };

    // Crear un estado para las columnas utilizando las definiciones predefinidas
    const [columns, setColumns] = useState<Record<TaskStatus, KanbanColumnScheme>>(() => ({
        ...predefinedColumns,

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
    }));

    useEffect(() => {
        // Solo marcamos el componente como montado cuando se hidrata en el cliente
        /* setIsMounted(true);

        if (isMounted) { */
        setColumns({
            ...predefinedColumns,
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
        /* } */
    }, [tasks]);

    const handleDragEnd = (result: { source: any; destination: any; draggableId: any; }) => {
        console.log("---- handleDragEnd ----");
        const { source, destination, draggableId } = result;

        if (!destination) return;

        // Si la tarea no cambió de columna, no hacemos nada
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            console.log("La tarea no se ha movido, regresando...");
            return;
        }

        const taskId = parseInt(draggableId, 10);
        const newStatus = destination.droppableId as TaskStatus;

        console.log("TaskID: ", taskId);
        console.log("NewStatus: ", newStatus);

        // Obtener la tarea que se está moviendo
        const taskToMove = tasks.find(task => task.id === taskId);
        if (!taskToMove) return; // Asegúrate de que la tarea existe

        // Actualizar el estado de la tarea
        const updatedTask = { ...taskToMove, status: newStatus }; // Crea una nueva tarea con el nuevo estado
        updateTaskDetails(updatedTask); // Usa la función para actualizar la tarea

        setColumns(prev => ({
            ...prev,
            [source.droppableId]: {
                ...prev[source.droppableId as TaskStatus],
                tasks: prev[source.droppableId as TaskStatus].tasks.filter(item => item.id !== taskId), // Eliminar tarea de la columna de origen
            },
            [newStatus]: {
                ...prev[newStatus],
                tasks: [...prev[newStatus].tasks, tasks.find(task => task.id === taskId)], // Añadir tarea a la nueva columna
            },
        }));
    };

    // Modificado para recibir una nueva tarea
    const handleAddTask = (taskData: Task) => {
        console.log("Creating task:", taskData);
        addTask(taskData);

        // Aquí puedes actualizar las columnas inmediatamente después de añadir la tarea
        setColumns(prev => ({
            ...prev,
            [taskData.status]: {
                ...prev[taskData.status],
                tasks: [...prev[taskData.status].tasks, taskData],
            },
        }));
    };

    // Nueva función para manejar la actualización de tareas
    const handleUpdateTask = (updatedTask: Task) => {
        console.log("Updating task:", updatedTask);
        updateTaskDetails(updatedTask);
    };

    const handleDeleteTask = (taskId: number) => {
        console.log("Deleting task:", taskId);
        deleteTask(taskId);
    };

    // No renderizamos el componente DragDropContext hasta que esté montado en el cliente
    /* if (!isMounted) return null; */

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex space-x-4 overflow-x-auto p-4">
                {Object.values(columns).map((column) => (
                    <KanbanColumn
                        key={column.id}
                        column={column}
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
