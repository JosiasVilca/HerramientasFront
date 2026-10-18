"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Upload, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export default function ProductUpload() {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedProduct, setUploadedProduct] = useState<ProductResponse | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      setError("Por favor selecciona una imagen del producto.");
      return;
    }

    if (!name.trim()) {
      setError("El nombre del producto es obligatorio.");
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError("Por favor ingresa un precio válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadedProduct(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("price", price);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const response = await fetch(`${baseUrl}/products/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: No se pudo subir el producto.`);
      }

      const data: ProductResponse = await response.json();
      setUploadedProduct(data);
      
      // Reset form
      setName("");
      setPrice("");
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Error de red al conectar con el servidor Spring Boot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-slate-100">
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">Registro de Producto</h2>
          <p className="text-xs text-slate-400">Subida multimedia a Cloudinary & Persistencia PostgreSQL</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {uploadedProduct && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>¡Producto guardado exitosamente!</span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
            <p><strong className="text-slate-400">ID:</strong> {uploadedProduct.id}</p>
            <p><strong className="text-slate-400">Nombre:</strong> {uploadedProduct.name}</p>
            <p><strong className="text-slate-400">Precio:</strong> S/ {Number(uploadedProduct.price).toFixed(2)}</p>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 block mb-1.5 font-semibold">URL de Cloudinary:</span>
              <a 
                href={uploadedProduct.imageUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:underline break-all font-mono text-[11px]"
              >
                {uploadedProduct.imageUrl}
              </a>
            </div>
          </div>
          {uploadedProduct.imageUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
              <img 
                src={uploadedProduct.imageUrl} 
                alt={uploadedProduct.name} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="productName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Nombre del Producto
          </label>
          <input
            id="productName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Teclado Mecánico RGB"
            className="w-full h-11 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="productPrice" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Precio (S/)
          </label>
          <input
            id="productPrice"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ej: 299.90"
            className="w-full h-11 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Imagen del Producto (Cloudinary)
          </label>
          
          <div className="relative border-2 border-dashed border-slate-800 hover:border-purple-500/50 bg-slate-950/60 rounded-2xl p-6 text-center transition-colors cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {preview ? (
              <div className="space-y-3">
                <div className="relative aspect-video max-h-48 mx-auto rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                  <img src={preview} alt="Vista previa" className="w-full h-full object-contain" />
                </div>
                <p className="text-xs text-purple-400 font-semibold">Clic o arrastra para cambiar la imagen</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-slate-400 group-hover:text-purple-400 group-hover:bg-purple-600/10 flex items-center justify-center transition-colors border border-slate-800">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Selecciona o suelta tu archivo de imagen</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP hasta 10MB</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Subiendo a Cloudinary...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Guardar Producto</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
