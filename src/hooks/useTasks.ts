import { useState, useEffect } from 'react';
import { Task, Priority } from '../types/task';

const STORAGE_KEY = 'taskstream-tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, description: string, dueDate: string, priority: Priority) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      dueDate,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const bulkComplete = (ids: string[]) => {
    setTasks(tasks.map(task => 
      ids.includes(task.id) ? { ...task, completed: true } : task
    ));
  };

  const bulkDelete = (ids: string[]) => {
    setTasks(tasks.filter(task => !ids.includes(task.id)));
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    bulkComplete,
    bulkDelete,
  };
}
