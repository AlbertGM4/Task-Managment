// frontend/app/services/taskService.ts
import "dotenv/config"
import { Task } from '../models/task';

// Esta variable solo existe en el servidor
const apiUrl = process.env.API_URL as string;
console.log("API: ", process.env);
if (!apiUrl) {
  throw new Error('API_URL is not defined. Make sure it is available in your environment.');
}

// Obtener tareas desde el servidor
export async function getTasks(): Promise<Task[]> {
    try {
        console.log("---- Obteniendo tareas ----");
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error al obtener las tareas');
        }
        const tasks: Task[] = await response.json();
        console.log("Tareas obtenidas desde el servicio:", tasks);
        return tasks;
    } catch (error) {
        console.error("Error en getTasks:", error);
        throw error; // Propagar el error para manejarlo en el componente
    }
}

// Función para crear una nueva tarea en el "backend"
export async function createTask(newTask: Task): Promise<Task> {
    try {
        console.log("---- Creando Tarea ----\n");
        console.log("Tarea: ", JSON.stringify(newTask));
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Agrega este encabezado
            },
            body: JSON.stringify(newTask),
        });

        if (!response.ok) {
            throw new Error(`Error al crear la tarea: ${response.statusText}`);
        }

        const createdTask: Task = await response.json();
        return createdTask;
    } catch (error) {
        console.error("Error en createTask:", error);
        throw error;
    }
}

// Función para actualizar el estado de la tarea
export async function updateTask(taskToUpdate: Task): Promise<Task | null> {
    try {
        const taskId = taskToUpdate.id
        console.log("---- Actualizacion tarea en backend ----");
        const response = await fetch(`${apiUrl}/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify({ taskToUpdate }),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la tarea: ${response.statusText}`);
        }

        const updatedTask: Task = await response.json();
        console.log("Tarea actualizada:", updatedTask);
        return updatedTask;
    } catch (error) {
        console.error("Error en updateTaskStatus:", error);
        throw error;
    }
}

// Función para eliminar una tarea
export async function deleteTask(taskId: number): Promise<void> {
    try {
        const response = await fetch(`${apiUrl}/${taskId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la tarea: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error en deleteTask:", error);
        throw error;
    }
}