"use client";

import React from "react";
import { TrackingDetailDTO } from "@/types/tracking";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, User, Phone, Headphones, Receipt, Package, Truck, Flag, Send } from "lucide-react";

interface ShipmentInfoCardProps {
  detail: TrackingDetailDTO;
}

export default function ShipmentInfoCard({ detail }: ShipmentInfoCardProps) {
  return (
    <div className="space-y-6">
      
      {/* ACTION BUTTONS CARD */}
      <div className="p-4 rounded-2xl bg-zinc-900 text-white flex flex-col sm:flex-row gap-3 shadow-md">
        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 rounded-xl cursor-pointer flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" />
          <span>Contactar Soporte</span>
        </Button>
        <Button variant="outline" className="flex-1 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold h-11 rounded-xl cursor-pointer flex items-center justify-center gap-2">
          <Receipt className="w-4 h-4" />
          <span>Descargar Recibo</span>
        </Button>
      </div>

      {/* SHIPMENT DETAILS CARD */}
      <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span>Información del Envío</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          
          {/* Origin & Destination Grid */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-primary border border-blue-100 dark:border-blue-900/50 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Origen</span>
                <p className="font-bold text-sm text-zinc-900 dark:text-white">{detail.originCity}</p>
                <p className="text-xs text-zinc-500 font-light">Remitente: {detail.senderName}</p>
              </div>
            </div>

            <Separator className="bg-zinc-100 dark:bg-zinc-800" />

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-secondary border border-orange-100 dark:border-orange-900/50 shrink-0">
                <Flag className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Destino</span>
                <p className="font-bold text-sm text-zinc-900 dark:text-white">{detail.destinationCity}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">{detail.destinationAddress}</p>
                <p className="text-xs text-zinc-500 font-light">Destinatario: {detail.receiverName}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-100 dark:bg-zinc-800" />

          {/* Additional Package Attributes */}
          <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Peso Total</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {detail.weightKg ? `${detail.weightKg} kg` : "N/D"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Entrega Estimada</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {detail.estimatedDeliveryDate}
              </span>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* COURIER ASSIGNED CARD */}
      <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" />
            <span>Repartidor Asignado</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={detail.courierAvatar} alt={detail.courierName || "Repartidor"} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {detail.courierName ? detail.courierName.substring(0, 2).toUpperCase() : "RP"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-grow space-y-0.5">
              <p className="font-bold text-sm text-zinc-900 dark:text-white">
                {detail.courierName || "Asignación en proceso"}
              </p>
              <p className="text-xs text-zinc-500 font-medium">
                {detail.courierPhone || "Teléfono no disponible"}
              </p>
            </div>

            {detail.courierPhone && (
              <a
                href={`tel:${detail.courierPhone}`}
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                title="Llamar al repartidor"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
