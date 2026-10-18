// services/category.service.ts
import { fetchFromAPI } from "@/lib/api-client";
import type { Category, CategoryInput } from "@/types/catalog";

export const categoryService = {
  /** Lectura pública. */
  list: async (): Promise<Category[]> => {
    return await fetchFromAPI<Category[]>("/api/categories", { method: "GET" });
  },

  create: async (input: CategoryInput): Promise<Category> => {
    return await fetchFromAPI<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  update: async (id: number, input: CategoryInput): Promise<Category> => {
    return await fetchFromAPI<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },

  remove: async (id: number): Promise<void> => {
    await fetchFromAPI<void>(`/api/categories/${id}`, { method: "DELETE" });
  },
};
