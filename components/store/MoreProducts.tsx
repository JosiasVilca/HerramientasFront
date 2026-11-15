// components/store/MoreProducts.tsx
"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import Reveal from "@/components/ui/reveal";
import { useCombinedProducts } from "@/lib/use-combined-products";

export default function MoreProducts() {
  const { allProducts, isLoaded } = useCombinedProducts();

  // Mismo criterio que la portada: primero los productos con precio real.
  const conPrecio = allProducts.filter((product) => product.price > 0);
  const catalogo = conPrecio.length > 0 ? conPrecio : allProducts;

  // Mostrar del producto 8 en adelante (los que no salen en NewArrivals)
  const productsToShow = catalogo.slice(8, 16);

  // Si el catálogo real no alcanza para una segunda tanda, la sección no se
  // renderiza: un encabezado sin productos se lee como un fallo de carga.
  if (isLoaded && productsToShow.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
            Más para tu setup
          </h2>
          <p className="mt-2 max-w-lg text-base text-muted-foreground">
            Componentes, monitores y ergonomía para completar la estación de
            juego.
          </p>
        </div>

        <Link
          href="/productos"
          className="inline-flex min-h-11 items-center whitespace-nowrap text-base font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
        >
          Ver todos los productos
        </Link>
      </Reveal>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
        {isLoaded &&
          productsToShow.map((product, index) => (
            <Reveal key={product.id} delay={(index % 4) * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
      </div>
    </section>
  );
}
