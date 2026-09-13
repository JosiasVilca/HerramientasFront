// components/store/RelatedProducts.tsx
import Link from "next/link";
import ProductCard from "./ProductCard";
import { newArrivals, moreProducts, Product } from "@/data/products";

interface RelatedProductsProps {
  product: Product;
}

export default function RelatedProducts({ product }: RelatedProductsProps) {
  const allProducts = [...newArrivals, ...moreProducts];

  // Filtrar productos de la misma categoría (excluyendo el actual)
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Si no hay suficientes de la misma categoría, rellenar con otros
  const fallback = allProducts
    .filter((p) => p.id !== product.id && !related.includes(p))
    .slice(0, 4 - related.length);

  const finalRelated = [...related, ...fallback].slice(0, 4);

  if (finalRelated.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-bold text-purple-600 tracking-widest uppercase mb-2 block">
            Completa tu battle station
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recomendados con el {product.name}
          </h2>
        </div>
        <Link
          href="/productos"
          className="text-sm font-semibold text-purple-600 hover:text-purple-700 whitespace-nowrap"
        >
          Ver todo el catálogo →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {finalRelated.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
