// components/store/ProductInfo.tsx
"use client";

import { useState } from "react";
import {
  FiCheck,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiShield,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import { Product } from "@/data/products";

interface ProductInfoProps {
  product: Product;
}
export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const agregarAlCarrito = () => {
    const carritoActual = JSON.parse(
      localStorage.getItem("carrito_compras") || "[]"
    );

    const indexExistente = carritoActual.findIndex(
      (item: any) => item.id === product.id
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

  };

  return (
    <div className="w-full">
      {/* Disponible */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
          Disponible
        </span>
        <span className="text-xs text-slate-500 ml-2">
          | {product.stock} unidades listas en almacén
        </span>
      </div>

      {/* Título */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
        {product.name}
      </h1>

      {/* SKU + Rating */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-xs text-slate-500 uppercase tracking-wider">
          SKU: <span className="font-bold text-slate-700">{product.sku}</span>
        </span>
        <div className="flex items-center gap-1">
          <FiStar className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-slate-900">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500">
            ({product.reviews} valoraciones)
          </span>
        </div>
      </div>

      {/* Precio */}
      <div className="bg-slate-50 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-extrabold text-slate-900">
            S/ {product.price.toFixed(2)}
          </span>
          {product.oldPrice > product.price && (
            <span className="text-sm text-slate-400 line-through">
              S/ {product.oldPrice.toFixed(2)}
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
              AHORRAS {product.discount}%
            </span>
          )}
        </div>
      </div>

      {/* Cantidad */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Cantidad:
        </label>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center border border-slate-200 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition"
              aria-label="Restar"
            >
              <FiMinus className="w-4 h-4 text-slate-600" />
            </button>
            <span className="w-12 text-center font-bold text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition"
              aria-label="Sumar"
            >
              <FiPlus className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <span className="text-xs text-slate-500">
            Máximo {product.stock} unidades
          </span>
        </div>
      </div>

      {/* Botones */}
      <div className="space-y-3 mb-6">
        <button
          onClick={agregarAlCarrito}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-cyan-400 text-white font-extrabold text-sm rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          <FiShoppingCart className="w-4 h-4" />
          Añadir al carrito
        </button>
        <button className="w-full py-3.5 bg-slate-900 text-white font-extrabold text-sm rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wider">
          Comprar ahora con envío express
        </button>
      </div>

      {/* Garantías */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          Garantía de reemplazo inmediato de {product.warranty} autorizados por ATK eSports.
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiTruck className="w-4 h-4 text-purple-600 shrink-0" />
          Envío Exprés 24H en Lima Metropolitana y envíos a nivel nacional.
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiShield className="w-4 h-4 text-cyan-600 shrink-0" />
          Pago 100% encriptado con Visa, Mastercard y PayPal.
        </div>
      </div>
    </div>
  );
}
