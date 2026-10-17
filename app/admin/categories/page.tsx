"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Edit3, Layers3, Plus, Trash2, X } from "lucide-react";
import { catalogService } from "@/services/catalog.service";
import { Category, CategoryRequest } from "@/types/catalog";

const emptyForm: CategoryRequest = { name: "", slug: "", description: "", parentId: null, active: true };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      setCategories(await catalogService.listCategories({ search: search.trim() || undefined }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadCategories(); }, 0);
    return () => window.clearTimeout(timer);
  }, [search]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name?.trim()) return setError("El nombre de la categoría es obligatorio.");
    setSaving(true);
    try {
      const payload = { ...form, name: form.name.trim(), slug: form.slug?.trim() || undefined, description: form.description?.trim() || undefined };
      if (editingId === null) {
        await catalogService.createCategory(payload);
        setNotice("Categoría creada correctamente.");
      } else {
        await catalogService.updateCategory(editingId, payload);
        setNotice("Categoría actualizada correctamente.");
      }
      setForm(emptyForm); setEditingId(null); await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la categoría.");
    } finally { setSaving(false); }
  };

  const edit = (category: Category) => {
    setEditingId(category.id);
    setForm({ name: category.name, slug: category.slug, description: category.description ?? "", parentId: category.parentId ?? null, active: category.active });
    setNotice(null); setError(null);
  };

  const remove = async (category: Category) => {
    if (!window.confirm(`¿Eliminar "${category.name}"? Si tiene productos asociados, el backend puede rechazar la operación.`)) return;
    try { await catalogService.deleteCategory(category.id); setNotice("Categoría eliminada."); await loadCategories(); }
    catch (err) { setError(err instanceof Error ? err.message : "No se pudo eliminar la categoría."); }
  };

  const deactivate = async (category: Category) => {
    try { await catalogService.deactivateCategory(category.id); setNotice("Categoría desactivada."); await loadCategories(); }
    catch (err) { setError(err instanceof Error ? err.message : "No se pudo desactivar la categoría."); }
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-border/60 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600">NEXORA STORE // Catálogos</span>
        <h1 className="mt-1 text-2xl font-extrabold">Gestión de Categorías</h1>
        <p className="mt-1 text-xs text-muted-foreground">Administra las categorías persistidas en PostgreSQL.</p>
      </header>
      {(notice || error) && <div className={`flex justify-between rounded-lg border p-4 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
        <span className="flex items-center gap-2">{error ? <X size={18} /> : <CheckCircle2 size={18} />}{error ?? notice}</span>
        <button onClick={() => { setNotice(null); setError(null); }} aria-label="Cerrar"><X size={16} /></button>
      </div>}
      <section className="rounded-xl border border-border/80 bg-card p-6 shadow-xs">
        <div className="mb-5 flex items-center gap-3"><Layers3 className="text-purple-600" size={20} /><div><h2 className="font-bold">{editingId === null ? "Nueva categoría" : "Editar categoría"}</h2><p className="text-xs text-muted-foreground">El slug se genera automáticamente si lo dejas vacío.</p></div></div>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Nombre<input className="mt-2 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-normal text-foreground" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} maxLength={100} required /></label>
          <label className="text-xs font-bold uppercase text-muted-foreground">Slug<input className="mt-2 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-normal text-foreground" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} maxLength={120} /></label>
          <label className="text-xs font-bold uppercase text-muted-foreground sm:col-span-2">Descripción<textarea className="mt-2 min-h-20 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-normal text-foreground" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
          <label className="text-xs font-bold uppercase text-muted-foreground">Categoría padre<select className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm font-normal text-foreground" value={form.parentId ?? ""} onChange={e => setForm({ ...form, parentId: e.target.value ? Number(e.target.value) : null })}><option value="">Sin categoría padre</option>{categories.filter(c => c.id !== editingId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <div className="flex items-end gap-2"><button disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-lg bg-purple-600 px-5 text-xs font-bold uppercase text-white disabled:opacity-50">{editingId === null ? <Plus size={16} /> : <Edit3 size={16} />}{saving ? "Guardando..." : editingId === null ? "Crear" : "Guardar"}</button>{editingId !== null && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="h-10 rounded-lg border px-4 text-xs font-bold">Cancelar</button>}</div>
        </form>
      </section>
      <section className="rounded-xl border border-border/80 bg-card p-6 shadow-xs">
        <div className="mb-5 flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold">Categorías registradas ({categories.length})</h2><p className="text-xs text-muted-foreground">Consulta, edita, desactiva o elimina datos del backend.</p></div><input className="rounded-lg border border-input bg-transparent px-3 py-2 text-sm" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        {loading ? <p className="py-8 text-center text-sm text-muted-foreground">Cargando categorías...</p> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categories.map(category => <article key={category.id} className="rounded-lg border border-border/60 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{category.name}</h3><p className="text-xs text-muted-foreground">{category.slug}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${category.active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>{category.active ? "Activa" : "Inactiva"}</span></div>{category.description && <p className="mt-3 text-xs text-muted-foreground">{category.description}</p>}<div className="mt-4 flex gap-2"><button onClick={() => edit(category)} className="rounded-md border p-2 text-muted-foreground hover:text-purple-600" title="Editar"><Edit3 size={15} /></button>{category.active && <button onClick={() => void deactivate(category)} className="rounded-md border px-3 text-xs font-semibold">Desactivar</button>}<button onClick={() => void remove(category)} className="rounded-md border p-2 text-muted-foreground hover:text-destructive" title="Eliminar"><Trash2 size={15} /></button></div></article>)}</div>}
      </section>
    </div>
  );
}
