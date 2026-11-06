// app/(store)/carrito/page.tsx
"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiMessageCircle,
  FiMinus,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import ProductCard from "@/components/store/ProductCard";
import Reveal from "@/components/ui/reveal";
import { useCombinedProducts } from "@/lib/use-combined-products";

interface CartItem {
  id: string;
  nombre: string;
  especificacion?: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

const CART_KEY = "carrito_compras";
const EMPTY_CART: CartItem[] = [];

// Snapshot cacheado: useSyncExternalStore exige devolver la misma referencia
// mientras el contenido de localStorage no cambie.
let cartCache: { raw: string | null; items: CartItem[] } = {
  raw: null,
  items: EMPTY_CART,
};

function readCart(): CartItem[] {
  const raw = window.localStorage.getItem(CART_KEY);
  if (raw !== cartCache.raw) {
    try {
      const parsed = JSON.parse(raw ?? "[]");
      cartCache = {
        raw,
        items: Array.isArray(parsed) ? (parsed as CartItem[]) : EMPTY_CART,
      };
    } catch {
      cartCache = { raw, items: EMPTY_CART };
    }
  }
  return cartCache.items;
}

function subscribeToCart(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("cartUpdated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cartUpdated", callback);
  };
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cartUpdated"));
}

export default function CarritoPage() {
  const carrito = useSyncExternalStore(
    subscribeToCart,
    readCart,
    () => EMPTY_CART,
  );
  const { allProducts, isLoaded } = useCombinedProducts();

  const idsEnCarrito = new Set(carrito.map((item) => item.id));
  const recomendados = isLoaded
    ? allProducts.filter((product) => !idsEnCarrito.has(product.id)).slice(0, 4)
    : [];

  const guardarCarrito = (items: CartItem[]) => {
    writeCart(items);
  };

  const cambiarCantidad = (id: string, delta: number) => {
    const actualizado = carrito
      .map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + delta } : item,
      )
      .filter((item) => item.cantidad > 0);
    guardarCarrito(actualizado);
  };

  const eliminarProducto = (id: string) => {
    guardarCarrito(carrito.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    if (!window.confirm("¿Vaciar el carrito? Esta acción no se puede deshacer.")) {
      return;
    }
    guardarCarrito([]);
  };

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const mensajeWhatsApp = [
    "Hola NEXORA, quiero coordinar este pedido:",
    "",
    ...carrito.map(
      (item) =>
        `• ${item.nombre}${item.especificacion ? ` (${item.especificacion})` : ""} x${item.cantidad} — S/ ${(item.precio * item.cantidad).toFixed(2)}`,
    ),
    "",
    `Total: S/ ${subtotal.toFixed(2)}`,
  ].join("\n");

  const whatsappHref = `https://wa.me/51987654321?text=${encodeURIComponent(
    mensajeWhatsApp,
  )}`;

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
        <span className="text-foreground">Carrito</span>
      </nav>

      <h1 className="hero-rise mt-5 text-[clamp(2.75rem,6vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground [animation-delay:60ms]">
        Carrito
      </h1>
      <p className="hero-rise mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:120ms]">
        Revisa lo que llevas y confirma disponibilidad, envío y forma de pago
        con nuestro equipo por WhatsApp.
      </p>

      {carrito.length === 0 ? (
        <div className="hero-rise mt-8 rounded-xl bg-card p-10 sm:p-14 [animation-delay:180ms]">
          <h2 className="text-2xl font-semibold text-foreground">
            Tu carrito está vacío
          </h2>
          <p className="mt-2 max-w-md text-base text-muted-foreground">
            Explora el catálogo y agrega los periféricos que quieras sumar a tu
            setup.
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
          <p className="mt-3 text-lg text-muted-foreground">
            {totalItems} {totalItems === 1 ? "unidad" : "unidades"} en{" "}
            {carrito.length} {carrito.length === 1 ? "producto" : "productos"}.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-14">
            <ul className="space-y-6">
              {carrito.map((item, index) => (
                <li
                  key={item.id}
                  className="hero-rise flex flex-wrap items-start gap-4 sm:flex-nowrap sm:gap-6"
                  style={{ animationDelay: `${120 + index * 70}ms` }}
                >
                  <Link
                    href={`/producto/${item.id}`}
                    className="block h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f1f4fa] sm:h-28 sm:w-28"
                    aria-label={`Ver ${item.nombre}`}
                  >
                    <img
                      src={item.imagen || "/producto-placeholder.svg"}
                      alt={item.nombre}
                      className="h-full w-full object-contain p-2 mix-blend-multiply"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                      <div className="min-w-0">
                        <Link
                          href={`/producto/${item.id}`}
                          className="text-lg font-semibold text-foreground transition-colors hover:text-primary"
                        >
                          {item.nombre}
                        </Link>
                        {item.especificacion && (
                          <p className="mt-0.5 text-base text-muted-foreground">
                            {item.especificacion}
                          </p>
                        )}
                        <p className="mt-1 text-base text-muted-foreground">
                          {item.precio > 0
                            ? `S/ ${item.precio.toFixed(2)} por unidad`
                            : "Precio por confirmar"}
                        </p>
                      </div>

                      <p className="text-lg font-semibold text-secondary tabular-nums">
                        {item.precio > 0
                          ? `S/ ${(item.precio * item.cantidad).toFixed(2)}`
                          : "Por confirmar"}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="inline-flex items-center rounded-lg bg-muted">
                        <button
                          onClick={() => cambiarCantidad(item.id, -1)}
                          className="flex h-10 w-10 items-center justify-center rounded-l-lg text-foreground transition-colors hover:bg-accent"
                          aria-label={`Quitar una unidad de ${item.nombre}`}
                        >
                          <FiMinus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="w-9 text-center text-base font-semibold text-foreground tabular-nums">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => cambiarCantidad(item.id, 1)}
                          className="flex h-10 w-10 items-center justify-center rounded-r-lg text-foreground transition-colors hover:bg-accent"
                          aria-label={`Agregar una unidad de ${item.nombre}`}
                        >
                          <FiPlus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <button
                        onClick={() => eliminarProducto(item.id)}
                        className="inline-flex min-h-10 items-center gap-2 text-base font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-destructive"
                      >
                        <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="hero-rise rounded-xl bg-card p-6 [animation-delay:260ms] lg:sticky lg:top-8">
              <h2 className="text-xl font-semibold text-foreground">
                Resumen del pedido
              </h2>

              <dl className="mt-5 space-y-3 text-base">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">
                    Artículos ({totalItems})
                  </dt>
                  <dd className="font-medium text-foreground tabular-nums">
                    S/ {subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">Envío</dt>
                  <dd className="font-medium text-foreground">
                    A coordinar
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 pt-3 text-lg font-semibold">
                  <dt className="text-foreground">Total</dt>
                  <dd className="text-secondary tabular-nums">
                    S/ {subtotal.toFixed(2)}
                  </dd>
                </div>
              </dl>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <FiMessageCircle className="h-5 w-5" aria-hidden="true" />
                Confirmar por WhatsApp
              </a>

              <button
                onClick={vaciarCarrito}
                className="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg bg-muted text-base font-medium text-foreground transition-colors hover:bg-accent"
              >
                Vaciar carrito
              </button>

              <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
                No se realiza ningún cobro en esta web. Coordinamos stock,
                envío y forma de pago por WhatsApp.
              </p>

              <Link
                href="/productos"
                className="mt-4 inline-flex items-center gap-2 text-base font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
              >
                <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
                Seguir comprando
              </Link>
            </aside>
          </div>

          {recomendados.length > 0 && (
            <section className="mt-20">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
                  Suma algo más a tu setup
                </h2>
                <Link
                  href="/productos"
                  className="inline-flex min-h-11 items-center whitespace-nowrap text-base font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
                >
                  Ver todo el catálogo
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
                {recomendados.map((product, index) => (
                  <Reveal key={product.id} delay={(index % 4) * 70}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
