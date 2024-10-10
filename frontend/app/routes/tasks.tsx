import { Link } from "@remix-run/react";

export default function Tasks() {
    const tasks = [
        { id: 1, title: "Primera tarea" },
        { id: 2, title: "Segunda tarea" },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Tareas</h1>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <Link to={`/tasks/${task.id}`} className="text-blue-500">
                            {task.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
