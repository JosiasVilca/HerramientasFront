"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Loader2, Calendar, MapPin, Truck, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { trackPackage } from "@/lib/api-client";
import { TrackingSummaryDTO, TrackingStatus } from "@/types/tracking";

const STAGES: { status: TrackingStatus; label: string }[] = [
  { status: "REGISTRADO", label: "Registrado" },
  { status: "EN_ALMACEN", label: "En Almacén" },
  { status: "EN_TRANSITO", label: "En Tránsito" },
  { status: "EN_RUTA", label: "En Ruta" },
  { status: "ENTREGADO", label: "Entregado" },
];

export default function QuickTrackingForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingSummaryDTO | null>(null);
  const [open, setOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Por favor ingresa un número de guía.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await trackPackage(code);
      setResult(data);
      setOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar el envío.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: TrackingStatus) => {
    switch (status) {
      case "ENTREGADO":
        return <Badge className="bg-green-600 text-white hover:bg-green-700">Entregado</Badge>;
      case "EN_RUTA":
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700">En Ruta de Entrega</Badge>;
      case "EN_TRANSITO":
        return <Badge className="bg-sky-600 text-white hover:bg-sky-700">En Tránsito</Badge>;
      case "EN_ALMACEN":
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Recibido en Almacén</Badge>;
      case "REGISTRADO":
        return <Badge className="bg-zinc-500 text-white hover:bg-zinc-600">Registrado</Badge>;
      case "INCIDENCIA":
        return <Badge variant="destructive">Incidencia</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Determine the index of the current status in the STAGES array
  const currentStageIndex = STAGES.findIndex((s) => s.status === result?.currentStatus);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Introduce código de guía (Ej: SW-9843-XY, TRK-1111-AA)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            className="w-full h-12 pl-4 pr-10 text-base border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900 rounded-xl focus-visible:ring-primary shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-12 px-8 rounded-xl font-semibold active:scale-[0.98] transition-transform cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground shadow-md flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Buscar</span>
            </>
          )}
        </Button>
      </form>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Info Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <DialogHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6">
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Guía: {result?.trackingCode}
                </DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                  Última actualización: {result?.lastUpdate}
                </DialogDescription>
              </div>
              <div className="shrink-0">{result && getStatusBadge(result.currentStatus)}</div>
            </div>
          </DialogHeader>

          {result && (
            <div className="space-y-6 pt-4">
              
              {/* Core Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60">
                <div className="space-y-1">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Origen</span>
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{result.originCity}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Destino</span>
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{result.destinationCity}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Fecha Estimada</span>
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{result.estimatedDeliveryDate}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Peso</span>
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                    <Package className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{result.weight ? `${result.weight} kg` : "N/D"}</span>
                  </div>
                </div>
              </div>

              {/* Graphical Timeline (Skip on INCIDENCIA status mapping for linear flow) */}
              {result.currentStatus !== "INCIDENCIA" && (
                <div className="py-2">
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-6">Estado del Envío</h4>
                  
                  {/* Timeline Horizontal Line (Large screens) */}
                  <div className="relative hidden sm:block">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0 rounded-full" />
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500" 
                      style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
                    />
                    
                    <div className="relative z-10 flex justify-between">
                      {STAGES.map((stage, idx) => {
                        const isCompleted = idx <= currentStageIndex;
                        const isActive = idx === currentStageIndex;
                        
                        return (
                          <div key={stage.status} className="flex flex-col items-center gap-2">
                            <div 
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white dark:bg-zinc-900 transition-all ${
                                isCompleted 
                                  ? "border-primary text-primary" 
                                  : "border-zinc-300 dark:border-zinc-700 text-zinc-400"
                              } ${isActive ? "ring-4 ring-primary/20 scale-110" : ""}`}
                            >
                              {idx < currentStageIndex ? (
                                <CheckCircle className="w-4 h-4 fill-primary/10" />
                              ) : (
                                <div className={`w-2 h-2 rounded-full ${isCompleted ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-700"}`} />
                              )}
                            </div>
                            <span className={`text-[11px] font-bold ${isCompleted ? "text-primary" : "text-zinc-400 dark:text-zinc-500"}`}>
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vertical Timeline (Mobile / Small screens) */}
                  <div className="block sm:hidden space-y-4">
                    {STAGES.map((stage, idx) => {
                      const isCompleted = idx <= currentStageIndex;
                      const isActive = idx === currentStageIndex;
                      
                      return (
                        <div key={stage.status} className="flex items-center gap-3">
                          <div 
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white dark:bg-zinc-900 ${
                              isCompleted ? "border-primary text-primary" : "border-zinc-300 dark:border-zinc-700 text-zinc-400"
                            } ${isActive ? "ring-2 ring-primary/25" : ""}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-700"}`} />
                          </div>
                          <span className={`text-xs font-bold ${isCompleted ? "text-primary" : "text-zinc-400"}`}>
                            {stage.label} {isActive && "(Actual)"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* History Events */}
              <div>
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4">Detalle del Historial</h4>
                <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-zinc-200 dark:before:bg-zinc-800">
                  {result.history?.map((event) => (
                    <div key={event.id} className="flex gap-4 items-start pl-6 relative">
                      <div className="absolute left-[8px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-zinc-50 dark:ring-zinc-900" />
                      <div className="flex-grow space-y-0.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            {event.location} - {event.status}
                          </span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
                            {event.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
