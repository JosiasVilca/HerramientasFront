"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Boxes, CheckCircle2, Database, Edit3, FileSpreadsheet, FileText, Layers3, Plus, Trash2, X } from "lucide-react";
import { catalogService } from "@/services/catalog.service";
import { Category, InventoryStats, Product, ProductRequest } from "@/types/catalog";

const pageSize = 20;
const emptyForm: ProductRequest = { sku: "", name: "", slug: "", description: "", price: 0, stock: 0, categoryId: null, imageUrl: "", imageHoverUrl: "", rating: 5, reviewsCount: 0, newProduct: true, active: true };
const money = (value: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [form, setForm] = useState<ProductRequest>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stockStatus, setStockStatus] = useState("ALL");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(() => ({ search: search.trim() || undefined, categoryId: categoryId ? Number(categoryId) : undefined, stockStatus, page, size: pageSize }), [categoryId, page, search, stockStatus]);

  const load = async () => {
    setLoading(true);
    try {
      const [inventory, inventoryStats] = await Promise.all([catalogService.listInventory(filters), catalogService.inventoryStats(filters)]);
      setProducts(inventory.content); setTotalPages(inventory.totalPages); setStats(inventoryStats); setError(null);
    } catch (err) { setError(err instanceof Error ? err.message : "No se pudo cargar el inventario."); }
    finally { setLoading(false); }
  };

  useEffect(() => { void catalogService.listCategories({ activeOnly: true }).then(setCategories).catch(err => setError(err instanceof Error ? err.message : "No se pudieron cargar las categorías.")); }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [filters]);

  const closeModal = () => { setModalOpen(false); setImageFile(null); setEditingId(null); setForm(emptyForm); };
  const edit = (product: Product) => {
    setImageFile(null);
    setEditingId(product.id);
    setForm({ sku: product.sku, name: product.name, slug: product.slug, description: product.description ?? "", price: product.price, stock: product.stock, categoryId: product.categoryId ?? null, imageUrl: product.imageUrl, imageHoverUrl: product.imageHoverUrl ?? "", rating: product.rating ?? 5, reviewsCount: product.reviewsCount ?? 0, newProduct: product.newProduct, active: product.active });
    setModalOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!imageFile && !form.imageUrl?.trim()) return setError("La imagen principal es obligatoria para el backend. Selecciona un archivo o indica una URL de imagen.");
    setSaving(true);
    try {
      const payload = { ...form, sku: form.sku.trim().toUpperCase(), name: form.name.trim(), slug: form.slug?.trim() || undefined, description: form.description?.trim() || undefined, imageUrl: form.imageUrl.trim(), imageHoverUrl: form.imageHoverUrl?.trim() || undefined };
      if (editingId) { await catalogService.updateProduct(editingId, payload, imageFile); setNotice("Producto actualizado correctamente."); }
      else { await catalogService.createProduct(payload, imageFile); setNotice("Producto creado correctamente."); }
      closeModal(); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "No se pudo guardar el producto."); }
    finally { setSaving(false); }
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`¿Eliminar "${product.name}" del catálogo?`)) return;
    try { await catalogService.deleteProduct(product.id); setNotice("Producto eliminado."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "No se pudo eliminar el producto."); }
  };

  const exportFile = async (format: "xlsx" | "pdf") => {
    try {
      const query = new URLSearchParams();
      if (filters.search) query.set("search", filters.search);
      if (filters.categoryId) query.set("categoryId", String(filters.categoryId));
      if (filters.stockStatus !== "ALL") query.set("stockStatus", filters.stockStatus);
      const blob = await catalogService.downloadInventory(format, query);
      const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `inventario.${format}`; anchor.click(); URL.revokeObjectURL(url);
    } catch (err) { setError(err instanceof Error ? err.message : "No se pudo exportar el inventario."); }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-center"><div><span className="text-xs font-bold uppercase tracking-wider text-purple-600">NEXORA STORE // Inventario</span><h1 className="mt-1 text-2xl font-extrabold">Control de inventario</h1><p className="mt-1 text-xs text-muted-foreground">Datos paginados y persistidos en el backend.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => void exportFile("xlsx")} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold"><FileSpreadsheet size={16} /> Excel</button><button onClick={() => void exportFile("pdf")} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold"><FileText size={16} /> PDF</button><button onClick={() => { setImageFile(null); setEditingId(null); setForm(emptyForm); setModalOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white"><Plus size={16} /> Nuevo producto</button></div></header>
      {(notice || error) && <div className={`flex justify-between rounded-lg border p-4 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}><span className="flex items-center gap-2">{error ? <X size={18} /> : <CheckCircle2 size={18} />}{error ?? notice}</span><button onClick={() => { setNotice(null); setError(null); }} aria-label="Cerrar"><X size={16} /></button></div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Kpi icon={<Boxes size={20} />} label="Productos" value={stats?.totalProducts ?? 0} /><Kpi icon={<AlertTriangle size={20} />} label="Stock bajo" value={stats?.lowStockProducts ?? 0} /><Kpi icon={<Database size={20} />} label="Unidades" value={stats?.totalUnits ?? 0} /><Kpi icon={<Layers3 size={20} />} label="Valor inventario" value={money(stats?.totalValue ?? 0)} /></div>
      <section className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row"><input className="flex-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm" placeholder="Buscar por nombre, SKU o slug..." value={search} onChange={e => { setPage(0); setSearch(e.target.value); }} /><select className="rounded-lg border border-input bg-card px-3 py-2 text-sm" value={categoryId} onChange={e => { setPage(0); setCategoryId(e.target.value); }}><option value="">Todas las categorías</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select className="rounded-lg border border-input bg-card px-3 py-2 text-sm" value={stockStatus} onChange={e => { setPage(0); setStockStatus(e.target.value); }}><option value="ALL">Todos los estados</option><option value="OPTIMAL">En stock</option><option value="LOW">Stock bajo</option><option value="OUT">Agotado</option></select></section>
      <section className="overflow-hidden rounded-xl border bg-card"><div className="flex items-center justify-between border-b p-4"><h2 className="font-bold">Productos ({stats?.totalProducts ?? 0})</h2>{loading && <span className="text-xs text-muted-foreground">Cargando...</span>}</div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="px-5 py-3">Producto</th><th className="px-3 py-3">Categoría</th><th className="px-3 py-3">Precio</th><th className="px-3 py-3">Stock</th><th className="px-3 py-3">Estado</th><th className="px-5 py-3 text-right">Acciones</th></tr></thead><tbody className="divide-y">{products.map(product => <tr key={product.id}><td className="px-5 py-3"><div className="flex items-center gap-3">{product.imageUrl && <img src={product.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />}<div><p className="font-semibold">{product.name}</p><p className="font-mono text-xs text-muted-foreground">{product.sku}</p></div></div></td><td className="px-3 py-3">{product.categoryName ?? "Sin categoría"}</td><td className="px-3 py-3 font-semibold">{money(product.price)}</td><td className="px-3 py-3">{product.stock}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${product.stockStatus === "OUT" ? "bg-red-100 text-red-700" : product.stockStatus === "LOW" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{product.stockStatus === "OUT" ? "Agotado" : product.stockStatus === "LOW" ? "Bajo" : "Óptimo"}</span></td><td className="px-5 py-3"><div className="flex justify-end gap-2"><button onClick={() => edit(product)} className="rounded border p-2 text-muted-foreground hover:text-purple-600" title="Editar"><Edit3 size={15} /></button><button onClick={() => void remove(product)} className="rounded border p-2 text-muted-foreground hover:text-destructive" title="Eliminar"><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>{!loading && products.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No hay productos para estos filtros.</p>}<div className="flex items-center justify-between border-t p-4 text-sm"><span>Página {totalPages ? page + 1 : 0} de {totalPages}</span><div className="flex gap-2"><button disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Anterior</button><button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Siguiente</button></div></div></section>
      {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-xl bg-card p-6 shadow-xl"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">{editingId ? "Editar producto" : "Nuevo producto"}</h2><button type="button" onClick={closeModal} aria-label="Cerrar"><X /></button></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Nombre"><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field><Field label="SKU"><input required value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></Field><Field label="Slug (opcional)"><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></Field><Field label="Categoría"><select value={form.categoryId ?? ""} onChange={e => setForm({ ...form, categoryId: e.target.value ? Number(e.target.value) : null })}><option value="">Sin categoría</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field><Field label="Precio"><input required min="0" step="0.01" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} /></Field><Field label="Stock"><input required min="0" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} /></Field><Field label="Imagen principal (URL)"><input required={!imageFile} value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></Field><Field label="Subir imagen"><input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0] ?? null; if (file && (file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/"))) { e.target.value = ""; setImageFile(null); setError("Selecciona una imagen de hasta 10 MB."); return; } setImageFile(file); }} /></Field><Field label="Imagen hover (URL)"><input value={form.imageHoverUrl} onChange={e => setForm({ ...form, imageHoverUrl: e.target.value })} placeholder="https://..." /></Field><Field label="Descripción"><textarea className="min-h-20" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field></div><div className="flex justify-end gap-2"><button type="button" onClick={closeModal} className="rounded-lg border px-4 py-2 text-sm">Cancelar</button><button disabled={saving} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{saving ? "Guardando..." : "Guardar"}</button></div></form></div>}
    </div>
  );
}

function Kpi({ icon, label, value }: { icon: ReactNode; label: string; value: number | string }) {
  return <div className="rounded-xl border bg-card p-4"><div className="mb-3 flex items-center justify-between text-purple-600">{icon}<span className="text-xs text-muted-foreground">{label}</span></div><strong className="text-xl">{value}</strong></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="text-xs font-bold uppercase text-muted-foreground">{label}<div className="mt-2 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-input [&_input]:bg-transparent [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:font-normal [&_input]:text-foreground [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-input [&_select]:bg-card [&_select]:px-3 [&_select]:py-2 [&_select]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-input [&_textarea]:bg-transparent [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm [&_textarea]:font-normal">{children}</div></label>;
}
