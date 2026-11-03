// components/store/ProductInfo.tsx
"use client";

import { useState } from "react";
import {
  FiCheck,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiMinus,
  FiPlus,
  FiMessageCircle,
} from "react-icons/fi";
import { Product } from "@/data/products";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const hasPrice = product.price > 0;
  const available = product.stock > 0;
  const maxQuantity = Math.max(1, Math.min(product.stock, 10));

  const whatsappHref = `https://wa.me/51987654321?text=${encodeURIComponent(
    `Hola, quiero consultar por ${product.name} (SKU ${product.sku}).`,
  )}`;

  const agregarAlCarrito = () => {
    if (!hasPrice || !available) return;

    try {
      const carritoActual = JSON.parse(
        localStorage.getItem("carrito_compras") || "[]",
      );
      const indexExistente = carritoActual.findIndex(
        (item: { id: string }) => item.id === product.id,
      );

      if (indexExistente >= 0) {
        carritoActual[indexExistente].cantidad += quantity;
      } else {
        carritoActual.push({
          id: product.id,
          nombre: product.name,
          especificacion: product.sku,
          precio: product.price,
          cantidad: quantity,
          imagen: product.image,
        });
      }

      localStorage.setItem("carrito_compras", JSON.stringify(carritoActual));
      window.dispatchEvent(new Event("cartUpdated"));
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1600);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  const categoryLabel = product.category
    .replace(/-/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
  const summary =
    product.description &&
    !product.description.startsWith("Producto registrado desde")
      ? product.description
      : `${categoryLabel} original, con garantía oficial y despacho a todo el Perú.`;

  return (
    <div className="w-full">
      <h1 className="text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-foreground">
        {product.name}
      </h1>

      <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
        {summary}
      </p>

      <div className="mt-5">
        {hasPrice ? (
          <>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-bold tracking-tight text-secondary tabular-nums">
                S/ {product.price.toFixed(2)}
              </span>
              {product.oldPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through tabular-nums">
                  S/ {product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="mt-1 text-base text-muted-foreground">
              Precio en soles, incluido IGV.
            </p>
          </>
        ) : (
          <>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              Precio por confirmar
            </p>
            <p className="mt-1 text-base text-muted-foreground">
              Consulta disponibilidad y precio por WhatsApp.
            </p>
          </>
        )}
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-2 text-base text-muted-foreground">
        <span
          className={`h-2 w-2 rounded-full ${
            available ? "bg-emerald-600" : "bg-muted-foreground"
          }`}
          aria-hidden="true"
        />
        <span className={available ? "text-foreground" : ""}>
          {available ? "Disponible" : "Sin stock"}
        </span>
        {available && <span aria-hidden="true">·</span>}
        {available && <span>{product.stock} unidades en almacén</span>}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-muted-foreground">
        <span className="font-medium text-foreground">{product.sku}</span>
        <span aria-hidden="true">·</span>
        <span className="capitalize">{product.category.replace(/-/g, " ")}</span>
        {product.reviews > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <FiStar
                className="h-4 w-4 fill-secondary text-secondary"
                aria-hidden="true"
              />
              <span className="font-medium text-foreground">
                {product.rating.toFixed(1)}
              </span>
              <span>({product.reviews} valoraciones)</span>
            </span>
          </>
        )}
      </div>

      {hasPrice && available && (
        <div className="mt-6">
          <span className="text-base font-medium text-foreground">
            Cantidad
          </span>
          <div className="mt-2 flex items-center gap-3">
            <div className="inline-flex items-center rounded-lg bg-muted">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-l-lg text-foreground transition-colors hover:bg-accent disabled:opacity-40"
                aria-label="Restar una unidad"
                disabled={quantity <= 1}
              >
                <FiMinus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-10 text-center text-base font-semibold text-foreground tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(maxQuantity, quantity + 1))
                }
                className="flex h-11 w-11 items-center justify-center rounded-r-lg text-foreground transition-colors hover:bg-accent disabled:opacity-40"
                aria-label="Sumar una unidad"
                disabled={quantity >= maxQuantity}
              >
                <FiPlus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <span className="text-base text-muted-foreground">
              Máximo {maxQuantity} por compra
            </span>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {hasPrice ? (
          <button
            onClick={agregarAlCarrito}
            disabled={!available}
            className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-lg text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
              isAdded
                ? "bg-foreground text-background"
                : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
            }`}
          >
            {isAdded ? (
              <>
                <FiCheck className="h-4 w-4" aria-hidden="true" />
                Agregado al carrito
              </>
            ) : (
              <>
                <FiShoppingCart className="h-4 w-4" aria-hidden="true" />
                {available ? "Añadir al carrito" : "Sin stock"}
              </>
            )}
          </button>
        ) : (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <FiMessageCircle className="h-4 w-4" aria-hidden="true" />
            Consultar por WhatsApp
          </a>
        )}

        {hasPrice && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-muted text-base font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <FiMessageCircle className="h-4 w-4" aria-hidden="true" />
            Consultar por WhatsApp
          </a>
        )}
      </div>

      <ul className="mt-8 space-y-3 text-base text-foreground/80">
        <li className="flex items-start gap-3">
          <FiTruck
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          Despacho en 24 h en Lima y envío a todo el Perú.
        </li>
        <li className="flex items-start gap-3">
          <FiShield
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          Garantía oficial de {product.warranty}.
        </li>
        <li className="flex items-start gap-3">
          <FiCreditCard
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          Hasta 12 cuotas con tarjetas participantes.
        </li>
      </ul>
    </div>
  );
}
