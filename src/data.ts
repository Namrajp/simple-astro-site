import { drizzle } from "drizzle-orm/node-postgres";
import { tasks, categories } from "@drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const db = drizzle(import.meta.env.POSTGRES_URL!);

interface Task {
  id: number;
  title: string;
  done: boolean;
  created_at: string;
  category_name: string | null;
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const result = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        done: tasks.done,
        created_at: tasks.createdAt,
        category_name: categories.name,
      })
      .from(tasks)
      .leftJoin(categories, eq(tasks.categoryId, categories.id))
      .orderBy(desc(tasks.createdAt));

    return result as Task[];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

//...existing content in this file

interface Category {
  id: number;
  name: string;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .orderBy(categories.name);

    return result as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
