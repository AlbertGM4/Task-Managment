import { Task } from '~/models/task';
import { Draggable } from 'react-beautiful-dnd';
import { KanbanTaskProps } from '~/models/kanban';
import React, { useEffect, useRef, useState } from 'react';


const KanbanTask: React.FC<KanbanTaskProps> = ({ task, users, index, handleUpdateTask, handleDeleteTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task>(task);
    const taskRef = useRef<HTMLDivElement | null>(null); // Referencia para el div de la tarea


    // Maneja el clic fuera del área de la tarea
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (taskRef.current && !taskRef.current.contains(event.target as Node)) {
                setIsEditing(false);
                setEditedTask({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    user: task.user,
                    subtasks: task.subtasks,
                    priority: task.priority
                });
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
        return user ? `${user.name} ${user.surname}` : "Sin asignar";
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleUpdateTask(editedTask);
        setIsEditing(false);
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
                                style={{ whiteSpace: 'normal' }} // Asegura que el texto se expanda hacia abajo
                            />
                            <select
                                name="user"
                                value={editedTask.user || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border rounded"
                            >
                                <option value="" disabled>Seleccionar Usuario</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
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
                                    WebkitLineClamp: 3, // Cambia este valor para ajustar el número de líneas visibles
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                  }}
                            >
                                {task.description}
                            </p>
                            <p>Usuario: {handleUser(task.user)}</p>
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
