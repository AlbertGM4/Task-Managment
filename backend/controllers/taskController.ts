/* para manejar las operaciones CRUD sobre las tareas */

import { Request, Response } from 'express';
import Task from '../models/taskModel';

// Obtener todas las tareas
export const getTasks = async (req: Request, res: Response) => {
  try {
    console.log("---- Dentro back getTasks ----");
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas', error });
  }
};

// Crear una nueva tarea
export const createTask = async (req: Request, res: Response) => {
  console.log("---- Dentro back createTask ----\n")
  console.log("Request: \n", req.body);
  const { id, title, description, status } = req.body;
  const task = new Task({ id, title, description, status });
  console.log("Task en back: ", task);
  try {
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea', error });
  }
};

// Obtener una tarea por ID
export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la tarea', error });
  }
};

// Actualizar una tarea
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea', error });
  }
};

// Eliminar una tarea
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (deletedTask) {
      res.json({ message: 'Tarea eliminada' });
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea', error });
  }
};
