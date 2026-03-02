import { getDatabase } from "../lib/db";
import {
  Task,
  TaskWithCategory,
  TaskFilters,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "../types";

export async function fetchTasks(filters?: TaskFilters): Promise<TaskWithCategory[]> {
  const db = await getDatabase();

  let query = `
    SELECT
      t.*,
      c.name as category_name,
      c.color as category_color
    FROM tasks t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE 1=1
  `;

  const params: (string | number | null)[] = [];

  if (filters?.status && filters.status !== "all") {
    query += " AND t.status = ?";
    params.push(filters.status);
  }

  if (filters?.priority && filters.priority !== "all") {
    query += " AND t.priority = ?";
    params.push(filters.priority);
  }

  if (filters?.category_id !== undefined) {
    query += " AND t.category_id = ?";
    params.push(filters.category_id);
  }

  if (filters?.deadline_from) {
    query += " AND t.deadline >= ?";
    params.push(filters.deadline_from);
  }

  if (filters?.deadline_to) {
    query += " AND t.deadline <= ?";
    params.push(filters.deadline_to);
  }

  if (filters?.search) {
    query += " AND (t.title LIKE ? OR t.description LIKE ?)";
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  query += " ORDER BY t.deadline ASC NULLS LAST, t.priority DESC, t.created_at DESC";

  const results = await db.select<TaskWithCategory[]>(query, params);
  return results;
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const db = await getDatabase();

  const result = await db.execute(
    `
    INSERT INTO tasks (title, description, status, priority, category_id, start_time, deadline, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    [
      payload.title,
      payload.description || null,
      payload.status || "todo",
      payload.priority || "Medium",
      payload.category_id || null,
      payload.start_time || null,
      payload.deadline || null,
    ]
  );

  // Fetch and return the created task using the inserted ID
  const tasks = await db.select<Task[]>(
    "SELECT * FROM tasks WHERE id = ?",
    [result.lastInsertId]
  );

  return tasks[0];
}

export async function updateTask(payload: UpdateTaskPayload): Promise<Task> {
  const db = await getDatabase();

  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  if (payload.title !== undefined) {
    updates.push("title = ?");
    params.push(payload.title);
  }
  if (payload.description !== undefined) {
    updates.push("description = ?");
    params.push(payload.description);
  }
  if (payload.status !== undefined) {
    updates.push("status = ?");
    params.push(payload.status);
  }
  if (payload.priority !== undefined) {
    updates.push("priority = ?");
    params.push(payload.priority);
  }
  if (payload.category_id !== undefined) {
    updates.push("category_id = ?");
    params.push(payload.category_id);
  }
  if (payload.start_time !== undefined) {
    updates.push("start_time = ?");
    params.push(payload.start_time);
  }
  if (payload.deadline !== undefined) {
    updates.push("deadline = ?");
    params.push(payload.deadline);
  }

  if (updates.length === 0) {
    return fetchTaskById(payload.id);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  params.push(payload.id);

  await db.execute(
    `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`,
    params
  );

  return fetchTaskById(payload.id);
}

export async function updateTaskStatus(id: number, status: string): Promise<Task> {
  return updateTask({ id, status: status as any });
}

export async function deleteTask(id: number): Promise<void> {
  const db = await getDatabase();
  await db.execute("DELETE FROM tasks WHERE id = ?", [id]);
}

async function fetchTaskById(id: number): Promise<Task> {
  const db = await getDatabase();
  const tasks = await db.select<Task[]>(
    "SELECT * FROM tasks WHERE id = ?",
    [id]
  );
  return tasks[0];
}
