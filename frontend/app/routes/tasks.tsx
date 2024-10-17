// app/routes/tasks.tsx
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import TaskList from '../components/tasks/taskList';
import { getTasks } from '~/services/taskService';

// Loader que se ejecuta en el servidor para obtener las tareas
export const loader = async () => {
    const tasks = await getTasks();
    return json({ tasks });
  };

const TasksPage: React.FC = () => {
    const { tasks } = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Lista de Tareas</h1>
            <TaskList tasks={tasks}/>
        </div>
    );
};

export default TasksPage;
