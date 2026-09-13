// app/(store)/productos/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import {
  FiChevronRight,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiZap,
} from "react-icons/fi";
import FilterSidebar from "@/components/store/FilterSidebar";
import ProductsGrid from "@/components/store/ProductsGrid";

export default function ProductosPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-5">
        <Link href="/" className="hover:text-purple-600 transition-colors">
          Inicio
        </Link>
        <FiChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium">Productos</span>
      </nav>

      {/* Título */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">
            NEXORA Store Perú
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Catálogo de Productos
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Explora nuestra amplia variedad de periféricos y accesorios gamer con
          envío prioritario a todo el Perú.
        </p>
      </div>

      {/* Barra de beneficios */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl p-3">
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
            <FiTruck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Envío Exprés Perú
            </p>
            <p className="text-xs font-semibold text-slate-900 truncate">
              24 horas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl p-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <FiShield className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Garantía
            </p>
            <p className="text-xs font-semibold text-slate-900 truncate">
              Oficial 2 años
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl p-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
            <FiCreditCard className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Cuotas
            </p>
            <p className="text-xs font-semibold text-slate-900 truncate">
              Hasta 12 meses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl p-3">
          <div className="w-9 h-9 rounded-lg bg-fuchsia-100 flex items-center justify-center shrink-0">
            <FiZap className="w-4 h-4 text-fuchsia-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Stock
            </p>
            <p className="text-xs font-semibold text-slate-900 truncate">
              Lima en Vivo
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="hidden lg:block">
          <Suspense fallback={<div className="text-sm text-slate-500">Cargando filtros...</div>}>
            <FilterSidebar />
          </Suspense>
        </aside>

        <main>
          <Suspense fallback={<p className="text-sm text-slate-500">Cargando productos...</p>}>
            <ProductsGrid />
          </Suspense>
        </main>
      </div>
    </div>
  );
}