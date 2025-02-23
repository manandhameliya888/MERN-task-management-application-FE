import { useState, useCallback, useMemo, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { TaskFilter } from './components/TaskFilter';
import { Toaster, ToastType, ToastMessage } from './components/Toaster';
import { Task, TaskFilter as FilterType } from './types';
import { CheckSquare } from 'lucide-react';
import axios from "axios"

let baseURL = "http://localhost:3000/api/todos";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const newToast: ToastMessage = {
      id: crypto.randomUUID(),
      message,
      type,
      createdAt: Date.now(),
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleAddTask = useCallback((title: string) => {
    const newTask: Task = {
      _id: crypto.randomUUID(),
      taskName: title,
      status: false,
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
    addToast(`Task "${title}" added successfully!`);
    postTask(title);

  }, []);

  const postTask = async (task: string) => {
    try {
      await axios.post(baseURL, {taskName: task});
    } catch (error) {
      console.error('Error posting task:', error);
      addToast('Failed to store task in the API', 'error');
    }
  };

  const handleToggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const updatedTasks = prev.map((task) =>
        task._id === id ? { ...task, status: !task.status } : task
      );
      const task = updatedTasks.find((t) => t._id === id);
      if (task) {
        addToast(
          `Task "${task.taskName}" marked as ${task.status ? 'completed' : 'active'}`,
          'info'
        );
        updateTask(task._id, task.status);
      }
      return updatedTasks;
    });
  }, []);

  // New deleteTask function for making DELETE API call
  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      addToast('Failed to delete task', 'error');
    }
  };

  const handleDeleteTask = useCallback((id: string) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      addToast(`Task "${task.taskName}" deleted`, 'error');
      deleteTask(id);  // Call delete API and update state
    }
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    switch (currentFilter) {
      case 'active':
        return tasks.filter((task) => !task.status);
      case 'completed':
        return tasks.filter((task) => task.status);
      default:
        return tasks;
    }
  }, [tasks, currentFilter]);

  const taskCounts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((t) => !t.status).length,
      completed: tasks.filter((t) => t.status).length,
    }),
    [tasks]
  );

  useEffect(() => {
    getTask();
  }, [])

  const getTask = async () => {
    try {
      const response = await axios.get(baseURL);
      const fetchedTasks = response.data;

      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      addToast('Failed to fetch tasks from API', 'error');
    }
  }; const updateTask = async (id: string, status: boolean) => {
    try {
      // Send PUT request to update the task status
      await axios.patch(`${baseURL}/${id}`, { status });
    } catch (error) {
      console.error('Error updating task:', error);
      addToast('Failed to update task status', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster toasts={toasts} onRemove={removeToast} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <CheckSquare className="text-blue-500 w-8 h-8 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <TaskForm onAddTask={handleAddTask} />

            <div className="border-t border-gray-200 pt-6">
              <TaskFilter
                currentFilter={currentFilter}
                onFilterChange={setCurrentFilter}
                taskCounts={taskCounts}
              />
            </div>

            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No tasks found. Add some tasks to get started!
                </p>
              ) : (
                <TaskList
                  tasks={filteredTasks}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}  // Passing handleDeleteTask to TaskList
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
