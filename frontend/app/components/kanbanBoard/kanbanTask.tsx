import { Task } from '~/models/task';
import { Draggable } from 'react-beautiful-dnd';
import { KanbanTaskProps } from '~/models/kanban';
import React, { useEffect, useRef, useState } from 'react';


const KanbanTask: React.FC<KanbanTaskProps> = ({ task, index, handleUpdateTask, handleDeleteTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task>(task);
    const taskRef = useRef<HTMLDivElement | null>(null); // Referencia para el div de la tarea

    // Maneja el clic fuera del área de la tarea
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (taskRef.current && !taskRef.current.contains(event.target as Node)) {
                setIsEditing(false); // Cierra el modo de edición si se hace clic fuera
            }
        };

        // Agregar el event listener al montar el componente
        document.addEventListener('mousedown', handleClickOutside);

        // Limpiar el event listener al desmontar
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedTask((prev) => ({ ...prev, [name]: value }));
    };

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
                                value={editedTask.title}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 mb-2 border rounded"
                            />
                            <textarea
                                name="description"
                                value={editedTask.description}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 mb-2 border rounded"
                            />
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
                            <p>{task.description}</p>
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
