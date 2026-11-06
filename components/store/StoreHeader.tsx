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
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";

import { useAuth } from "@/context/auth-context";

const categorias = [
  { label: "Periféricos", value: "periféricos" },
  { label: "Notebooks", value: "notebooks" },
  { label: "Mouse", value: "mouse" },
  { label: "Audífonos", value: "audífonos" },
  { label: "Monitores", value: "monitores" },
  { label: "Micrófonos", value: "micrófonos" },
  { label: "Sillas Gamer", value: "sillas-gamer" },
  { label: "Accesorios", value: "accesorios" },
];

export default function StoreHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  // Sincroniza el contador del carrito con el localStorage y con el evento que
  // disparan las tarjetas de producto al agregar o quitar unidades.
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const items = JSON.parse(localStorage.getItem("carrito_compras") || "[]");
        const total = items.reduce(
          (acc: number, item: { cantidad?: number }) => acc + (item.cantidad || 1),
          0,
        );
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/productos?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    } else {
      router.push(`/productos`);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("favorites");
    setUserMenuOpen(false);
    await logout();
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
    <header className="relative z-40 w-full bg-card">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 lg:flex-nowrap lg:gap-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="NEXORA STORE, inicio">
          <img src="/logotipo.png" alt="NEXORA STORE" className="h-7 w-auto object-contain" />
        </Link>

        {/* Buscador */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="order-3 w-full min-w-0 lg:order-none lg:max-w-2xl lg:flex-1"
        >
          <label htmlFor="store-search" className="sr-only">
            Buscar productos
          </label>
          <div className="relative">
            <FiSearch
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="store-search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos, marcas y categorías"
              className="h-11 w-full rounded-lg bg-muted pl-10 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </form>

        {/* Acciones */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/favoritos"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent hover:text-primary"
            aria-label="Favoritos"
          >
            <FiHeart className="h-5 w-5" />
          </Link>

          <Link
            href="/carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent hover:text-primary"
            aria-label={`Carrito, ${cartCount} artículos`}
          >
            <FiShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold leading-none text-secondary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Menú de usuario */}
          <div className="relative" ref={menuRef}>
            {user ? (
              <>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex min-h-10 items-center gap-2 rounded-lg px-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:px-2"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold uppercase text-primary-foreground">
                    {user.fullName ? user.fullName.charAt(0) : "U"}
                  </span>
                  <span className="hidden text-muted-foreground sm:inline">
                    Hola,{" "}
                    <span className="font-semibold text-foreground">
                      {user.fullName ? user.fullName.split(" ")[0] : "Usuario"}
                    </span>
                  </span>
                  <FiChevronDown
                    aria-hidden="true"
                    className={`hidden h-4 w-4 text-muted-foreground transition-transform sm:inline ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl bg-card shadow-lg ring-1 ring-border/60">
                    <div className="bg-muted px-4 py-3">
                      <p className="text-sm text-muted-foreground">Conectado como</p>
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.email}
                      </p>
                    </div>

                    <ul className="py-1.5">
                      <li>
                        <Link
                          href="/perfil"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-primary"
                        >
                          <FiUser className="h-4 w-4" aria-hidden="true" />
                          Mi perfil
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/favoritos"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-primary"
                        >
                          <FiHeart className="h-4 w-4" aria-hidden="true" />
                          Favoritos
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/carrito"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-primary"
                        >
                          <FiShoppingCart
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                          Mi carrito
                        </Link>
                      </li>
                    </ul>

                    <div className="bg-muted py-1.5">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <FiLogOut className="h-4 w-4" aria-hidden="true" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4"
              >
                <FiUser className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Iniciar sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Menú de categorías */}
      <nav aria-label="Categorías" className="bg-muted/60">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
          <ul className="flex flex-wrap items-center justify-center gap-1 py-1.5">
            {categorias.map((cat) => {
              const soloEscritorio = ["Notebooks", "Monitores", "Micrófonos", "Sillas Gamer", "Accesorios"].includes(
                cat.label,
              );
              return (
                <li key={cat.value} className={soloEscritorio ? "hidden md:block" : ""}>
                  <Link
                    href={`/productos?categoria=${encodeURIComponent(cat.value)}`}
                    className="block whitespace-nowrap rounded-md px-3 py-2 text-base font-medium text-foreground/80 transition-colors hover:bg-card hover:text-primary"
                  >
                    {cat.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/productos?categoria=ofertas"
                className="ml-1 block whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-base font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90"
              >
                Ofertas
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
