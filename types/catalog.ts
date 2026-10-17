// types/catalog.ts
// Contratos del catálogo tal como los expone el backend (store_schema).

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
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
