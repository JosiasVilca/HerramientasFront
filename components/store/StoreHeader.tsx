// components/store/StoreHeader.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiPackage,
  FiMapPin,
  FiLogOut,
  FiChevronDown,
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
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/productos?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    } else {
      router.push(`/productos`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("favorites");
    setUserMenuOpen(false);
    router.push("/login");
  };

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logotipo.png"
            alt="NEXORA STORE"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Buscador */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos, marcas y categorías..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 border border-transparent text-sm outline-none focus:bg-white focus:border-purple-500 transition"
          />
        </form>

        {/* Íconos */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Favoritos */}
          <Link
            href="/favoritos"
            className="p-2 rounded-lg hover:bg-slate-100 transition relative"
            aria-label="Favoritos"
          >
            <FiHeart className="w-5 h-5 text-slate-700" />
          </Link>

          {/* Carrito */}
          <button
            className="p-2 rounded-lg hover:bg-slate-100 transition relative"
            aria-label="Carrito"
          >
            <FiShoppingCart className="w-5 h-5 text-slate-700" />
            <span className="absolute top-1 right-1 bg-purple-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              0
            </span>
          </button>

          {/* Menú de usuario */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition text-sm font-medium text-slate-700"
            >
              {/* Avatar circular con inicial */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                J
              </div>
              <span className="hidden sm:inline text-slate-600">
                Hola, <span className="font-bold text-slate-900">Juan</span>
              </span>
              <FiChevronDown
                className={`w-3.5 h-3.5 transition-transform hidden sm:inline text-slate-400 ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                {/* Header del menú */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-xs text-slate-500">Conectado como</p>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    juan.perez@ejemplo.com
                  </p>
                </div>

                <ul className="py-2">
                  <li>
                    <Link
                      href="/perfil"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <FiUser className="w-4 h-4" />
                      Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/perfil?tab=pedidos"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <FiPackage className="w-4 h-4" />
                      Mis Pedidos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/perfil?tab=direcciones"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <FiMapPin className="w-4 h-4" />
                      Ubicación
                    </Link>
                  </li>
                </ul>

                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menú de categorías */}
      <nav className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {categorias.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/productos?categoria=${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block px-3 py-1.5 text-sm text-slate-600 font-medium hover:text-purple-600 hover:bg-purple-50 rounded-md transition whitespace-nowrap"
                >
                  {cat}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/productos"
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