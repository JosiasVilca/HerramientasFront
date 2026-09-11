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
      case "INCIDENCIA": return 3; // Se queda visualmente en tránsito pero con alerta
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
    <section className="bg-[#0f171d]/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-sm shadow-xl">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Estado del Envío</h2>
        <span className="text-xs text-slate-500">Última act: {lastUpdate}</span>
      </div>

      <div className="relative">
        <div className="hidden md:block absolute top-6 left-12 right-12 h-0.5 bg-slate-800/90 -z-0" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative z-10">
          {steps.map((step) => {
            const isCompleted = step.step <= currentStepIndex;
            const isCurrent = step.step === currentStepIndex;
            const IconComponent = step.icon;
            
            let ringColor = "ring-[#00f5ff]/10";
            let borderColor = "border-[#00f5ff]/40";
            let bgColor = "bg-[#142028]";
            let iconColor = "text-[#00f5ff]";

            if (isIncidencia && isCurrent) {
              ringColor = "ring-red-500/20";
              borderColor = "border-red-500/50";
              iconColor = "text-red-500";
            }

            return (
              <div
                key={step.step}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? `${bgColor} ${borderColor} shadow-lg shadow-[#00f5ff]/5`
                    : isCompleted && !isIncidencia
                    ? "bg-slate-900/40 border-slate-800/80"
                    : "bg-slate-900/20 border-slate-800/40 opacity-50"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                    isCurrent
                      ? `bg-slate-800/50 ${iconColor} border ${borderColor} ring-4 ${ringColor}`
                      : isCompleted && !isIncidencia
                      ? "bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/30"
                      : "bg-slate-800 text-slate-500 border border-slate-700"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="space-y-1 mt-3">
                  <div className={`text-sm font-bold ${isCurrent ? "text-white" : "text-slate-400"}`}>
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