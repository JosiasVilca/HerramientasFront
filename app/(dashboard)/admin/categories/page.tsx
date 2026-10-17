"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Layers3,
  Loader2,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types/catalog";

type Notice = { text: string; tone: "success" | "error" };

function normalizeCategory(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function messageFrom(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await categoryService.list());
    } catch (error) {
      setNotice({ text: messageFrom(error, "No se pudieron cargar las categorías."), tone: "error" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Diferido con microtask para no llamar a setState de forma síncrona
    // dentro del efecto (convención usada en el resto del panel).
    queueMicrotask(() => {
      void loadCategories();
    });
  }, [loadCategories]);

  const resetForm = () => {
    setEditingId(null);
    setCategoryName("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = normalizeCategory(categoryName);

    if (!normalizedName) {
      setNotice({ text: "Escribe un nombre para registrar la categoría.", tone: "error" });
      return;
    }

    const duplicated = categories.some(
      (category) =>
        category.id !== editingId &&
        category.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase(),
    );
    if (duplicated) {
      setNotice({ text: "Ya existe una categoría con ese nombre.", tone: "error" });
      return;
    }

    setIsSaving(true);
    try {
      if (editingId != null) {
        await categoryService.update(editingId, { name: normalizedName });
        setNotice({ text: `Categoría actualizada a "${normalizedName}".`, tone: "success" });
      } else {
        await categoryService.create({ name: normalizedName });
        setNotice({ text: `Categoría "${normalizedName}" registrada correctamente.`, tone: "success" });
      }
      resetForm();
      await loadCategories();
    } catch (error) {
      setNotice({ text: messageFrom(error, "No se pudo guardar la categoría."), tone: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setCategoryName(category.name);
    setNotice(null);
  };

  const deleteCategory = async (category: Category) => {
    if (!window.confirm(`¿Eliminar la categoría "${category.name}"?`)) return;

    try {
      await categoryService.remove(category.id);
      if (editingId === category.id) resetForm();
      setNotice({ text: `Categoría "${category.name}" eliminada.`, tone: "success" });
      await loadCategories();
    } catch (error) {
      setNotice({ text: messageFrom(error, "No se pudo eliminar la categoría."), tone: "error" });
    }
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
        <div
          className={`flex items-center justify-between gap-3 rounded-lg border p-4 text-xs font-medium shadow-2xs ${
            notice.tone === "success"
              ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          <span className="flex items-center gap-2.5">
            {notice.tone === "success" ? (
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle size={18} className="shrink-0" />
            )}
            <span>{notice.text}</span>
          </span>
          <button
            onClick={() => setNotice(null)}
            className="cursor-pointer opacity-70 hover:opacity-100"
            aria-label="Cerrar notificación"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Formulario de Registro/Edición */}
      <section className="rounded-xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs">
        <div className="mb-6 flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            <Tag size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              {editingId != null ? "Editar Categoría Existente" : "Registrar Nueva Categoría"}
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
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-purple-700 cursor-pointer h-10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : editingId != null ? <Edit3 size={16} /> : <Plus size={16} />}
            {editingId != null ? "Guardar Cambios" : "Agregar Categoría"}
          </button>
          {editingId != null && (
            <button
              type="button"
              onClick={resetForm}
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

        {isLoading ? (
          <div className="flex min-h-32 flex-col items-center justify-center gap-3 py-8 text-center">
            <Loader2 size={32} className="animate-spin text-purple-600" />
            <p className="text-xs text-muted-foreground">Cargando categorías desde la base de datos…</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex min-h-32 flex-col items-center justify-center gap-2 py-8 text-center">
            <Layers3 size={36} className="text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">Todavía no hay categorías registradas.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 p-3.5 text-sm font-semibold text-foreground hover:border-purple-400 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="block truncate">{category.name}</span>
                    <span className="block truncate font-mono text-[10px] font-normal text-muted-foreground">
                      {category.slug}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEditing(category)}
                    className="rounded-md p-1.5 text-muted-foreground hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-950/40 transition cursor-pointer"
                    aria-label={`Editar categoría ${category.name}`}
                    title="Editar categoría"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category)}
                    className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                    aria-label={`Eliminar categoría ${category.name}`}
                    title="Eliminar categoría"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
