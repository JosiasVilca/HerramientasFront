// components/store/TikTokCarousel.tsx
"use client";

import { useRef, useState } from "react";
import { FiExternalLink, FiPlay, FiPause, FiVolume2, FiVolumeX } from "react-icons/fi";

const videos = [
  {
    id: 1,
    views: "70.2K",
    title: "Test de mouse inalámbrico a 8.000 Hz: ¿vale la pena el salto? 🤔",
    hashtag: "#nexorastore #gaming #peru",
    src: "/videos/tiktok1.mp4",
  },
  {
    id: 2,
    views: "68.1K",
    title: "Mi Dark Walnut Setup Tour 2026: mousepad de vidrio y periféricos premium 🖥️",
    hashtag: "#setup #gamingsetup #tech",
    src: "/videos/tiktok2.mp4",
  },
  {
    id: 3,
    views: "68.5K",
    title: "Unboxing: Apolo Pro TKL 8K y BlackWidow V4 Pro 🔥",
    hashtag: "#unboxing #razer #keyboard",
    src: "/videos/tiktok3.mp4",
  },
  {
    id: 4,
    views: "64.3K",
    title: "Test de audio en CS2 y Valorant: configurando el Arctis Nova Pro 🎧",
    hashtag: "#cs2 #valorant #steelseries",
    src: "/videos/tiktok4.mp4",
  },
];

function VideoCard({ video }: { video: (typeof videos)[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      onClick={togglePlay}
      className="group relative flex-shrink-0 w-44 sm:w-48 md:w-52 aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 cursor-pointer"
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={video.src}
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Degradado inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>

      {/* Views arriba izquierda */}
      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
        <FiPlay className="w-2.5 h-2.5 fill-white" />
        {video.views}
      </div>

      {/* Botón mute arriba derecha */}
      <button
        onClick={toggleMute}
        className="absolute top-2 right-2 w-7 h-7 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition z-20"
        aria-label={isMuted ? "Activar sonido" : "Silenciar"}
      >
        {isMuted ? (
          <FiVolumeX className="w-3.5 h-3.5" />
        ) : (
          <FiVolume2 className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Botón play/pausa centro (solo visible cuando pausado) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiPlay className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Indicador de pausa (arriba centro) */}
      {isPlaying && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <FiPause className="w-2.5 h-2.5" />
          Click para pausar
        </div>
      )}

      {/* Info abajo */}
      <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
        <p className="text-white text-[11px] font-semibold mb-1 line-clamp-3 leading-snug">
          {video.title}
        </p>
        <p className="text-cyan-300 text-[9px] font-medium">
          {video.hashtag}
        </p>
      </div>
    </div>
  );
}

export default function TikTokCarousel() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div>
          <span className="inline-flex items-center bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-widest uppercase mb-2">
            Contenido Viral
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Síguenos en TikTok{" "}
            <span className="text-cyan-500 font-bold">@nexorastore.pe</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Descubre nuestros productos, novedades, directos y contenido gamer
            exclusivo.
          </p>
        </div>

        <a
          href="https://www.tiktok.com/@mmstorepe"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-purple-600 transition-colors uppercase tracking-wider self-start"
        >
          <FiExternalLink className="w-3.5 h-3.5" />
          Abrir TikTok NEXORA STORE
        </a>
      </div>

      {/* Carrusel horizontal */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}