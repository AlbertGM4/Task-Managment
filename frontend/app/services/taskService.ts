// frontend/app/services/taskService.ts
import "dotenv/config"
import { Task } from '../models/task';


const apiUrl = process.env.API_URL as string;
if (!apiUrl) {
  throw new Error('API_URL is not defined. Make sure it is available in your environment.');
}

// Obtener tareas desde el servidor
export async function getTasks(): Promise<Task[]> {
    console.log("---- Obteniendo tareas ----");
    try {
        const response = await fetch(`${apiUrl}/tasks`);
        if (!response.ok) {
            throw new Error('Error al obtener las tareas');
        }
        const tasksFromBackend = await response.json();
        const tasks: Task[] = tasksFromBackend.map((task: any) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            user: task.user,
            subtasks: task.subtasks,
            priority: task.priority
        }));
        console.log("Tareas obtenidas desde el servicio:", tasks);
        return tasks;
    } catch (error) {
        console.error("Error en getTasks:", error);
        throw error; // Propagar el error para manejarlo en el componente
    }
}

// Función para crear una nueva tarea en el "backend"
export async function createTask(newTask: Task): Promise<Task> {
    console.log("---- Creando Tarea ----\n");
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        });
        console.log("Respuesta crear back: ", response);

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

// Función para añadir una nueva subtarea en el "backend"
export async function useAddSubtask(taskId: string, subtaskId: string): Promise<Task> {
    console.log("---- Añadiendo Subtarea ----\n");
    try {
        const response = await fetch(`${apiUrl}/subtasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskId, subtaskId }),
        });
        if (!response.ok) {
            throw new Error(`Error al crear la subtarea: ${response.statusText}`);
        }

        const updatedTask: Task = await response.json();
        return updatedTask;
    } catch (error) {
        console.error("Error en useAddSubtask:", error);
        throw error;
    }
}

// Función para actualizar el estado de la tarea
export async function updateTask(taskToUpdate: Task): Promise<Task | null> {
    console.log("---- Actualizacion tarea ----");
    try {
        const taskId = taskToUpdate.id

        const response = await fetch(`${apiUrl}/:${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskToUpdate),
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
export async function deleteTask(taskId: string): Promise<void> {
    console.log("---- Borrado tarea ----");
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