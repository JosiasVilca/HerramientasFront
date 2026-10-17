"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ChevronDown,
  Database,
  Edit3,
  FileSpreadsheet,
  FileText,
  Layers3,
  Loader2,
  PackagePlus,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import type { ApiProduct, Category } from "@/types/catalog";

const LOW_STOCK_LIMIT = 10;

type Notice = { text: string; tone: "success" | "error" };

type ProductForm = {
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  stock: number;
  description: string;
};

const EMPTY_FORM: ProductForm = {
  name: "",
  sku: "",
  categoryId: "",
  price: 0,
  stock: 0,
  description: "",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function messageFrom(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  // `isLoading` arranca en `true`; el estado se libera dentro del callback
  // asíncrono, sin provocar renders en cascada desde el efecto.
  const loadData = useCallback(async () => {
    try {
      const [items, cats] = await Promise.all([
        productService.listAll(),
        categoryService.list(),
      ]);
      setProducts(items);
      setCategories(cats);
    } catch (error) {
      setNotice({
        text: messageFrom(
          error,
          "No se pudo cargar el inventario. Verifica que iniciaste sesión como administrador.",
        ),
        tone: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Diferido con microtask para no llamar a setState de forma síncrona
    // dentro del efecto (convención usada en el resto del panel).
    queueMicrotask(() => {
      void loadData();
    });
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !query ||
        [product.name, product.sku, product.categoryName, product.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesCategory =
        categoryFilter === "ALL" || String(product.categoryId) === categoryFilter;
      const matchesStock =
        stockFilter === "ALL" ||
        (stockFilter === "OPTIMAL" && product.stock > LOW_STOCK_LIMIT) ||
        (stockFilter === "LOW" &&
          product.stock > 0 &&
          product.stock <= LOW_STOCK_LIMIT) ||
        (stockFilter === "OUT" && product.stock === 0);
      return matchesQuery && matchesCategory && matchesStock;
    });
  }, [categoryFilter, products, search, stockFilter]);

  const totalValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  );
  const totalUnits = products.reduce((total, product) => total + product.stock, 0);
  const lowStock = products.filter((product) => product.stock <= LOW_STOCK_LIMIT).length;

  const openCreateDrawer = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0] ? String(categories[0].id) : "" });
    setImageFile(null);
    setImagePreview(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (product: ApiProduct) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId != null ? String(product.categoryId) : "",
      price: product.price,
      stock: product.stock,
      description: product.description || "",
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || null);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setNotice({ text: "La imagen no debe superar los 2MB.", tone: "error" });
      return;
    }
    if (!file.type.startsWith("image/")) {
      setNotice({ text: "Solo se permiten archivos de imagen.", tone: "error" });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const categoryId = form.categoryId ? Number(form.categoryId) : null;
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name || categoryId == null) {
      setNotice({ text: "Completa el nombre y la categoría para guardar el producto.", tone: "error" });
      return;
    }
    if (price < 0 || stock < 0) {
      setNotice({ text: "El precio y el stock no pueden ser negativos.", tone: "error" });
      return;
    }
    if (!editingId && !imageFile) {
      setNotice({ text: "La imagen del producto es obligatoria al registrarlo.", tone: "error" });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        sku: form.sku.trim() || undefined,
        description: form.description.trim(),
        price,
        stock,
        categoryId,
        file: imageFile,
      };

      if (editingId) {
        await productService.update(editingId, payload);
        setNotice({ text: "Producto actualizado y guardado en la base de datos.", tone: "success" });
      } else {
        await productService.create(payload);
        setNotice({ text: "Producto registrado y guardado en la base de datos.", tone: "success" });
      }
      closeDrawer();
      await loadData();
    } catch (error) {
      setNotice({ text: messageFrom(error, "No se pudo guardar el producto."), tone: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (product: ApiProduct) => {
    if (!window.confirm(`¿Eliminar "${product.name}" del catálogo?`)) return;

    try {
      await productService.remove(product.id);
      setNotice({ text: `"${product.name}" se eliminó del catálogo.`, tone: "success" });
      await loadData();
    } catch (error) {
      setNotice({ text: messageFrom(error, "No se pudo eliminar el producto."), tone: "error" });
    }
  };

  const categoryOptions: string[][] = [
    ["ALL", "Todas las categorías"],
    ...categories.map((category) => [String(category.id), category.name]),
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
            NEXORA STORE // Panel de Inventario
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Control Matriz de Periféricos &amp; Stock
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Catálogo unificado de periféricos gaming, accesorios y hardware de NEXORA Store Perú.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
          >
            <FileSpreadsheet size={16} className="text-emerald-600" />
            <span>Exportar Excel</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
          >
            <FileText size={16} className="text-purple-600 dark:text-purple-400" />
            <span>Exportar PDF</span>
          </button>
          <button
            onClick={openCreateDrawer}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-purple-700 transition shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Nuevo Producto</span>
          </button>
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

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Productos Registrados"
          value={products.length}
          detail="Catálogo NEXORA"
          icon={<Boxes size={20} />}
          tone="primary"
        />
        <KpiCard
          label="Alertas Stock Bajo"
          value={lowStock}
          detail="Límite ≤10 unidades"
          icon={<AlertTriangle size={20} />}
          tone="warning"
        />
        <KpiCard
          label="Valoración Total"
          value={formatCurrency(totalValue)}
          detail={`${totalUnits} unidades en inventario`}
          icon={<Database size={20} />}
          tone="success"
        />
        <KpiCard
          label="Categorías Activas"
          value={categories.length}
          detail={categories.length ? categories.map((c) => c.name).join(" • ") : "Sin categorías"}
          icon={<Layers3 size={20} />}
          tone="accent"
        />
      </div>

      {/* Search & Filters Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-4 md:flex-row shadow-2xs">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por periférico, SKU o categoría..."
            className="w-full rounded-lg border border-input bg-transparent py-2 pl-9 pr-4 text-xs text-foreground outline-none transition placeholder:text-muted-foreground focus:border-purple-600 focus:ring-3 focus:ring-purple-500/20"
          />
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-3 md:w-auto">
          <FilterSelect label="Categoría" value={categoryFilter} onChange={setCategoryFilter} options={categoryOptions} />
          <FilterSelect
            label="Estado"
            value={stockFilter}
            onChange={setStockFilter}
            options={[
              ["ALL", "Todos los estados"],
              ["OPTIMAL", "En stock (>10)"],
              ["LOW", "Stock bajo (1-10)"],
              ["OUT", "Agotado (0)"],
            ]}
          />
        </div>
      </div>

      {/* Main Inventory Table */}
      <section className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Catálogo NEXORA</h2>
            <span className="text-xs text-muted-foreground font-medium">
              ({filteredProducts.length} de {products.length})
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Conectado a PostgreSQL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-border/60 bg-muted/20 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3.5">SKU &amp; Periférico</th>
                <th className="px-4 py-3.5">Categoría</th>
                <th className="px-4 py-3.5">Precio Oficial</th>
                <th className="px-4 py-3.5">Stock Disponible</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-4 py-3.5">Última Modificación</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-xs">
              {filteredProducts.map((product) => {
                const status =
                  product.stock === 0
                    ? "Agotado"
                    : product.stock <= LOW_STOCK_LIMIT
                      ? "Stock bajo"
                      : "En stock";
                const statusClass =
                  product.stock === 0
                    ? "text-destructive border-destructive/30 bg-destructive/10"
                    : product.stock <= LOW_STOCK_LIMIT
                      ? "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-50 dark:bg-amber-950/40"
                      : "text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40";
                return (
                  <tr key={product.id} className="group transition hover:bg-muted/40">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                            <PackagePlus size={18} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="block max-w-[280px] truncate font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400">
                            {product.name}
                          </span>
                          <span className="mt-0.5 block font-mono text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">
                            {product.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-foreground">
                        {product.categoryName || "Sin categoría"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-foreground">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`font-bold ${
                            product.stock <= LOW_STOCK_LIMIT ? "text-amber-600 dark:text-amber-400" : "text-foreground"
                          }`}
                        >
                          {product.stock} uds
                        </span>
                        <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              product.stock <= LOW_STOCK_LIMIT ? "bg-amber-500" : "bg-purple-600"
                            }`}
                            style={{ width: `${Math.min(product.stock * 2, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusClass}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[11px] text-muted-foreground">{formatDate(product.updatedAt)}</td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEditDrawer(product)}
                          className="rounded-md border border-border bg-card p-1.5 text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition cursor-pointer"
                          title="Editar producto"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => deleteProduct(product)}
                          className="rounded-md border border-border bg-card p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                          title="Eliminar producto"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {isLoading ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 text-center py-12">
              <Loader2 size={36} className="animate-spin text-purple-600" />
              <p className="text-xs text-muted-foreground">Cargando catálogo desde la base de datos…</p>
            </div>
          ) : (
            filteredProducts.length === 0 && (
              <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 text-center py-12">
                <Boxes size={42} className="text-muted-foreground/50" />
                <h3 className="text-sm font-bold uppercase text-foreground">
                  {products.length ? "Sin resultados para esta búsqueda" : "Inventario sin productos"}
                </h3>
                <p className="max-w-md text-xs text-muted-foreground">
                  {products.length
                    ? "Prueba cambiando las palabras clave o los filtros de categoría."
                    : "Registra tu primer periférico para comenzar a gestionar el catálogo."}
                </p>
                {!products.length && (
                  <button
                    onClick={openCreateDrawer}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                  >
                    <Plus size={16} /> Registrar Primer Producto
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </section>

      {/* Drawer / Modal para Crear y Editar */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          <button className="absolute inset-0 cursor-default" onClick={closeDrawer} aria-label="Cerrar formulario" />
          <div className="relative z-10 flex h-auto max-h-[90vh] w-full max-w-xl flex-col rounded-xl border border-border bg-card shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-6 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                  NEXORA STORE // Panel Admin
                </p>
                <h2 id="drawer-title" className="mt-0.5 text-base font-bold text-foreground">
                  {editingId ? "Editar Periférico NEXORA" : "Registrar Nuevo Periférico"}
                </h2>
              </div>
              <button onClick={closeDrawer} className="rounded-lg p-1 text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex-1 space-y-4 p-6 text-xs">
                <Field label="Nombre del periférico">
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Ej. Teclado Gamer Hall Effect NX-80 Pro"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Código SKU (opcional, se autogenera)">
                    <input
                      value={form.sku}
                      onChange={(event) => setForm({ ...form, sku: event.target.value })}
                      placeholder="NX-KB-0001"
                    />
                  </Field>
                  <Field label="Categoría">
                    <select
                      required
                      value={form.categoryId}
                      onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                    >
                      <option value="" disabled>
                        Selecciona una categoría
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={String(category.id)}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Precio Oficial (PEN S/)">
                    <input
                      required
                      min="0"
                      step="0.01"
                      type="number"
                      value={form.price}
                      onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
                    />
                  </Field>
                  <Field label="Stock Disponible">
                    <input
                      required
                      min="0"
                      step="1"
                      type="number"
                      value={form.stock}
                      onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })}
                    />
                  </Field>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Imagen del Producto {editingId ? "(opcional: reemplaza la actual)" : ""}
                  </span>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border">
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white cursor-pointer"
                          aria-label="Eliminar imagen"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 transition">
                      <PackagePlus size={16} />
                      {imagePreview ? "Cambiar Imagen" : "Subir Imagen"}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <Field label="Descripción General (Opcional)">
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    placeholder="Características técnicas, conectividad, tipo de switches, sensores..."
                  />
                </Field>
              </div>

              <div className="flex gap-3 border-t border-border/80 bg-muted/30 p-4 justify-end">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-purple-700 cursor-pointer shadow-xs disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  {editingId ? "Guardar Cambios" : "Registrar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  detail,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
  tone: "primary" | "warning" | "success" | "accent";
}) {
  const styles = {
    primary: "text-primary border-primary/20 bg-primary/10",
    warning: "text-[#9d4300] border-[#9d4300]/20 bg-[#9d4300]/10",
    success: "text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40",
    accent: "text-accent-foreground border-accent-foreground/20 bg-accent",
  };
  return (
    <div className="rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${styles[tone]}`}>{icon}</div>
      </div>
      <div className={`mt-3 text-2xl font-extrabold text-foreground`}>{value}</div>
      <div className="mt-1 truncate text-xs text-muted-foreground" title={detail}>
        {detail}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
      {label}:
      <span className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="appearance-none rounded-lg border border-input bg-transparent py-1.5 pl-3 pr-7 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
        >
          {options.map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </span>
    </label>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children && (
        <div className="[&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-input [&_input]:bg-transparent [&_input]:px-3 [&_input]:py-2 [&_input]:text-xs [&_input]:text-foreground [&_input]:outline-none [&_input]:placeholder:text-muted-foreground [&_input]:focus:border-primary [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-input [&_select]:bg-transparent [&_select]:px-3 [&_select]:py-2 [&_select]:text-xs [&_select]:text-foreground [&_select]:outline-none [&_select]:focus:border-primary [&_textarea]:w-full [&_textarea]:resize-none [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-input [&_textarea]:bg-transparent [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-xs [&_textarea]:text-foreground [&_textarea]:outline-none [&_textarea]:placeholder:text-muted-foreground [&_textarea]:focus:border-primary">
          {children}
        </div>
      )}
    </label>
  );
}
