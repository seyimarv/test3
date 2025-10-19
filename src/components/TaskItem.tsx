import { useState } from 'react';
import { Task, Priority } from '../lib/types';
import { Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns';
import { Trash2, GripVertical, Calendar, Edit2, Check, X } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  index: number;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-700 border-blue-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  high: 'bg-red-100 text-red-700 border-red-300',
};

export function TaskItem({ 
  task, 
  index, 
  onUpdate, 
  onDelete, 
  onToggleComplete,
  isSelected,
  onToggleSelect 
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    if (editedTask.title.trim()) {
      onUpdate(editedTask);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white rounded-lg border-2 p-4 mb-3 transition-all duration-200 ${
            snapshot.isDragging 
              ? 'shadow-2xl border-blue-400 scale-105' 
              : 'shadow-sm hover:shadow-md border-gray-200'
          } ${task.completed ? 'opacity-60' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            <div
              {...provided.dragHandleProps}
              className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={20} />
            </div>

            {/* Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(task.id)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />

            {/* Complete Toggle */}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer transition-all"
            />

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Task title"
                    autoFocus
                  />
                  <textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Description"
                    rows={2}
                  />
                  <div className="flex gap-3 flex-wrap">
                    <input
                      type="date"
                      value={editedTask.dueDate}
                      onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={editedTask.priority}
                      onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Priority })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Check size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div onClick={() => !task.completed && setIsEditing(true)} className="cursor-pointer">
                  <h3 className={`text-lg font-semibold mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`text-sm mb-2 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={14} />
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {!isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit task"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
