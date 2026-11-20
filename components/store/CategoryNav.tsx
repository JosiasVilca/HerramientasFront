"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import { categoryService } from "@/services/category.service";
import { mapCategorySlug } from "@/lib/catalog";
import type { Category } from "@/types/catalog";

const featured = [
  { label: "Laptops", value: "notebooks" },
  { label: "Monitores", value: "monitores" },
  { label: "Mouses", value: "mouse" },
  { label: "Teclados", value: "teclados" },
  { label: "Audífonos", value: "audifonos" },
];
const categoryHref = (value: string) => `/productos?categoria=${encodeURIComponent(value)}`;

export default function CategoryNav() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const containerRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    categoryService.list().then(items => {
      if (!cancelled) setCategories(items.filter(item => item.active !== false && item.isActive !== false)
        .sort((a, b) => a.name.localeCompare(b.name, "es")));
    }).catch(() => { if (!cancelled) setFailed(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return <nav aria-label="Categorías" className="relative bg-muted/60">
    <div className="mx-auto max-w-[1400px] px-3 sm:px-5 lg:px-8">
      <ul className="flex flex-wrap items-center justify-center gap-1 py-1.5">
        {featured.map(category => <li key={category.value}>
          <Link href={categoryHref(category.value)} onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 transition-colors hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {category.label}
          </Link>
        </li>)}
        <li ref={containerRef} className="sm:relative" onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
        }}>
          <button ref={buttonRef} type="button" onClick={() => setOpen(value => !value)}
            aria-expanded={open} aria-controls="store-all-categories"
            className="flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-base font-semibold text-foreground transition-colors hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Más <FiChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && <div id="store-all-categories" className="absolute left-1/2 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            <p className="border-b border-border px-4 py-3 text-sm font-semibold text-muted-foreground">Todas las categorías</p>
            <div className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
              {loading ? <p role="status" className="px-2 py-3 text-sm text-muted-foreground">Cargando categorías...</p>
                : failed ? <p role="status" className="px-2 py-3 text-sm text-muted-foreground">No se pudieron cargar las categorías.</p>
                : categories.length === 0 ? <p className="px-2 py-3 text-sm text-muted-foreground">Aún no hay categorías disponibles.</p>
                : <ul>{categories.map(category => <li key={category.id}>
                  <Link href={categoryHref(mapCategorySlug(category.name))} onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-base text-foreground transition-colors hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {category.name}
                  </Link>
                </li>)}</ul>}
            </div>
            <Link href="/productos" onClick={() => setOpen(false)} className="block border-t border-border px-4 py-3 text-sm font-semibold text-primary hover:bg-accent">Ver todo el catálogo</Link>
          </div>}
        </li>
      </ul>
    </div>
  </nav>;
}
