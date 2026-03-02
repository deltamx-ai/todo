import { useEffect, useState, ReactNode } from "react";
import { AppContext, AppContextType } from "./AppContext";
import { Category, TaskFilters, TaskWithCategory } from "../types";
import * as taskService from "../services/taskService";
import * as categoryService from "../services/categoryService";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [tasks, setTasks] = useState<TaskWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reload tasks when filters change
  useEffect(() => {
    loadTasks();
  }, [filters]);

  async function loadInitialData() {
    try {
      setIsLoading(true);
      setError(null);
      const [tasksData, categoriesData] = await Promise.all([
        taskService.fetchTasks(filters),
        categoryService.fetchCategories(),
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadTasks() {
    try {
      const tasksData = await taskService.fetchTasks(filters);
      setTasks(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error(err);
    }
  }

  async function loadCategories() {
    try {
      const categoriesData = await categoryService.fetchCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error(err);
    }
  }

  const contextValue: AppContextType = {
    tasks,
    categories,
    filters,
    isLoading,
    error,

    addTask: async (payload) => {
      try {
        await taskService.createTask(payload);
        await loadTasks();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create task";
        setError(message);
        console.error("Add task error:", err);
        throw err;
      }
    },

    editTask: async (id, payload) => {
      try {
        await taskService.updateTask({ id, ...payload });
        await loadTasks();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update task";
        setError(message);
        console.error("Edit task error:", err);
        throw err;
      }
    },

    changeTaskStatus: async (id, status) => {
      try {
        await taskService.updateTaskStatus(id, status);
        await loadTasks();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update task status";
        setError(message);
        console.error("Change status error:", err);
        throw err;
      }
    },

    removeTask: async (id) => {
      try {
        await taskService.deleteTask(id);
        await loadTasks();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete task";
        setError(message);
        console.error("Delete task error:", err);
        throw err;
      }
    },

    addCategory: async (payload) => {
      try {
        await categoryService.createCategory(payload);
        await loadCategories();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create category";
        setError(message);
        console.error("Add category error:", err);
        throw err;
      }
    },

    editCategory: async (id, payload) => {
      try {
        await categoryService.updateCategory({ id, ...payload });
        await loadCategories();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update category";
        setError(message);
        console.error("Edit category error:", err);
        throw err;
      }
    },

    removeCategory: async (id) => {
      try {
        await categoryService.deleteCategory(id);
        await loadCategories();
        await loadTasks();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete category";
        setError(message);
        console.error("Delete category error:", err);
        throw err;
      }
    },

    updateFilters: (newFilters) => {
      setFilters(newFilters);
    },

    clearFilters: () => {
      setFilters({ status: "all" });
    },
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
