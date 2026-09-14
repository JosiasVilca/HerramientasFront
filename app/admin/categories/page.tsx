"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Edit3,
  Gamepad2,
  Layers3,
  Menu,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";

const STORAGE_KEY = "ecostore_categories";
const DEFAULT_CATEGORIES = ["Teclados", "Ratones", "Monitores"];

function normalizeCategory(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [categoryName, setCategoryName] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [today, setToday] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setToday(new Date().toLocaleDateString());
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (
            Array.isArray(parsed) &&
            parsed.every((category): category is string => typeof category === "string")
          ) {
            setCategories(parsed);
          }
        }
      } catch (error) {
        console.error("No se pudieron leer las categorías locales:", error);
        setNotice("No fue posible leer las categorías guardadas en este navegador.");
      } finally {
        setHydrated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("No se pudieron sincronizar las categorías locales:", error);
      queueMicrotask(() =>
        setNotice("No fue posible sincronizar las categorías con LocalStorage."),
      );
    }
  }, [categories, hydrated]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = normalizeCategory(categoryName);

    if (!normalizedName) {
      setNotice("Escribe un nombre para registrar la categoría.");
      return;
    }

    if (
      categories.some(
        (category) =>
          category !== editingCategory &&
          category.toLocaleLowerCase() === normalizedName.toLocaleLowerCase(),
      )
    ) {
      setNotice("Ya existe una categoría con ese nombre.");
      return;
    }

    if (editingCategory) {
      setCategories((current) =>
        current.map((category) =>
          category === editingCategory ? normalizedName : category,
        ),
      );
      setNotice(`Categoría actualizada a "${normalizedName}".`);
    } else {
      setCategories((current) => [...current, normalizedName]);
      setNotice(`Categoría "${normalizedName}" registrada correctamente.`);
    }
    setCategoryName("");
    setEditingCategory(null);
  };

  const startEditing = (category: string) => {
    setEditingCategory(category);
    setCategoryName(category);
    setNotice(null);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setCategoryName("");
  };

  const deleteCategory = (category: string) => {
    if (!window.confirm(`¿Eliminar la categoría "${category}"?`)) return;

    setCategories((current) => current.filter((item) => item !== category));
    if (editingCategory === category) {
      cancelEditing();
    }
    setNotice(`Categoría "${category}" eliminada.`);
  };

  return (
    <div className="min-h-screen bg-[#0c0e16] text-[#e2e1ed] [background-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,217,255,0.07),transparent),radial-gradient(circle_at_100%_100%,rgba(87,27,193,0.08),transparent_40%),linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:100%_100%,100%_100%,36px_36px]">
      <div className="flex min-h-screen">
        <aside
          className={`${isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"} fixed inset-y-0 left-0 z-20 flex shrink-0 flex-col justify-between overflow-hidden border-r border-[#242d32]/70 bg-[#161822] transition-all lg:static lg:translate-x-0`}
        >
          <div>
            <div className="flex h-20 items-center gap-3 border-b border-[#242d32]/70 bg-gradient-to-r from-[#161822] to-[#1e1f28] px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00d9ff] to-[#571bc1] text-[#00d9ff] shadow-[0_0_12px_-2px_rgba(0,217,255,0.45)]">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#0c0e16]">
                  <Gamepad2 size={22} />
                </div>
              </div>
              <div>
                <div className="font-mono text-lg font-extrabold tracking-tight text-white">NEXORA</div>
                <span className="font-mono text-[9px] tracking-widest text-[#859398]">Simplemente los mejores</span>
              </div>
            </div>

            <nav className="mt-3 space-y-1 p-3">
              <div className="px-3 pb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#859398]">
                Control de Mando
              </div>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-[#859398] transition hover:bg-[#1e1f28] hover:text-white" href="/admin/inventory">
                <Archive size={18} /> Dashboard Matriz
              </a>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-[#859398] transition hover:bg-[#1e1f28] hover:text-white" href="/admin/inventory">
                <Layers3 size={18} /> Inventario &amp; CRUD
              </a>
              <a className="flex items-center gap-3 rounded-lg border border-[#00d9ff]/30 bg-[#00d9ff]/10 px-3 py-2.5 text-xs font-bold text-[#00d9ff] shadow-[0_0_12px_-2px_rgba(0,217,255,0.45)]" href="/admin/categories">
                <Layers3 size={18} /> Catálogos y categorías
              </a>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-[#859398] transition hover:bg-[#1e1f28] hover:text-white" href="/tracking-list">
                <Layers3 size={18} /> Seguimiento de Envíos
              </a>
            </nav>
          </div>
          <div className="border-t border-[#242d32]/70 p-4 font-mono text-[10px] text-[#859398]">
            <div className="mb-2 flex items-center gap-2 text-[#58ffa1]">
              <CheckCircle2 size={13} /> Logeado como administrador
            </div>
            <div>{today || "..."}</div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#242d32]/70 bg-[#161822]/90 px-4 py-5 backdrop-blur-md sm:px-8">
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg border border-[#242d32] p-2 text-[#859398] transition hover:border-[#00d9ff]/50 hover:text-[#00d9ff]"
                onClick={() => setIsSidebarOpen((open) => !open)}
                aria-label={isSidebarOpen ? "Ocultar navegación" : "Mostrar navegación"}
              >
                <Menu size={18} />
              </button>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#859398]">
                  Administración
                </p>
                <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                  Nuevas categorías
                </h1>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1100px] space-y-6 p-4 sm:p-8">
            {notice && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#58ffa1]/40 bg-[#58ffa1]/10 p-4 font-mono text-xs text-[#58ffa1]">
                <span className="flex items-center gap-3">
                  <CheckCircle2 size={19} /> {notice}
                </span>
                <button onClick={() => setNotice(null)} aria-label="Cerrar notificación">
                  <X size={16} />
                </button>
              </div>
            )}

            <section className="rounded-xl border border-[#242d32] bg-[#161822] p-5 sm:p-7">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#00d9ff]/40 bg-[#00d9ff]/10 text-[#00d9ff]">
                  <Tag size={24} />
                </div>
                <div>
                  <h2 className="font-mono text-lg font-bold uppercase tracking-wide text-white">
                    Registrar categoría
                  </h2>
                  <p className="mt-1 text-sm text-[#859398]">
                    Crea una categoría para organizar los productos de NEXORA.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex-1 font-mono text-xs font-bold uppercase tracking-wider text-[#859398]">
                  Nombre de la categoría
                  <input
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    placeholder="Ej. Accesorios"
                    maxLength={50}
                    className="mt-2 w-full rounded-lg border border-[#242d32] bg-[#1e1f28] px-4 py-3 text-sm font-normal normal-case tracking-normal text-white outline-none transition placeholder:text-[#859398] focus:border-[#00d9ff] focus:ring-1 focus:ring-[#00d9ff]"
                  />
                </label>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#00d9ff] px-5 py-3 font-mono text-xs font-extrabold uppercase tracking-wider text-[#0c0e16] shadow-[0_0_25px_-4px_rgba(0,217,255,0.35)] transition hover:bg-[#58ffa1]"
                >
                  {editingCategory ? <Edit3 size={18} /> : <Plus size={18} />}
                  {editingCategory ? "Guardar cambios" : "Agregar categoría"}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#242d32] bg-[#1e1f28] px-5 py-3 font-mono text-xs font-extrabold uppercase tracking-wider text-[#e2e1ed] transition hover:border-[#ff5449]/60 hover:text-[#ff8d86]"
                  >
                    <X size={18} /> Cancelar
                  </button>
                )}
              </form>
            </section>

            <section className="rounded-xl border border-[#242d32] bg-[#161822] p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-mono text-sm font-bold uppercase tracking-wide text-white">
                    Categorías registradas
                  </h2>
                  <p className="mt-1 text-xs text-[#859398]">
                    {categories.length} {categories.length === 1 ? "categoría disponible" : "categorías disponibles"}
                  </p>
                </div>
                <Layers3 className="text-[#d0bcff]" size={22} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-3 rounded-lg border border-[#242d32] bg-[#1e1f28] px-4 py-3 text-sm text-[#e2e1ed]"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#58ffa1] shadow-[0_0_8px_rgba(88,255,161,0.7)]" />
                    <span className="min-w-0 flex-1 truncate">{category}</span>
                    <button
                      type="button"
                      onClick={() => startEditing(category)}
                      className="rounded-md p-1.5 text-[#859398] transition hover:bg-[#00d9ff]/10 hover:text-[#00d9ff]"
                      aria-label={`Editar categoría ${category}`}
                      title="Editar categoría"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCategory(category)}
                      className="rounded-md p-1.5 text-[#859398] transition hover:bg-[#ff5449]/10 hover:text-[#ff8d86]"
                      aria-label={`Eliminar categoría ${category}`}
                      title="Eliminar categoría"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
