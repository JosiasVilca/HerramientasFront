// components/store/ProductCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { FiHeart, FiShoppingCart, FiCheck } from "react-icons/fi";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

// Función que lee si el producto es favorito (sin useEffect)
const getInitialFavorite = (productId: string): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem("favorites");
    const favorites: string[] = stored ? JSON.parse(stored) : [];
    return favorites.includes(productId);
  } catch {
    return false;
  }
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(() => getInitialFavorite(product.id));
  const [isAdded, setIsAdded] = useState(false);
  const [heartAnimated, setHeartAnimated] = useState(false);

  const toggleFavorite = () => {
    setHeartAnimated(true);
    setTimeout(() => setHeartAnimated(false), 300);

    try {
      const stored = localStorage.getItem("favorites");
      const favorites: string[] = stored ? JSON.parse(stored) : [];
      let updated: string[];

      if (favorites.includes(product.id)) {
        updated = favorites.filter((id) => id !== product.id);
        setIsFavorite(false);
      } else {
        updated = [...favorites, product.id];
        setIsFavorite(true);
      }

      localStorage.setItem("favorites", JSON.stringify(updated));
      window.dispatchEvent(new Event("favoritesChanged"));
    } catch (e) {
      console.error("Error al guardar favorito:", e);
    }
  };

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);

    try {
      const stored = localStorage.getItem("carrito_compras");
      const carrito: {
        id: string;
        nombre: string;
        especificacion: string;
        precio: number;
        cantidad: number;
        imagen: string;
      }[] = stored ? JSON.parse(stored) : [];

      const index = carrito.findIndex((item) => item.id === product.id);
      if (index > -1) {
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

      localStorage.setItem("carrito_compras", JSON.stringify(carrito));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {
      console.error("Error al agregar al carrito:", e);
    }
  };

  const hasDiscount = product.oldPrice > product.price;

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f1f4fa]">
        <Link
          href={`/producto/${product.id}`}
          className="absolute inset-0 z-10"
          aria-label={`Ver ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain p-6 transition-opacity duration-300 group-hover:opacity-0"
            loading="lazy"
          />
          {product.imageHover && product.imageHover !== product.image && (
            <img
              src={product.imageHover}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-contain p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              loading="lazy"
            />
          )}
        </Link>

        <button
          onClick={toggleFavorite}
          className={`absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-border/70 transition-transform hover:text-secondary ${
            heartAnimated ? "scale-110" : ""
          }`}
          aria-label={isFavorite ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
          aria-pressed={isFavorite}
        >
          <FiHeart
            className={`h-[18px] w-[18px] transition-colors ${
              isFavorite ? "fill-secondary text-secondary" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-sm font-medium text-muted-foreground">{product.sku}</p>

        <Link href={`/producto/${product.id}`} className="mt-1">
          <h3 className="line-clamp-2 min-h-[48px] text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          {product.price > 0 ? (
            <span className="text-lg font-bold tracking-tight text-secondary tabular-nums">
              S/ {product.price.toFixed(2)}
            </span>
          ) : (
            <span className="text-base font-semibold text-foreground">
              Precio por confirmar
            </span>
          )}
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through tabular-nums">
              S/ {product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={`mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
            isAdded
              ? "bg-foreground text-background"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isAdded ? (
            <>
              <FiCheck className="h-4 w-4" aria-hidden="true" />
              Agregado
            </>
          ) : (
            <>
              <FiShoppingCart className="h-4 w-4" aria-hidden="true" />
              Agregar
            </>
          )}
        </button>
      </div>
    </article>
  );
}
