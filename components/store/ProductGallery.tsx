// components/store/ProductGallery.tsx
"use client";

import { useRef, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { Product } from "@/data/products";

interface ProductGalleryProps {
  product: Product;
}

const readFavorite = (productId: string): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem("favorites");
    const favorites: string[] = stored ? JSON.parse(stored) : [];
    return favorites.includes(productId);
  } catch {
    return false;
  }
};

export default function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.images.length > 0 ? product.images : [product.image];
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(() => readFavorite(product.id));
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setZoomPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const toggleFavorite = () => {
    try {
      const stored = localStorage.getItem("favorites");
      const favorites: string[] = stored ? JSON.parse(stored) : [];
      const updated = favorites.includes(product.id)
        ? favorites.filter((id) => id !== product.id)
        : [...favorites, product.id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(updated.includes(product.id));
      window.dispatchEvent(new Event("favoritesChanged"));
    } catch (error) {
      console.error("Error al guardar favorito:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f1f4fa]">
        <div
          ref={containerRef}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          className="h-full w-full cursor-zoom-in overflow-hidden"
        >
          <img
            src={images[selectedImage]}
            alt={product.name}
            className="h-full w-full origin-center object-contain p-6 mix-blend-multiply transition-transform duration-300"
            style={{
              transform: isZooming ? "scale(1.9)" : "scale(1)",
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />
        </div>

        {product.discount > 0 && (
          <span className="absolute left-4 top-4 rounded-lg bg-secondary px-3 py-1.5 text-sm font-bold text-secondary-foreground">
            -{product.discount}%
          </span>
        )}

        <button
          onClick={toggleFavorite}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-card text-muted-foreground transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          aria-label={
            isFavorite
              ? `Quitar ${product.name} de favoritos`
              : `Guardar ${product.name} en favoritos`
          }
          aria-pressed={isFavorite}
        >
          <FiHeart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? "fill-secondary text-secondary" : ""
            }`}
          />
        </button>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((img, index) => (
            <button
              key={img + index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square overflow-hidden rounded-lg bg-[#f1f4fa] ring-2 transition-colors ${
                selectedImage === index
                  ? "ring-primary"
                  : "ring-transparent hover:ring-border"
              }`}
              aria-label={`Ver imagen ${index + 1} de ${product.name}`}
              aria-pressed={selectedImage === index}
            >
              <img
                src={img}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain p-2 mix-blend-multiply"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
