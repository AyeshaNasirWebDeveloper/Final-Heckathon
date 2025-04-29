import { createContext, useState, useEffect, useContext } from 'react';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  getTasksByStatus 
} from '../services/api';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch all tasks when authenticated
  useEffect(() => {
    const fetchTasks = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          setError(null);
          const data = await getTasks();
          setTasks(data);
          
          // Separate tasks by status
          setTodoTasks(data.filter(task => task.status === 'todo'));
          setInProgressTasks(data.filter(task => task.status === 'inProgress'));
          setDoneTasks(data.filter(task => task.status === 'done'));
        } catch (error) {
          setError(error.message || 'Failed to fetch tasks');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTasks();
  }, [isAuthenticated]);

  // Add a new task
  const addTask = async (taskData) => {
    try {
      setError(null);
      const newTask = await createTask(taskData);
      setTasks([newTask, ...tasks]);
      
      // Update the appropriate status array
      if (newTask.status === 'todo') {
        setTodoTasks([newTask, ...todoTasks]);
      } else if (newTask.status === 'inProgress') {
        setInProgressTasks([newTask, ...inProgressTasks]);
      } else if (newTask.status === 'done') {
        setDoneTasks([newTask, ...doneTasks]);
      }
      
      return newTask;
    } catch (error) {
      setError(error.message || 'Failed to create task');
      throw error;
    }
  };

  // Update a task
  const updateTaskItem = async (id, taskData) => {
    try {
      setError(null);
      const updatedTask = await updateTask(id, taskData);
      
      // Update tasks array
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
      
      // Update status arrays
      // First, remove the task from its current status array
      setTodoTasks(todoTasks.filter(task => task._id !== id));
      setInProgressTasks(inProgressTasks.filter(task => task._id !== id));
      setDoneTasks(doneTasks.filter(task => task._id !== id));
      
      // Then add it to the appropriate status array
      if (updatedTask.status === 'todo') {
        setTodoTasks([updatedTask, ...todoTasks]);
      } else if (updatedTask.status === 'inProgress') {
        setInProgressTasks([updatedTask, ...inProgressTasks]);
      } else if (updatedTask.status === 'done') {
        setDoneTasks([updatedTask, ...doneTasks]);
      }
      
      return updatedTask;
    } catch (error) {
      setError(error.message || 'Failed to update task');
      throw error;
    }
  };

  // Delete a task
  const removeTask = async (id) => {
    try {
      setError(null);
      await deleteTask(id);
      
      // Remove task from all arrays
      setTasks(tasks.filter(task => task._id !== id));
      setTodoTasks(todoTasks.filter(task => task._id !== id));
      setInProgressTasks(inProgressTasks.filter(task => task._id !== id));
      setDoneTasks(doneTasks.filter(task => task._id !== id));
    } catch (error) {
      setError(error.message || 'Failed to delete task');
      throw error;
    }
  };

  // Move a task to a different status
  const moveTask = async (id, newStatus) => {
    try {
      const task = tasks.find(task => task._id === id);
      if (!task) throw new Error('Task not found');
      
      return await updateTaskItem(id, { ...task, status: newStatus });
    } catch (error) {
      setError(error.message || 'Failed to move task');
      throw error;
    }
  };

  // Refresh tasks
  const refreshTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
      
      // Separate tasks by status
      setTodoTasks(data.filter(task => task.status === 'todo'));
      setInProgressTasks(data.filter(task => task.status === 'inProgress'));
      setDoneTasks(data.filter(task => task.status === 'done'));
    } catch (error) {
      setError(error.message || 'Failed to refresh tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
        loading,
        error,
        addTask,
        updateTaskItem,
        removeTask,
        moveTask,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
