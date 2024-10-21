/* Crear la ruta para las tareas */

import { Router } from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../controllers/taskController';

const router = Router();

// Rutas para las tareas
router.get('/tasks', getTasks);           // Obtener todas las tareas
router.post('/', createTask);             // Crear una nueva tarea
router.put('/:id', updateTask);           // Actualizar una tarea
router.delete('/:id', deleteTask);        // Eliminar una tarea

export default router;