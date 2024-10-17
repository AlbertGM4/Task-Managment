// routes/index.tsx
import { ActionFunction, json, redirect } from '@remix-run/node';
import { createTask, deleteTask, getTasks, updateTask } from '~/services/taskService';
import { useLoaderData, useFetcher } from '@remix-run/react';
import KanbanBoard from '~/components/kanbanBoard/kanbanBoard';
import { Task, TaskStatus } from '~/models/task';
import { v4 as uuidv4 } from 'uuid';


export const loader = async () => {
  const tasks = await getTasks();
  return json({ tasks });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get('action');

  switch (actionType) {
    case 'add':
      const newTask : Task = {
        id: uuidv4(),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as TaskStatus,
      };
      await createTask(newTask);
      return redirect('/');

    case 'update':
      const taskIdToUpdate = formData.get('id');
      const updatedTask: Task = {
        id: taskIdToUpdate as string,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as TaskStatus,
      };
      await updateTask(updatedTask);
      return redirect('/');

    case 'delete':
      const taskIdToDelete = parseInt(formData.get('id') as string, 10);
      await deleteTask(taskIdToDelete);
      return redirect('/');

    default:
      return json({ error: 'Invalid action' }, { status: 400 });
  }
};

const IndexPage = () => {
  const { tasks } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof useFetcher>();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Kanban Board</h1>
      <KanbanBoard tasks={tasks} fetcher={fetcher}/>
    </div>
  );
};

export default IndexPage;
