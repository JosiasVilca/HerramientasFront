"use client";

import React from "react";
import { TrackingEventDTO } from "@/types/tracking";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CheckCircle2, ArrowRightLeft, Warehouse, Truck, AlertTriangle } from "lucide-react";

interface EventTimelineProps {
  events: TrackingEventDTO[];
}

export default function EventTimeline({ events }: EventTimelineProps) {
  const getEventIcon = (status: string) => {
    switch (status) {
      case "ENTREGADO":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "EN_RUTA":
      case "EN_TRANSITO":
        return <Truck className="w-4 h-4 text-primary" />;
      case "EN_ALMACEN":
        return <Warehouse className="w-4 h-4 text-orange-500" />;
      case "INCIDENCIA":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <ArrowRightLeft className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xs">
      <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Historial Detallado del Envío</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {events.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-6">No hay eventos registrados aún.</p>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-zinc-200 dark:before:bg-zinc-800">
            {events.map((event, idx) => {
              const isLatest = idx === 0;

              return (
                <div key={event.id || idx} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full border-2 bg-white dark:bg-zinc-900 flex items-center justify-center transition-all ${
                      isLatest
                        ? "border-primary ring-4 ring-primary/20 text-primary"
                        : "border-zinc-300 dark:border-zinc-700 text-zinc-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isLatest ? "bg-primary animate-ping" : "bg-zinc-400 dark:bg-zinc-600"
                      }`}
                    />
                  </div>

                  <div className="bg-zinc-50/70 dark:bg-zinc-950/40 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 space-y-2 hover:border-primary/30 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
                          {getEventIcon(event.status)}
                        </div>
                        <span className="font-bold text-sm text-zinc-900 dark:text-white">
                          {event.location}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[11px] text-zinc-500 border-zinc-200 dark:border-zinc-800 font-mono self-start sm:self-auto">
                        {event.timestamp}
                      </Badge>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light pl-7">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
