import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import UserProfile from "~/components/users/profile";
import { getUsers } from "~/services/userService";


// Loader que se ejecuta en el servidor para obtener las tareas
export const loader = async () => {
    const users = await getUsers();
    return json({ users });
  };

const TasksPage: React.FC = () => {
    const { users } = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Tu Perfil</h1>
            <UserProfile users={users}/>
        </div>
    );
};