// app/(store)/favoritos/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiChevronRight, FiHeart, FiShoppingCart } from "react-icons/fi";
import ProductCard from "@/components/store/ProductCard";
import { newArrivals, moreProducts } from "@/data/products";

const allProducts = [...newArrivals, ...moreProducts];

export default function FavoritosPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavoriteIds(stored);
    };

    loadFavorites();
    window.addEventListener("favoritesChanged", loadFavorites);

    return () => {
      window.removeEventListener("favoritesChanged", loadFavorites);
    };
  }, []);

  const favoriteProducts = allProducts.filter((p) =>
    favoriteIds.includes(p.id)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-5">
        <Link href="/" className="hover:text-purple-600 transition-colors">
          Inicio
        </Link>
        <FiChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium">Mis Favoritos</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FiHeart className="w-5 h-5 fill-red-500 text-red-500" />
            <span className="text-xs font-bold text-purple-600 tracking-widest uppercase">
              Lista de Deseos
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
            Mis Favoritos
          </h1>
          <p className="text-sm text-slate-500">
            {favoriteProducts.length === 0
              ? "Aún no has guardado ningún producto."
              : `${favoriteProducts.length} ${
                  favoriteProducts.length === 1
                    ? "producto guardado"
                    : "productos guardados"
                }`}
          </p>
        </div>

        {favoriteProducts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-wider hover:bg-slate-50 transition">
              Comparar lista
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-purple-700 transition">
              <FiShoppingCart className="w-3.5 h-3.5" />
              Mover todos al carrito
            </button>
          </div>
        )}
      </div>

      {/* Grid de favoritos o vacío */}
      {favoriteProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4">
            <FiHeart className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Tu lista está vacía
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            Explora nuestro catálogo y guarda tus productos favoritos haciendo
            clic en el corazón.
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold text-sm rounded-lg hover:bg-purple-700 transition"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}