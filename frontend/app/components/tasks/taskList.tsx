import { TaskListProps, Task, TaskPriority, TaskStatus } from "~/models/task";
import { useState, useEffect, useRef } from "react";

const TaskList: React.FC<TaskListProps> = ({ tasks, users, fetcher }) => {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isEditingTaskId, setIsEditingTaskId] = useState<string | null>(null);
    const [subtaskForms, setSubtaskForms] = useState<{ [key: string]: boolean }>({});
    const [newSubtaskId, setNewSubtaskId] = useState<string>('');

    const addTaskFormRef = useRef<Map<boolean, HTMLFormElement | null>>(new Map());
    const addTaskItemRefs = useRef<Map<boolean, HTMLDivElement | null>>(new Map());
    const editTaskFormRefs = useRef<Map<string, HTMLFormElement | null>>(new Map());
    const editTaskItemRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());

    const [newTask, setNewTask] = useState<Task>({
        id: '',
        title: '',
        description: '',
        status: TaskStatus.TODO,
        user: null,
        subtasks: undefined,
        priority: TaskPriority.LOW
    });
    const [newSubtask, setNewSubtask] = useState<{ id: string; title: string } | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isAddingTask) {
                const currentAddTaskItem = addTaskItemRefs.current.get(isAddingTask);
                const currentAddForm = addTaskFormRef.current?.get(isAddingTask);

                if (
                    currentAddTaskItem &&
                    !currentAddTaskItem.contains(event.target as Node) &&
                    currentAddForm && !currentAddForm.contains(event.target as Node)
                ) {
                    setIsAddingTask(false);
                    resetNewTask();
                }
            }

            if (isEditingTaskId) {
                const currentEditTaskItem = editTaskItemRefs.current.get(isEditingTaskId);
                const currentEditForm = editTaskFormRefs.current.get(isEditingTaskId);

                if (
                    currentEditTaskItem &&
                    !currentEditTaskItem.contains(event.target as Node) &&
                    currentEditForm && !currentEditForm.contains(event.target as Node)
                ) {
                    setIsEditingTaskId(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAddingTask, isEditingTaskId]);

    // Tasks
    const handleToggleEditTask = (taskId: string) => {
        if (isEditingTaskId === taskId) {
            setIsEditingTaskId(null);
        } else {
            setIsEditingTaskId(taskId);
        }
    };

    const handleToggleAddTask = () => {
        if (isAddingTask === false) {
            setIsAddingTask(true);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({ ...prev, [name]: value === '' ? null : value }));
    };

    const resetNewTask = () => {
        setNewTask({
            id: '',
            title: '',
            description: '',
            status: TaskStatus.TODO,
            user: null,
            subtasks: undefined,
            priority: TaskPriority.LOW
        });
    };

    const handleSubmitAddTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetcher.submit(new FormData(e.currentTarget), { method: 'post' });
        resetNewTask();
        setIsAddingTask(false);
    };

    const handleSubmitEditTask = (e: React.FormEvent<HTMLFormElement>, taskId: string) => {
        e.preventDefault();
        fetcher.submit(new FormData(e.currentTarget), { method: 'post' });
        setIsEditingTaskId(null);
    };

    // Subtask
    const handleToggleAddSubtask = (taskId: string) => {
        setSubtaskForms((prev) => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const handleSubtaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewSubtaskId(e.target.value);
    };

    const handleSubmitAddSubtask = (e: React.FormEvent<HTMLFormElement>, taskId: string) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        fetcher.submit(new FormData(e.currentTarget), { method: 'post' });

        setNewSubtaskId('');
        setSubtaskForms((prev) => ({ ...prev, [taskId]: false }));
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Tareas</h2>

            {/* Botón para añadir una nueva tarea */}
            <div className="flex justify-center mb-4">
                <button
                    onClick={handleToggleAddTask}
                    className="flex-initial px-2 py-2 mb-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
                >
                    Agregar Tarea
                </button>
            </div>

            {/* Formulario para agregar una nueva tarea */}
            <div ref={(el) => addTaskItemRefs.current.set(true, el)}>
                {isAddingTask ? (
                    <form ref={(el) => addTaskFormRef.current?.set(true, el)} method="post"
                        onSubmit={handleSubmitAddTask}
                    >
                        <input type="hidden" name="action" value="add" />
                        <input
                            type="text"
                            name="title"
                            placeholder="Título de la tarea"
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
                        <div className="flex justify-between">
                            <select
                                name="status"
                                defaultValue={newTask.status}
                                className="border rounded p-2 mr-2"
                            >
                                {Object.values(TaskStatus).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="priority"
                                defaultValue={newTask.priority}
                                className="border rounded p-2"
                            >
                                {Object.values(TaskPriority).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="user"
                                value={newTask.user ?? ""}
                                onChange={handleInputChange}
                                className="border rounded p-2"
                            >
                                <option key="none" value="none">
                                    <p>Sin usuario</p>
                                </option>
                                {users?.map((user) => (
                                    <option key={user.id} value={user.name}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-center mt-2">
                            <button
                                type="submit"
                                className="flex-initial px-2 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-200"
                            >
                                Confirmar
                            </button>
                        </div>
                    </form>
                ) : null}
            </div>

            {/* Lista de tareas */}
            {tasks?.length === 0 ? (
                <p>No hay tareas disponibles.</p>
            ) : (
                <ul className="space-y-2">
                    {tasks?.map((task) => (
                        <li
                            key={task.id}
                            className="border p-4 rounded shadow"
                            ref={(el) => editTaskItemRefs.current.set(task.id, el)}
                        >
                            <div onClick={() => handleToggleEditTask(task.id)}>
                                <h3 className="font-semibold">{task.title}</h3>
                                <p>{task.description}</p>
                                <p>{task.status}</p>
                                <p>{task.priority}</p>

                                {/* Subtareas */}
                                <div className="mt-4">
                                    <h4 className="font-semibold">Subtareas</h4>
                                    {task.subtasks && task.subtasks.length > 0 ? (
                                        <ul>
                                            {task.subtasks.map((subtaskId) => {
                                                const subtask = tasks.find((t) => t.id === subtaskId);
                                                return (
                                                    <li key={subtaskId}>
                                                        {subtask ? subtask.title : 'Subtarea no encontrada'}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p>No hay subtareas.</p>
                                    )}

                                    <button
                                        onClick={() => handleToggleAddSubtask(task.id)}
                                        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Añadir Subtarea
                                    </button>

                                    {subtaskForms[task.id] && (
                                        <form onSubmit={(e) => handleSubmitAddSubtask(e, task.id)}>
                                            <input type="hidden" name="action" value="addSubtask" />
                                            <input type="hidden" name="taskId" value={task.id} />
                                            <select
                                                name="subtaskId"
                                                value={newSubtaskId}
                                                onChange={handleSubtaskChange}
                                                className="border rounded p-2"
                                                required
                                            >
                                                <option value="" disabled>
                                                    Seleccionar subtarea
                                                </option>
                                                {tasks.map((subtask) => (
                                                    <option key={subtask.id} value={subtask.id}>
                                                        {subtask.title}
                                                    </option>
                                                ))}
                                            </select>
                                            <button type="submit" className="ml-2 bg-blue-500 text-white rounded px-2 py-1">
                                                Agregar
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Mostrar el formulario de edición solo si es la tarea seleccionada */}
                            {isEditingTaskId === task.id && (
                                <form
                                    ref={(el) => editTaskFormRefs.current.set(task.id, el)} // Asignamos referencia al formulario de edición
                                    method="post"
                                    onSubmit={(e) => handleSubmitEditTask(e, task.id)}
                                >
                                    <input type="hidden" name="action" value="update" />
                                    <input type="hidden" name="id" value={task.id} />
                                    <input
                                        type="text"
                                        name="title"
                                        defaultValue={task.title}
                                        className="w-full p-2 mb-2 border rounded"
                                    />
                                    <textarea
                                        name="description"
                                        defaultValue={task.description}
                                        className="w-full p-2 mb-2 border rounded"
                                    />
                                    <div className="flex justify-between mb-2">
                                        <select
                                            name="status"
                                            defaultValue={task.status}
                                            className="border rounded p-2 mr-2"
                                        >
                                            {Object.values(TaskStatus).map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            name="priority"
                                            value={newTask.priority}
                                            onChange={handleInputChange}
                                            className="border rounded p-2 mr-2"
                                        >
                                            {Object.values(TaskPriority).map((priority) => (
                                                <option key={priority} value={priority}>
                                                    {priority}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            name="user"
                                            value={newTask.user ?? ""}
                                            onChange={handleInputChange}
                                            className="border rounded p-2"
                                        >
                                            <option key="none" value="none">
                                                <p>Sin usuario</p>
                                            </option>
                                            {users?.map((user) => (
                                                <option key={user.id} value={user.name}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-center mt-2">
                                        <button
                                            type="submit"
                                            className="flex-initial px-2 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-200"
                                        >
                                            Actualizar Tarea
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="flex justify-between mt-2">
                                {/* Botón para eliminar tarea visible solo si no está en modo de edición */}
                                {isEditingTaskId !== task.id && (
                                    <form method="post">
                                        <input type="hidden" name="action" value="delete" />
                                        <input type="hidden" name="id" value={task.id} />
                                        <button
                                            type="submit"
                                            className="flex-initial px-2 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
                                        >
                                            Eliminar Tarea
                                        </button>
                                    </form>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskList;
