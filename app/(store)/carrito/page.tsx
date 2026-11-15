// app/(store)/carrito/page.tsx
"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  FiArrowLeft,
  FiCreditCard,
  FiMessageCircle,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import ProductCard from "@/components/store/ProductCard";
import Reveal from "@/components/ui/reveal";
import { useCombinedProducts } from "@/lib/use-combined-products";
import { useAuth } from "@/context/auth-context";

import {
  EMPTY_CART,
  readCart,
  subscribeToCart,
  writeCart,
  type CartItem,
} from "@/lib/cart";

const gradientBg = "btn-accent";
const gradientText =
  "text-white";

const pasos = ["Carrito", "Datos", "Confirmación"];

export default function CarritoPage() {
  const carrito = useSyncExternalStore(
    subscribeToCart,
    readCart,
    () => EMPTY_CART,
  );
  const { allProducts, isLoaded } = useCombinedProducts();
  const router = useRouter();
  const { user } = useAuth();

  const finalizarCompra = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

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
        className="hero-rise flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-foreground">Carrito</span>
      </nav>

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="hero-rise text-4xl font-extrabold tracking-[-0.03em] text-[#0b1c30] sm:text-5xl [animation-delay:60ms]">
            Tu carrito
          </h1>
          <p className="hero-rise mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:120ms]">
            Revisa tus productos, ajusta las cantidades y continúa con tu compra.
          </p>
        </div>

        <ol
          aria-label="Pasos de compra"
          className="hero-rise flex items-center gap-3 text-xs font-extrabold uppercase tracking-wider [animation-delay:160ms]"
        >
          {pasos.map((paso, i) => (
            <li key={paso} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  i === 0
                    ? `${gradientBg} text-white`
                    : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={i === 0 ? "text-[#0b1c30]" : "text-muted-foreground"}
              >
                {paso}
              </span>
              {i < pasos.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden h-px w-8 bg-border sm:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>

      {carrito.length === 0 ? (
        <div className="hero-rise mt-10 flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center sm:p-16 [animation-delay:180ms]">
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full ${gradientBg} text-white`}
          >
            <FiShoppingBag className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-2xl font-extrabold text-[#0b1c30]">
            Tu carrito está vacío
          </h2>
          <p className="mt-2 max-w-md text-base text-muted-foreground">
            Explora el catálogo y agrega los periféricos que quieras sumar a tu
            setup.
          </p>
          <Link
            href="/productos"
            className={`mt-8 inline-flex min-h-12 items-center justify-center rounded-lg ${gradientBg} px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-[transform,box-shadow,opacity] duration-200 hover:opacity-90 hover:shadow-xl active:scale-[0.98]`}
          >
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-8 text-base font-medium text-muted-foreground">
            {totalItems} {totalItems === 1 ? "unidad" : "unidades"} en{" "}
            {carrito.length} {carrito.length === 1 ? "producto" : "productos"}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-12">
            <ul className="space-y-4">
              {carrito.map((item, index) => (
                <li
                  key={item.id}
                  className="hero-rise flex flex-wrap items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-lg sm:flex-nowrap sm:gap-6 sm:p-5"
                  style={{ animationDelay: `${120 + index * 70}ms` }}
                >
                  <Link
                    href={`/producto/${item.id}`}
                    className="block h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#f1f4fa] sm:h-32 sm:w-32"
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
                        {item.especificacion && (
                          <p className="text-xs font-extrabold uppercase tracking-wider text-brand">
                            {item.especificacion}
                          </p>
                        )}
                        <Link
                          href={`/producto/${item.id}`}
                          className="mt-1 block text-lg font-bold leading-snug text-foreground transition-colors hover:text-brand"
                        >
                          {item.nombre}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.precio > 0
                            ? `S/ ${item.precio.toFixed(2)} por unidad`
                            : "Precio por confirmar"}
                        </p>
                      </div>

                      <p className="text-xl font-extrabold text-[#0b1c30] tabular-nums">
                        {item.precio > 0
                          ? `S/ ${(item.precio * item.cantidad).toFixed(2)}`
                          : "Por confirmar"}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <div className="inline-flex items-center rounded-lg border border-border bg-white">
                        <button
                          onClick={() => cambiarCantidad(item.id, -1)}
                          className="flex h-10 w-10 items-center justify-center rounded-l-lg text-foreground transition-colors hover:bg-accent hover:text-brand"
                          aria-label={`Quitar una unidad de ${item.nombre}`}
                        >
                          <FiMinus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="w-10 text-center text-base font-bold text-[#0b1c30] tabular-nums">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => cambiarCantidad(item.id, 1)}
                          className="flex h-10 w-10 items-center justify-center rounded-r-lg text-foreground transition-colors hover:bg-accent hover:text-brand"
                          aria-label={`Agregar una unidad de ${item.nombre}`}
                        >
                          <FiPlus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <button
                        onClick={() => eliminarProducto(item.id)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
                      >
                        <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="hero-rise rounded-2xl bg-[#0b1c30] p-6 text-white shadow-xl [animation-delay:260ms] sm:p-7 lg:sticky lg:top-8">
              <h2 className="text-xl font-extrabold">Resumen del pedido</h2>

              <dl className="mt-6 space-y-3 text-base">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-white/70">Artículos ({totalItems})</dt>
                  <dd className="font-semibold tabular-nums">
                    S/ {subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-white/70">Envío</dt>
                  <dd className="font-semibold">A coordinar</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-white/15 pt-4">
                  <dt className="text-lg font-bold">Total</dt>
                  <dd
                    className={`text-3xl font-extrabold tabular-nums ${gradientText}`}
                  >
                    S/ {subtotal.toFixed(2)}
                  </dd>
                </div>
              </dl>

              <button
                onClick={finalizarCompra}
                disabled={carrito.length === 0}
                className={`mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg ${gradientBg} px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-[transform,box-shadow,opacity] duration-200 hover:opacity-90 hover:shadow-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1c30] disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Finalizar compra
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1c30]"
              >
                <FiMessageCircle className="h-5 w-5" aria-hidden="true" />
                Confirmar por WhatsApp
              </a>

              <ul className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm text-white/75">
                <li className="flex items-start gap-3">
                  <FiShield
                    className="mt-0.5 h-4 w-4 shrink-0 text-white/80"
                    aria-hidden="true"
                  />
                  No se realiza ningún cobro en esta web.
                </li>
                <li className="flex items-start gap-3">
                  <FiTruck
                    className="mt-0.5 h-4 w-4 shrink-0 text-white/80"
                    aria-hidden="true"
                  />
                  Coordinamos stock y envío contigo.
                </li>
                <li className="flex items-start gap-3">
                  <FiCreditCard
                    className="mt-0.5 h-4 w-4 shrink-0 text-white/80"
                    aria-hidden="true"
                  />
                  La forma de pago se acuerda por WhatsApp.
                </li>
              </ul>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/15 pt-5">
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 text-sm font-semibold text- underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                >
                  <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Seguir comprando
                </Link>
                <button
                  onClick={vaciarCarrito}
                  className="text-sm font-medium text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-red-300 hover:decoration-red-300"
                >
                  Vaciar carrito
                </button>
              </div>
            </aside>
          </div>

          {recomendados.length > 0 && (
            <section className="mt-20">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span
                    aria-hidden="true"
                    className={`block h-1 w-12 rounded-full ${gradientBg}`}
                  />
                  <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-[#0b1c30] sm:text-4xl">
                    Suma algo más a tu setup
                  </h2>
                </div>
                <Link
                  href="/productos"
                  className="inline-flex min-h-11 items-center whitespace-nowrap text-sm font-extrabold uppercase tracking-wider text-brand underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
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
