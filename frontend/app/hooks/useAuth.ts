import { getUsers } from "~/services/userService";


// Hook para obtener las tareas
const useUsers = () => {

    const fetchTasks = async () => {
      try {
        const users = await getUsers();
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    };

    return { fetchTasks };
  };