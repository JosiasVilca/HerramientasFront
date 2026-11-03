// components/store/ProductsGrid.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import ProductCard from "./ProductCard";
import Reveal from "@/components/ui/reveal";
import type { Product } from "@/data/products";

type ProductsGridProps = {
  products: Product[];
  isLoaded: boolean;
};

export default function ProductsGrid({ products, isLoaded }: ProductsGridProps) {
  const [sortBy, setSortBy] = useState("relevancia");

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "precio-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "precio-desc":
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [products, sortBy]);

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} aria-hidden="true">
            <div className="aspect-square rounded-xl bg-muted" />
            <div className="mt-4 h-3 w-20 rounded bg-muted" />
            <div className="mt-2 h-4 w-full rounded bg-muted" />
            <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="rounded-xl bg-card p-10 text-center">
        <h2 className="text-xl font-semibold text-foreground">Sin resultados</h2>
        <p className="mx-auto mt-2 max-w-md text-base text-muted-foreground">
          No hay productos que coincidan con esta búsqueda o estos filtros.
        </p>
        <Link
          href="/productos"
          className="mt-6 inline-flex min-h-11 items-center text-base font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
        >
          Ver todo el catálogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-base text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">
            {sortedProducts.length}
          </span>{" "}
          {sortedProducts.length === 1 ? "producto" : "productos"}
        </p>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="sr-only sm:not-sr-only">Ordenar por</span>
          <span className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 cursor-pointer appearance-none rounded-lg bg-muted pl-3 pr-9 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
            <FiChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
          </span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
        {sortedProducts.map((product, index) => (
          <Reveal key={product.id} delay={(index % 3) * 70}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
