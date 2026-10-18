export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: number | null;
  active: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface CategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  parentId?: number | null;
  active?: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  stock: number;
  categoryId?: number | null;
  categoryName?: string | null;
  imageUrl: string;
  imageHoverUrl?: string | null;
  rating?: number | null;
  reviewsCount?: number | null;
  newProduct: boolean;
  active: boolean;
  isActive?: boolean;
  stockStatus: "OUT" | "LOW" | "OPTIMAL";
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  sku: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number | null;
  imageUrl: string;
  imageHoverUrl?: string;
  rating?: number;
  reviewsCount?: number;
  newProduct?: boolean;
  active?: boolean;
}

export interface InventoryPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface InventoryStats {
  totalProducts: number;
  totalUnits: number;
  totalValue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

/** Producto tal como lo devuelve la API. */
export interface ApiProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  stock: number;
  categoryId?: number | null;
  categoryName?: string | null;
  imageUrl: string;
  imageHoverUrl?: string | null;
  rating?: number | null;
  reviewsCount?: number | null;
  isNew?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Datos aceptados al crear/actualizar un producto (se envían como multipart). */
export interface ProductInput {
  name: string;
  sku?: string;
  description?: string;
  price: number;
  stock?: number;
  categoryId?: number | null;
  isNew?: boolean;
  isActive?: boolean;
  /** Archivo de imagen; el backend lo sube a Cloudinary. */
  file?: File | null;
}

export interface CategoryInput {
  name: string;
  description?: string;
  isActive?: boolean;
}