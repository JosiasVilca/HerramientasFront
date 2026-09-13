// components/store/SetupBanner.tsx
import Link from "next/link";
import { FiCheck } from "react-icons/fi";

export default function SetupBanner() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-4">
      <div className="relative rounded-3xl overflow-hidden min-h-[400px] sm:min-h-[450px]">
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/promo.jpg')" }}
        ></div>

        {/* Degradado morado encima para que el texto se lea */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/50 to-purple-700/10"></div>
        {/* Resplandor decorativo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/20 blur-[100px] rounded-full"></div>

        {/* Contenido */}
        <div className="relative z-10 p-8 sm:p-12 max-w-2xl">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-cyan-400/20 border border-cyan-300/40 text-cyan-100 text-[10px] font-bold px-3 py-1.5 rounded-md tracking-wider uppercase">
              Combos Gamer + Envío Gratis
            </span>
            <span className="inline-flex items-center bg-emerald-500/20 border border-emerald-300/40 text-emerald-100 text-[10px] font-bold px-3 py-1.5 rounded-md tracking-wider uppercase">
              Hasta 30% Off
            </span>
          </div>

          {/* Título */}
          <h2
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5"
            style={{
              textShadow:
                "0 4px 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)",
            }}
          >
            MEJORA TU SETUP
          </h2>

          {/* Descripción */}
          <p
            className="text-sm sm:text-base text-white mb-8 leading-relaxed max-w-lg"
            style={{
              textShadow:
                "0 4px 20px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.8)",
            }}
          >
            Optimiza tu estación de juego con packs calibrados para competir:
            teclados mecánicos hot-swap, mouse inalámbricos de 8 kHz y
            alternativas de velocidad extrema en un solo paquete con descuento
            directo en NEXORA.
          </p>

          {/* Botón */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-bold text-sm rounded-lg hover:bg-purple-50 transition-colors shadow-lg"
            >
              Ver combos y ofertas →
            </Link>
          </div>

          {/* Check */}
          <div className="flex items-center gap-2 text-purple-100 text-sm">
            <span className="w-5 h-5 rounded-full bg-emerald-400/30 border border-emerald-300/60 flex items-center justify-center">
              <FiCheck className="w-3 h-3 text-emerald-200" />
            </span>
            Garantía de 2 años incluida
          </div>
        </div>
      </div>
    </section>
  );
}
