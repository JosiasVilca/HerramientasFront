// components/store/NewArrivals.tsx
"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { useCombinedProducts } from "@/lib/use-combined-products";

export default function NewArrivals() {
  const { allProducts, isLoaded } = useCombinedProducts();

  // Mostrar solo los primeros 8 productos
  const productsToShow = allProducts.slice(0, 8);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">
              Stock Limitado
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Nuevos ingresos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Descubre los últimos periféricos de gama alta que llegaron a NEXORA.
          </p>
        </div>

        <Link
          href="/productos"
          className="text-sm font-semibold text-purple-600 hover:text-purple-700 whitespace-nowrap"
        >
          Explorar novedades →
        </Link>
      </div>

      {/* Grid de productos */}
      {isLoaded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {productsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}