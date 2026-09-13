// components/store/ProductGallery.tsx
"use client";

import { useState, useRef } from "react";
import { FiHeart, FiMaximize2, FiZoomIn } from "react-icons/fi";
import { Product } from "@/data/products";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const containerRef = useRef<HTMLDivElement>(null);

  const images = product.images.length > 0 ? product.images : [product.image];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="w-full">
      {/* Contenedor principal */}
      <div className="relative bg-slate-50 rounded-3xl aspect-square mb-4 border border-slate-200 overflow-hidden">
        {/* Badge de descuento */}
        {product.discount > 0 && (
          <div className="absolute top-4 left-4 z-30">
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
              AHORRAS {product.discount}%
            </div>
            <div className="bg-red-500/20 border border-red-500/40 text-red-700 text-[10px] font-bold px-3 py-1 rounded-lg mt-1 backdrop-blur-sm">
              LIQUIDACIÓN DE MAYO
            </div>
          </div>
        )}

        {/* Imagen con zoom interactivo */}
        <div
          ref={containerRef}
          className="w-full h-full cursor-crosshair"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          style={{
            backgroundImage: `url(${images[selectedImage]})`,
            backgroundSize: isZooming ? "250%" : "contain",
            backgroundPosition: isZooming
              ? `${zoomPosition.x}% ${zoomPosition.y}%`
              : "center",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "content-box",
            transition: isZooming
              ? "background-size 0.2s ease"
              : "background-size 0.3s ease",
            padding: isZooming ? "0" : "24px",
          }}
        />

        {/* Botón favorito */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-30"
          aria-label="Favorito"
        >
          <FiHeart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-slate-400"
            }`}
          />
        </button>

        {/* Botón expandir */}
        <button
          className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-30"
          aria-label="Expandir"
        >
          <FiMaximize2 className="w-4 h-4 text-slate-600" />
        </button>

        {/* Hint */}
        {!isZooming && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-xs text-slate-500 px-3 py-1.5 rounded-lg z-30">
            <FiZoomIn className="w-3.5 h-3.5" />
            Pasa el cursor para hacer zoom HD
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square bg-slate-50 rounded-xl overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? "border-purple-500 shadow-md"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <img
              src={img}
              alt={`${product.name} ${index + 1}`}
              className="w-full h-full object-contain p-2"
            />
          </button>
        ))}
      </div>
    </div>
  );
}