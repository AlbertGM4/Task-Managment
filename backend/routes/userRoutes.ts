/* Crear la ruta para las tareas */

import { Router } from 'express';
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController';


const router = Router();

// Rutas para las tareas
router.get('/', getUsers);                // Obtener todos los usuarios
router.post('/', createUser);             // Crear una nueva tarea
router.put('/:id', updateUser);           // Actualizar una tarea
router.delete('/:id', deleteUser);        // Eliminar una tarea

export default router;