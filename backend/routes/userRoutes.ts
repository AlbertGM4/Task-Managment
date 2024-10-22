/* Crear la ruta para los usuarios */

import { Router } from 'express';
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController';


const router = Router();

// Rutas para los usuarios
router.get('/getUsers', getUsers);                  // Obtener todos los usuarios
router.post('/createUser', createUser);             // Crear un nuevo usuario
router.put('/updateUser/:id', updateUser);          // Actualizar un usuario
router.delete('/deleteUser/:id', deleteUser);       // Eliminar un usuario

export default router;