// services/taskService.ts
import { Task, TaskStatus } from '../models/task';


// Example data
let tasksDatabase: Task[] = [
  { id: 1, title: 'Task 1', description: 'This is task 1', status: TaskStatus.TODO },
  { id: 2, title: 'Task 2', description: 'This is task 2', status: TaskStatus.IN_PROGRESS },
  { id: 3, title: 'Task 3', description: 'This is task 3', status: TaskStatus.DONE },
];

// Simular un API
export async function getTasks(): Promise<Task[]> {
    return new Promise((resolve) => {
        console.log("Obteniendo tareas desde el servicio...");
        setTimeout(() => {
            console.log("Tareas obtenidas desde el servicio:", tasksDatabase);
            resolve(tasksDatabase);
        }, 1000); // Simula un retraso en la respuesta
    });
}

// Función para actualizar el estado de la tarea
export async function updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task | null> {
  console.log("---- Actualizacion tarea en backend ----");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const taskIndex = tasksDatabase.findIndex(task => task.id === taskId);
            if (taskIndex === -1) {
                reject(new Error("Task not found"));
                return;
            }

            // Actualizar la tarea
          tasksDatabase[taskIndex].status = status;
          console.log("data: ", tasksDatabase)
            resolve(tasksDatabase[taskIndex]);
        }, 500);
    });
}

// Función para crear una nueva tarea en el "backend"
export async function createTask(newTask: Task): Promise<Task> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // uid
            const newId = tasksDatabase.length > 0 ? tasksDatabase[tasksDatabase.length - 1].id + 1 : 1;
            const createdTask = { ...newTask, id: newId }; // Genera un nuevo ID único
            tasksDatabase.push(createdTask);
            console.log("New database: ", tasksDatabase);
            resolve(createdTask);
        }, 500);
    });
}

// Obtener tareas desde el servidor
/* export async function getTasks(): Promise<Task[]> {
    try {
        const response = await fetch(API_URL);
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
} */

// Función para actualizar el estado de la tarea
/* export async function updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task | null> {
    try {
        console.log("---- Actualizacion tarea en backend ----");
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT', // Método para actualizar
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }), // Solo actualiza el estado
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
} */

// Función para crear una nueva tarea en el "backend"
/* export async function createTask(newTask: Task): Promise<Task> {
    try {
        const response = await fetch(API_URL, {
            method: 'POST', // Método para crear
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask), // Enviar la nueva tarea
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
} */

// Función para eliminar una tarea
/* export async function deleteTask(taskId: number): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE', // Método para eliminar
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la tarea: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error en deleteTask:", error);
        throw error;
    }
} */