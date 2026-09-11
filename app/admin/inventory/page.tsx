"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  Boxes,
  CheckCircle2,
  ChevronDown,
  Database,
  Edit3,
  FileSpreadsheet,
  FileText,
  Layers3,
  Menu,
  PackagePlus,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

const STORAGE_KEY = "ecostore_inventory";
const LOW_STOCK_LIMIT = 10;
const PRODUCT_CATEGORIES = ["Teclados", "Ratones", "Monitores"] as const;

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  updatedAt: string;
};

type ProductForm = Omit<Product, "id" | "updatedAt">;

const EMPTY_FORM: ProductForm = {
  name: "",
  sku: "",
  category: "",
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function createId() {
  return `NX-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [notice, setNotice] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setProducts(parsed as Product[]);
          }
        }
      } catch (error) {
        console.error("No se pudo leer el inventario local:", error);
        setNotice("No fue posible leer el inventario guardado en este navegador.");
      } finally {
        setHydrated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("No se pudo sincronizar el inventario local:", error);
      queueMicrotask(() =>
        setNotice("No fue posible sincronizar los cambios con LocalStorage."),
      );
    }
  }, [hydrated, products]);

  const categories = useMemo(
    () =>
      PRODUCT_CATEGORIES.filter((category) =>
        products.some((product) => product.category === category),
      ),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !query ||
        [product.name, product.sku, product.category, product.description]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesCategory =
        categoryFilter === "ALL" || product.category === categoryFilter;
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
    setForm(EMPTY_FORM);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = {
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      category: form.category.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (!normalized.name || !normalized.sku || !normalized.category) {
      setNotice("Completa nombre, SKU y categoría para guardar el producto.");
      return;
    }
    if (normalized.price < 0 || normalized.stock < 0) {
      setNotice("El precio y el stock no pueden ser negativos.");
      return;
    }

    const updatedAt = new Date().toISOString();
    if (editingId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId ? { ...product, ...normalized, updatedAt } : product,
        ),
      );
      setNotice("Producto actualizado y sincronizado en la base de datos");
    } else {
      setProducts((current) => [
        ...current,
        { id: createId(), ...normalized, updatedAt },
      ]);
      setNotice("Producto registrado y sincronizado en la base de datos");
    }
    closeDrawer();
  };

  const deleteProduct = (product: Product) => {
    if (!window.confirm(`¿Eliminar "${product.name}" del inventario local?`)) return;
    setProducts((current) => current.filter((item) => item.id !== product.id));
    setNotice("Producto eliminado del inventario local.");
  };

  return (
    <div className="min-h-screen bg-[#0c0e16] text-[#e2e1ed] [background-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,217,255,0.07),transparent),radial-gradient(circle_at_100%_100%,rgba(87,27,193,0.08),transparent_40%),linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:100%_100%,100%_100%,36px_36px,36px_36px]">
      <div className="flex min-h-screen">
        <aside
          className={`${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-20 flex w-64 shrink-0 flex-col justify-between border-r border-[#242d32]/70 bg-[#161822] transition-transform lg:static lg:translate-x-0`}
        >
          <div>
            <div className="flex h-20 items-center gap-3 border-b border-[#242d32]/70 bg-gradient-to-r from-[#161822] to-[#1e1f28] px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00d9ff] to-[#571bc1] text-[#00d9ff] shadow-[0_0_12px_-2px_rgba(0,217,255,0.45)]">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#0c0e16]">
                  <Boxes size={22} />
                </div>
              </div>
              <div>
                <div className="font-mono text-lg font-extrabold tracking-tight text-white">NEXORA</div>
                <span className="font-mono text-[9px] tracking-widest text-[#859398]">Simplemente los mejores</span>
              </div>
            </div>

            <nav className="mt-3 space-y-1 p-3">
              <div className="px-3 pb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#859398]">Control de Mando</div>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-[#859398] transition hover:bg-[#1e1f28] hover:text-white" href="/admin">
                <Archive size={18} /> Dashboard Matriz
              </a>
              <a className="flex items-center gap-3 rounded-lg border border-[#00d9ff]/30 bg-[#00d9ff]/10 px-3 py-2.5 text-xs font-bold text-[#00d9ff] shadow-[0_0_12px_-2px_rgba(0,217,255,0.45)]" href="/admin/inventory">
                <Boxes size={18} /> Inventario &amp; CRUD
              </a>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-[#859398] transition hover:bg-[#1e1f28] hover:text-white" href="/admin/categories">
                <Layers3 size={18} /> Catálogos y categorías
              </a>
            </nav>
          </div>
          <div className="border-t border-[#242d32]/70 p-4 font-mono text-[10px] text-[#859398]">
            <div className="mb-2 flex items-center gap-2 text-[#58ffa1]"><CheckCircle2 size={13} /> Logeado como adminstrador</div>
            <div> { new Date().toLocaleDateString() } </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#242d32]/70 bg-[#161822]/90 px-4 py-5 backdrop-blur-md sm:px-8">
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-[#242d32] p-2 text-[#859398] lg:hidden" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Abrir navegación">
                <Menu size={18} />
              </button>
              <div>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">Gestión de Inventario (CRUD)</h1>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="flex items-center gap-2 rounded-lg border border-[#242d32] bg-[#1e1f28] px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#e2e1ed] transition hover:border-[#00d9ff]/50 hover:text-[#00d9ff]">
                <FileSpreadsheet size={16} /> <span>EXPORTAR EXCEL</span>
              </button>
              <button type="button" className="flex items-center gap-2 rounded-lg border border-[#242d32] bg-[#1e1f28] px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#e2e1ed] transition hover:border-[#d0bcff]/50 hover:text-[#d0bcff]">
                <FileText size={16} /> <span>EXPORTAR PDF</span>
              </button>
              <button onClick={openCreateDrawer} className="flex items-center gap-2 rounded-lg bg-[#00d9ff] px-4 py-2.5 font-mono text-xs font-extrabold uppercase tracking-wider text-[#0c0e16] shadow-[0_0_25px_-4px_rgba(0,217,255,0.35)] transition hover:bg-[#58ffa1]">
                <Plus size={18} /> Registrar periférico
              </button>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1550px] space-y-6 p-4 sm:p-8">
            {notice && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#58ffa1]/40 bg-[#58ffa1]/10 p-4 font-mono text-xs text-[#58ffa1]">
                <span className="flex items-center gap-3"><CheckCircle2 size={19} /> {notice}</span>
                <button onClick={() => setNotice(null)} aria-label="Cerrar notificación"><X size={16} /></button>
              </div>
            )}

            <div className="relative overflow-hidden rounded-xl border border-[#242d32] bg-gradient-to-r from-[#1e1f28] via-[#161822] to-[#1e1f28] p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#00d9ff]/40 bg-[#00d9ff]/10 text-[#00d9ff]"><Database size={24} /></div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold uppercase tracking-wide text-white">Estadisticas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard label="Productos totales" value={products.length} detail="Persistidos en local" icon={<Boxes size={20} />} tone="cyan" />
              <KpiCard label="Stock bajo / alertas" value={lowStock} detail="Requiere reposición" icon={<AlertTriangle size={20} />} tone="amber" />
              <KpiCard label="Valor de inventario" value={formatCurrency(totalValue)} detail={`${totalUnits} unidades registradas`} icon={<Database size={20} />} tone="green" />
              <KpiCard label="Categorías activas" value={categories.length} detail={categories.length ? categories.join(" • ") : "Sin categorías"} icon={<Layers3 size={20} />} tone="purple" />
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-[#242d32] bg-[#161822] p-4 md:flex-row">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#859398]" size={18} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, SKU o categoría..." className="w-full rounded-lg border border-[#242d32] bg-[#1e1f28] py-2.5 pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-[#859398] focus:border-[#00d9ff] focus:ring-1 focus:ring-[#00d9ff]" />
              </div>
              <div className="flex w-full flex-wrap items-center justify-end gap-3 md:w-auto">
                <FilterSelect label="Categoría" value={categoryFilter} onChange={setCategoryFilter} options={[["ALL", "Todas las categorías"], ...PRODUCT_CATEGORIES.map((category) => [category, category])]} />
                <FilterSelect label="Estado" value={stockFilter} onChange={setStockFilter} options={[["ALL", "Todos los estados"], ["OPTIMAL", "En stock (>10)"], ["LOW", "Stock bajo (1-10)"], ["OUT", "Agotado (0)"]]} />
              </div>
            </div>

            <section className="overflow-hidden rounded-xl border border-[#242d32] bg-[#161822] shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242d32]/70 bg-[#1e1f28]/50 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#00d9ff] shadow-[0_0_12px_-2px_rgba(0,217,255,0.45)]" />
                  <h2 className="font-mono text-sm font-bold uppercase tracking-wide text-white">Catálogo Total</h2>
                  <span className="font-mono text-xs text-[#859398]">({filteredProducts.length} de {products.length})</span>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-xs text-[#58ffa1]"><span className="h-2 w-2 rounded-full bg-[#58ffa1]" /> Sincronización activa</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="border-b border-[#242d32]/60 bg-[#1e1f28]/80 font-mono text-[11px] uppercase tracking-wider text-[#859398]">
                    <tr>
                      <th className="px-6 py-3.5">SKU &amp; periférico</th><th className="px-4 py-3.5">Categoría</th><th className="px-4 py-3.5">Precio oficial</th><th className="px-4 py-3.5">Stock disponible</th><th className="px-4 py-3.5">Estado</th><th className="px-4 py-3.5">Última modificación</th><th className="px-6 py-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242d32]/40 text-xs">
                    {filteredProducts.map((product) => {
                      const status = product.stock === 0 ? "Agotado" : product.stock <= LOW_STOCK_LIMIT ? "Stock bajo" : "En stock";
                      const statusClass = product.stock === 0 ? "text-[#ff5449] border-[#ff5449]/30 bg-[#ff5449]/10" : product.stock <= LOW_STOCK_LIMIT ? "text-amber-400 border-amber-400/30 bg-amber-400/10" : "text-[#58ffa1] border-[#58ffa1]/30 bg-[#58ffa1]/10";
                      return (
                        <tr key={product.id} className="group transition hover:bg-[#1e1f28]/50">
                          <td className="px-6 py-3.5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#242d32] bg-[#1e1f28] text-[#00d9ff]"><PackagePlus size={20} /></div><div className="min-w-0"><span className="block max-w-[280px] truncate font-bold text-white group-hover:text-[#00d9ff]">{product.name}</span><span className="mt-0.5 block font-mono text-[10px] text-[#00d9ff]">{product.sku}</span></div></div></td>
                          <td className="px-4 py-3.5"><span className="rounded-md border border-[#242d32] bg-[#1e1f28] px-2.5 py-1 font-mono text-[11px] text-[#e2e1ed]">{product.category}</span></td>
                          <td className="px-4 py-3.5 font-mono font-bold text-white">{formatCurrency(product.price)}</td>
                          <td className="px-4 py-3.5"><div className="flex flex-col gap-1"><span className={`font-mono font-bold ${product.stock <= LOW_STOCK_LIMIT ? "text-amber-400" : "text-[#58ffa1]"}`}>{product.stock} uds</span><div className="h-1 w-20 rounded-full bg-[#33343d]"><div className={`h-full rounded-full ${product.stock <= LOW_STOCK_LIMIT ? "bg-amber-400" : "bg-[#58ffa1]"}`} style={{ width: `${Math.min(product.stock * 2, 100)}%` }} /></div></div></td>
                          <td className="px-4 py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${statusClass}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span></td>
                          <td className="px-4 py-3.5 font-mono text-[11px] text-[#859398]">{formatDate(product.updatedAt)}</td>
                          <td className="px-6 py-3.5 text-right"><div className="flex justify-end gap-2"><button onClick={() => openEditDrawer(product)} className="rounded-lg border border-[#242d32] bg-[#1e1f28] p-2 text-[#e2e1ed] transition hover:border-[#00d9ff] hover:bg-[#00d9ff] hover:text-[#0c0e16]" title="Editar producto"><Edit3 size={15} /></button><button onClick={() => deleteProduct(product)} className="rounded-lg border border-[#242d32] bg-[#1e1f28] p-2 text-[#e2e1ed] transition hover:border-[#ff5449] hover:bg-[#ff5449] hover:text-white" title="Eliminar producto"><Trash2 size={15} /></button></div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 text-center"><Boxes size={42} className="text-[#3c494d]" /><h3 className="font-mono text-sm font-bold uppercase text-white">{products.length ? "Sin resultados para estos filtros" : "Inventario vacío"}</h3><p className="max-w-md text-xs text-[#859398]">{products.length ? "Prueba con otra búsqueda o cambia los filtros activos." : "Registra el primer periférico para comenzar a construir tu catálogo local."}</p>{!products.length && <button onClick={openCreateDrawer} className="mt-2 flex items-center gap-2 rounded-lg bg-[#00d9ff] px-4 py-2 font-mono text-xs font-bold uppercase text-[#0c0e16]"><Plus size={16} /> Registrar primer producto</button>}</div>}
              </div>
            </section>
          </div>
        </main>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <button className="absolute inset-0 cursor-default" onClick={closeDrawer} aria-label="Cerrar formulario" />
          <div className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-[#00d9ff]/20 bg-[#11131b] shadow-[-20px_0_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#242d32] bg-[#161822] px-6 py-5">
              <div><p className="font-mono text-[10px] uppercase tracking-widest text-[#00d9ff]">NEXUS CYBER // DATA ENTRY</p><h2 id="drawer-title" className="mt-1 font-mono text-lg font-bold uppercase text-white">{editingId ? "Editar periférico" : "Registrar nuevo periférico"}</h2></div>
              <button onClick={closeDrawer} className="rounded-lg border border-[#242d32] p-2 text-[#859398] hover:text-white" aria-label="Cerrar"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex-1 space-y-5 p-6">
                <Field label="Nombre del producto"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej. Teclado Hall Effect NX-80" /></Field>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="SKU"><input required value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} placeholder="NX-KB-0001" /></Field><Field label="Categoría"><select required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="" disabled>Selecciona una categoría</option>{PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></Field></div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="Precio oficial (PEN)"><input required min="0" step="0.01" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} /></Field><Field label="Stock disponible"><input required min="0" step="1" type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })} /></Field></div>
                <Field label="Descripción técnica (opcional)"><textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Características, sensor, conectividad..." /></Field>
              </div>
              <div className="flex gap-3 border-t border-[#242d32] bg-[#161822] p-6"><button type="button" onClick={closeDrawer} className="flex-1 rounded-lg border border-[#242d32] px-4 py-3 font-mono text-xs font-bold uppercase text-[#e2e1ed] hover:bg-[#1e1f28]">Cancelar</button><button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#00d9ff] px-4 py-3 font-mono text-xs font-extrabold uppercase text-[#0c0e16] hover:bg-[#58ffa1]"><CheckCircle2 size={16} /> {editingId ? "Guardar cambios" : "Registrar producto"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, detail, icon, tone }: { label: string; value: string | number; detail: string; icon: ReactNode; tone: "cyan" | "amber" | "green" | "purple" }) {
  const styles = { cyan: "text-[#00d9ff] border-[#00d9ff]/30 bg-[#00d9ff]/10", amber: "text-amber-400 border-amber-400/30 bg-amber-400/10", green: "text-[#58ffa1] border-[#58ffa1]/30 bg-[#58ffa1]/10", purple: "text-[#d0bcff] border-[#d0bcff]/30 bg-[#d0bcff]/10" };
  return <div className="rounded-xl border border-[#242d32] bg-[#161822] p-5 transition hover:border-[#00d9ff]/40"><div className="flex items-center justify-between"><span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#859398]">{label}</span><div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${styles[tone]}`}>{icon}</div></div><div className={`mt-4 font-mono text-3xl font-extrabold ${tone === "amber" ? "text-amber-400" : "text-white"}`}>{value}</div><div className="mt-1 truncate font-mono text-xs text-[#859398]">{detail}</div></div>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return <label className="flex items-center gap-2 font-mono text-xs font-semibold uppercase text-[#859398]">{label}: <span className="relative"><select value={value} onChange={(event) => onChange(event.target.value)} className="appearance-none rounded-lg border border-[#242d32] bg-[#1e1f28] py-2 pl-3 pr-8 text-xs font-sans font-normal normal-case text-white outline-none focus:border-[#00d9ff]">{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#859398]" /></span></label>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-2"><span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#859398]">{label}</span>{children && <div className="[&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#242d32] [&_input]:bg-[#1e1f28] [&_input]:px-3 [&_input]:py-3 [&_input]:text-sm [&_input]:text-white [&_input]:outline-none [&_input]:placeholder:text-[#859398] [&_input]:focus:border-[#00d9ff] [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#242d32] [&_select]:bg-[#1e1f28] [&_select]:px-3 [&_select]:py-3 [&_select]:text-sm [&_select]:text-white [&_select]:outline-none [&_select]:focus:border-[#00d9ff] [&_textarea]:w-full [&_textarea]:resize-none [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#242d32] [&_textarea]:bg-[#1e1f28] [&_textarea]:px-3 [&_textarea]:py-3 [&_textarea]:text-sm [&_textarea]:text-white [&_textarea]:outline-none [&_textarea]:placeholder:text-[#859398] [&_textarea]:focus:border-[#00d9ff]">{children}</div>}</label>;
}
