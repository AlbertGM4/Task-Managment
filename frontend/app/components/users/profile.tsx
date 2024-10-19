import { UserListProps } from "~/models/user";


const UserProfile: React.FC<UserListProps> = ({ users }) => {

    return (
        <div className="p-4">
            {users?.length === 0 ? (
                <p>No hay tareas disponibles.</p>
            ) : (
                <ul className="space-y-2">
                    {users?.map(user => (
                        <li key={user.id} className="border p-4 rounded shadow">
                            <h3 className="font-semibold">{user.name}</h3>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserProfile;