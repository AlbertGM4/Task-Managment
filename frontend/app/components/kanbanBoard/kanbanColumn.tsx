// components/kanbanBoard/kanbanColumn.tsx
import { useEffect, useRef, useState } from 'react';
import { Task, TaskPriority } from '~/models/task';
import { Droppable } from 'react-beautiful-dnd';
import { KanbanColumnProps } from '~/models/kanban';
import KanbanTask from './kanbanTask';


const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, users, handleAddTask, handleUpdateTask, handleDeleteTask }) => {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const taskRef = useRef<HTMLDivElement | null>(null);
    const [newTask, setNewTask] = useState<Task>({
        id: '',
        title: '',
        description: '',
        status: column.id,
        user: null,
        subtasks: undefined,
        priority: TaskPriority.LOW
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (taskRef.current && !taskRef.current.contains(event.target as Node)) {
                setIsAddingTask(false);
                setNewTask({
                    id: '',
                    title: '',
                    description: '',
                    status: column.id,
                    user: null,
                    subtasks: undefined,
                    priority: TaskPriority.LOW });
            }
        };

        // Agregar el event listener al montar el componente
        document.addEventListener('mousedown', handleClickOutside);

        // Limpiar el event listener al desmontar
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({ ...prev, [name]: value === '' ? null : value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleAddTask(newTask);
        setNewTask({
            id: '',
            title: '',
            description: '',
            status: column.id,
            user: null,
            subtasks: undefined,
            priority: TaskPriority.LOW });
        setIsAddingTask(false);
    };

    return (
        <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
                <div
                ref={(element) => {
                    provided.innerRef(element);
                    taskRef.current = element;
                }}
                    {...provided.droppableProps}
                    className="w-96 p-4 bg-gray-100 rounded-lg shadow-md"
                >
                    <h2 className="font-bold text-lg mb-4">{column.title}</h2>
                    {column.tasks.map((task: Task, index: number) => (
                        <KanbanTask
                            key={task.id}
                            task={task}
                            subtasks={column.subtasks}
                            users={users}
                            index={index}
                            handleUpdateTask={handleUpdateTask}
                            handleDeleteTask={handleDeleteTask}
                        />
                    ))}
                    <button
                        onClick={() => {
                            console.log("Cambiando estado a agregar tarea");
                            setIsAddingTask(true);
                        }}
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
                            <select
                                name="user"
                                value={newTask.user || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border rounded"
                            >
                                <option value="" disabled>Selecciona un usuario</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} {user.surname}
                                    </option>
                                ))}
                            </select>
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
