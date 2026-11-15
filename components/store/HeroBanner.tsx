// components/store/HeroBanner.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent, PointerEvent } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";

type HeroSlide = {
  image: string;
  title: [string, string];
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  imageClassName?: string;
};

const SLIDES: HeroSlide[] = [
  {
    image: "/banner.jpg",
    title: ["Equipo que", "compite."],
    description:
      "Periféricos, audio y monitores originales, elegidos para rendir. Despacho express a todo el Perú y garantía oficial de dos años.",
    primary: { label: "Explorar catálogo", href: "/productos" },
    secondary: {
      label: "Ver ofertas de la semana",
      href: "/productos?categoria=ofertas",
    },
    imageClassName: "object-[62%_center] lg:object-center",
  },
  {
    image: "/promo.jpg",
    title: ["Arma tu", "estación."],
    description:
      "Teclados, mouse y audio que funcionan juntos. Elige las piezas por separado o completa tu setup con una sola compra.",
    primary: { label: "Ver combos y periféricos", href: "/productos" },
    imageClassName: "object-[70%_center] lg:object-center",
  },
  {
    image: "/fondo.jpg",
    title: ["Despacho", "express."],
    description:
      "En 24 horas en Lima, envío a todo el Perú, garantía oficial de dos años y hasta 12 cuotas con tarjetas participantes.",
    primary: { label: "Explorar catálogo", href: "/productos" },
    imageClassName: "object-center blur-[1px]",
  },
];

const SLIDE_COUNT = SLIDES.length;
const AUTOPLAY_MS = 7000;

const PRIMARY_CTA_CLASS =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-400 px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-[transform,box-shadow,opacity] duration-200 hover:opacity-90 hover:shadow-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1c30] sm:w-auto";

const SECONDARY_CTA_CLASS =
  "inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-colors hover:border-cyan-300/60 hover:bg-white/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1c30] sm:w-auto";

const CONTROL_CLASS =
  "flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-white/40 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1c30]";

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const slide = SLIDES[active];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setDocumentHidden(document.hidden);

    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const autoplayPaused =
    !playing || hovered || focused || !inView || documentHidden || reduceMotion;

  useEffect(() => {
    if (autoplayPaused) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDE_COUNT);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [autoplayPaused]);

  const goTo = useCallback((index: number) => {
    setActive((index + SLIDE_COUNT) % SLIDE_COUNT);
    setPlaying(false);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!pointerStart.current) return;

    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    pointerStart.current = null;

    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    goTo(active + (deltaX < 0 ? 1 : -1));
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocused(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full touch-pan-y overflow-hidden bg-[#0b1c30] text-white"
      aria-roledescription="carrusel"
      aria-label="Destacados de NEXORA"
      onKeyDown={handleKeyDown}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHovered(false);
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={handleBlur}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
    >
      {/* Fondo full-bleed: la pieza fotográfica vive dentro del bloque oscuro. */}
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((item, index) => (
          <img
            key={item.image}
            src={item.image}
            alt=""
            decoding="async"
            loading="eager"
            fetchPriority={index === 0 ? "high" : "auto"}
            className={`hero-drift absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              item.imageClassName ?? ""
            } ${index === active ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-[#0b1c30]/80 lg:bg-[#0b1c30]/70" />
      </div>

      <div className="relative mx-auto flex min-h-[560px] max-w-[1400px] flex-col px-5 py-9 sm:px-6 sm:py-10 lg:min-h-[640px] lg:px-8 lg:py-14">
        <div className="flex flex-1 items-center py-4 sm:py-8 lg:py-10">
          <div key={active} className="hero-rise w-full max-w-3xl">
            <h1 className="text-[clamp(2.75rem,7vw,6rem)] font-extrabold leading-[0.94] tracking-[-0.045em]">
              {slide.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              {slide.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link href={slide.primary.href} className={PRIMARY_CTA_CLASS}>
                {slide.primary.label}
              </Link>
              {slide.secondary && (
                <Link
                  href={slide.secondary.href}
                  className={SECONDARY_CTA_CLASS}
                >
                  {slide.secondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <dl className="hidden grid-cols-1 gap-4 text-base sm:grid sm:grid-cols-3 lg:gap-8">
            <div>
              <dt className="text-white/80">Despacho</dt>
              <dd className="mt-1 font-semibold">24 h en Lima</dd>
            </div>
            <div>
              <dt className="text-white/80">Garantía</dt>
              <dd className="mt-1 font-semibold">Oficial 2 años</dd>
            </div>
            <div>
              <dt className="text-white/80">Pagos</dt>
              <dd className="mt-1 font-semibold">Hasta 12 cuotas</dd>
            </div>
          </dl>

          <div
            className="flex items-center justify-between gap-3 sm:justify-end"
            role="group"
            aria-label="Controles del carrusel"
          >
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                className={CONTROL_CLASS}
                aria-label="Diapositiva anterior"
              >
                <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="flex items-center">
                {SLIDES.map((item, index) => (
                  <button
                    key={item.image}
                    type="button"
                    onClick={() => goTo(index)}
                    className="flex h-11 w-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1c30]"
                    aria-label={`Ir a la diapositiva ${index + 1} de ${SLIDE_COUNT}: ${item.title.join(" ")}`}
                    aria-current={index === active ? "true" : undefined}
                  >
                    <span
                      className={`h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${
                        index === active
                          ? "w-7 bg-white"
                          : "w-2.5 bg-white/40"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => goTo(active + 1)}
                className={CONTROL_CLASS}
                aria-label="Diapositiva siguiente"
              >
                <FiChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {!reduceMotion && (
              <button
                type="button"
                onClick={() => {
                  const next = !playing;
                  setPlaying(next);
                  if (next) {
                    setHovered(false);
                    setFocused(false);
                  }
                }}
                className={CONTROL_CLASS}
                aria-label={
                  playing
                    ? "Pausar carrusel automático"
                    : "Reanudar carrusel automático"
                }
              >
                {playing ? (
                  <FiPause className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <FiPlay className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>

        <p
          className="sr-only"
          aria-live={playing ? "off" : "polite"}
          aria-atomic="true"
        >
          Diapositiva {active + 1} de {SLIDE_COUNT}: {slide.title.join(" ")}
        </p>
      </div>
    </section>
  );
}
