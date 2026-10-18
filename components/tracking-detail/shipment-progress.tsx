import React from "react";
import { ClipboardList, Package, Truck, CheckCircle, AlertTriangle } from "lucide-react";
import { TrackingStatus } from "@/types/tracking";

interface ShipmentProgressProps {
  currentStatus: TrackingStatus;
  lastUpdate: string;
}

export default function ShipmentProgress({ currentStatus, lastUpdate }: ShipmentProgressProps) {
  const isIncidencia = currentStatus === "INCIDENCIA";
  
  const getStepIndex = (status: TrackingStatus) => {
    switch (status) {
      case "REGISTRADO": return 1;
      case "EN_ALMACEN": return 2;
      case "EN_TRANSITO": 
      case "EN_RUTA": return 3;
      case "ENTREGADO": return 4;
      case "INCIDENCIA": return 3;
      default: return 1;
    }
  };

  const currentStepIndex = getStepIndex(currentStatus);

  const steps = [
    { step: 1, title: "Registrado", icon: ClipboardList },
    { step: 2, title: "En Almacén", icon: Package },
    { step: 3, title: isIncidencia ? "Incidencia" : "En Camino", icon: isIncidencia ? AlertTriangle : Truck },
    { step: 4, title: "Entregado", icon: CheckCircle },
  ];

  return (
    <section className="bg-card border border-border/80 rounded-xl p-6 sm:p-8 mb-8 shadow-xs">
      <div className="flex justify-between items-center mb-6 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Progreso del Envío</h2>
          <p className="text-sm font-semibold text-foreground mt-0.5">Línea de Tiempo Operativa</p>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
          Actualizado: {lastUpdate}
        </span>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {steps.map((step) => {
            const isCompleted = step.step <= currentStepIndex;
            const isCurrent = step.step === currentStepIndex;
            const IconComponent = step.icon;

            let cardStyles = "bg-muted/30 border-border/40 opacity-60";
            let iconBoxStyles = "bg-muted text-muted-foreground border-border";
            let titleStyles = "text-muted-foreground font-medium";

            if (isCurrent) {
              if (isIncidencia) {
                cardStyles = "bg-destructive/10 border-destructive/40 shadow-xs ring-1 ring-destructive/20";
                iconBoxStyles = "bg-destructive text-destructive-foreground border-destructive";
                titleStyles = "text-destructive font-bold";
              } else {
                cardStyles = "bg-accent/60 border-primary/40 shadow-xs ring-1 ring-primary/20";
                iconBoxStyles = "bg-primary text-primary-foreground border-primary";
                titleStyles = "text-primary font-bold";
              }
            } else if (isCompleted) {
              cardStyles = "bg-slate-900 border-slate-800 shadow-2xs";
              iconBoxStyles = "bg-purple-600/15 text-purple-400 border-purple-500/30";
              titleStyles = "text-slate-200 font-semibold";
            }

            return (
              <div
                key={step.step}
                className={`flex items-center gap-3.5 p-3.5 rounded-lg border transition-all ${cardStyles}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-2xs ${iconBoxStyles}`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Paso 0{step.step}
                  </span>
                  <div className={`text-sm ${titleStyles}`}>
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}