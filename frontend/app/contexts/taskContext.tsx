// contexts/taskContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { Task, TaskContextType } from '../models/task';
import { createTask, getTasks, updateTaskStatus } from '~/services/taskService';


// Crear el contexto para las tareas
export const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Proveedor de contexto de tareas
export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    console.log("TaskProvider se está renderizando"); // Verificar si el proveedor se renderiza

    // Cargar tareas al montar el componente
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                console.log("Intentando obtener tareas...");
                const tasksFromApi = await getTasks();
                console.log("Tareas obtenidas:", tasksFromApi);
                setTasks(tasksFromApi);
            } catch (error) {
                console.error("Error obteniendo tareas:", error);
            }
        };

        fetchTasks();
    }, []);

    const updateTask = async (updatedTask: Task) => {
        console.log("---- Update Task ----");
        console.log("Tarea a actualizar:", updatedTask);

        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task));
            console.log("Tareas actualizadas:", updatedTasks); // Verifica las tareas actualizadas
            return updatedTasks;
        });

        // Llama a la función del servicio para actualizar la tarea en el backend simulado
        try {
            const taskFromApi = await updateTaskStatus(updatedTask.id, updatedTask.status); // Llamada al backend simulado
            console.log("Tarea actualizada en el backend correctamente");
        } catch (error) {
            console.error("Error actualizando la tarea en el backend:", error);
            // Opcional: revertir cambios si hay un error
        }
    };

    const addTask = async (newTask: Task) => {
        // Hacer la petición al backend para añadir la tarea
        try {
            const createdTask = await createTask(newTask); // Llamar al servicio de backend
            console.log("Tarea añadida correctamente en el backend");
            const tasksFromApi = await getTasks();
            setTasks(tasksFromApi);
        } catch (error) {
            console.error("Error añadiendo la tarea al backend:", error);
            // Revertir el cambio en el frontend si la petición falla
            setTasks(prevTasks => prevTasks.filter(task => task.id !== newTask.id));
        }
    };

    const deleteTask = async (id: number) => {
        try {
            await deleteTask(id);
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, updateTask, addTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};
