"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Gamepad2, Package, ShoppingBag } from "lucide-react";
import TrackingFilterBar from "@/components/tracking-list/tracking-filter-bar";
import TrackingCard, { OrderTrackingItem } from "@/components/tracking-list/tracking-card";

// Mantenemos los datos mockeados aquí temporalmente hasta conectarlo con tracking.service.ts
const mockOrders: OrderTrackingItem[] = [
  { id: "ord-1", trackingCode: "SW-9843-XY", orderNumber: "NXR-88214", productSummary: "Mouse Ultraligero 8K + Teclado Hall Effect 60HE+", itemsCount: 2, originCity: "Lima (HQ Central)", destinationCity: "Lima (San Isidro)", destinationAddress: "Av. Los Conquistadores 480", lastUpdate: "Hoy, 04:15 PM", status: "EN TRÁNSITO", estimatedDelivery: "Hoy ~05:00 PM", totalAmount: 1288.0 },
  { id: "ord-2", trackingCode: "SW-7731-AB", orderNumber: "NXR-88190", productSummary: "Auriculares Planar Magnetic Pro Wireless", itemsCount: 1, originCity: "Lima", destinationCity: "Arequipa (Cercado)", destinationAddress: "Urb. Vallecito B-12", lastUpdate: "Ayer, 06:30 PM", status: "ENTREGADO", estimatedDelivery: "Entregado el 23 Oct", totalAmount: 749.0 },
  { id: "ord-3", trackingCode: "SW-6429-KL", orderNumber: "NXR-88155", productSummary: "Mousepad Glass Control Ultra + Skates Cerámica", itemsCount: 2, originCity: "Lima", destinationCity: "Cusco (Wanchaq)", destinationAddress: "Av. La Florida 305", lastUpdate: "Hoy, 10:20 AM", status: "INCIDENCIA", estimatedDelivery: "Retenido por validación de dirección", totalAmount: 319.0 },
];

export default function TrackingListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("TODOS");

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        order.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === "TODOS" || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  return (
    <div className="min-h-screen bg-[#070b0e] text-slate-100 font-sans selection:bg-[#00f5ff]/20 selection:text-[#00f5ff]">
      <header className="sticky top-0 z-40 bg-[#070b0e]/95 backdrop-blur-md border-b border-slate-800/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-white group-hover:border-[#00f5ff]/50 transition-colors shadow-lg shadow-cyan-950/20">
              <Gamepad2 className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <span className="font-black text-lg tracking-widest text-white uppercase group-hover:text-[#00f5ff] transition-colors">
              NEXORA STORE
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4 text-[#00f5ff]" /> Tienda Oficial
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00f5ff] mb-1">
              <span>Centro de Envíos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Listado de Pedidos</h1>
          </div>
        </div>

        <TrackingFilterBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          selectedStatus={selectedStatus} 
          setSelectedStatus={setSelectedStatus} 
        />

        <section className="space-y-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => <TrackingCard key={order.id} order={order} />)
          ) : (
            <div className="bg-[#0f171d]/90 border border-slate-800/90 rounded-2xl p-12 text-center backdrop-blur-sm">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No se encontraron pedidos</h3>
              <button
                onClick={() => { setSearchQuery(""); setSelectedStatus("TODOS"); }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold uppercase text-slate-200 transition"
              >
                Restablecer Búsqueda
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}