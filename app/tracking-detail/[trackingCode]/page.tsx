"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Gamepad2, Loader2, Package } from "lucide-react";

import ShipmentProgress from "@/components/tracking-detail/shipment-progress";
import ShipmentDetailsCard from "@/components/tracking-detail/shipment-details-card";
import TrackingTimeline from "@/components/tracking-detail/tracking-timeline";
import { TrackingDetailDTO, TrackingStatus } from "@/types/tracking";

interface PedidoGuardado {
  codigoUnico: string;
  articulos: { id: string; nombre: string; especificacion?: string; precio: number; cantidad: number; imagen: string }[];
  montoTotal: number;
  fechaCreacion: string;
  metodoPago: string;
  estado: string;
  direccion?: {
    nombre: string;
    direccion: string;
    referencia: string;
    telefono: string;
    nota: string;
  };
}

export default function TrackingDetailPage() {
  const params = useParams();
  const trackingCodeParam = params?.trackingCode as string;

  const [detail, setDetail] = useState<TrackingDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!trackingCodeParam) return;

    try {
      const storedOrders = localStorage.getItem("user_orders");
      if (storedOrders) {
        const parsedOrders: PedidoGuardado[] = JSON.parse(storedOrders);
        
        const found = parsedOrders.find(
          (o) => o.codigoUnico.replace("#", "") === trackingCodeParam
        );

        if (found) {
          const currentStat = (found.estado === "En camino" ? "EN_TRÁNSITO" : "EN_PREPARACIÓN") as unknown as TrackingStatus;

          const mappedDetail = {
            trackingCode: found.codigoUnico.replace("#", ""),
            orderId: found.codigoUnico,
            currentStatus: currentStat,
            lastUpdate: found.fechaCreacion,
            origin: "Lima (HQ Central)",
            destination: found.direccion?.direccion || "Dirección local de entrega",
            recipientName: found.direccion?.nombre || "Cliente Nexora",
            estimatedDelivery: "En 24 a 48 hrs",
            items: found.articulos.map((art) => ({
              id: art.id,
              name: art.nombre,
              quantity: art.cantidad,
              price: art.precio,
              image: art.imagen,
            })),
            history: [
              {
                status: "EN_PREPARACIÓN",
                timestamp: found.fechaCreacion,
                description: "El pago fue verificado y la orden ingresó al sistema central.",
              },
              {
                status: "EN_TRÁNSITO",
                timestamp: "Próximamente",
                description: "Courier asignado rumbo a la dirección de destino.",
              },
              {
                status: "ENTREGADO",
                timestamp: "Pendiente",
                description: "Pedido recepcionado por el cliente.",
              },
            ],
          } as unknown as TrackingDetailDTO;

          setDetail(mappedDetail);
          setError("");
        } else {
          setError("No se encontró ningún envío asociado a este código.");
        }
      } else {
        setError("No hay registros de pedidos en este navegador.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al leer los detalles del envío.");
    } finally {
      setLoading(false);
    }
  }, [trackingCodeParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b0e] flex items-center justify-center text-[#00f5ff] gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Cargando detalle de envío...</span>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#070b0e] flex flex-col items-center justify-center text-slate-300 gap-4">
        <Package className="w-12 h-12 text-slate-600 mb-2" />
        <p className="font-medium text-sm">{error || "No se encontró el envío"}</p>
        <Link href="/tracking-list" className="text-xs font-bold uppercase tracking-wider text-[#00f5ff] hover:underline">
          Volver al listado
        </Link>
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
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00f5ff]">
              <span>Seguimiento Logístico</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mt-1">
              Guía <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{detail.trackingCode}</span>
            </h1>
          </div>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-lg bg-slate-900/90 border-[#00f5ff]/30 text-slate-200">
             <span className="text-xs font-extrabold uppercase tracking-wider">
              {String(detail.currentStatus).replace("_", " ")}
            </span>
          </div>
        </div>

        <ShipmentProgress currentStatus={detail.currentStatus} lastUpdate={detail.lastUpdate} />
        <ShipmentDetailsCard detail={detail} />
        <TrackingTimeline history={detail.history} />
      </main>
    </div>
  );
}