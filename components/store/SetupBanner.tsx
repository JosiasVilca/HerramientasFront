// components/store/SetupBanner.tsx
import Link from "next/link";
import Reveal from "@/components/ui/reveal";

export default function SetupBanner() {
  return (
    <section className="w-full bg-[#eef2f8]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-5 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <Reveal>
          <h2 className="max-w-lg text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl">
            Arma una estación que rinda tanto como tú.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Teclados, mouse y audio que funcionan juntos. Elige las piezas por
            separado o completa tu setup con una sola compra.
          </p>
          <Link
            href="/productos"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            Ver combos y periféricos
          </Link>
        </Reveal>

        <Reveal delay={100} className="overflow-hidden">
          <img
            src="/promo.jpg"
            alt="Teclado mecánico y audífonos inalámbricos disponibles en NEXORA"
            width={1024}
            height={341}
            loading="lazy"
            className="h-[220px] w-full scale-105 object-contain object-center mix-blend-multiply sm:h-[280px] lg:h-[320px]"
          />
        </Reveal>
      </div>
    </section>
  );
}
