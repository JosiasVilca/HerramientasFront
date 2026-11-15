// components/store/ProductTabs.tsx
"use client";

import { useState } from "react";
import { FiCheck, FiMinus } from "react-icons/fi";
import { Product } from "@/data/products";

interface ProductTabsProps {
  product: Product;
}

type TabId = "descripcion" | "specs" | "garantia";

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("descripcion");

  const tabs: { id: TabId; label: string }[] = [
    { id: "descripcion", label: "Descripción" },
    { id: "specs", label: "Especificaciones" },
    { id: "garantia", label: "Garantía" },
  ];

  return (
    <section>
      <div
        role="tablist"
        aria-label="Información del producto"
        className="inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-10 rounded-md px-4 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-card p-6 sm:p-8" role="tabpanel">
        {activeTab === "descripcion" && (
          <div>
            <p className="max-w-3xl text-base leading-relaxed text-foreground/85">
              {product.longDescription}
            </p>

            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {product.specs.slice(0, 3).map((spec) => (
                <div key={spec.label}>
                  <dt className="text-base text-muted-foreground">{spec.label}</dt>
                  <dd className="mt-1 text-base font-medium text-foreground">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {activeTab === "specs" && (
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Especificaciones
            </h2>
            <dl className="mt-6 max-w-2xl space-y-4">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-6"
                >
                  <dt className="text-base text-muted-foreground">
                    {spec.label}
                  </dt>
                  <dd className="text-base font-medium text-foreground">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {activeTab === "garantia" && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Garantía y devoluciones
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/85">
              Este producto cuenta con garantía oficial de {product.warranty}{" "}
              directamente con el fabricante. Cubre defectos de fabricación y
              funcionamiento bajo uso normal.
            </p>

            <h3 className="mt-6 text-base font-semibold text-foreground">
              Qué cubre
            </h3>
            <ul className="mt-2 space-y-2">
              {[
                "Defectos de fabricación.",
                "Fallas eléctricas o electrónicas.",
                "Reemplazo dentro de los primeros 30 días.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-base text-foreground/80"
                >
                  <FiCheck
                    className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-base font-semibold text-foreground">
              Qué no cubre
            </h3>
            <ul className="mt-2 space-y-2">
              {[
                "Daños por mal uso o accidentes.",
                "Modificaciones no autorizadas.",
                "Desgaste normal por uso.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-base text-foreground/80"
                >
                  <FiMinus
                    className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
