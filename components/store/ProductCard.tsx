// components/store/ProductCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { FiHeart, FiShoppingCart, FiStar, FiCheck } from "react-icons/fi";
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
      const carrito: any[] = stored ? JSON.parse(stored) : [];

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
          imagen: product.image
        });
      }

      localStorage.setItem("carrito_compras", JSON.stringify(carrito));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {
      console.error("Error al agregar al carrito:", e);
    }
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-15px_rgba(124,58,237,0.25)] motion-reduce:hover:translate-y-0 flex flex-col">
      {/* Imagen con Link a detalle */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <Link
          href={`/producto/${product.id}`}
          className="absolute inset-0 z-10"
          aria-label={`Ver ${product.name}`}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
            <div className="absolute inset-8 bg-purple-500/20 blur-3xl rounded-full"></div>
            <div className="absolute inset-4 bg-cyan-400/20 blur-2xl rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
          </div>

          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:scale-105 motion-reduce:transform-none"
          />

          <img
            src={product.imageHover}
            alt={`${product.name} - vista alternativa`}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105 motion-reduce:transform-none"
          />
        </Link>

        <button
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md z-20 transition-all duration-300 cursor-pointer ${
            heartAnimated ? "scale-125 bg-rose-50" : "hover:scale-110"
          } motion-reduce:transform-none`}
          aria-label="Favorito"
        >
          <FiHeart
            className={`w-4 h-4 transition-all duration-300 ${
              isFavorite ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-400"
            }`}
          />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mb-1">
          {product.sku}
        </p>

        <Link href={`/producto/${product.id}`}>
          <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2 min-h-[40px] hover:text-purple-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 mb-3 line-clamp-2 min-h-[32px]">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mb-3">
          <FiStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-slate-700">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">
            ({product.reviews} reviews)
          </span>
        </div>

        <div className="mb-4">
          <span className="text-xl font-extrabold text-slate-900">
            S/ {product.price.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`mt-auto w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-wider cursor-pointer active:scale-95 motion-reduce:transform-none ${
            isAdded
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-102"
              : "bg-slate-900 text-white hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-600/25"
          }`}
        >
          {isAdded ? (
            <>
              <FiCheck className="w-4 h-4 animate-bounce" />
              <span>¡Agregado!</span>
            </>
          ) : (
            <>
              <FiShoppingCart className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}