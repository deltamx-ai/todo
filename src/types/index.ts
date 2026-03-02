export type TaskStatus = "todo" | "inprogress" | "done";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category_id: number | null;
  start_time: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskWithCategory extends Task {
  category_name?: string;
  category_color?: string;
}

export interface TaskFilters {
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  category_id?: number | null;
  deadline_from?: string;
  deadline_to?: string;
  search?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category_id?: number | null;
  start_time?: string;
  deadline?: string;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  id: number;
}

export interface CreateCategoryPayload {
  name: string;
  color?: string;
}

export interface UpdateCategoryPayload {
  id: number;
  name?: string;
  color?: string;
}
