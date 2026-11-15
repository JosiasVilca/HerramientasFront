// components/store/RelatedProducts.tsx
"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import Reveal from "@/components/ui/reveal";
import { useCombinedProducts } from "@/lib/use-combined-products";
import { Product } from "@/data/products";

interface RelatedProductsProps {
  product: Product;
}

export default function RelatedProducts({ product }: RelatedProductsProps) {
  const { allProducts, isLoaded } = useCombinedProducts();

  const sameCategory = allProducts.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );
  const otherProducts = allProducts.filter(
    (item) => item.category !== product.category && item.id !== product.id,
  );
  const related = [...sameCategory, ...otherProducts].slice(0, 4);

  if (!isLoaded || related.length === 0) return null;

  return (
    <section className="mt-16 lg:mt-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
          Completa tu setup
        </h2>
        <Link
          href="/productos"
          className="inline-flex min-h-11 items-center whitespace-nowrap text-base font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
        >
          Ver todo el catálogo
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {related.map((item, index) => (
          <Reveal key={item.id} delay={(index % 4) * 70}>
            <ProductCard product={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
