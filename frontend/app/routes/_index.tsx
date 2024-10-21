// routes/index.tsx
import { v4 as uuidv4 } from 'uuid';
import { getUsers } from '~/services/userService';
import { useLoaderData, useFetcher } from '@remix-run/react';
import KanbanBoard from '~/components/kanbanBoard/kanbanBoard';
import { Task, TaskPriority, TaskStatus } from '~/models/task';
import { ActionFunction, json, redirect } from '@remix-run/node';
import { createTask, deleteTask, getTasks, updateTask } from '~/services/taskService';


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
      const taskAddData = formData.get('task');

      if (taskAddData) {
        const newTask: Task = JSON.parse(taskAddData as string);
        newTask.id = uuidv4()
        await createTask(newTask);
        return redirect('/');
      } else {
        return json({ error: 'No task data to add provided' }, { status: 400 });
      }

    case 'update':
      console.log("---- Dentro de action update ----");
      const taskEditData = formData.get('task');

      if (taskEditData) {
          const updatedTask: Task = JSON.parse(taskEditData as string);
          await updateTask(updatedTask);

          return redirect('/');
      } else {
          return json({ error: 'No task data to update provided' }, { status: 400 });
      }

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