// lib/use-combined-products.ts
"use client";

import { useEffect, useState } from "react";
import { newArrivals, moreProducts, Product } from "@/data/products";
import { apiProductToEcommerce } from "@/lib/catalog";
import { productService } from "@/services/product.service";

/**
 * Combina el catálogo de la API (productos creados desde el panel admin,
 * persistidos en PostgreSQL) con los productos de demostración hardcodeados.
 */
export function useCombinedProducts() {
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    productService
      .list()
      .then((items) => {
        if (!cancelled) {
          setApiProducts(items.map(apiProductToEcommerce));
        }
      })
      .catch((error) => {
        // La tienda sigue funcionando con el catálogo de demostración.
        console.warn("No se pudo cargar el catálogo desde la API:", error);
      })
      .finally(() => {
        if (!cancelled) setIsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Primero los productos reales de la API, luego los de demostración.
  const allProducts = [...apiProducts, ...newArrivals, ...moreProducts];

  return {
    allProducts,
    adminProducts: apiProducts,
    isLoaded,
  };
}
