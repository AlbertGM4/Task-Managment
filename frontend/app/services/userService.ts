// frontend/app/services/userService.ts
import "dotenv/config"
import { User } from '../models/user';

const apiUrl = process.env.API_URL as string;

if (!apiUrl) {
    throw new Error('API_URL is not defined. Make sure it is available in your environment.');
}

// Obtener todos los usuarios desde el servidor
export async function getUsers(): Promise<User[]> {
    console.log("---- Obteniendo usuarios ----");
    try {
        const response = await fetch(`${apiUrl}/getUsers`);
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        const usersFromBackend = await response.json();
        const users: User[] = usersFromBackend.map((user: any) => ({
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
        }));

        return users;
    } catch (error) {
        console.error("Error en getUsers:", error);
        throw error;
    }
}

// Crear un nuevo usuario en el servidor
export async function createUser(newUser: User): Promise<User> {
    console.log("---- Creando Usuario ----");
    try {
        const response = await fetch(`${apiUrl}/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            throw new Error(`Error al crear el usuario: ${response.statusText}`);
        }

        const createdUser: User = await response.json();
        return createdUser;
    } catch (error) {
        console.error("Error en createUser:", error);
        throw error;
    }
}

// Actualizar un usuario en el servidor
export async function updateUser(userToUpdate: User): Promise<User> {
    console.log("---- Actualizando Usuario ----");
    try {
        const userId = userToUpdate.id;
        const response = await fetch(`${apiUrl}/updateUser/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userToUpdate),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el usuario: ${response.statusText}`);
        }

        const updatedUser: User = await response.json();
        return updatedUser;
    } catch (error) {
        console.error("Error en updateUser:", error);
        throw error;
    }
}

// Eliminar un usuario en el servidor
export async function deleteUser(userId: string): Promise<void> {
    console.log("---- Eliminando Usuario ----");
    try {
        const response = await fetch(`${apiUrl}/deleteUser/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el usuario: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error en deleteUser:", error);
        throw error;
    }
}
