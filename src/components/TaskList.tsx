import React from 'react';
import { Task, TaskFilter } from '../types';
import { Check, Trash2, X } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  return (
    <div className="w-full max-w-md space-y-2">
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`flex items-center justify-between p-4 rounded-lg border ${
            task.status
              ? 'bg-gray-50 border-gray-200'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleTask(task._id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.status
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {task.status && <Check size={14} />}
            </button>
            <span
              className={`text-gray-800 ${
                task.status ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.taskName}
            </span>
          </div>
          <button
            onClick={() => onDeleteTask(task._id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}