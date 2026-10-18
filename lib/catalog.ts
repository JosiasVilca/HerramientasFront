// lib/catalog.ts
// Conversión entre el producto de la API (store_schema) y el modelo del ecommerce.

import type { Product } from "@/data/products";
import type { ApiProduct } from "@/types/catalog";

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800&auto=format&fit=crop";

/**
 * Mapa nombre-de-categoría → slug del ecommerce.
 * Se indexa por el nombre ya "slugificado" para tolerar tildes y mayúsculas.
 */
const CATEGORY_SLUG_MAP: Record<string, string> = {
  teclados: "teclados",
  "teclados-gamer": "teclados",
  mouse: "mouse",
  "mouse-gamer": "mouse",
  ratones: "mouse",
  monitores: "monitores",
  audifonos: "audifonos",
  "audifonos-audio": "audifonos",
  microfonos: "microfonos",
  mousepads: "perifericos",
  perifericos: "perifericos",
  accesorios: "accesorios",
  notebooks: "notebooks",
  "sillas-gamer": "sillas-gamer",
};

/** Normaliza un texto a slug (quita tildes, minúsculas, separa con guiones). */
export function slugify(value: string | null | undefined): string {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Traduce el nombre/slug de categoría del backend al slug del ecommerce. */
export function mapCategorySlug(categoryName?: string | null): string {
  const slug = slugify(categoryName);
  if (!slug) return "general";
  return CATEGORY_SLUG_MAP[slug] ?? slug;
}

/** Convierte un producto de la API en un producto del ecommerce. */
export function apiProductToEcommerce(product: ApiProduct): Product {
  const categoryName = product.categoryName || "General";
  const image = product.imageUrl || PLACEHOLDER_IMAGE;
  const imageHover = product.imageHoverUrl || image;
  const description =
    product.description || "Producto registrado desde el panel de administración de NEXORA.";

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description,
    longDescription: description,
    category: mapCategorySlug(categoryName),
    brand: categoryName.toLowerCase(),
    image,
    imageHover,
    images: imageHover && imageHover !== image ? [image, imageHover] : [image],
    specs: [
      { label: "SKU", value: product.sku },
      { label: "Categoría", value: categoryName },
    ],
    stock: product.stock,
    warranty: "24 meses",
    rating: product.rating ?? 5,
    reviews: product.reviewsCount ?? 0,
    oldPrice: product.price,
    price: product.price,
    discount: 0,
    isNew: product.isNew ?? true,
  };
}
