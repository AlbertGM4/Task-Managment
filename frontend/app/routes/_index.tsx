// routes/index.tsx
import KanbanBoard from '~/components/kanbanBoard/kanbanBoard';


const IndexPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Kanban Board</h1>
      <KanbanBoard />
    </div>
  );
};

export default IndexPage;
