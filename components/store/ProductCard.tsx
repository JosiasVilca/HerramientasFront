// components/store/ProductCard.tsx
"use client";

import { useState } from "react";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_15px_40px_-15px_rgba(34,211,238,0.35)] flex flex-col">
      {" "}
      {/* Imagen con hover */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        {/* Iluminación celeste detrás (aparece al hover) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0">
          <div className="absolute inset-8 bg-cyan-400/50 blur-3xl rounded-full"></div>
          <div className="absolute inset-4 bg-cyan-300/30 blur-2xl rounded-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent"></div>
        </div>

        {/* Imagen principal */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:scale-110 z-10"
        />

        {/* Imagen hover */}
        <img
          src={product.imageHover}
          alt={`${product.name} - vista alternativa`}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-110 z-10"
        />

        {/* Corazón favorito */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-20"
          aria-label="Favorito"
        >
          <FiHeart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-slate-400"
            }`}
          />
        </button>
      </div>
      {/* Info del producto */}
      <div className="p-4 flex flex-col flex-1">
        {/* SKU */}
        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mb-1">
          {product.sku}
        </p>

        {/* Nombre */}
        <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Descripción */}
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 min-h-[32px]">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <FiStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-slate-700">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">
            ({product.reviews} reviews)
          </span>
        </div>

        {/* Precio */}
        <div className="mb-4">
          <span className="text-xl font-extrabold text-slate-900">
            S/ {product.price.toFixed(2)}
          </span>
        </div>

        {/* Botón Agregar */}
        <button className="mt-auto w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors uppercase tracking-wider">
          <FiShoppingCart className="w-3.5 h-3.5" />
          Agregar
        </button>
      </div>
    </div>
  );
}
