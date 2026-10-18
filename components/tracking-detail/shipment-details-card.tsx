import React from "react";
import { MapPin, User, Package as PkgIcon, Truck, Phone } from "lucide-react";
import { TrackingDetailDTO } from "@/types/tracking";

export default function ShipmentDetailsCard({ detail }: { detail: TrackingDetailDTO }) {
  const origin = detail.originCity || "Lima (HQ Central)";
  const destination = detail.destinationCity || detail.destinationAddress || "Destino Local";
  const weight = detail.weightKg || 1.5;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
      {/* Columna Izquierda: Datos Operativos */}
      <section className="lg:col-span-7 xl:col-span-8 space-y-4">
        <div className="bg-card border border-border/80 rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-4 mb-6">
            <PkgIcon className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Detalles del Paquete</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-muted/40 border border-border/60">
              <span className="text-xs font-medium text-muted-foreground block mb-1">Ruta Programada</span>
              <div className="flex items-center justify-between text-foreground font-semibold text-sm">
                <span>{origin}</span>
                <span className="text-muted-foreground">→</span>
                <span>{destination}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Peso Registrado</span>
                <span className="text-foreground font-semibold text-sm">{weight} kg</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/40 border border-border/60">
              <span className="text-xs font-medium text-muted-foreground block mb-2">Repartidor Asignado</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                  {detail.courierAvatar && detail.courierAvatar !== "N/D" ? (
                    <img src={detail.courierAvatar} alt="Courier" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <Truck className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{detail.courierName || "Courier Asignado"}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    <span>{detail.courierPhone || "+51 987 654 321"}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Columna Derecha: Datos de Contacto */}
      <aside className="lg:col-span-5 xl:col-span-4 space-y-6">
        <div className="bg-card border border-border/80 rounded-xl p-6 shadow-xs h-full">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-4 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Contactos de Entrega</h2>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Remitente</span>
              <p className="font-semibold text-foreground">{detail.senderName || "HerramientasFront Central"}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{detail.senderPhone || "+51 1 200 4000"}</p>
            </div>
            
            <div className="pt-3 border-t border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Destinatario</span>
              <p className="font-semibold text-foreground">{detail.receiverName || "Cliente Registrado"}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{detail.receiverPhone || "+51 912 345 678"}</p>
            </div>

            <div className="pt-3 border-t border-border/60">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Dirección Destino</span>
              </div>
              <p className="text-foreground leading-relaxed text-sm font-medium">{detail.destinationAddress || "Dirección local de entrega"}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent text-accent-foreground text-xs font-semibold">
                <span>Entrega Estimada: {detail.estimatedDeliveryDate || "24 - 48 hrs"}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}