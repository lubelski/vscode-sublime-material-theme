import { useState, useEffect, useCallback } from 'react';

// Class definition for data management
export class TaskManager {
  private tasks: Map<string, Task> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor(private maxTasks: number = 100) {}

  addTask(task: Omit<Task, 'id' | 'createdAt'>): string {
    if (this.tasks.size >= this.maxTasks) {
      throw new Error('Maximum tasks limit reached');
    }
    
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTask: Task = {
      ...task,
      id,
      createdAt: new Date(),
    };
    
    this.tasks.set(id, newTask);
    this.notifyListeners();
    return id;
  }

  removeTask(id: string): boolean {
    const deleted = this.tasks.delete(id);
    if (deleted) this.notifyListeners();
    return deleted;
  }

  updateTask(id: string, updates: Partial<Pick<Task, 'title' | 'completed' | 'priority'>>): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    this.notifyListeners();
    return updatedTask;
  }

  getTasks(): Task[] {
    return Array.from(this.tasks.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  getTasksByPriority(priority: TaskPriority): Task[] {
    return this.getTasks().filter(task => task.priority === priority);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  getStats(): TaskStats {
    const tasks = this.getTasks();
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      highPriority: tasks.filter(t => t.priority === 'high').length,
    };
  }
}

// Type definitions
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  createdAt: Date;
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
}

// Custom React hook
export function useTaskManager(initialTasks: Omit<Task, 'id' | 'createdAt'>[] = []): {
  tasks: Task[];
  stats: TaskStats;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => string;
  removeTask: (id: string) => boolean;
  toggleTask: (id: string) => void;
  updateTaskPriority: (id: string, priority: TaskPriority) => void;
  clearCompleted: () => void;
} {
  const [taskManager] = useState(() => new TaskManager());
  const [tasks, setTasks] = useState<Task[]>([]);

  // Initialize with provided tasks
  useEffect(() => {
    initialTasks.forEach(task => taskManager.addTask(task));
  }, [taskManager, initialTasks]);

  // Subscribe to task manager changes
  useEffect(() => {
    const updateTasks = () => setTasks(taskManager.getTasks());
    updateTasks(); // Initial load
    
    const unsubscribe = taskManager.subscribe(updateTasks);
    return unsubscribe;
  }, [taskManager]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    return taskManager.addTask(task);
  }, [taskManager]);

  const removeTask = useCallback((id: string) => {
    return taskManager.removeTask(id);
  }, [taskManager]);

  const toggleTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      taskManager.updateTask(id, { completed: !task.completed });
    }
  }, [taskManager, tasks]);

  const updateTaskPriority = useCallback((id: string, priority: TaskPriority) => {
    taskManager.updateTask(id, { priority });
  }, [taskManager]);

  const clearCompleted = useCallback(() => {
    tasks.filter(task => task.completed).forEach(task => {
      taskManager.removeTask(task.id);
    });
  }, [taskManager, tasks]);

  const stats = taskManager.getStats();

  return {
    tasks,
    stats,
    addTask,
    removeTask,
    toggleTask,
    updateTaskPriority,
    clearCompleted,
  };
}