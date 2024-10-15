// hooks/useTask.ts
import { useContext } from 'react';
import { TaskContext } from '../contexts/taskContext';
import { Task } from '~/models/task';

// Hook para utilizar el contexto
const useTask = () => {
    const context = useContext(TaskContext);
    
    if (!context) {
        throw new Error('useTask debe ser usado dentro de un TaskProvider');
    }
    
    return context;
};

const useUpdateTask = () => {
    const { updateTask } = useTask(); // Usar el hook useTask para obtener el contexto

    // Cambia la firma de esta función para aceptar un objeto Task completo
    const updateTaskDetails = (updatedTask: Task) => {
        console.log("Actualizando tarea:", updatedTask);
        updateTask(updatedTask); // Llama a la función del contexto para actualizar la tarea
    };

    return { updateTaskDetails }; // Cambia el nombre a updateTaskDetails
};

const useAddTask = () => {
    const context = useContext(TaskContext); // Acceder al contexto
    if (!context) {
        throw new Error("useAddTask debe ser usado dentro de un TaskProvider");
    }

    const { addTask } = context; // Obtener la función addTask del contexto

    return { addTask }; // Devolverla para que pueda ser usada
};

const useDeleteTask = () => {
    const context = useContext(TaskContext); // Acceder al contexto
    if (!context) {
        throw new Error("useAddTask debe ser usado dentro de un TaskProvider");
    }

    const { deleteTask } = context; // Obtener la función addTask del contexto

    return { deleteTask }; // Devolverla para que pueda ser usada
};

export { useTask, useUpdateTask, useAddTask, useDeleteTask };
