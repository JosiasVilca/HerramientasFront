import React from "react";
import Link from "next/link";
import { Package, MapPin, Clock, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react";

export type OrderStatus = "ENTREGADO" | "EN TRÁNSITO" | "INCIDENCIA" | "EN PREPARACIÓN";

export interface OrderTrackingItem {
  id: string;
  trackingCode: string;
  orderNumber: string;
  productSummary: string;
  itemsCount: number;
  originCity: string;
  destinationCity: string;
  destinationAddress: string;
  lastUpdate: string;
  status: OrderStatus;
  estimatedDelivery?: string;
  totalAmount: number;
}

export default function TrackingCard({ order }: { order: OrderTrackingItem }) {
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "ENTREGADO":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Entregado
          </span>
        );
      case "EN TRÁNSITO":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/30 shadow-sm shadow-[#00f5ff]/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f5ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f5ff]"></span>
            </span>
            En Tránsito
          </span>
        );
      case "INCIDENCIA":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> Incidencia
          </span>
        );
      case "EN PREPARACIÓN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> En Preparación
          </span>
        );
    }
  };

  return (
    <Link
      href={`/tracking-detail/${order.trackingCode}`}
      className="group block bg-[#0f171d]/90 hover:bg-slate-800/40 border border-slate-800/90 hover:border-[#00f5ff]/40 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-[#00f5ff]/5 transition-all duration-200"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#00f5ff] group-hover:border-[#00f5ff]/30 shrink-0 transition-colors">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-base sm:text-lg font-bold text-white group-hover:text-[#00f5ff] transition-colors">
                {order.trackingCode}
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                #{order.orderNumber}
              </span>
              {renderStatusBadge(order.status)}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 truncate max-w-xl">
              {order.productSummary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-4 lg:gap-8 text-xs shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800/60">
          <div className="space-y-0.5">
            <span className="text-slate-500 font-medium block flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00f5ff]" /> Ruta de Envío
            </span>
            <p className="font-semibold text-slate-200">
              {order.originCity} <span className="text-[#00f5ff] mx-1">→</span> {order.destinationCity}
            </p>
          </div>
          <div className="space-y-0.5 min-w-[130px]">
            <span className="text-slate-500 font-medium block flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Última Actualización
            </span>
            <p className="font-mono text-slate-300 font-medium">{order.lastUpdate}</p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-5">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total</span>
              <span className="font-mono font-bold text-sm text-white">S/ {order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-[#00f5ff]/20 group-hover:border-[#00f5ff]/40 group-hover:translate-x-1 transition-all">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}