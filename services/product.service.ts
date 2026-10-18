// services/product.service.ts
import { fetchFromAPI } from "@/lib/api-client";
import type { ApiProduct, ProductInput } from "@/types/catalog";

function toFormData(input: ProductInput): FormData {
  const formData = new FormData();

  formData.append("name", input.name);
  if (input.sku) formData.append("sku", input.sku);
  if (input.description != null) formData.append("description", input.description);
  formData.append("price", String(input.price));
  if (input.stock != null) formData.append("stock", String(input.stock));
  if (input.categoryId != null) formData.append("categoryId", String(input.categoryId));
  if (input.isNew != null) formData.append("isNew", String(input.isNew));
  if (input.isActive != null) formData.append("isActive", String(input.isActive));
  if (input.file) formData.append("file", input.file);

  return formData;
}

export const productService = {
  /** Catálogo público (solo productos activos). */
  list: async (): Promise<ApiProduct[]> => {
    return await fetchFromAPI<ApiProduct[]>("/api/products", { method: "GET" });
  },

  /** Panel admin: incluye productos inactivos. Requiere rol ADMIN. */
  listAll: async (): Promise<ApiProduct[]> => {
    return await fetchFromAPI<ApiProduct[]>("/api/products/manage", { method: "GET" });
  },

  get: async (id: string): Promise<ApiProduct> => {
    return await fetchFromAPI<ApiProduct>(`/api/products/${id}`, { method: "GET" });
  },

  create: async (input: ProductInput): Promise<ApiProduct> => {
    return await fetchFromAPI<ApiProduct>("/api/products", {
      method: "POST",
      body: toFormData(input),
    });
  },

  update: async (id: string, input: ProductInput): Promise<ApiProduct> => {
    return await fetchFromAPI<ApiProduct>(`/api/products/${id}`, {
      method: "PUT",
      body: toFormData(input),
    });
  },

  remove: async (id: string): Promise<void> => {
    await fetchFromAPI<void>(`/api/products/${id}`, { method: "DELETE" });
  },
};
