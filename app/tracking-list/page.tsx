"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Gamepad2, Package, ShoppingBag, Loader2 } from "lucide-react";
import TrackingFilterBar from "@/components/tracking-list/tracking-filter-bar";
import TrackingCard, { OrderTrackingItem } from "@/components/tracking-list/tracking-card";

// Interfaz que coincide con la estructura guardada por el carrito
interface PedidoGuardado {
  codigoUnico: string;
  articulos: { nombre: string; cantidad: number }[];
  montoTotal: number;
  fechaCreacion: string;
  estado: string;
  direccion?: { direccion: string };
}

export default function TrackingListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("TODOS");
  
  const [realOrders, setRealOrders] = useState<OrderTrackingItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      // 1. Extraemos los pedidos reales del localStorage (la compra finalizada)
      const storedOrders = localStorage.getItem("user_orders");
      
      if (storedOrders) {
        const parsedOrders: PedidoGuardado[] = JSON.parse(storedOrders);
        
        // 2. Mapeamos la data del carrito al formato visual de tu tarjeta
        const mappedOrders: OrderTrackingItem[] = parsedOrders.map((pedido) => {
          
          // Sincronizar los estados de la orden con el diseño UI
          let mappedStatus: "EN PREPARACIÓN" | "EN TRÁNSITO" | "ENTREGADO" | "INCIDENCIA" = "EN PREPARACIÓN";
          if (pedido.estado === "En camino") mappedStatus = "EN TRÁNSITO";
          if (pedido.estado === "Entregado") mappedStatus = "ENTREGADO";
          
          // Limpiamos el símbolo '#' para tener una URL de detalle limpia (ej. ECO-12345)
          const cleanCode = pedido.codigoUnico.replace("#", "");
          
          // Generar el texto resumen de los productos comprados
          const totalItems = pedido.articulos.reduce((acc, item) => acc + item.cantidad, 0);
          const firstProductName = pedido.articulos[0]?.nombre || "Paquete";
          const summary = totalItems > 1 ? `${firstProductName} y más...` : firstProductName;

          return {
            id: pedido.codigoUnico,
            trackingCode: cleanCode,
            orderNumber: cleanCode,
            productSummary: summary,
            itemsCount: totalItems,
            originCity: "Lima (HQ Central)",
            destinationCity: "Lima Metropolitana",
            destinationAddress: pedido.direccion?.direccion || "Dirección de cliente",
            lastUpdate: pedido.fechaCreacion,
            status: mappedStatus,
            estimatedDelivery: "En 24 a 48 hrs",
            totalAmount: pedido.montoTotal,
          };
        });
        
        setRealOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Error al cargar pedidos guardados:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const filteredOrders = useMemo(() => {
    return realOrders.filter((order) => {
      const matchesSearch =
        order.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === "TODOS" || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [realOrders, searchQuery, selectedStatus]);

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
            <Link 
                href="/admin/inventory" 
                className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#859398] transition hover:text-[#00d9ff]"
              >
                {/* Opcional: puedes dejar un ícono de flecha o el que ya tenía */}
                <span>← Volver</span>
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

        <section className="space-y-3 mt-6">
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#00f5ff]" />
              <p className="text-sm font-semibold tracking-wider uppercase">Cargando envíos...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => <TrackingCard key={order.id} order={order} />)
          ) : (
            <div className="bg-[#0f171d]/90 border border-slate-800/90 rounded-2xl p-12 text-center backdrop-blur-sm">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No tienes pedidos recientes</h3>
              <button
                onClick={() => { setSearchQuery(""); setSelectedStatus("TODOS"); }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold uppercase text-slate-200 transition"
              >
                Restablecer Filtros
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}