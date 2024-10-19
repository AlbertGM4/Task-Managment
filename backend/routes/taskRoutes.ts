/* Crear la ruta para las tareas */

import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getUsers,
} from '../controllers/taskController';

const router = Router();

// Rutas para las tareas
router.get('/tasks', getTasks);              // Obtener todas las tareas
router.get('/users', getUsers);         // Obtener todos los usuarios
router.post('/', createTask);           // Crear una nueva tarea
router.get('/:id', getTaskById);        // Obtener una tarea por ID
router.put('/:id', updateTask);         // Actualizar una tarea
router.delete('/:id', deleteTask);      // Eliminar una tarea

export default router;