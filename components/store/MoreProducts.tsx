// components/store/MoreProducts.tsx
"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { useCombinedProducts } from "@/lib/use-combined-products";

export default function MoreProducts() {
  const { allProducts, isLoaded } = useCombinedProducts();

  // Mostrar del producto 8 en adelante (los que no salen en NewArrivals)
  const productsToShow = allProducts.slice(8, 16);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-[10px] font-bold text-purple-600 tracking-widest uppercase">
              Catálogo de Rendimiento
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Más novedades
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Componentes, monitores, esports, audio y ergonomía para elevar tu
            juego.
          </p>
        </div>

        <Link
          href="/productos"
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 whitespace-nowrap"
        >
          Ver todos los productos →
        </Link>
      </div>

      {/* Grid de productos (hasta 6 columnas) */}
      {isLoaded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {productsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}