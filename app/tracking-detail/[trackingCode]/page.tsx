"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { trackingService } from "@/services/tracking.service";
import { TrackingDetailDTO } from "@/types/tracking";

// Tus 3 nuevos componentes aislados
import ShipmentProgress from "@/components/tracking-detail/shipment-progress";
import ShipmentDetailsCard from "@/components/tracking-detail/shipment-details-card";
import TrackingTimeline from "@/components/tracking-detail/tracking-timeline";

export default function TrackingDetailPage() {
  const params = useParams();
  // Capturamos el código de la URL basándonos en el nombre de la carpeta [trackingCode]
  const trackingCode = params?.trackingCode as string;

  const [detail, setDetail] = useState<TrackingDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!trackingCode) return;
    
    trackingService.getTrackingDetail(trackingCode)
      .then((data) => {
        setDetail(data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [trackingCode]);

  if (loading) {
    return <div className="min-h-screen bg-[#070b0e] flex items-center justify-center text-[#00f5ff]">Cargando detalle de envío...</div>;
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#070b0e] flex flex-col items-center justify-center text-slate-300 gap-4">
        <p>{error || "No se encontró el envío"}</p>
        <Link href="/tracking-list" className="text-[#00f5ff] hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b0e] text-slate-100 font-sans">
      <header className="border-b border-slate-800/80 bg-[#0d1418]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-white group-hover:border-[#00f5ff]/50 transition-colors shadow-lg shadow-cyan-950/20">
                <Gamepad2 className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <span className="font-black text-lg tracking-widest text-white uppercase group-hover:text-[#00f5ff] transition-colors">
                NEXORA STORE
              </span>
            </Link>
          <Link href="/tracking-list" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8">
          <div>
            {/* Restauramos el subtítulo original que se había borrado */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00f5ff]">
              <span>Seguimiento Logístico</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mt-1">
              Guía <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{detail.trackingCode}</span>
            </h1>
          </div>
          <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-lg ${detail.currentStatus === 'INCIDENCIA' ? 'bg-red-900/20 border-red-500/30 text-red-400' : 'bg-slate-900/90 border-[#00f5ff]/30 text-slate-200'}`}>
             <span className="text-xs font-extrabold uppercase tracking-wider">
              {detail.currentStatus.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Tus componentes en acción */}
        <ShipmentProgress currentStatus={detail.currentStatus} lastUpdate={detail.lastUpdate} />
        <ShipmentDetailsCard detail={detail} />
        <TrackingTimeline history={detail.history} />
      </main>
    </div>
  );
}