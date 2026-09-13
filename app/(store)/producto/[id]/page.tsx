// app/(store)/producto/[id]/page.tsx
"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import ProductGallery from "@/components/store/ProductGallery";
import ProductInfo from "@/components/store/ProductInfo";
import ProductTabs from "@/components/store/ProductTabs";
import RelatedProducts from "@/components/store/RelatedProducts";
import { newArrivals, moreProducts, Product } from "@/data/products";

const baseProducts = [...newArrivals, ...moreProducts];

interface PageProps {
  params: Promise<{ id: string }>;
}

interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  updatedAt: string;
}

const INVENTORY_STORAGE_KEY = "ecostore_inventory";

// Convertir producto del admin → producto del ecommerce
function convertAdminProduct(adminProduct: AdminProduct): Product {
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

  const placeholderImage =
    "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800&auto=format&fit=crop";

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
    image: placeholderImage,
    imageHover: placeholderImage,
    images: [placeholderImage],
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

// Función que busca el producto (sin useEffect)
function findProduct(id: string): Product | null {
  // 1. Buscar en productos hardcodeados
  const baseProduct = baseProducts.find((p) => p.id === id);
  if (baseProduct) return baseProduct;

  // 2. Si no está, buscar en productos del admin (localStorage)
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (stored) {
      const parsed: AdminProduct[] = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const found = parsed.find((p) => p.id === id);
        if (found) return convertAdminProduct(found);
      }
    }
  } catch (error) {
    console.error("Error al buscar producto del admin:", error);
  }

  return null;
}

export default function ProductoPage({ params }: PageProps) {
  const { id } = use(params);

  // useState con inicializador (lee localStorage una sola vez)
  const [product] = useState<Product | null>(() => findProduct(id));

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-purple-600 transition-colors">
          Inicio
        </Link>
        <FiChevronRight className="w-3 h-3" />
        <Link
          href={`/productos?categoria=${product.category}`}
          className="hover:text-purple-600 transition-colors capitalize"
        >
          {product.category}
        </Link>
        <FiChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium line-clamp-1">
          {product.name}
        </span>
      </nav>

      {/* Producto: galería + info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>

      {/* Tabs: descripción, specs, garantía */}
      <ProductTabs product={product} />

      {/* Productos relacionados */}
      <RelatedProducts product={product} />
    </div>
  );
}