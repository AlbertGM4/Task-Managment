// components/users/userList.tsx
import { useState } from "react";
import { UserListProps } from "~/models/user";
import { useFetcher } from "@remix-run/react";

const UserList: React.FC<UserListProps> = ({ users }) => {
    const [newUser, setNewUser] = useState({ name: '', surname: '', email: '' });
    const fetcher = useFetcher();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Users</h2>

            {/* Formulario para agregar usuario */}
            <fetcher.Form method="post">
                <input type="hidden" name="action" value="add" />
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    value={newUser.name}
                    onChange={handleInputChange}
                    required
                    className="border p-2 mb-2 rounded w-full"
                />
                <input
                    type="text"
                    name="surname"
                    placeholder="Apellido"
                    value={newUser.name}
                    onChange={handleInputChange}
                    required
                    className="border p-2 mb-2 rounded w-full"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                    className="border p-2 mb-2 rounded w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Agregar Usuario
                </button>
            </fetcher.Form>

            {/* Lista de usuarios */}
            {users?.length === 0 ? (
                <p>No hay usuarios disponibles.</p>
            ) : (
                <ul className="space-y-2">
                    {users?.map(user => (
                        <li key={user.id} className="border p-4 rounded shadow">
                            <h3 className="font-semibold">{user.name}</h3>
                            <p>{user.email}</p>

                            {/* Botón para eliminar usuario */}
                            <fetcher.Form method="post">
                                <input type="hidden" name="action" value="delete" />
                                <input type="hidden" name="id" value={user.id} />
                                <button
                                    type="submit"
                                    className="bg-red-500 text-white p-2 rounded mt-2"
                                >
                                    Borrar Usuario
                                </button>
                            </fetcher.Form>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserList;
