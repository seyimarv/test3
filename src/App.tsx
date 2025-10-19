import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Task, Filters } from './lib/types';
import { loadTasks, saveTasks } from './lib/storage';
import { TaskItem } from './components/TaskItem';
import { AddTaskForm } from './components/AddTaskForm';
import { FilterBar } from './components/FilterBar';
import { TaskStats } from './components/TaskStats';
import { BulkActions } from './components/BulkActions';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ListChecks } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    priority: 'all',
    search: '',
  });
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    taskId?: string;
    isBulk?: boolean;
  }>({ isOpen: false });

  // Load tasks from localStorage on mount
  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Add new task
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  // Update existing task
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  // Delete task with confirmation
  const handleDeleteTask = (id: string) => {
    setDeleteDialog({ isOpen: true, taskId: id });
  };

  const confirmDelete = () => {
    if (deleteDialog.taskId) {
      setTasks(tasks.filter(task => task.id !== deleteDialog.taskId));
      setSelectedTaskIds(prev => {
        const next = new Set(prev);
        next.delete(deleteDialog.taskId!);
        return next;
      });
    }
    setDeleteDialog({ isOpen: false });
  };

  // Toggle task completion
  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Toggle task selection
  const handleToggleSelect = (id: string) => {
    setSelectedTaskIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Bulk complete selected tasks
  const handleCompleteSelected = () => {
    setTasks(tasks.map(task =>
      selectedTaskIds.has(task.id) ? { ...task, completed: true } : task
    ));
    setSelectedTaskIds(new Set());
  };

  // Bulk delete selected tasks
  const handleDeleteSelected = () => {
    setDeleteDialog({ isOpen: true, isBulk: true });
  };

  const confirmBulkDelete = () => {
    setTasks(tasks.filter(task => !selectedTaskIds.has(task.id)));
    setSelectedTaskIds(new Set());
    setDeleteDialog({ isOpen: false });
  };

  // Drag and drop reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the full tasks array while preserving order of filtered items
    const filteredIds = new Set(items.map(t => t.id));
    const nonFilteredTasks = tasks.filter(t => !filteredIds.has(t.id));
    setTasks([...items, ...nonFilteredTasks]);
  };

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Status filter
      if (filters.status === 'active' && task.completed) return false;
      if (filters.status === 'completed' && !task.completed) return false;

      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(searchLower);
        const descMatch = task.description.toLowerCase().includes(searchLower);
        if (!titleMatch && !descMatch) return false;
      }

      return true;
    });
  }, [tasks, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
              <ListChecks size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kinetic List</h1>
              <p className="text-gray-600 text-sm">Organize your tasks with ease</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Add Task Form */}
        <AddTaskForm onAdd={handleAddTask} />

        {/* Filters */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Tasks ({filteredTasks.length})
          </h2>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListChecks size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">
                {tasks.length === 0
                  ? 'Get started by adding your first task!'
                  : 'Try adjusting your filters or search criteria.'}
              </p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {filteredTasks.map((task, index) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        index={index}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                        onToggleComplete={handleToggleComplete}
                        isSelected={selectedTaskIds.has(task.id)}
                        onToggleSelect={handleToggleSelect}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </main>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedTaskIds.size}
        onCompleteSelected={handleCompleteSelected}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.isBulk ? 'Delete Selected Tasks' : 'Delete Task'}
        message={
          deleteDialog.isBulk
            ? `Are you sure you want to delete ${selectedTaskIds.size} selected task${selectedTaskIds.size !== 1 ? 's' : ''}? This action cannot be undone.`
            : 'Are you sure you want to delete this task? This action cannot be undone.'
        }
        onConfirm={deleteDialog.isBulk ? confirmBulkDelete : confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false })}
      />
    </div>
  );
}

export default App;
