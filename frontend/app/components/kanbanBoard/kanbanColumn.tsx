// components/kanbanBoard/kanbanColumn.tsx
import { useEffect, useRef, useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '~/models/task';
import { Droppable } from 'react-beautiful-dnd';
import { KanbanColumnProps } from '~/models/kanban';
import KanbanTask from './kanbanTask';


const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, users, handleAddTask, handleUpdateTask, handleDeleteTask }) => {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [selectedSubtasks, setSelectedSubtasks] = useState<string[]>([]);
    const taskRef = useRef<HTMLDivElement | null>(null);
    const [newTask, setNewTask] = useState<Task>({
        id: '',
        title: '',
        description: '',
        status: column.id,
        user: null,
        subtasks: [],
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
                    subtasks: [],
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
        selectedSubtasks.forEach(subtaskId => {
            newTask.subtasks.push(subtaskId);
        });
        handleAddTask(newTask);
        setNewTask({
            id: '',
            title: '',
            description: '',
            status: column.id,
            user: null,
            subtasks: [],
            priority: TaskPriority.LOW });
        setIsAddingTask(false);
    };

    const handleSubtaskClick = (subtaskId: string) => {
        setSelectedSubtasks(prev =>
            prev.includes(subtaskId)
                ? prev.filter(id => id !== subtaskId)
                : [...prev, subtaskId]
        );
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
                            {/* Selección de subtareas en nueva tarea*/}
                            <div className="mb-2">
                                <h4>Selecciona Subtareas</h4>
                                <ul className="list-none p-0">
                                    {Object.keys(column.subtasks).map((taskTitle) => {
                                        const task = column.subtasks[taskTitle];
                                        return (
                                            <li
                                                key={task.id}
                                                onClick={() => handleSubtaskClick(task.id)}
                                                className={`cursor-pointer p-2 rounded ${
                                                    selectedSubtasks.includes(task.id) ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                                }`}
                                            >
                                                {taskTitle}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div className="flex justify-between">
                                <select
                                    id="addTaskStatus" name="status"
                                    defaultValue={newTask.status} onChange={handleInputChange}
                                    className="border rounded p-2 mr-2"
                                >
                                    {Object.values(TaskStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    id="addTaskPriority" name="priority"
                                    defaultValue={newTask.priority} onChange={handleInputChange}
                                    className="border rounded p-2"
                                >
                                    {Object.values(TaskPriority).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    id="addTaskUser" name="user"
                                    value={newTask.user ?? ""} onChange={handleInputChange}
                                    className="border rounded p-2"
                                >
                                    <option key="none" value="none">
                                        <p>Sin usuario</p>
                                    </option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.name}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
