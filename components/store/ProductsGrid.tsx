// components/store/ProductsGrid.tsx
"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FiGrid, FiList, FiChevronDown } from "react-icons/fi";
import ProductCard from "./ProductCard";
import { useCombinedProducts } from "@/lib/use-combined-products";

// Función para normalizar texto (quitar tildes y minúsculas)
const normalize = (str: string | undefined | null) =>
  (str || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function ProductsGrid() {
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState("populares");

  // ✅ Hook que combina productos hardcodeados + admin
  const { allProducts, isLoaded } = useCombinedProducts();

  // Leer los parámetros de la URL
  const categoriaParam = searchParams.get("categoria");
  const marcaParam = searchParams.get("marca");
  const busquedaParam = searchParams.get("q");
  const minParam = searchParams.get("min");
  const maxParam = searchParams.get("max");

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filtrar por categoría
    if (categoriaParam) {
      const categoriaNorm = normalize(categoriaParam);
      filtered = filtered.filter(
        (p) => normalize(p.category) === categoriaNorm
      );
    }

    // Filtrar por marca
    if (marcaParam) {
      const marcaNorm = normalize(marcaParam);
      filtered = filtered.filter((p) => normalize(p.brand) === marcaNorm);
    }

    // Filtrar por BÚSQUEDA INTELIGENTE
    if (busquedaParam && busquedaParam.trim()) {
      const query = normalize(busquedaParam);
      const words = query.split(/\s+/).filter(Boolean);

      filtered = filtered.filter((p) => {
        const searchableText = [
          normalize(p.name),
          normalize(p.sku),
          normalize(p.brand),
          normalize(p.category),
          normalize(p.description),
        ].join(" ");

        return words.every((word) => searchableText.includes(word));
      });

      if (filtered.length === 0) {
        filtered = allProducts.filter((p) => {
          const searchableText = [
            normalize(p.name),
            normalize(p.sku),
            normalize(p.brand),
            normalize(p.category),
            normalize(p.description),
          ].join(" ");

          return words.some((word) => searchableText.includes(word));
        });
      }
    }

    // Filtrar por precio
    if (minParam) {
      filtered = filtered.filter((p) => p.price >= Number(minParam));
    }
    if (maxParam) {
      filtered = filtered.filter((p) => p.price <= Number(maxParam));
    }

    return filtered;
  }, [allProducts, categoriaParam, marcaParam, busquedaParam, minParam, maxParam]);

  // Ordenar productos
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "precio-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "precio-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "nuevos":
        return sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  return (
    <div>
      {/* Título dinámico según filtro */}
      {busquedaParam && busquedaParam.trim() && (
        <div className="mb-4">
          <p className="text-xs text-slate-500">Resultados para:</p>
          <h2 className="text-lg font-bold text-slate-900">
            &ldquo;{busquedaParam}&rdquo;
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({sortedProducts.length}{" "}
              {sortedProducts.length === 1 ? "resultado" : "resultados"})
            </span>
          </h2>
        </div>
      )}

      {/* Título de categoría */}
      {categoriaParam && !busquedaParam && (
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 capitalize">
            {categoriaParam.replace(/-/g, " ")}
          </h2>
        </div>
      )}

      {/* Barra superior */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500">
            <span className="font-bold text-slate-900">
              {sortedProducts.length}
            </span>{" "}
            {sortedProducts.length === 1
              ? "producto disponible"
              : "productos disponibles"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-100 border border-transparent rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="populares">Más populares</option>
              <option value="nuevos">Más nuevos</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor valorados</option>
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button className="p-1.5 rounded-md bg-white shadow-sm text-purple-600">
              <FiGrid className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600">
              <FiList className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      {!isLoaded ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <p className="text-sm text-slate-500">Cargando productos...</p>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <p className="text-lg font-bold text-slate-900 mb-2">
            No hay productos
          </p>
          <p className="text-sm text-slate-500">
            No encontramos productos con esos filtros. Intenta con otra
            categoría o búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {sortedProducts.length > 0 && (
        <div className="flex items-center justify-center gap-1.5">
          <button
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            disabled
          >
            ‹
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                n === 1
                  ? "bg-purple-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {n}
            </button>
          ))}
          <span className="text-slate-400 px-1 text-xs">...</span>
          <button className="w-9 h-9 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">
            11
          </button>
          <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
            ›
          </button>
        </div>
      )}
    </div>
  );
}