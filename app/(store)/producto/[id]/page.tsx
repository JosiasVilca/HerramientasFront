// app/(store)/producto/[id]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGallery from "@/components/store/ProductGallery";
import ProductInfo from "@/components/store/ProductInfo";
import ProductTabs from "@/components/store/ProductTabs";
import RelatedProducts from "@/components/store/RelatedProducts";
import Reveal from "@/components/ui/reveal";
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
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="aspect-square rounded-xl bg-muted" aria-hidden="true" />
        <div className="space-y-4" aria-hidden="true">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-10 w-3/4 rounded bg-muted" />
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="h-12 w-40 rounded bg-muted" />
          <div className="h-12 w-full rounded bg-muted" />
        </div>
        <span className="sr-only">Cargando producto…</span>
      </div>
    );
  }

  if (missing || !product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-8">
      <nav
        aria-label="Migas de pan"
        className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/productos?categoria=${encodeURIComponent(product.category)}`}
          className="transition-colors hover:text-foreground"
        >
          {product.category.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase())}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="line-clamp-1 text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid grid-cols-1 items-start gap-10 md:grid-cols-2 lg:mt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 xl:gap-20">
        <div className="hero-rise">
          <ProductGallery product={product} />
        </div>
        <div className="hero-rise [animation-delay:80ms]">
          <ProductInfo product={product} />
        </div>
      </div>

      <Reveal className="mt-14 lg:mt-20">
        <ProductTabs product={product} />
      </Reveal>

      <RelatedProducts product={product} />
    </div>
  );
}
