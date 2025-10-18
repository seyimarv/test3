import React from 'react';
import { FilterStatus, Priority } from '../types/task';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Search, CheckCircle2, Circle, ListTodo, Trash2, CheckCheck } from 'lucide-react';

interface TaskFiltersProps {
  filterStatus: FilterStatus;
  onFilterStatusChange: (status: FilterStatus) => void;
  filterPriority: Priority | 'all';
  onFilterPriorityChange: (priority: Priority | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
  onBulkComplete: () => void;
  onBulkDelete: () => void;
}

export function TaskFilters({
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  searchQuery,
  onSearchChange,
  selectedCount,
  onBulkComplete,
  onBulkDelete,
}: TaskFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filterPriority}
            onChange={(e) => onFilterPriorityChange(e.target.value as Priority | 'all')}
            className="w-full sm:w-32"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterStatusChange('all')}
            className="transition-all duration-200"
          >
            <ListTodo className="w-4 h-4 mr-2" />
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterStatusChange('active')}
            className="transition-all duration-200"
          >
            <Circle className="w-4 h-4 mr-2" />
            Active
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterStatusChange('completed')}
            className="transition-all duration-200"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completed
          </Button>
        </div>

        {selectedCount > 0 && (
          <div className="flex gap-2 animate-fade-in">
            <span className="text-sm text-gray-600 flex items-center">
              {selectedCount} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkComplete}
              className="hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all duration-200"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDelete}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
