// components/store/ProductTabs.tsx
"use client";

import { useState } from "react";
import { Product } from "@/data/products";

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"descripcion" | "specs" | "garantia">(
    "descripcion"
  );

  const tabs = [
    { id: "descripcion", label: "Descripción" },
    { id: "specs", label: "Especificaciones Técnicas" },
    { id: "garantia", label: "Garantía" },
  ] as const;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden mb-10">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors relative ${
              activeTab === tab.id
                ? "text-purple-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></span>
            )}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="p-6 sm:p-8">
        {activeTab === "descripcion" && (
          <div>
            <p className="text-sm text-slate-700 leading-relaxed mb-6">
              {product.longDescription}
            </p>

            {/* Specs destacadas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {product.specs.slice(0, 3).map((spec, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                >
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">
                    {spec.label}
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Incluye todos los accesorios originales de fábrica: cable USB-C
              trenzado, manual de usuario, y empaque oficial. Compatible con
              todos los sistemas operativos principales (Windows, macOS, Linux).
            </p>
          </div>
        )}

        {activeTab === "specs" && (
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Especificaciones Técnicas
            </h3>
            <div className="divide-y divide-slate-100">
              {product.specs.map((spec, i) => (
                <div key={i} className="grid grid-cols-2 py-3 gap-4">
                  <span className="text-sm font-semibold text-slate-600">
                    {spec.label}
                  </span>
                  <span className="text-sm text-slate-900">
                    {spec.value}
                  </span>
                </div>
              ))}
              <div className="grid grid-cols-2 py-3 gap-4">
                <span className="text-sm font-semibold text-slate-600">
                  Marca
                </span>
                <span className="text-sm text-slate-900 uppercase">
                  {product.brand}
                </span>
              </div>
              <div className="grid grid-cols-2 py-3 gap-4">
                <span className="text-sm font-semibold text-slate-600">
                  SKU
                </span>
                <span className="text-sm text-slate-900">{product.sku}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "garantia" && (
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Garantía y Devoluciones
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Este producto cuenta con una garantía oficial de{" "}
              <strong>{product.warranty}</strong> directamente con el
              fabricante. La garantía cubre defectos de fabricación y
              funcionamiento bajo uso normal.
            </p>
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              ¿Qué cubre la garantía?
            </h4>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 shrink-0"></span>
                Defectos de fabricación.
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 shrink-0"></span>
                Fallas eléctricas o electrónicas.
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 shrink-0"></span>
                Reemplazo inmediato en caso de falla dentro de los primeros 30
                días.
              </li>
            </ul>
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              ¿Qué NO cubre la garantía?
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                Daños por mal uso o accidentes.
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                Modificaciones no autorizadas.
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                Desgaste normal por uso.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}