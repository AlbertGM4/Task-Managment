// routes/index.tsx
import { ActionFunction, json, redirect } from '@remix-run/node';
import { createTask, deleteTask, getTasks, getUsers, updateTask } from '~/services/taskService';
import { useLoaderData, useFetcher } from '@remix-run/react';
import KanbanBoard from '~/components/kanbanBoard/kanbanBoard';
import { Task, TaskPriority, TaskStatus } from '~/models/task';
import { v4 as uuidv4 } from 'uuid';


export const loader = async () => {
  const tasks = await getTasks();
  const users = await getUsers();
  return json({ tasks, users });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get('action');

  switch (actionType) {
    case 'add':
      console.log("---- Dentro de action add ----");
      const newTask : Task = {
        id: uuidv4(),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as TaskStatus,
        user: null,
        subtasks: undefined,
        priority: TaskPriority.LOW
      };
      await createTask(newTask);
      return redirect('/');

    case 'update':
      console.log("---- Dentro de action update ----");
      const taskIdToUpdate = formData.get('id');
      const updatedTask: Task = {
        id: taskIdToUpdate as string,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as TaskStatus,
        user: null,
        subtasks: undefined,
        priority: TaskPriority.LOW
      };
      await updateTask(updatedTask);
      return redirect('/');

    case 'delete':
      console.log("---- Dentro de action delete ----");
      const taskIdToDelete = formData.get('id') as string;
      await deleteTask(taskIdToDelete);
      return redirect('/');

    default:
      return json({ error: 'Invalid action' }, { status: 400 });
  }
};

const IndexPage = () => {
  const { tasks, users } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 id="kanbanTitle" className="text-3xl font-bold text-center mb-6">Kanban Board</h1>
        <KanbanBoard tasks={tasks} users={users} fetcher={fetcher} />
    </div>
  );
};

export default IndexPage;