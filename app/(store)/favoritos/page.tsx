// app/(store)/favoritos/page.tsx
"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { FiCheck, FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import ProductCard from "@/components/store/ProductCard";
import Reveal from "@/components/ui/reveal";
import { useCombinedProducts } from "@/lib/use-combined-products";

const FAVORITES_KEY = "favorites";
const EMPTY_IDS: string[] = [];

let favoritesCache: { raw: string | null; ids: string[] } = {
  raw: null,
  ids: EMPTY_IDS,
};

function readFavorites(): string[] {
  const raw = window.localStorage.getItem(FAVORITES_KEY);
  if (raw !== favoritesCache.raw) {
    try {
      const parsed = JSON.parse(raw ?? "[]");
      favoritesCache = {
        raw,
        ids: Array.isArray(parsed)
          ? parsed.filter((id): id is string => typeof id === "string")
          : EMPTY_IDS,
      };
    } catch {
      favoritesCache = { raw, ids: EMPTY_IDS };
    }
  }
  return favoritesCache.ids;
}

function subscribeToFavorites(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("favoritesChanged", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("favoritesChanged", callback);
  };
}

function writeFavorites(ids: string[]) {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("favoritesChanged"));
}

interface CartItem {
  id: string;
  nombre: string;
  especificacion: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export default function FavoritosPage() {
  const favoriteIds = useSyncExternalStore(
    subscribeToFavorites,
    readFavorites,
    () => EMPTY_IDS,
  );
  const { allProducts, isLoaded } = useCombinedProducts();
  const [feedback, setFeedback] = useState("");

  const favoriteProducts = allProducts.filter((product) =>
    favoriteIds.includes(product.id),
  );
  const pricedFavorites = favoriteProducts.filter(
    (product) => product.price > 0,
  );

  const moverTodoAlCarrito = () => {
    if (pricedFavorites.length === 0) return;

    try {
      const carrito: CartItem[] = JSON.parse(
        localStorage.getItem("carrito_compras") || "[]",
      );

      for (const product of pricedFavorites) {
        const index = carrito.findIndex((item) => item.id === product.id);
        if (index >= 0) {
          carrito[index].cantidad += 1;
        } else {
          carrito.push({
            id: product.id,
            nombre: product.name,
            especificacion: product.sku,
            precio: product.price,
            cantidad: 1,
            imagen: product.image,
          });
        }
      }

      localStorage.setItem("carrito_compras", JSON.stringify(carrito));
      window.dispatchEvent(new Event("cartUpdated"));
      setFeedback(
        `${pricedFavorites.length} ${
          pricedFavorites.length === 1 ? "producto" : "productos"
        } en el carrito`,
      );
      setTimeout(() => setFeedback(""), 2400);
    } catch (error) {
      console.error("Error al mover favoritos al carrito:", error);
    }
  };

  const vaciarFavoritos = () => {
    if (!window.confirm("¿Vaciar tu lista de favoritos?")) return;
    writeFavorites([]);
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-8 sm:px-6 lg:px-8 lg:pt-10">
      <nav
        aria-label="Migas de pan"
        className="hero-rise flex items-center gap-2 text-base text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">Favoritos</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="hero-rise text-[clamp(2.75rem,6vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground [animation-delay:60ms]">
            Favoritos
          </h1>
          <p className="hero-rise mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:120ms]">
            Los productos que guardaste para volver a ellos cuando quieras.
          </p>
        </div>

        {isLoaded && favoriteProducts.length > 0 && (
          <div className="hero-rise flex flex-wrap items-center gap-3 [animation-delay:180ms]">
            <button
              onClick={moverTodoAlCarrito}
              disabled={pricedFavorites.length === 0}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              {feedback ? (
                <>
                  <FiCheck className="h-4 w-4" aria-hidden="true" />
                  {feedback}
                </>
              ) : (
                <>
                  <FiShoppingCart className="h-4 w-4" aria-hidden="true" />
                  Mover todo al carrito
                </>
              )}
            </button>
            <button
              onClick={vaciarFavoritos}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-muted px-5 text-base font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <FiTrash2 className="h-4 w-4" aria-hidden="true" />
              Vaciar lista
            </button>
          </div>
        )}
      </div>

      {!isLoaded ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} aria-hidden="true">
              <div className="aspect-square rounded-xl bg-muted" />
              <div className="mt-4 h-3 w-20 rounded bg-muted" />
              <div className="mt-2 h-4 w-full rounded bg-muted" />
              <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : favoriteProducts.length === 0 ? (
        <div className="hero-rise mt-10 rounded-xl bg-card p-10 sm:p-14 [animation-delay:180ms]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FiHeart
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <h2 className="mt-5 text-2xl font-semibold text-foreground">
            Tu lista está vacía
          </h2>
          <p className="mt-2 max-w-md text-base leading-relaxed text-muted-foreground">
            Explora el catálogo y guarda los productos que quieras tener a mano
            con el corazón de cada tarjeta.
          </p>
          <Link
            href="/productos"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <>
          <p
            aria-live="polite"
            className="mt-8 text-base tabular-nums text-muted-foreground"
          >
            <span className="font-semibold text-foreground">
              {favoriteProducts.length}
            </span>{" "}
            {favoriteProducts.length === 1
              ? "producto guardado"
              : "productos guardados"}
            {pricedFavorites.length < favoriteProducts.length && (
              <> · los productos sin precio se consultan por WhatsApp</>
            )}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {favoriteProducts.map((product, index) => (
              <Reveal key={product.id} delay={(index % 4) * 70}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
