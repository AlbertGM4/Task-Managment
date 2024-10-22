// routes/tasks.tsx
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getUsers } from '~/services/userService';
import TaskList from '~/components/tasks/taskList';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { Task, TaskStatus, TaskPriority } from '~/models/task';
import { json, redirect, ActionFunction } from '@remix-run/node';
import { getTasks, createTask, updateTask, deleteTask, useAddSubtask } from '~/services/taskService';


export const loader = async () => {
    const tasks = await getTasks();
    const users = await getUsers();
    return json({ tasks, users });
};

// Action para manejar la creación, actualización y eliminación de tareas
export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const actionType = formData.get('action');

    switch (actionType) {
        case 'add':
            const newTask: Task = {
                id: uuidv4(),
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                status: formData.get('status') as TaskStatus,
                user: formData.get('user') as string | null,
                subtasks: formData.getAll('subtasks[]') as string[],
                priority: formData.get('priority') as TaskPriority,
            };
            await createTask(newTask);
            return redirect('/tasks');

        case 'addSubtask':
            const taskId = formData.get('taskId') as string;
            const subtaskId = formData.get('subtaskId') as string;
            await useAddSubtask(taskId, subtaskId);

            return redirect('/tasks');

        case 'update':
            const updatedTask: Task = {
                id: formData.get('id') as string,
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                status: formData.get('status') as TaskStatus,
                user: formData.get('user') as string | null,
                subtasks: formData.getAll('subtasks[]') as string[],
                priority: formData.get('priority') as TaskPriority,
            };
            await updateTask(updatedTask);
            return redirect('/tasks');

        case 'delete':
            const taskIdToDelete = formData.get('id') as string;
            await deleteTask(taskIdToDelete);
            return redirect('/tasks');

        default:
            return json({ error: 'Invalid action' }, { status: 400 });
    }
};

const TasksPage: React.FC = () => {
    const { tasks, users } = useLoaderData<typeof loader>();
    const fetcher = useFetcher();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Lista de Tareas</h1>
            <TaskList tasks={tasks} users={users} fetcher={fetcher}/>
        </div>
    );
};

export default TasksPage;
