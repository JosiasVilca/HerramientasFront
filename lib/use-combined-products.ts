// lib/use-combined-products.ts
"use client";

import { useState, useEffect } from "react";
import { newArrivals, moreProducts, Product } from "@/data/products";

// Clave del localStorage que usa el panel admin
const INVENTORY_STORAGE_KEY = "ecostore_inventory";

// Estructura del producto que guarda el admin
interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image?: string;         // ← NUEVO: imagen opcional
  updatedAt: string;
}

// Convertir producto del admin → producto del ecommerce
function convertAdminProductToEcommerce(adminProduct: AdminProduct): Product {
  // Mapear categoría del admin a la tuya
  const categoryMap: Record<string, string> = {
    Teclados: "teclados",
    Ratones: "mouse",
    Monitores: "monitores",
    Audífonos: "audifonos",
    Micrófonos: "microfonos",
    Mousepads: "perifericos",
    Accesorios: "accesorios",
    Notebooks: "notebooks",
    "Sillas Gamer": "sillas-gamer",
    Periféricos: "perifericos",
  };

  const mappedCategory =
    categoryMap[adminProduct.category] ||
    adminProduct.category.toLowerCase().replace(/\s+/g, "-");

  // Usar imagen del admin o placeholder
  const placeholderImage =
    "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800&auto=format&fit=crop";

  const imageUrl = adminProduct.image || placeholderImage;

  return {
    id: adminProduct.id,
    sku: adminProduct.sku,
    name: adminProduct.name,
    description: adminProduct.description || "Producto registrado desde el panel admin.",
    longDescription:
      adminProduct.description ||
      "Producto registrado desde el panel de administración de NEXORA.",
    category: mappedCategory,
    brand: adminProduct.category.toLowerCase(),
    image: imageUrl,
    imageHover: imageUrl,
    images: [imageUrl],
    specs: [
      { label: "SKU", value: adminProduct.sku },
      { label: "Categoría", value: adminProduct.category },
    ],
    stock: adminProduct.stock,
    warranty: "24 meses",
    rating: 5.0,
    reviews: 0,
    oldPrice: adminProduct.price,
    price: adminProduct.price,
    discount: 0,
    isNew: true,
  };
}

// Hook que combina los productos hardcodeados + los del admin
export function useCombinedProducts() {
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadAdminProducts = () => {
      try {
        const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
        if (stored) {
          const parsed: AdminProduct[] = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const converted = parsed.map(convertAdminProductToEcommerce);
            setAdminProducts(converted);
          }
        } else {
          setAdminProducts([]);
        }
      } catch (error) {
        console.error("Error al cargar productos del admin:", error);
        setAdminProducts([]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadAdminProducts();
  }, []);

  // Combinar: primero los del admin (más nuevos), luego los hardcodeados
  const allProducts = [...adminProducts, ...newArrivals, ...moreProducts];

  return {
    allProducts,
    adminProducts,
    isLoaded,
  };
}