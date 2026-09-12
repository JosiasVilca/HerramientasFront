// components/store/HeroBanner.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  {
    id: 1,
    badge: "LANZAMIENTO EXCLUSIVO",
    title: "OFERTAS GAMER",
    subtitle:
      "Hasta 40% de descuento en periféricos seleccionados de calibre competitivo.",
    description:
      "Únete a nuestro setup con despacho express a todo el Perú y garantía oficial.",
    imagen: "banner.jpg",
    specs: [
      { label: "8000 Hz", sub: "POLLING RATE" },
      { label: "0.2 ms", sub: "LATENCIA BT" },
      { label: "PRO WIRELESS", sub: "BAJA LATENCIA" },
    ],
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-6">
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 min-h-[420px] sm:min-h-[480px] shadow-2xl">
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${slide.imagen}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 p-8 sm:p-12 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-300 tracking-wider uppercase">
              {slide.badge}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4 leading-none">
            {slide.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mb-3 leading-relaxed">
            {slide.subtitle}
          </p>

          <p className="text-sm text-slate-400 mb-8">{slide.description}</p>

          {/* Botones */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href="/categoria/ofertas"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-400 text-white font-semibold text-sm rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Comprar ahora →
            </Link>
            <Link
              href="/ofertas"
              className="px-6 py-3 border-2 border-white/30 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition-all"
            >
              Ver ofertas
            </Link>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-3">
            {slide.specs.map((spec, i) => (
              <div
                key={i}
                className="bg-slate-800/60 border border-white/10 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[140px]"
              >
                <div className="text-lg font-bold text-white">{spec.label}</div>
                <div className="text-[10px] text-slate-400 tracking-widest uppercase">
                  {spec.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flechas (solo si hay más de un slide) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition z-20"
              aria-label="Anterior"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition z-20"
              aria-label="Siguiente"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
