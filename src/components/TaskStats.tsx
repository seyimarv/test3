import { Task } from '../lib/types';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Tasks</p>
            <p className="text-4xl font-bold">{total}</p>
          </div>
          <ListTodo size={48} className="text-blue-200 opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium mb-1">Completed</p>
            <p className="text-4xl font-bold">{completed}</p>
          </div>
          <CheckCircle2 size={48} className="text-green-200 opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-1">Active</p>
            <p className="text-4xl font-bold">{active}</p>
          </div>
          <Circle size={48} className="text-orange-200 opacity-80" />
        </div>
      </div>
    </div>
  );
}
