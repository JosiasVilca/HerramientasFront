// components/store/StoreHeader.tsx
"use client";

import Link from "next/link";
import {
  FiSearch,
  FiHeart,
  FiBell,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

const categorias = [
  "Periféricos",
  "Notebooks",
  "Mouse",
  "Audífonos",
  "Monitores",
  "Micrófonos",
  "Sillas Gamer",
  "Accesorios",
];

export default function StoreHeader() {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Barra superior: logo, buscador, íconos */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4">
        {/* Logo (más pequeño) */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logotipo.png"
            alt="NEXORA STORE"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Buscador */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar productos, marcas y categorías..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 border border-transparent text-sm outline-none focus:bg-white focus:border-purple-500 transition"
            />
          </div>
        </div>

        {/* Íconos */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="p-2 rounded-lg hover:bg-slate-100 transition relative"
            aria-label="Favoritos"
          >
            <FiHeart className="w-5 h-5 text-slate-700" />
          </button>

          <button
            className="p-2 rounded-lg hover:bg-slate-100 transition relative"
            aria-label="Carrito"
          >
            <FiShoppingCart className="w-5 h-5 text-slate-700" />
            <span className="absolute top-1 right-1 bg-purple-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              0
            </span>
          </button>

          <button
            className="p-2 rounded-lg hover:bg-slate-100 transition relative"
            aria-label="Notificaciones"
          >
            <FiBell className="w-5 h-5 text-slate-700" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              0
            </span>
          </button>

          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition text-sm font-medium text-slate-700"
          >
            <FiUser className="w-5 h-5" />
            <span className="hidden sm:inline">Mi Cuenta</span>
          </Link>
        </div>
      </div>

      {/* Menú de categorías (CENTRADO) */}
      <nav className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {categorias.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/categoria/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block px-3 py-1.5 text-sm text-slate-600 font-medium hover:text-purple-600 hover:bg-purple-50 rounded-md transition whitespace-nowrap"
                >
                  {cat}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/ofertas"
                className="ml-1 inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full hover:shadow-lg hover:shadow-purple-500/40 hover:scale-105 transition-all whitespace-nowrap"
              >
                Ofertas
                <span className="text-xs">🔥</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
