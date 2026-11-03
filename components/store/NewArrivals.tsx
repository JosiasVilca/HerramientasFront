// components/store/NewArrivals.tsx
"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import Reveal from "@/components/ui/reveal";
import { useCombinedProducts } from "@/lib/use-combined-products";

export default function NewArrivals() {
  const { allProducts, isLoaded } = useCombinedProducts();

  // En la portada solo se muestran productos con precio; el catálogo conserva
  // los que están pendientes de precio para consulta.
  const conPrecio = allProducts.filter((product) => product.price > 0);
  const catalogo = conPrecio.length > 0 ? conPrecio : allProducts;

  // Mostrar solo los primeros 8 productos
  const productsToShow = catalogo.slice(0, 8);

  return (
    <section className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
            Nuevos ingresos
          </h2>
          <p className="mt-2 max-w-lg text-base text-muted-foreground">
            Lo último en periféricos y audio, disponible desde hoy en NEXORA.
          </p>
        </div>

        <Link
          href="/productos"
          className="inline-flex min-h-11 items-center whitespace-nowrap text-base font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
        >
          Ver todo el catálogo
        </Link>
      </Reveal>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
        {isLoaded
          ? productsToShow.map((product, index) => (
              <Reveal key={product.id} delay={(index % 4) * 70}>
                <ProductCard product={product} />
              </Reveal>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} aria-hidden="true">
                <div className="aspect-square rounded-xl bg-muted" />
                <div className="mt-4 h-3 w-20 rounded bg-muted" />
                <div className="mt-2 h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
              </div>
            ))}
      </div>
    </section>
  );
}
