// hooks/useTask.ts
import { Task } from '~/models/task';
import { createTask, deleteTask, getTasks, updateTask } from '~/services/taskService';

// Hook para obtener las tareas
const useTasks = () => {

  const fetchTasks = async () => {
    try {
      const tasks = await getTasks();
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  };

  return { fetchTasks };
};

// Hook para añadir una tarea
const useAddTask = () => {

  const addTask = async (newTask: Task) => {
    try {
      const createdTask = await createTask(newTask);
      return createdTask;
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return { addTask };
};

// Hook para añadir una tarea
const useAddSubtask = () => {

  const addSubTask = async (newTask: Task) => {
    try {
      const createdTask = await createTask(newTask);
      return createdTask;
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return { addSubTask };
};

// Hook para actualizar una tarea
const useUpdateTask = () => {

  const updateTaskDetails = async (taskToUpdate: Task) => {
    try {
      const updated = await updateTask(taskToUpdate);
      return updated;
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return { updateTaskDetails };
};

// Hook para eliminar una tarea
const useDeleteTask = () => {

  const removeTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return { removeTask };
};

export { useTasks, useUpdateTask, useAddSubtask, useAddTask, useDeleteTask };

