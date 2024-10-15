// app/routes/kanban.tsx
import type { MetaFunction } from "@remix-run/node";
import KanbanBoard from "../components/kanbanBoard/kanbanBoard";

export const meta: MetaFunction = () => {
    return [
        { title: "Kanban Board" },
        { name: "description", content: "View your tasks in a Kanban board." },
    ];
};

export default function KanbanPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-center my-8">Kanban Board</h1>
            <KanbanBoard />
        </div>
    );
}
