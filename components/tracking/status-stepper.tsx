"use client";

import React from "react";
import { TrackingStatus } from "@/types/tracking";
import { Check, Package, Warehouse, Truck, MapPin, Home, AlertTriangle } from "lucide-react";

interface StatusStepperProps {
  currentStatus: TrackingStatus;
}

interface StepConfig {
  status: TrackingStatus;
  label: string;
  description: string;
  icon: React.ElementType;
}

const STEPS: StepConfig[] = [
  {
    status: "REGISTRADO",
    label: "Registrado",
    description: "Información recibida y guía generada.",
    icon: Package,
  },
  {
    status: "EN_ALMACEN",
    label: "En Almacén",
    description: "Procesado en centro de acopio origen.",
    icon: Warehouse,
  },
  {
    status: "EN_TRANSITO",
    label: "En Tránsito",
    description: "Transportándose hacia el hub de destino.",
    icon: Truck,
  },
  {
    status: "EN_RUTA",
    label: "En Ruta",
    description: "Asignado a repartidor de entrega final.",
    icon: MapPin,
  },
  {
    status: "ENTREGADO",
    label: "Entregado",
    description: "Paquete entregado con conformidad.",
    icon: Home,
  },
];

export default function StatusStepper({ currentStatus }: StatusStepperProps) {
  const isIncidencia = currentStatus === "INCIDENCIA";
  const activeStepIndex = STEPS.findIndex((s) => s.status === currentStatus);

  if (isIncidencia) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200 flex items-start gap-4 shadow-xs">
        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base">Atención: Incidencia Registrada</h3>
          <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed font-light">
            Se ha reportado una observación con la entrega (dirección no encontrada o reintento). El equipo de soporte de SwiftLogix se encuentra coordinando la solución.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xs">
      <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white mb-6 md:mb-8">
        Flujo de Estado del Envío
      </h3>

      {/* DESKTOP STEPPER (Horizontal) */}
      <div className="hidden md:block relative px-4">
        {/* Background Connecting Bar */}
        <div className="absolute top-6 left-10 right-10 h-1 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Active Progress Bar */}
        <div
          className="absolute top-6 left-10 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-in-out"
          style={{
            width: activeStepIndex > 0 ? `${(activeStepIndex / (STEPS.length - 1)) * 90}%` : "0%",
          }}
        />

        <div className="relative z-10 flex justify-between items-start">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeStepIndex;
            const isActive = idx === activeStepIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.status} className="flex flex-col items-center text-center max-w-[130px] group">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                      : isActive
                      ? "bg-white dark:bg-zinc-900 border-primary text-primary ring-4 ring-primary/20 scale-110 shadow-lg"
                      : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <span
                    className={`block text-xs font-bold transition-colors ${
                      isCompleted || isActive ? "text-primary font-bold" : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="block text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE STEPPER (Vertical) */}
      <div className="block md:hidden relative pl-2 space-y-6">
        <div className="absolute top-4 bottom-4 left-[23px] w-0.5 bg-zinc-200 dark:bg-zinc-800 z-0" />
        
        {STEPS.map((step, idx) => {
          const isCompleted = idx < activeStepIndex;
          const isActive = idx === activeStepIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.status} className="relative z-10 flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : isActive
                    ? "bg-white dark:bg-zinc-900 border-primary text-primary ring-4 ring-primary/20"
                    : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-4 h-4" />}
              </div>

              <div className="pt-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4
                    className={`text-xs font-bold ${
                      isCompleted || isActive ? "text-primary" : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isActive && (
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                      Estado Actual
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
