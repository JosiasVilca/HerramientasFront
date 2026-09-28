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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-semibold text-muted-foreground">Cargando información de envío...</span>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground p-4">
        <div className="bg-card border border-border/80 rounded-xl p-8 max-w-md w-full text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-foreground mb-2">Envío no encontrado</h2>
          <p className="text-xs text-muted-foreground mb-6">{error || "No se encontró ningún envío asociado a este código de seguimiento."}</p>
          <Link 
            href="/tracking-list" 
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const isIncidencia = detail.currentStatus === "INCIDENCIA";
  const isEntregado = detail.currentStatus === "ENTREGADO";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-600/30">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white flex items-center justify-center font-bold text-base shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-white uppercase block leading-tight">
                NEXORA <span className="text-purple-400 font-normal">STORE</span>
              </span>
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest block">
                Sistema de Paquetería
              </span>
            </div>
          </Link>
          <Link 
            href="/packages" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400" /> 
            <span>Panel de Envíos</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 block mb-1">
              Guía de Seguimiento Logístico
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Guía <span className="font-mono text-purple-400">#{detail.trackingCode}</span>
            </h1>
          </div>
          <div className="inline-flex items-center gap-2">
            <span 
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${
                isIncidencia
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  : isEntregado
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-purple-600/20 text-purple-300 border-purple-500/30"
              }`}
            >
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