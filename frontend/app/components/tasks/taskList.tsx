import { TaskListProps, Task, TaskPriority, TaskStatus } from "~/models/task";
import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";

const TaskList: React.FC<TaskListProps> = ({ tasks, users, fetcher }: TaskListProps) => {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isEditingTaskId, setIsEditingTaskId] = useState<string | null>(null);
    const [selectedSubtasks, setSelectedSubtasks] = useState<string[]>([]);

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
        subtasks: [],
        priority: TaskPriority.LOW
    });

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
    // Show/hide add task form
    const handleToggleAddTask = () => {
        if (isAddingTask === false) {
            setIsAddingTask(true);
        }
    };

    // Register new task changes
    const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log("Name / value: ", name, value)
        // Si el select es múltiple
        if (name === 'subtasks[]') {
            const selectElement = e.target as HTMLSelectElement;
            const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
            setNewTask(prevTask => ({
                ...prevTask,
                subtasks: selectedOptions,
            }));
        } else {
            // Maneja otros campos
            setNewTask(prevTask => ({
                ...prevTask,
                [name]: value === '' ? null : value
            }));
        }
    };

    const handleUser = (userId: string | null) => {
        const user = users.find(user => user.id === userId);
        return user ? `${user.name}` : "Sin asignar";
    }

    // Clean new task
    const resetNewTask = () => {
        setNewTask({
            id: '',
            title: '',
            description: '',
            status: TaskStatus.TODO,
            user: null,
            subtasks: [],
            priority: TaskPriority.LOW
        });
    };

    // Submit new task
    const handleSubmitAddTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const addForm = addTaskFormRef.current?.get(true);
        if (addForm) {
            const formData = new FormData(addForm);

            selectedSubtasks.forEach(subtaskId => {
                formData.append('subtasks[]', subtaskId);
            });

            fetcher.submit(formData, { method: 'post' });
            resetNewTask();
            setIsAddingTask(false);
        }
    };

    // Show/hide edit task form
    const handleToggleEditTask = (taskId: string) => {
        if (isEditingTaskId === taskId) {
            setIsEditingTaskId(null);
        } else {
            setIsEditingTaskId(taskId);
            setSelectedSubtasks(tasks.find((task) => task.id === taskId)?.subtasks ?? [])
        }
    };

    // Submit update task
    const handleSubmitEditTask = (taskId: string, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const editForm = editTaskFormRefs.current?.get(taskId);
        if (editForm) {
            const formData = new FormData(editForm);

            selectedSubtasks.forEach(subtaskId => {
                formData.append('subtasks[]', subtaskId);
            });

            fetcher.submit(formData, { method: 'post' });
            setIsEditingTaskId(null);
        }
    };

    // Subtask
    const handleSubtaskClick = (subtaskId: string) => {
        setSelectedSubtasks(prev =>
            prev.includes(subtaskId)
                ? prev.filter(id => id !== subtaskId)
                : [...prev, subtaskId]
        );
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
                            type="text" id="addTaskTitle" name="title" placeholder="Título de la tarea"
                            value={newTask.title} onChange={handleNewTaskChange}
                            className="w-full p-2 mb-2 border rounded" required
                        />
                        <textarea
                            id="addTaskDescription" name="description" placeholder="Descripción"
                            value={newTask.description} onChange={handleNewTaskChange}
                            className="w-full p-2 mb-2 border rounded" required
                        />
                        {/* Selección de subtareas en nueva tarea*/}
                        <div className="mb-2">
                            <h4>Selecciona Subtareas</h4>
                            <ul className="list-none p-0">
                                {tasks.map((subtask) => (
                                    <li
                                        key={subtask.id}
                                        onClick={() => handleSubtaskClick(subtask.id)}
                                        className={`cursor-pointer p-2 rounded ${
                                            selectedSubtasks.includes(subtask.id)
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200'
                                        }`}
                                    >
                                        {subtask.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Lista de subtareas seleccionadas */}
                        {selectedSubtasks && selectedSubtasks.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold">Subtareas añadidas</h4>
                                <ul>
                                    {selectedSubtasks.map((subtaskId) => {
                                        const subtask = tasks.find(t => t.id === subtaskId);
                                        return subtask ? (
                                            <li key={subtask.id} className="flex justify-between items-center mb-2">
                                                {subtask.title}
                                            </li>
                                        ) : null;
                                    })}
                                </ul>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <select
                                id="addTaskStatus" name="status"
                                defaultValue={newTask.status} onChange={handleNewTaskChange}
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
                                defaultValue={newTask.priority} onChange={handleNewTaskChange}
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
                                value={newTask.user ?? ""} onChange={handleNewTaskChange}
                                className="border rounded p-2"
                            >
                                <option key="" value=""><p>Sin usuario</p></option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
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
                    {tasks.map((task) => (
                        <li key={task.id} ref={(el) => editTaskItemRefs.current.set(task.id, el)}
                            className="border p-4 rounded shadow"
                        >
                            <div onClick={() => handleToggleEditTask(task.id)}>
                                <h2 className="font-semibold">{task.title}</h2>
                                <h4 className="font-semibold">Descripcion:</h4>
                                <Markdown>{task.description}</Markdown>
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
                                </div>
                                <p className="font-semibold">Status: </p><span>{task.status}</span>
                                <p className="font-semibold">Priority: </p><span>{task.priority}</span>
                                <p className="font-semibold">User: </p><span>{handleUser(task.user)}</span>
                            </div>

                            {/* Mostrar el formulario de edición solo si es la tarea seleccionada */}
                            {isEditingTaskId === task.id && (
                                <form
                                    ref={(el) => editTaskFormRefs.current.set(task.id, el)}
                                    method="post"
                                    onSubmit={(e) => handleSubmitEditTask(task.id, e)}
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
                                    <ul className="list-none p-0">
                                        {tasks
                                            .filter((subtask) => subtask.id !== task.id) // Excluye la tarea actual
                                            .map((subtask) => (
                                                <li
                                                    key={subtask.id}
                                                    onClick={() => handleSubtaskClick(subtask.id)}
                                                    className={`cursor-pointer p-2 rounded ${
                                                        selectedSubtasks.includes(subtask.id)
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-200'
                                                    }`}
                                                >
                                                    {subtask.title}
                                                </li>
                                            ))}
                                    </ul>
                                    {/* Lista de subtareas seleccionadas */}
                                    {selectedSubtasks && selectedSubtasks.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="font-semibold">Subtareas añadidas</h4>
                                            <ul>
                                                {selectedSubtasks.map((subtaskId) => {
                                                    const subtask = tasks.find(t => t.id === subtaskId);
                                                    return subtask ? (
                                                        <li key={subtask.id} className="flex justify-between items-center mb-2">
                                                            {subtask.title}
                                                        </li>
                                                    ) : null;
                                                })}
                                            </ul>
                                        </div>
                                    )}
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
                                            onChange={handleNewTaskChange}
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
                                            onChange={handleNewTaskChange}
                                            className="border rounded p-2"
                                        >
                                            <option value=""><p>Sin usuario</p></option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
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
