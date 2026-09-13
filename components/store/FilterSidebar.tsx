// components/store/FilterSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";

const categorias = [
  { id: "mouse", label: "Mouse Gamer", count: 3 },
  { id: "teclados", label: "Teclados Mecánicos", count: 4 },
  { id: "audifonos", label: "Audífonos", count: 3 },
  { id: "monitores", label: "Monitores", count: 1 },
  { id: "microfonos", label: "Micrófonos", count: 1 },
  { id: "perifericos", label: "Mousepads", count: 2 },
  { id: "accesorios", label: "Accesorios", count: 2 },
];

const marcas = [
  { id: "logitech", label: "Logitech G", count: 4 },
  { id: "razer", label: "Razer", count: 4 },
  { id: "steelseries", label: "SteelSeries", count: 2 },
  { id: "hyperx", label: "HyperX", count: 2 },
  { id: "corsair", label: "Corsair", count: 2 },
  { id: "asus-rog", label: "ASUS ROG", count: 2 },
];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openSections, setOpenSections] = useState({
    categorias: true,
    marcas: true,
    precio: true,
  });

  // Leer estado desde la URL
  const categoriaActiva = searchParams.get("categoria") || "";
  const marcaActiva = searchParams.get("marca") || "";
  const minPrecio = Number(searchParams.get("min") || 0);
  const maxPrecio = Number(searchParams.get("max") || 5000);
  const [priceRange, setPriceRange] = useState({ min: minPrecio, max: maxPrecio });
  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Actualizar la URL con un parámetro nuevo
  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/productos?${params.toString()}`, { scroll: false });
  };

  const toggleCategory = (id: string) => {
    if (categoriaActiva === id) {
      updateParam("categoria", null);
    } else {
      updateParam("categoria", id);
    }
  };

  const toggleBrand = (id: string) => {
    if (marcaActiva === id) {
      updateParam("marca", null);
    } else {
      updateParam("marca", id);
    }
  };

  const applyPriceRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("min", String(priceRange.min));
    params.set("max", String(priceRange.max));
    router.push(`/productos?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.push("/productos", { scroll: false });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Filtros
          </h2>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-purple-600 font-medium hover:underline"
        >
          Resetear
        </button>
      </div>

      {/* Categorías */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection("categorias")}
          className="w-full flex items-center justify-between mb-3"
        >
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Categorías
          </span>
          {openSections.categorias ? (
            <FiChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <FiChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.categorias && (
          <ul className="space-y-2">
            {categorias.map((cat) => (
              <li key={cat.id}>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={categoriaActiva === cat.id}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-purple-600 transition-colors flex-1">
                    {cat.label}
                  </span>
                  <span className="text-xs text-slate-400">({cat.count})</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Marcas */}
      <div className="mb-5 pt-5 border-t border-slate-100">
        <button
          onClick={() => toggleSection("marcas")}
          className="w-full flex items-center justify-between mb-3"
        >
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Marcas
          </span>
          {openSections.marcas ? (
            <FiChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <FiChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.marcas && (
          <ul className="space-y-2">
            {marcas.map((marca) => (
              <li key={marca.id}>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={marcaActiva === marca.id}
                    onChange={() => toggleBrand(marca.id)}
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-purple-600 transition-colors flex-1">
                    {marca.label}
                  </span>
                  <span className="text-xs text-slate-400">({marca.count})</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Precio */}
      <div className="pt-5 border-t border-slate-100">
        <button
          onClick={() => toggleSection("precio")}
          className="w-full flex items-center justify-between mb-4"
        >
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Rango de Precio
          </span>
          {openSections.precio ? (
            <FiChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <FiChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSections.precio && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-slate-100 rounded-lg px-3 py-2">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  Mín
                </p>
                <p className="text-xs font-bold text-slate-900">
                  S/ {priceRange.min}
                </p>
              </div>
              <span className="text-slate-400">—</span>
              <div className="flex-1 bg-slate-100 rounded-lg px-3 py-2">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  Máx
                </p>
                <p className="text-xs font-bold text-slate-900">
                  S/ {priceRange.max}
                </p>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={5000}
              step={50}
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: Number(e.target.value) })
              }
              className="w-full accent-purple-600"
            />
          </div>
        )}
      </div>

      {/* Botón Aplicar */}
      <button
        onClick={applyPriceRange}
        className="w-full mt-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-purple-600 transition-colors uppercase tracking-wider"
      >
        Aplicar filtros
      </button>
    </div>
  );
}