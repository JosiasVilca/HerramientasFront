import React from "react";
import { MapPin, User, Package as PkgIcon, Truck } from "lucide-react";
import { TrackingDetailDTO } from "@/types/tracking";

export default function ShipmentDetailsCard({ detail }: { detail: TrackingDetailDTO }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
      {/* Columna Izquierda: Datos Operativos */}
      <section className="lg:col-span-7 xl:col-span-8 space-y-4">
        <div className="bg-[#0f171d]/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4 mb-6">
            <PkgIcon className="w-5 h-5 text-[#00f5ff]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Detalles del Paquete</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1">Ruta Programada</span>
              <div className="flex items-center justify-between text-white font-semibold text-sm">
                <span>{detail.originCity}</span>
                <span className="text-slate-600">→</span>
                <span>{detail.destinationCity}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-500 block mb-1">Peso Registrado</span>
                <span className="text-slate-200 font-mono">{detail.weightKg} kg</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-2">Información del Repartidor</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-700">
                  {detail.courierAvatar && detail.courierAvatar !== "N/D" ? (
                    <img src={detail.courierAvatar} alt="Courier" className="w-full h-full object-cover" />
                  ) : (
                    <Truck className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{detail.courierName}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{detail.courierPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Columna Derecha: Datos de Contacto */}
      <aside className="lg:col-span-5 xl:col-span-4 space-y-6">
        <div className="bg-[#0f171d]/90 border border-slate-800/90 rounded-2xl p-6 backdrop-blur-sm shadow-xl h-full">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4 mb-6">
            <User className="w-5 h-5 text-[#00f5ff]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Contactos de Entrega</h2>
          </div>

          <div className="space-y-5 text-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-1">Remitente</span>
              <p className="font-semibold text-slate-200">{detail.senderName}</p>
              <p className="text-slate-400 font-mono text-xs mt-0.5">{detail.senderPhone}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-800/50">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-1">Destinatario</span>
              <p className="font-semibold text-white">{detail.receiverName}</p>
              <p className="text-slate-400 font-mono text-xs mt-0.5">{detail.receiverPhone}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/50">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                <MapPin className="w-4 h-4 text-[#00f5ff]" />
                <span>Dirección Destino</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm">{detail.destinationAddress}</p>
              <p className="text-emerald-400 font-medium text-xs mt-2">
                Est. Entrega: {detail.estimatedDeliveryDate}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}