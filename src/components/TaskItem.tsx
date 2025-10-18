import React, { useState } from 'react';
import { Task, Priority } from '../types/task';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Trash2, GripVertical, Edit2, Check, X, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

export function TaskItem({ task, onToggleComplete, onUpdate, onDelete, isSelected, onSelect }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editDueDate, setEditDueDate] = useState(task.dueDate);
  const [editPriority, setEditPriority] = useState(task.priority);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle,
        description: editDescription,
        dueDate: editDueDate,
        priority: editPriority,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate);
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    if (priority === 'high') {
      return <AlertCircle className="w-4 h-4" />;
    }
    return null;
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="bg-white rounded-lg border border-blue-500 p-4 shadow-md">
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            autoFocus
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />
            <Select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelect(task.id, e.target.checked)}
            className="mt-1"
          />
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
          >
            <GripVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <Checkbox
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
            />
            <div className="flex-1 min-w-0">
              <h3
                className={`text-base font-medium text-gray-900 break-words cursor-pointer hover:text-blue-600 transition-colors ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
                onClick={() => setIsEditing(true)}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-sm text-gray-600 mt-1 break-words cursor-pointer hover:text-gray-900 ${
                    task.completed ? 'line-through' : ''
                  }`}
                  onClick={() => setIsEditing(true)}
                >
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-6">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)}
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                <Calendar className="w-3 h-3" />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
