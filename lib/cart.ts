// lib/cart.ts
export interface CartItem {
  id: string;
  nombre: string;
  especificacion?: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export const CART_KEY = "carrito_compras";
export const EMPTY_CART: CartItem[] = [];

// Snapshot cacheado: useSyncExternalStore exige devolver la misma referencia
// mientras el contenido de localStorage no cambie.
let cartCache: { raw: string | null; items: CartItem[] } = {
  raw: null,
  items: EMPTY_CART,
};

export function readCart(): CartItem[] {
  const raw = window.localStorage.getItem(CART_KEY);
  if (raw !== cartCache.raw) {
    try {
      const parsed = JSON.parse(raw ?? "[]");
      cartCache = {
        raw,
        items: Array.isArray(parsed) ? (parsed as CartItem[]) : EMPTY_CART,
      };
    } catch {
      cartCache = { raw, items: EMPTY_CART };
    }
  }
  return cartCache.items;
}

export function subscribeToCart(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("cartUpdated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cartUpdated", callback);
  };
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function addToCart(item: Omit<CartItem, "cantidad">, cantidad = 1) {
  const items = [...readCart()];
  const index = items.findIndex((i) => i.id === item.id);

  if (index > -1) {
    items[index] = { ...items[index], cantidad: items[index].cantidad + cantidad };
  } else {
    items.push({ ...item, cantidad });
  }

  writeCart(items);
}
