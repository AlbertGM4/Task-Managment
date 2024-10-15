// src/components/TaskList.tsx
import React from 'react';
import { useTask } from '../../hooks/useTask'; // Asegúrate de que la ruta es correcta
import { TaskStatus } from '../../models/task';


const TaskList: React.FC = () => {
    const { tasks } = useTask(); // Obtener las tareas del contexto
    console.log("Tareas en TaskList:", tasks); // Log para depurar

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Tareas</h2>
            {tasks.length === 0 ? (
                <p>No hay tareas disponibles.</p>
            ) : (
                <ul className="space-y-2">
                    {tasks.map(task => (
                        <li key={task.id} className="border p-4 rounded shadow">
                            <h3 className="font-semibold">{task.title}</h3>
                            <p>{task.description}</p>
                            <span className={`badge ${task.status === TaskStatus.TODO ? 'bg-blue-500' : task.status === TaskStatus.IN_PROGRESS ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                {task.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskList;
