"use client";

import React, { useState } from "react";
import { trackingApi } from "@/lib/api-client";
import { PackageDTO, PackageStatus } from "@/types/tracking";

// Helper to determine active step in visual flow
const getStatusStep = (status: PackageStatus): number => {
  switch (status) {
    case "PENDING":
      return 1;
    case "COLLECTED":
      return 2;
    case "IN_TRANSIT":
      return 3;
    case "OUT_FOR_DELIVERY":
      return 4;
    case "DELIVERED":
      return 5;
    default:
      return 1;
  }
};

const getStatusLabel = (status: PackageStatus): string => {
  switch (status) {
    case "PENDING": return "Registrado";
    case "COLLECTED": return "En Almacén";
    case "IN_TRANSIT": return "En Tránsito";
    case "OUT_FOR_DELIVERY": return "En Ruta de Entrega";
    case "DELIVERED": return "Entregado";
    case "FAILED_DELIVERY": return "Entrega Fallida";
    case "RETURNED": return "Devuelto";
    case "CANCELLED": return "Cancelado";
    default: return status;
  }
};

export default function QuickTrackingForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<PackageDTO | null>(null);

  const validateCode = (val: string) => {
    if (!val.trim()) {
      return "El código de rastreo no puede estar vacío.";
    }
    if (val.trim().length < 5) {
      return "El código debe tener al menos 5 caracteres.";
    }
    return null;
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const validationError = validateCode(code);
    if (validationError) {
      setError(validationError);
      setPackageData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await trackingApi.trackPackage(code);
      setPackageData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo encontrar el paquete");
      setPackageData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = (mockCode: string) => {
    setCode(mockCode);
    setTimeout(() => {
      setLoading(true);
      setError(null);
      trackingApi.trackPackage(mockCode)
        .then(data => {
          setPackageData(data);
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : "Error al cargar datos");
          setPackageData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 50);
  };

  const currentStep = packageData ? getStatusStep(packageData.status) : 0;

  return (
    <div className="w-full flex flex-col items-center gap-lg">
      {/* Search Bar Container */}
      <div className="w-full max-w-2xl bg-surface rounded-xl shadow-md border border-outline-variant p-md transform transition-all hover:shadow-lg">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-sm items-center w-full">
          <div className="relative flex-grow w-full">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline" style={{ fontVariationSettings: "'FILL' 0" }}>
              barcode
            </span>
            <input
              className="w-full pl-xl pr-sm py-md bg-surface border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all outline-none text-on-surface placeholder:text-outline"
              placeholder="Rastrea tu envío (ej: SW-9843-XY)..."
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
              }}
              disabled={loading}
            />
          </div>
          <button
            className="w-full md:w-auto bg-[#f97316] text-white px-xl py-md rounded-lg font-label-md text-label-md hover:bg-opacity-90 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-xs cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
            )}
            {loading ? "Buscando..." : "Rastrear"}
          </button>
        </form>

        {/* Quick test buttons helper */}
        <div className="flex flex-wrap items-center gap-xs mt-sm text-label-sm text-on-surface-variant/80">
          <span>Prueba rápida:</span>
          <button 
            type="button"
            onClick={() => handleQuickTest("SW-9843-XY")}
            className="text-primary hover:underline hover:text-primary-container font-semibold"
          >
            SW-9843-XY (En Tránsito)
          </button>
          <span>•</span>
          <button 
            type="button"
            onClick={() => handleQuickTest("TRK-1111-AA")}
            className="text-primary hover:underline hover:text-primary-container font-semibold"
          >
            TRK-1111-AA (Entregado)
          </button>
        </div>
      </div>

      {/* Validation or API error state */}
      {error && (
        <div className="w-full max-w-2xl p-md rounded-lg bg-error-container border border-error/20 text-on-error-container text-body-sm flex items-center gap-sm animate-fadeIn">
          <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Detailed Tracking Results Section */}
      {packageData && (
        <div className="w-full max-w-4xl bg-background border border-outline-variant rounded-xl p-md md:p-xl shadow-lg mt-md animate-slideDown flex flex-col gap-lg text-on-surface">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline-variant pb-md gap-md">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs">Código de Rastreo</p>
              <h2 className="font-code-tracking text-code-tracking text-primary text-xl font-bold">{packageData.trackingCode}</h2>
            </div>
            <div className="flex items-center gap-sm bg-surface-container-high px-sm py-xs rounded-full border border-outline-variant">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              <span className="font-label-sm text-label-sm text-primary font-semibold">{getStatusLabel(packageData.status)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {/* Summary and Status Flow */}
            <div className="lg:col-span-2 flex flex-col gap-lg">
              {/* Shipment Details Panel */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-lg relative overflow-hidden shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#f97316]"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex items-start gap-md">
                    <span className="material-symbols-outlined text-outline mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>location_on</span>
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Origen</p>
                      <p className="font-body-lg text-body-lg font-semibold text-on-surface">{packageData.originAddress}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Remitente: {packageData.senderName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-md">
                    <span className="material-symbols-outlined text-outline mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>flag</span>
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Destino</p>
                      <p className="font-body-lg text-body-lg font-semibold text-on-surface">{packageData.destinationAddress}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Est. Entrega: {packageData.estimatedDeliveryDate}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-outline-variant mt-md pt-md grid grid-cols-2 gap-md text-body-sm">
                  <div>
                    <span className="text-on-surface-variant">Peso: </span>
                    <span className="font-semibold">{packageData.weight} kg</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant">Descripción: </span>
                    <span className="font-semibold">{packageData.description}</span>
                  </div>
                </div>
              </div>

              {/* Status Flow Timeline */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-lg shadow-sm">
                <h3 className="font-headline-sm text-headline-sm mb-lg text-on-surface font-semibold">Flujo del Estado</h3>
                <div className="relative pl-xs flex flex-col gap-xl">
                  {/* Vertical Line Connector */}
                  <div className="absolute left-[23px] top-[24px] bottom-[24px] w-[2px] bg-outline-variant animate-fadeIn" />

                  {/* Step 1: Registrado */}
                  <div className={`relative flex items-start group transition-opacity ${currentStep >= 1 ? "opacity-100" : "opacity-40"}`}>
                    <div className={`z-10 flex items-center justify-center w-12 h-12 rounded-full shrink-0 shadow-sm transition-colors ${
                      currentStep >= 1 ? "bg-primary text-white" : "bg-surface-variant text-on-surface-variant"
                    }`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                    <div className="ml-lg pt-sm">
                      <h4 className={`font-label-md text-label-md ${currentStep >= 1 ? "text-primary font-bold" : "text-on-surface-variant"}`}>Registrado</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Información del envío registrada en el sistema.</p>
                    </div>
                  </div>

                  {/* Step 2: En Almacén */}
                  <div className={`relative flex items-start group transition-opacity ${currentStep >= 2 ? "opacity-100" : "opacity-40"}`}>
                    <div className={`z-10 flex items-center justify-center w-12 h-12 rounded-full shrink-0 shadow-sm transition-all ${
                      currentStep > 2 
                        ? "bg-primary text-white" 
                        : currentStep === 2 
                          ? "bg-surface border-2 border-primary text-primary ring-4 ring-primary-container/20" 
                          : "bg-surface-variant text-on-surface-variant"
                    }`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                    </div>
                    <div className="ml-lg pt-sm">
                      <h4 className={`font-label-md text-label-md ${currentStep >= 2 ? "text-primary font-bold" : "text-on-surface-variant"}`}>En Almacén</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Procesado y clasificado en el centro logístico.</p>
                    </div>
                  </div>

                  {/* Step 3: En Tránsito */}
                  <div className={`relative flex items-start group transition-opacity ${currentStep >= 3 ? "opacity-100" : "opacity-40"}`}>
                    <div className={`z-10 flex items-center justify-center w-12 h-12 rounded-full shrink-0 shadow-sm transition-all ${
                      currentStep > 3 
                        ? "bg-primary text-white" 
                        : currentStep === 3 
                          ? "bg-surface border-2 border-primary text-primary ring-4 ring-primary-container/20" 
                          : "bg-surface-variant text-on-surface-variant"
                    }`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: currentStep === 3 ? "'FILL' 0" : "'FILL' 1" }}>local_shipping</span>
                    </div>
                    <div className="ml-lg pt-sm">
                      <h4 className={`font-label-md text-label-md ${currentStep >= 3 ? "text-primary font-bold" : "text-on-surface-variant"}`}>En Tránsito</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">El envío viaja hacia la ciudad de destino.</p>
                    </div>
                  </div>

                  {/* Step 4: En Ruta de Entrega */}
                  <div className={`relative flex items-start group transition-opacity ${currentStep >= 4 ? "opacity-100" : "opacity-40"}`}>
                    <div className={`z-10 flex items-center justify-center w-12 h-12 rounded-full shrink-0 shadow-sm transition-all ${
                      currentStep > 4 
                        ? "bg-primary text-white" 
                        : currentStep === 4 
                          ? "bg-surface border-2 border-primary text-primary ring-4 ring-primary-container/20" 
                          : "bg-surface-variant text-on-surface-variant"
                    }`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: currentStep === 4 ? "'FILL' 0" : "'FILL' 1" }}>route</span>
                    </div>
                    <div className="ml-lg pt-sm">
                      <h4 className={`font-label-md text-label-md ${currentStep >= 4 ? "text-primary font-bold" : "text-on-surface-variant"}`}>En Reparto</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">En manos del repartidor local, entrega hoy.</p>
                    </div>
                  </div>

                  {/* Step 5: Entregado */}
                  <div className={`relative flex items-start group transition-opacity ${currentStep >= 5 ? "opacity-100" : "opacity-40"}`}>
                    <div className={`z-10 flex items-center justify-center w-12 h-12 rounded-full shrink-0 shadow-sm transition-all ${
                      currentStep === 5 
                        ? "bg-primary text-white ring-4 ring-green-100" 
                        : "bg-surface-variant text-on-surface-variant"
                    }`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: currentStep === 5 ? "'FILL' 0" : "'FILL' 1" }}>home</span>
                    </div>
                    <div className="ml-lg pt-sm">
                      <h4 className={`font-label-md text-label-md ${currentStep >= 5 ? "text-primary font-bold" : "text-on-surface-variant"}`}>Entregado</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Entregado exitosamente en el destino.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Actions & Event Log */}
            <div className="flex flex-col gap-lg">
              {/* Actions Card */}
              <div className="bg-surface-container-highest rounded-lg p-md flex flex-col gap-md border border-outline-variant/30">
                <button className="w-full flex items-center justify-center gap-sm bg-primary text-white px-lg py-sm rounded-lg hover:bg-opacity-95 active:scale-95 transition-all font-label-md shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                  Soporte de Envío
                </button>
                <button className="w-full flex items-center justify-center gap-sm bg-surface text-on-surface border border-outline-variant px-lg py-sm rounded-lg hover:bg-surface-variant active:scale-95 transition-all font-label-md shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                  Comprobante PDF
                </button>
              </div>

              {/* Event Log */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col flex-grow">
                <h3 className="font-headline-sm text-headline-sm mb-md pb-xs border-b border-outline-variant font-semibold text-on-surface">Historial Detallado</h3>
                <div className="flex flex-col max-h-[360px] overflow-y-auto pr-xs">
                  {packageData.history.length === 0 ? (
                    <p className="text-body-sm text-on-surface-variant italic">No hay actualizaciones todavía.</p>
                  ) : (
                    packageData.history.map((event) => (
                      <div key={event.id} className="py-md border-b border-outline-variant last:border-0 hover:bg-surface-container-low/20 transition-colors flex items-start gap-md">
                        <div className="bg-surface-variant text-on-surface-variant p-xs rounded shrink-0">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {event.status === "DELIVERED" ? "home" : event.status === "OUT_FOR_DELIVERY" ? "route" : event.status === "IN_TRANSIT" ? "swap_horiz" : "info"}
                          </span>
                        </div>
                        <div>
                          <p className="font-body-sm text-body-sm text-on-surface font-medium leading-tight">{event.description}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                            {event.location} • {event.timestamp}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
