import { getDatabase } from "../lib/db";
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types";

export async function fetchCategories(): Promise<Category[]> {
  const db = await getDatabase();
  const results = await db.select<Category[]>(
    "SELECT * FROM categories ORDER BY name ASC",
    []
  );
  return results;
}

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  const db = await getDatabase();

  const result = await db.execute(
    `
    INSERT INTO categories (name, color, created_at, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    [payload.name, payload.color || "#000000"]
  );

  const categories = await db.select<Category[]>(
    "SELECT * FROM categories WHERE id = ?",
    [result.lastInsertId]
  );

  return categories[0];
}

export async function updateCategory(payload: UpdateCategoryPayload): Promise<Category> {
  const db = await getDatabase();

  const updates: string[] = [];
  const params: (string | null)[] = [];

  if (payload.name !== undefined) {
    updates.push("name = ?");
    params.push(payload.name);
  }
  if (payload.color !== undefined) {
    updates.push("color = ?");
    params.push(payload.color);
  }

  if (updates.length === 0) {
    return fetchCategoryById(payload.id);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  params.push(payload.id.toString());

  await db.execute(
    `UPDATE categories SET ${updates.join(", ")} WHERE id = ?`,
    params as any
  );

  return fetchCategoryById(payload.id);
}

export async function deleteCategory(id: number): Promise<void> {
  const db = await getDatabase();
  // Set category_id to NULL for all tasks using this category
  await db.execute(
    "UPDATE tasks SET category_id = NULL WHERE category_id = ?",
    [id]
  );
  // Delete the category
  await db.execute("DELETE FROM categories WHERE id = ?", [id]);
}

async function fetchCategoryById(id: number): Promise<Category> {
  const db = await getDatabase();
  const categories = await db.select<Category[]>(
    "SELECT * FROM categories WHERE id = ?",
    [id]
  );
  return categories[0];
}
