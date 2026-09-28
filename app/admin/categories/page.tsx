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
    <div className="space-y-6">
      {/* Top Banner / Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
            NEXORA STORE // Catálogos
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Gestión de Categorías
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Organiza las familias de productos, periféricos y accesorios de NEXORA Store Perú.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800">
            {categories.length} {categories.length === 1 ? "Categoría Activa" : "Categorías Activas"}
          </span>
        </div>
      </div>

      {notice && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 p-4 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-2xs">
          <span className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </span>
          <button 
            onClick={() => setNotice(null)} 
            className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200 cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Formular de Registro/Edición */}
      <section className="rounded-xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs">
        <div className="mb-6 flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            <Tag size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              {editingCategory ? "Editar Categoría Existente" : "Registrar Nueva Categoría"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Crea o modifica una categoría para agrupar periféricos y artículos en la tienda.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Nombre de la categoría
            <input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Ej. Teclados, Audífonos, Monitores, Sillas Gamer..."
              maxLength={50}
              className="mt-2 w-full rounded-lg border border-input bg-transparent px-3.5 py-2.5 text-sm font-normal normal-case tracking-normal text-foreground outline-none transition placeholder:text-muted-foreground focus:border-purple-600 focus:ring-3 focus:ring-purple-500/20"
            />
          </label>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-purple-700 cursor-pointer h-10"
          >
            {editingCategory ? <Edit3 size={16} /> : <Plus size={16} />}
            {editingCategory ? "Guardar Cambios" : "Agregar Categoría"}
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={cancelEditing}
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted/80 transition cursor-pointer h-10"
            >
              <X size={16} /> Cancelar
            </button>
          )}
        </form>
      </section>

      {/* Lista de Categorías */}
      <section className="rounded-xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Categorías Registradas
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Catálogo activo de familias de productos en NEXORA Store
            </p>
          </div>
          <Layers3 className="text-purple-600 dark:text-purple-400" size={20} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 p-3.5 text-sm font-semibold text-foreground hover:border-purple-400 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                <span className="truncate">{category}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => startEditing(category)}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-950/40 transition cursor-pointer"
                  aria-label={`Editar categoría ${category}`}
                  title="Editar categoría"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(category)}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                  aria-label={`Eliminar categoría ${category}`}
                  title="Eliminar categoría"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


