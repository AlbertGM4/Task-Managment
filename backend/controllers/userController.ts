/* Op. CRUD sobre los usuarios */

import { Request, Response } from 'express';
import { User } from '../models/user';


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

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
  console.log("---- Dentro back createUser ----\n");
  const { id, name, surname, email } = req.body;

  const user = new User({
    _id: id,
    name,
    surname,
    email
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    if (error instanceof Error && error.message.includes('duplicate key')) {
      res.status(400).json({ message: 'El email ya está en uso' });
    } else {
      res.status(500).json({ message: 'Error al crear el usuario', error });
    }
  }
};

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response) => {
  console.log("---- Dentro back updateUser ----\n");
  const { id, ...userData } = req.body;
  const _id = id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      userData,
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
  console.log("---- Dentro back deleteUser ----\n");
  const { id } = req.params;
  const _id = id;

  try {
    const deletedUser = await User.findByIdAndDelete(_id);
    if (deletedUser) {
      res.json({ message: 'Usuario eliminado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error });
  }
};
