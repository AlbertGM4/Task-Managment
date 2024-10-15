// src/routes/tasks.tsx
import React from 'react';
import TaskList from '../components/tasks/taskList';


const TasksPage: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Lista de Tareas</h1>
            <TaskList />
        </div>
    );
};

export default TasksPage;
