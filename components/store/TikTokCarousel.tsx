// components/store/TikTokCarousel.tsx
"use client";

import { FiExternalLink, FiPlay } from "react-icons/fi";

const videos = [
  {
    id: 1,
    views: "70.2K",
    title: "Test de mouse inalámbrico a 8.000 Hz: ¿vale la pena el salto? 🤔",
    hashtag: "#nexorastore #gaming #peru",
    thumbnail:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    views: "68.1K",
    title:
      "Mi Dark Walnut Setup Tour 2026: mousepad de vidrio y periféricos premium 🖥️",
    hashtag: "#setup #gamingsetup #tech",
    thumbnail:
      "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    views: "68.5K",
    title: "Unboxing: Apolo Pro TKL 8K y BlackWidow V4 Pro 🔥",
    hashtag: "#unboxing #razer #keyboard",
    thumbnail:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    views: "64.3K",
    title:
      "Test de audio en CS2 y Valorant: configurando el Arctis Nova Pro 🎧",
    hashtag: "#cs2 #valorant #steelseries",
    thumbnail:
      "https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=600&auto=format&fit=crop",
  },
];

export default function TikTokCarousel() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center bg-cyan-100 text-cyan-700 text-xs font-bold px-3 py-1 rounded-md tracking-widest uppercase mb-3">
            Contenido Viral
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Síguenos en TikTok{" "}
            <span className="text-cyan-500 font-bold">@nexorastore.pe</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Descubre nuestros productos, novedades, directos y contenido gamer
            exclusivo.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-purple-600 transition-colors uppercase tracking-wider self-start">
          <FiExternalLink className="w-4 h-4" />
          Abrir TikTok NEXORA STORE
        </button>
      </div>

      {/* Carrusel horizontal */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group relative flex-shrink-0 w-64 sm:w-72 aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer"
          >
            {/* Imagen de fondo */}
            <img
              src={video.thumbnail}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Degradado inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

            {/* Views arriba izquierda */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <FiPlay className="w-3 h-3 fill-white" />
              {video.views}
            </div>

            {/* Botón play centro */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiPlay className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
            </div>

            {/* Info abajo */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-sm font-semibold mb-2 line-clamp-3 leading-snug">
                {video.title}
              </p>
              <p className="text-cyan-300 text-xs font-medium">
                {video.hashtag}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
