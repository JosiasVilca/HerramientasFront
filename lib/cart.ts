import type { Product } from "@/data/products";

export interface CartItem {
  id: string;
  nombre: string;
  slug?: string;
  especificacion?: string;
  precio: number;
  cantidad: number;
  imagen: string;
  stock?: number;
}
export const CART_KEY = "carrito_compras";
export const EMPTY_CART: CartItem[] = [];
export const MAX_CART_QUANTITY = 1000;
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY_CART };
export const isCatalogId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

function parseCart(raw: string | null): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) return EMPTY_CART;
    const items = new Map<string, CartItem>();
    for (const value of parsed) {
      if (!value || typeof value !== "object") continue;
      const v = value as Record<string, unknown>;
      if (typeof v.id !== "string" || !v.id || typeof v.nombre !== "string" ||
          typeof v.imagen !== "string" || typeof v.precio !== "number" || !Number.isFinite(v.precio) || v.precio < 0 ||
          typeof v.cantidad !== "number" || !Number.isInteger(v.cantidad) || v.cantidad < 1 || v.cantidad > MAX_CART_QUANTITY) continue;
      const stock = typeof v.stock === "number" && Number.isInteger(v.stock) && v.stock >= 0 ? v.stock : undefined;
      const previous = items.get(v.id);
      items.set(v.id, { id: v.id, nombre: v.nombre, imagen: v.imagen, precio: v.precio,
        cantidad: Math.min(MAX_CART_QUANTITY, (previous?.cantidad ?? 0) + v.cantidad), stock,
        slug: typeof v.slug === "string" ? v.slug : undefined,
        especificacion: typeof v.especificacion === "string" ? v.especificacion : undefined });
    }
    return [...items.values()];
  } catch { return EMPTY_CART; }
}
export function readCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (raw !== cache.raw) cache = { raw, items: parseCart(raw) };
    return cache.items;
  } catch { return EMPTY_CART; }
}
export function subscribeToCart(callback: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === CART_KEY || event.key === null) callback(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener("cartUpdated", callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("cartUpdated", callback);
  };
}
export function writeCart(items: CartItem[]) {
  try { window.localStorage.setItem(CART_KEY, JSON.stringify(items)); }
  catch { throw new Error("No se pudo guardar el carrito. Comprueba el almacenamiento de tu navegador."); }
  window.dispatchEvent(new Event("cartUpdated"));
}
export function addToCart(product: Product, quantity = 1) {
  const items = readCart();
  const existing = items.find((item) => item.id === product.id);
  const count = (existing?.cantidad ?? 0) + quantity;
  if (!Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(product.price) || product.price <= 0 ||
      !Number.isInteger(product.stock) || product.stock < 1 || count > Math.min(product.stock, MAX_CART_QUANTITY)) {
    throw new Error(`No puedes agregar esa cantidad de ${product.name}. Stock disponible: ${product.stock}.`);
  }
  const item: CartItem = { id: product.id, slug: product.slug, nombre: product.name,
    especificacion: product.sku, precio: product.price, cantidad: count, imagen: product.image, stock: product.stock };
  writeCart(existing ? items.map((old) => old.id === item.id ? item : old) : [...items, item]);
}
export function changeQuantity(id: string, delta: number) {
  if (!Number.isInteger(delta)) return;
  writeCart(readCart().map((item) => {
    if (item.id !== id) return item;
    const count = item.cantidad + delta;
    if (count < 1) return item;
    if (delta > 0 && (item.stock === undefined || count > Math.min(item.stock, MAX_CART_QUANTITY))) {
      throw new Error("Actualiza el stock o reduce la cantidad solicitada.");
    }
    return { ...item, cantidad: count };
  }));
}
export function removeFromCart(id: string) { writeCart(readCart().filter((item) => item.id !== id)); }

// Actualiza únicamente productos consultados y usa el carrito más reciente,
// para no resucitar artículos eliminados mientras la consulta estaba en curso.
export function reconcileCart(products: Product[], checkedIds: string[]) {
  const checked = new Set(checkedIds);
  const byId = new Map(products.map((product) => [product.id, product]));
  const items = readCart().map((item) => {
    if (!checked.has(item.id)) return item;
    const product = byId.get(item.id);
    if (!product) return { ...item, stock: 0 };
    const stock = Number.isInteger(product.stock) && product.stock >= 0 && product.price > 0 ? product.stock : 0;
    return { ...item, nombre: product.name, slug: product.slug, especificacion: product.sku,
      imagen: product.image, precio: product.price, stock,
      cantidad: stock > 0 ? Math.min(item.cantidad, stock, MAX_CART_QUANTITY) : item.cantidad };
  });
  if (JSON.stringify(items) !== JSON.stringify(readCart())) writeCart(items);
}
