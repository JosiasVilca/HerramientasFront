import { fetchFromAPI, getApiUrl, getAuthHeaders } from "@/lib/api-client";
import {
  Category,
  CategoryRequest,
  InventoryPage,
  InventoryStats,
  Product,
  ProductRequest,
} from "@/types/catalog";

export const catalogService = {
  listCategories: (params?: { search?: string; activeOnly?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.activeOnly) query.set("activeOnly", "true");
    return fetchFromAPI<Category[]>(
      `/admin/categories${query.size ? `?${query.toString()}` : ""}`,
    );
  },

  createCategory: (request: CategoryRequest) =>
    fetchFromAPI<Category>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(request),
    }),

  updateCategory: (id: number, request: CategoryRequest) =>
    fetchFromAPI<Category>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    }),

  deactivateCategory: (id: number) =>
    fetchFromAPI<Category>(`/admin/categories/${id}/deactivate`, {
      method: "PATCH",
    }),

  deleteCategory: (id: number) =>
    fetchFromAPI<void>(`/admin/categories/${id}`, { method: "DELETE" }),

  listInventory: (params: {
    search?: string;
    categoryId?: number;
    active?: boolean;
    stockStatus?: string;
    page: number;
    size: number;
  }) => {
    const query = new URLSearchParams({
      page: String(params.page),
      size: String(params.size),
      sortBy: "updatedAt",
      direction: "desc",
    });
    if (params.search) query.set("search", params.search);
    if (params.categoryId) query.set("categoryId", String(params.categoryId));
    if (params.active !== undefined) query.set("active", String(params.active));
    if (params.stockStatus && params.stockStatus !== "ALL") {
      query.set("stockStatus", params.stockStatus);
    }
    return fetchFromAPI<InventoryPage>(`/admin/products/inventory?${query}`);
  },

  inventoryStats: (params: {
    search?: string;
    categoryId?: number;
    active?: boolean;
    stockStatus?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.categoryId) query.set("categoryId", String(params.categoryId));
    if (params.active !== undefined) query.set("active", String(params.active));
    if (params.stockStatus && params.stockStatus !== "ALL") {
      query.set("stockStatus", params.stockStatus);
    }
    return fetchFromAPI<InventoryStats>(`/admin/products/inventory/stats?${query}`);
  },

  createProduct: (request: ProductRequest) =>
    fetchFromAPI<Product>("/admin/products", {
      method: "POST",
      body: JSON.stringify(request),
    }),

  updateProduct: (id: string, request: ProductRequest) =>
    fetchFromAPI<Product>(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    }),

  deactivateProduct: (id: string) =>
    fetchFromAPI<Product>(`/admin/products/${id}/deactivate`, { method: "PATCH" }),

  deleteProduct: (id: string) =>
    fetchFromAPI<void>(`/admin/products/${id}`, { method: "DELETE" }),

  downloadInventory: async (format: "xlsx" | "pdf", params: URLSearchParams) => {
    const response = await fetch(`${getApiUrl(`/admin/products/inventory/export.${format}?${params}`)}`, {
      headers: { Accept: format === "xlsx" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "application/pdf", ...getAuthHeaders() },
    });
    if (!response.ok) throw new Error(`No se pudo exportar el inventario (${response.status}).`);
    return response.blob();
  },
};
