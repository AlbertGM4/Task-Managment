// components/kanbanBoard/kanbanColumn.tsx
import { useState } from 'react';
import { Task } from '~/models/task';
import { Droppable } from 'react-beautiful-dnd';
import { KanbanColumnProps } from '~/models/kanban';
import KanbanTask from './kanbanTask';


const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, handleAddTask, handleUpdateTask, handleDeleteTask }) => {
    const [isAddingTask, setIsAddingTask] = useState(false);
    // Cambiado para ser de tipo Task
    const [newTask, setNewTask] = useState<Task>({
        id: 0, // Un ID inicial temporal, se generará un ID único al crear la tarea
        title: '',
        description: '',
        status: column.id,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleAddTask(newTask); // Llama a la función para agregar la tarea con los detalles del formulario
        setNewTask({ id: 0, title: '', description: '', status: column.id }); // Reiniciar el formulario
        setIsAddingTask(false); // Ocultar el formulario
    };

    return (
        <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="w-64 p-4 bg-gray-100 rounded-lg shadow-md"
                >
                    <h2 className="font-bold text-lg mb-4">{column.title}</h2>
                    {column.tasks.map((task: Task, index: number) => (
                        <KanbanTask
                            key={task.id}
                            task={task}
                            index={index}
                            handleUpdateTask={handleUpdateTask}
                            handleDeleteTask={handleDeleteTask}
                        />
                    ))}
                    <button
                        onClick={() => setIsAddingTask(true)}
                        className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Agregar Tarea
                    </button>
                    {/* Formulario para agregar nueva tarea */}
                    {isAddingTask && (
                        <form onSubmit={handleSubmit} className="mt-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Título"
                                value={newTask.title}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 mb-2 border rounded"
                            />
                            <textarea
                                name="description"
                                placeholder="Descripción"
                                value={newTask.description}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 mb-2 border rounded"
                            />
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition duration-200"
                            >
                                Crear Tarea
                            </button>
                        </form>
                    )}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default KanbanColumn;
