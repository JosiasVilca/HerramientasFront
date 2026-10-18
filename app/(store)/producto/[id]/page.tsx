// app/(store)/producto/[id]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import ProductGallery from "@/components/store/ProductGallery";
import ProductInfo from "@/components/store/ProductInfo";
import ProductTabs from "@/components/store/ProductTabs";
import RelatedProducts from "@/components/store/RelatedProducts";
import { newArrivals, moreProducts, Product } from "@/data/products";
import { apiProductToEcommerce } from "@/lib/catalog";
import { productService } from "@/services/product.service";

const baseProducts = [...newArrivals, ...moreProducts];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductoPage({ params }: PageProps) {
  const { id } = use(params);

  const isBaseProduct = baseProducts.some((p) => p.id === id);

  const [product, setProduct] = useState<Product | null>(
    () => baseProducts.find((p) => p.id === id) ?? null,
  );
  const [isLoading, setIsLoading] = useState(() => !isBaseProduct);
  const [missing, setMissing] = useState(false);

  // Los productos creados desde el panel admin viven en PostgreSQL (id UUID).
  useEffect(() => {
    if (isBaseProduct) return;

    let cancelled = false;
    productService
      .get(id)
      .then((apiProduct) => {
        if (!cancelled) setProduct(apiProductToEcommerce(apiProduct));
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isBaseProduct]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-24 text-center text-sm text-slate-500">
        Cargando producto…
      </div>
    );
  }

  if (missing || !product) {
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