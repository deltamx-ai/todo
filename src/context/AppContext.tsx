import { createContext, useContext } from "react";
import { Category, TaskFilters, TaskWithCategory } from "../types";

export interface AppContextType {
  tasks: TaskWithCategory[];
  categories: Category[];
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;

  // Task actions
  addTask: (payload: any) => Promise<void>;
  editTask: (id: number, payload: any) => Promise<void>;
  changeTaskStatus: (id: number, status: string) => Promise<void>;
  removeTask: (id: number) => Promise<void>;

  // Category actions
  addCategory: (payload: any) => Promise<void>;
  editCategory: (id: number, payload: any) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;

  // Filter actions
  updateFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
