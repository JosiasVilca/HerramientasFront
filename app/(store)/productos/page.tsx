// app/(store)/productos/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import CatalogView from "@/components/store/CatalogView";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Periféricos, audio y monitores originales con stock en Lima y despacho a todo el Perú.",
};

export default function ProductosPage() {
  return (
    <div className="w-full">
      <header className="mx-auto w-full max-w-[1400px] px-5 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-12">
        <nav
          aria-label="Migas de pan"
          className="hero-rise flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">Catálogo</span>
        </nav>

        <h1 className="hero-rise mt-5 text-[clamp(2.75rem,6vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground [animation-delay:60ms]">
          Catálogo completo
        </h1>
        <p className="hero-rise mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground [animation-delay:120ms]">
          Periféricos, audio y monitores originales con stock en Lima y
          despacho a todo el Perú. Garantía oficial de dos años.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-6 lg:px-8">
            <p className="text-base text-muted-foreground">
              Cargando catálogo…
            </p>
          </div>
        }
      >
        <CatalogView />
      </Suspense>
    </div>
  );
}
