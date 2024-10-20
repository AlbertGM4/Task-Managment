import { Task, TaskPriority } from '~/models/task';
import { Draggable } from 'react-beautiful-dnd';
import { KanbanTaskProps } from '~/models/kanban';
import React, { useEffect, useRef, useState } from 'react';


const KanbanTask: React.FC<KanbanTaskProps> = ({ task, subtasks, users, index, handleUpdateTask, handleDeleteTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [selectedSubtask, setSelectedSubtask] = useState<string>('');
    const [newSubtasks, setNewSubtasks] = useState<string[]>([]);
    const taskRef = useRef<HTMLDivElement | null>(null); // Referencia para el div de la tarea


    // Maneja el clic fuera del área de la tarea
    useEffect(() => {
        console.log("subtasks: ", subtasks)
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
        return user ? `${user.name} ${user.surname}` : "Sin asignar";
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleUpdateTask(editedTask);
        setIsEditing(false);
    };

    const handleAddSubtask = () => {
        if (!selectedSubtask) return;

        // Obtener las subtareas actuales de la tarea principal
        const actualSubTasks = subtasks[task.id]?.subtasks.map(subtask => subtask.id) || [];

        // Añadir la nueva subtarea seleccionada a las subtareas actuales
        const updatedSubtasks = [...actualSubTasks, selectedSubtask];

        console.log("Subtareas actualizadas: ", updatedSubtasks);

        // Aquí deberías incluir la lógica para guardar las subtareas en el estado o en el servidor
        setNewSubtasks(updatedSubtasks)

        setSelectedSubtask('');
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
                            <select
                                value={selectedSubtask}
                                onChange={(e) => setSelectedSubtask(e.target.value)}
                                className="w-full p-2 mb-2 border rounded"
                            >
                                <option value="" disabled>Seleccionar Subtarea</option>
                                {/* Muestra las claves de las tareas, excluyendo la tarea actual */}
                                {Object.keys(subtasks).filter(taskTitle => subtasks[taskTitle].id !== task.id).map(taskTitle => (
                                        <option key={subtasks[taskTitle].id} value={taskTitle}>
                                            {taskTitle} {/* Muestra título de la tarea principal y subtarea */}
                                        </option>
                                    )
                                )}
                            </select>
                            <button
                                className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200"
                                onClick={handleAddSubtask}
                            >
                                Añadir Subtarea
                            </button>
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
                                Descripcion: {task.description}
                            </p>
                            <p>Prioridad: {task.priority}</p>
                            {Object.keys(subtasks).filter(taskTitle => subtasks[taskTitle].id !== task.id).map(taskTitle => (
                                subtasks[taskTitle].subtasks.map(subtask => (
                                    <option key={subtask.id} value={subtask.id}>
                                        {taskTitle} - {subtask.title} {/* Muestra título de la tarea principal y subtarea */}
                                    </option>
                                ))
                            ))}
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
