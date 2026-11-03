// components/store/CatalogView.tsx
"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FiChevronDown, FiFilter } from "react-icons/fi";
import FilterSidebar, { type CategoryOption } from "./FilterSidebar";
import ProductsGrid from "./ProductsGrid";
import { useCombinedProducts } from "@/lib/use-combined-products";

const CATEGORY_LABELS: Record<string, string> = {
  mouse: "Mouse",
  teclados: "Teclados",
  audifonos: "Audífonos",
  monitores: "Monitores",
  microfonos: "Micrófonos",
  perifericos: "Mousepads",
  accesorios: "Accesorios",
  notebooks: "Notebooks",
  "sillas-gamer": "Sillas gamer",
  volantes: "Volantes",
  "camaras-web": "Cámaras web",
};

const normalize = (str: string | undefined | null) =>
  (str || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function CatalogView() {
  const searchParams = useSearchParams();
  const { allProducts, isLoaded } = useCombinedProducts();

  const categoriaParam = searchParams.get("categoria");
  const busquedaParam = searchParams.get("q");
  const minParam = searchParams.get("min");
  const maxParam = searchParams.get("max");

  const categories = useMemo<CategoryOption[]>(() => {
    const counts = new Map<string, number>();
    for (const product of allProducts) {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([id, count]) => ({
        id,
        count,
        label:
          CATEGORY_LABELS[id] ??
          id.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()),
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (categoriaParam) {
      const categoriaNorm = normalize(categoriaParam);
      filtered = filtered.filter(
        (product) => normalize(product.category) === categoriaNorm,
      );
    }

    if (busquedaParam && busquedaParam.trim()) {
      const words = normalize(busquedaParam).split(/\s+/).filter(Boolean);
      const matches = (product: (typeof allProducts)[number]) => {
        const searchableText = [
          normalize(product.name),
          normalize(product.sku),
          normalize(product.brand),
          normalize(product.category),
          normalize(product.description),
        ].join(" ");
        return words.every((word) => searchableText.includes(word));
      };

      const strict = filtered.filter(matches);
      filtered =
        strict.length > 0
          ? strict
          : filtered.filter((product) =>
              words.some((word) =>
                [
                  normalize(product.name),
                  normalize(product.sku),
                  normalize(product.brand),
                  normalize(product.category),
                  normalize(product.description),
                ]
                  .join(" ")
                  .includes(word),
              ),
            );
    }

    if (minParam !== null) {
      filtered = filtered.filter((product) => product.price >= Number(minParam));
    }
    if (maxParam !== null) {
      filtered = filtered.filter((product) => product.price <= Number(maxParam));
    }

    return filtered;
  }, [allProducts, categoriaParam, busquedaParam, minParam, maxParam]);

  const activeFilters = [categoriaParam, minParam, maxParam].filter(
    (value) => value !== null && value !== "",
  ).length;

  const categoriaLabel = categoriaParam
    ? (CATEGORY_LABELS[categoriaParam] ??
      categoriaParam.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()))
    : null;

  const grid = (
    <div>
      {busquedaParam && busquedaParam.trim() && (
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Resultados para{" "}
          <span className="text-muted-foreground">“{busquedaParam}”</span>
        </h2>
      )}
      {categoriaLabel && !busquedaParam && (
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          {categoriaLabel}
        </h2>
      )}
      <ProductsGrid products={filteredProducts} isLoaded={isLoaded} />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pb-20 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <FilterSidebar key={`${minParam}-${maxParam}`} categories={categories} />
        </aside>

        <div>
          <details className="group mb-6 rounded-xl bg-card lg:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <FiFilter className="h-4 w-4 text-primary" aria-hidden="true" />
                Filtros
                {activeFilters > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                    {activeFilters}
                  </span>
                )}
              </span>
              <FiChevronDown
                aria-hidden="true"
                className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="px-2 pb-2">
              <FilterSidebar key={`${minParam}-${maxParam}`} categories={categories} />
            </div>
          </details>

          {grid}
        </div>
      </div>
    </div>
  );
}
