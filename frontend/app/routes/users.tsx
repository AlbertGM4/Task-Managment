// routes/users.tsx
import { v4 as uuidv4 } from 'uuid';
import { ActionFunction, redirect, json } from '@remix-run/node';
import { useLoaderData } from "@remix-run/react";
import UserList from "~/components/users/userList";
import { createUser, deleteUser, getUsers, updateUser } from "~/services/userService";


export const loader = async () => {
    const users = await getUsers();
    return json({ users });
};

// Manejo de acciones (crear, actualizar, eliminar)
export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const actionType = formData.get('action');

    switch (actionType) {
        case 'add':
            const newUser = {
                id: uuidv4(),
                name: formData.get('name') as string,
                surname: formData.get('surname') as string,
                email: formData.get('email') as string,
            };
            await createUser(newUser);
            return redirect('/users');

        case 'update':
            const updatedUser = {
                id: formData.get('id') as string,
                name: formData.get('name') as string,
                surname: formData.get('surname') as string,
                email: formData.get('email') as string,
            };
            await updateUser(updatedUser);
            return redirect('/users');

        case 'delete':
            const userIdToDelete = formData.get('id') as string;
            await deleteUser(userIdToDelete);
            return redirect('/users');

        default:
            return json({ error: 'Invalid action' }, { status: 400 });
    }
};

const UsersPage: React.FC = () => {
    const { users } = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Lista de Usuarios</h1>
            <UserList users={users}/>
        </div>
    );
};

export default UsersPage;