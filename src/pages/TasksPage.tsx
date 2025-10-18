import React, { useState, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTasks } from '../hooks/useTasks';
import { FilterStatus, Priority } from '../types/task';
import { AddTaskForm } from '../components/AddTaskForm';
import { TaskItem } from '../components/TaskItem';
import { TaskFilters } from '../components/TaskFilters';
import { TaskStats } from '../components/TaskStats';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { ClipboardList } from 'lucide-react';

export function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete, reorderTasks, bulkComplete, bulkDelete } = useTasks();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = 
        filterStatus === 'all' ||
        (filterStatus === 'active' && !task.completed) ||
        (filterStatus === 'completed' && task.completed);

      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, filterStatus, filterPriority, searchQuery]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      reorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const handleDeleteClick = (id: string) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const handleSelectTask = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedTasks);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedTasks(newSelected);
  };

  const handleBulkComplete = () => {
    bulkComplete(Array.from(selectedTasks));
    setSelectedTasks(new Set());
  };

  const handleBulkDelete = () => {
    bulkDelete(Array.from(selectedTasks));
    setSelectedTasks(new Set());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <TaskStats tasks={tasks} />

        <AddTaskForm onAddTask={addTask} />

        <TaskFilters
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterPriority={filterPriority}
          onFilterPriorityChange={setFilterPriority}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCount={selectedTasks.size}
          onBulkComplete={handleBulkComplete}
          onBulkDelete={handleBulkDelete}
        />

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100">
                  <ClipboardList className="w-10 h-10 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
              <p className="text-gray-600">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first task'}
              </p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                {filteredTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleComplete}
                    onUpdate={updateTask}
                    onDelete={handleDeleteClick}
                    isSelected={selectedTasks.has(task.id)}
                    onSelect={handleSelectTask}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
