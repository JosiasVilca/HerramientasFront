// components/store/FilterSidebar.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiChevronDown, FiChevronUp, FiFilter } from "react-icons/fi";

export type CategoryOption = {
  id: string;
  label: string;
  count: number;
};

type FilterSidebarProps = {
  categories: CategoryOption[];
};

export default function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openSections, setOpenSections] = useState({
    categorias: true,
    precio: true,
  });

  const categoriaActiva = searchParams.get("categoria") || "";
  const minPrecio = Number(searchParams.get("min") || 0);
  const maxPrecio = Number(searchParams.get("max") || 5000);
  // La instancia se remonta con `key` cuando cambian los parámetros de precio,
  // así el formulario refleja la URL sin sincronizaciones dentro de un efecto.
  const [priceRange, setPriceRange] = useState({ min: minPrecio, max: maxPrecio });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
    updateParam("categoria", categoriaActiva === id ? null : id);
  };

  const applyPriceRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    const min = Math.max(0, Math.min(priceRange.min, priceRange.max));
    const max = Math.max(priceRange.max, min);
    params.set("min", String(min));
    params.set("max", String(max));
    router.push(`/productos?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.push("/productos", { scroll: false });
  };

  return (
    <div className="rounded-xl bg-card p-5 lg:sticky lg:top-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <FiFilter className="h-4 w-4 text-primary" aria-hidden="true" />
          Filtros
        </h2>
        <button
          onClick={resetFilters}
          className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
        >
          Limpiar
        </button>
      </div>

      <div>
        <button
          onClick={() => toggleSection("categorias")}
          className="flex w-full items-center justify-between py-1 text-left"
          aria-expanded={openSections.categorias}
        >
          <span className="text-base font-semibold text-foreground">Categoría</span>
          {openSections.categorias ? (
            <FiChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <FiChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
        </button>

        {openSections.categorias && (
          <ul className="mt-2 space-y-0.5">
            {categories.map((cat) => (
              <li key={cat.id}>
                <label className="flex min-h-9 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={categoriaActiva === cat.id}
                    onChange={() => toggleCategory(cat.id)}
                    className="h-4 w-4 shrink-0 cursor-pointer accent-primary"
                  />
                  <span className="flex-1 text-base text-foreground/85">
                    {cat.label}
                  </span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {cat.count}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => toggleSection("precio")}
          className="flex w-full items-center justify-between py-1 text-left"
          aria-expanded={openSections.precio}
        >
          <span className="text-base font-semibold text-foreground">Precio</span>
          {openSections.precio ? (
            <FiChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <FiChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
        </button>

        {openSections.precio && (
          <div className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-muted-foreground">
                Mínimo
                <input
                  type="number"
                  min={0}
                  max={5000}
                  step={50}
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: Number(e.target.value) })
                  }
                  className="mt-1 h-10 w-full rounded-lg bg-muted px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
              </label>
              <label className="text-sm text-muted-foreground">
                Máximo
                <input
                  type="number"
                  min={0}
                  max={5000}
                  step={50}
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: Number(e.target.value) })
                  }
                  className="mt-1 h-10 w-full rounded-lg bg-muted px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
              </label>
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
              aria-label="Precio máximo"
              className="mt-4 w-full accent-primary"
            />
          </div>
        )}
      </div>

      <button
        onClick={applyPriceRange}
        className="mt-6 min-h-11 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        Aplicar filtros
      </button>
    </div>
  );
}
