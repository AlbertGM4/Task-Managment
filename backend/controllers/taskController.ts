/* para manejar las operaciones CRUD sobre las tareas */

import { Request, Response } from 'express';
import Task from '../models/taskModel';
import { User } from '../models/user';

// Obtener todas las tareas
export const getTasks = async (req: Request, res: Response) => {
  console.log("---- Dentro back getTasks ----\n")
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas', error });
  }
};

// Obtener todas los usuarios
export const getUsers = async (req: Request, res: Response) => {
  console.log("---- Dentro back getUsers ----\n")
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

// Crear una nueva tarea
export const createTask = async (req: Request, res: Response) => {
  console.log("---- Dentro back createTask ----\n")
  const {
    id, title, description,
    subtasks, status, priority, user
  } = req.body;
  console.log("Sub: ", subtasks)
  const task = new Task(
                { _id: id,
                  title, description, subtasks,
                  status, priority, user
                }
              );
  try {
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea', error });
  }
};

// Obtener una tarea por ID
export const getTaskById = async (req: Request, res: Response) => {
  console.log("---- Dentro back getTaskById ----\n")
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
  console.log("---- Dentro back updateTask ----\n")
  const { id, ...taskData } = req.body;
  const _id = id;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      taskData,
      { new: true }
    );
    console.log("UPDATED: ", updateTask)

    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  } catch (error) {
    console.log("Ha dado error")
    res.status(500).json({ message: 'Error al actualizar la tarea', error });
  }
};

// Eliminar una tarea
export const deleteTask = async (req: Request, res: Response) => {
  console.log("---- Dentro back deleteTask ----\n")
  const { id } = req.params;
  const _id = id

  try {
    const deletedTask = await Task.findByIdAndDelete(_id);
    if (deletedTask) {
      res.json({ message: 'Tarea eliminada' });
    } else {
      res.status(404).json({ message: 'Tarea no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea', error });
  }
};
