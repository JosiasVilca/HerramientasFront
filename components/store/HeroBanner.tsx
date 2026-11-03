// components/store/HeroBanner.tsx
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="w-full">
      {/* Campo oscuro: el nombre y la promesa, sin adornos */}
      <div className="bg-[#0b1c30] text-white">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-10 pt-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 lg:px-8 lg:pb-14 lg:pt-20">
          <div className="hero-rise max-w-3xl">
            <h1 className="text-[clamp(2.75rem,7.2vw,6rem)] font-extrabold leading-[0.94] tracking-[-0.045em]">
              Equipo que
              <br />
              compite.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Periféricos, audio y monitores originales, elegidos para rendir.
              Despacho express a todo el Perú y garantía oficial de dos años.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/productos"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 text-base font-semibold text-[#0b1c30] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1c30]"
              >
                Explorar catálogo
              </Link>
              <Link
                href="/productos?categoria=ofertas"
                className="inline-flex min-h-12 items-center text-base font-semibold text-[#ffb690] underline decoration-[#ffb690]/40 underline-offset-8 transition-colors hover:text-white hover:decoration-white"
              >
                Ver ofertas de la semana
              </Link>
            </div>
          </div>

          <dl className="hero-rise hidden grid-cols-1 gap-4 text-base sm:grid sm:grid-cols-3 lg:gap-8 [animation-delay:120ms]">
            <div>
              <dt className="text-white/55">Despacho</dt>
              <dd className="mt-1 font-semibold">24 h en Lima</dd>
            </div>
            <div>
              <dt className="text-white/55">Garantía</dt>
              <dd className="mt-1 font-semibold">Oficial 2 años</dd>
            </div>
            <div>
              <dt className="text-white/55">Pagos</dt>
              <dd className="mt-1 font-semibold">Hasta 12 cuotas</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* La pieza fotográfica: el catálogo entra completo, a escala de banda */}
      <div className="overflow-hidden bg-[#eef2f8]">
        <img
          src="/banner.jpg"
          alt="Periféricos de NEXORA: teclados, mouse, micrófonos, audífonos y monitores"
          width={1024}
          height={341}
          className="hero-drift mx-auto block h-[220px] w-full max-w-[1600px] object-cover object-center sm:h-[300px] lg:h-[360px]"
        />
      </div>
    </section>
  );
}
