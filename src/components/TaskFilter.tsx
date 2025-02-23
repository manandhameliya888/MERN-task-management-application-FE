import React from 'react';
import { TaskFilter as FilterType } from '../types';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

export function TaskFilter({ currentFilter, onFilterChange, taskCounts }: TaskFilterProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: `All (${taskCounts.all})` },
    { value: 'active', label: `Active (${taskCounts.active})` },
    { value: 'completed', label: `Completed (${taskCounts.completed})` },
  ];

  return (
    <div className="flex space-x-2">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}