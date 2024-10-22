import { Task, TaskPriority } from '~/models/task';
import { Draggable } from 'react-beautiful-dnd';
import { KanbanTaskProps } from '~/models/kanban';
import React, { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';


const KanbanTask: React.FC<KanbanTaskProps> = ({ task, subtasks, users, index, handleUpdateTask, handleDeleteTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [selectedSubtasks, setSelectedSubtasks] = useState<string[]>([]);
    const taskRef = useRef<HTMLDivElement | null>(null);


    // Maneja el clic fuera del área de la tarea
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (taskRef.current && !taskRef.current.contains(event.target as Node)) {
                setIsEditing(false);
                setEditedTask(task);
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
        setEditedTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleUser = (userId: string | null) => {
        const user = users.find(user => user.id === userId);
        return user ? `${user.name}` : "Sin asignar";
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        selectedSubtasks.forEach(subtaskId => {
            editedTask.subtasks.push(subtaskId);
        });
        handleUpdateTask(editedTask);
        setIsEditing(false);
    };

    // Subtask
    const handleSubtaskClick = (subtaskId: string) => {
        setSelectedSubtasks(prev =>
            prev.includes(subtaskId)
                ? prev.filter(id => id !== subtaskId)
                : [...prev, subtaskId]
        );
    };

    const getSelectedSubtask = (taskId: string) => {
        for (const taskTitle in subtasks) {
            const task = subtasks[taskTitle];
            if (task.id === taskId) {
                return taskTitle
            }
        }
    };

    return (
        <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    ref={(element) => {
                        provided.innerRef(element);
                        taskRef.current = element;
                    }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-4 p-4 border rounded shadow bg-white dark:bg-gray-900 cursor-pointer"
                    onClick={() => setIsEditing(true)}
                >
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Titulo"
                                value={editedTask.title}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 mb-2 border rounded"
                            />
                            <textarea
                                name="description"
                                placeholder="Descripcion"
                                value={editedTask.description}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 mb-2 border rounded"
                                style={{ whiteSpace: 'normal' }}
                            />
                            {/* Selección de subtareas en nueva tarea*/}
                            <div className="mb-2">
                                <h4>Selecciona Subtareas</h4>
                                <ul className="list-none p-0">
                                {Object.keys(subtasks)
                                    .filter((taskTitle) => subtasks[taskTitle].id !== task.id)
                                    .map((taskTitle) => {
                                        const task = subtasks[taskTitle];

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
                            {/* Lista de subtareas seleccionadas */}
                            {selectedSubtasks && selectedSubtasks.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-semibold">Subtareas añadidas</h4>
                                    <ul>
                                        {selectedSubtasks.map((subtaskId) => {
                                            const subtaskTitle = getSelectedSubtask(subtaskId)
                                            return (
                                                <li key={subtaskId} className="cursor-pointer p-2 rounded">
                                                    {subtaskTitle}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}
                            <select
                                name="user"
                                value={editedTask.user || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border rounded"
                            >
                                <option value="">Seleccionar Usuario</option>
                                {users.map((user) => {
                                    return <option key={user.id} value={user.id}>{user.name}</option>;
                                    })}
                            </select>
                            <select
                                name="priority"
                                value={editedTask.priority || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border rounded"
                            >
                                <option value="" disabled>Seleccionar Prioridad</option>
                                {Object.values(TaskPriority).map((priority) => (
                                    <option key={priority} value={priority}>{priority}</option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition duration-200"
                            >
                                Actualizar Tarea
                            </button>
                        </form>
                    ) : (
                        <>
                            <h3 className="font-bold">{task.title}</h3>
                            <p
                                className="break-words overflow-hidden text-ellipsis"
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                  }}
                            >
                                Descripcion: <Markdown>{task.description}</Markdown>
                            </p>
                            <div className="mt-4">
                                <h4 className="font-semibold">Subtareas:</h4>
                                {task.subtasks && task.subtasks.length > 0 ? (
                                    <ul>
                                        {Object.keys(subtasks)
                                            .filter(taskTitle => task.subtasks.includes(subtasks[taskTitle].id))
                                            .map(taskTitle => (
                                                <li key={subtasks[taskTitle].id}>
                                                    {taskTitle}
                                                </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No hay subtareas.</p>
                                )}
                            </div>
                            <div className="mt-4">
                                <p>Prioridad: {task.priority}</p>
                                <p>Usuario: {handleUser(task.user)}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="mt-2 bg-red-500 text-white p-2 rounded"
                            >
                                Borrar
                            </button>
                        </>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default KanbanTask;
