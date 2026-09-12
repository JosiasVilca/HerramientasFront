// components/store/MoreProducts.tsx
import Link from "next/link";
import ProductCard from "./ProductCard";
import { moreProducts } from "@/data/products";

export default function MoreProducts() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-xs font-bold text-purple-600 tracking-widest uppercase">
              Catálogo de Rendimiento
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Más novedades
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Componentes, monitores, esports, audio y ergonomía para elevar tu
            juego.
          </p>
        </div>

        <Link
          href="/productos"
          className="text-sm font-semibold text-purple-600 hover:text-purple-700 whitespace-nowrap"
        >
          Ver todos los productos →
        </Link>
      </div>

      {/* Grid de productos (4 columnas) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {moreProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
