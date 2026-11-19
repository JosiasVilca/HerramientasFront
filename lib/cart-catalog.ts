import type { Product } from "@/data/products";
import { newArrivals, moreProducts } from "@/data/products";
import { apiProductToEcommerce } from "@/lib/catalog";
import { productService } from "@/services/product.service";
import { addToCart, isCatalogId, readCart, reconcileCart } from "@/lib/cart";

export async function addCatalogProduct(product: Product, quantity = 1) {
  let current = product;
  if (isCatalogId(product.id)) {
    const remote = await productService.get(product.id);
    if (remote.isActive === false) throw new Error("Este producto ya no está disponible.");
    current = apiProductToEcommerce(remote);
  }
  addToCart(current, quantity);
}

export async function refreshCartStock() {
  const ids = readCart().map((item) => item.id);
  if (!ids.length) return;
  // Si la API falla no se sustituye el stock real por datos de demostración.
  const realProducts = ids.some(isCatalogId)
    ? (await productService.list()).map(apiProductToEcommerce) : [];
  reconcileCart([...realProducts, ...newArrivals, ...moreProducts], ids);
}
