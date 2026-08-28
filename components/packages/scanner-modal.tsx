"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScanBarcode, Loader2, CheckCircle2, ShieldCheck, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import { packageService } from "@/services/package.service";
import { PackageItem, PackageStatus } from "@/types/package";

interface ScannerModalProps {
  onStatusUpdated: () => void;
}

export default function ScannerModal({ onStatusUpdated }: ScannerModalProps) {
  const [open, setOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [loadingScan, setLoadingScan] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scannedPackage, setScannedPackage] = useState<PackageItem | null>(null);
  
  // Status update state
  const [newStatus, setNewStatus] = useState<PackageStatus | "">("");
  const [updateLocation, setUpdateLocation] = useState("Almacén Principal");
  const [updateNotes, setUpdateNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Clear states when dialog resets
  const resetScanner = () => {
    setScanCode("");
    setErrorMsg(null);
    setScannedPackage(null);
    setNewStatus("");
    setUpdateLocation("Almacén Principal");
    setUpdateNotes("");
    setUpdateSuccess(false);
  };

  const handleSimulateScan = async (codeToScan?: string) => {
    const code = codeToScan || scanCode;
    if (!code.trim()) {
      setErrorMsg("Ingresa un código de guía válido.");
      return;
    }

    setLoadingScan(true);
    setErrorMsg(null);
    setScannedPackage(null);
    setUpdateSuccess(false);

    try {
      // Simulate scan delay
      await new Promise((resolve) => setTimeout(resolve, 850));
      const pkg = await packageService.getByTrackingCode(code);
      setScannedPackage(pkg);
      setNewStatus(pkg.status);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Código de barras no válido.");
    } finally {
      setLoadingScan(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedPackage || !newStatus) return;

    setUpdating(true);
    setErrorMsg(null);
    try {
      await packageService.updateStatus({
        packageId: scannedPackage.id,
        newStatus: newStatus as PackageStatus,
        location: updateLocation,
        notes: updateNotes || "Actualizado vía Escáner de Terminal",
      });
      
      setUpdateSuccess(true);
      onStatusUpdated();
      
      // Keep showing success check for a second, then close or reset
      setTimeout(() => {
        setScannedPackage(null);
        setScanCode("");
        setUpdateSuccess(false);
      }, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "No se pudo actualizar el estado.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: PackageStatus) => {
    switch (status) {
      case "ENTREGADO": return "bg-green-600";
      case "EN_RUTA": return "bg-blue-600";
      case "EN_TRANSITO": return "bg-sky-600";
      case "EN_ALMACEN": return "bg-orange-500";
      case "REGISTRADO": return "bg-zinc-500";
      default: return "bg-red-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) resetScanner();
    }}>
      <DialogTrigger render={<Button variant="outline" className="h-10 px-4 rounded-lg font-semibold active:scale-[0.98] transition-transform cursor-pointer border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-sm flex items-center gap-2" />}>
        <ScanBarcode className="w-4 h-4 text-primary" />
        <span>Escáner / Lector</span>
      </DialogTrigger>

      <DialogContent className="max-w-md w-[95vw] rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <DialogHeader className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <ScanBarcode className="w-5 h-5 text-primary" />
            <span>Escáner de Control Operativo</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
            Simulador de lectura de código de barras o QR para actualización ágil de estados en almacén.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          
          {/* CAMERA SIMULATION FRAME */}
          {!scannedPackage && !loadingScan && (
            <div className="relative w-full h-44 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
              {/* Laser Beam Animation */}
              <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-md shadow-red-500/50 z-10 animate-bounce" style={{ top: "35%", animationDuration: "3s" }}></div>
              
              <ScanBarcode className="w-10 h-10 text-zinc-400 dark:text-zinc-600 animate-pulse" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-2">Cámara Simulada / Lector Activo</span>
              
              {/* Quick test buttons inside scanner */}
              <div className="absolute bottom-2 flex gap-2 z-20">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-7 text-[10px] px-2.5 rounded-md cursor-pointer"
                  onClick={() => handleSimulateScan("SW-9843-XY")}
                >
                  Escanear SW-9843-XY
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-7 text-[10px] px-2.5 rounded-md cursor-pointer"
                  onClick={() => handleSimulateScan("SW-4321-LZ")}
                >
                  Escanear SW-4321-LZ
                </Button>
              </div>
            </div>
          )}

          {/* Loading scan state */}
          {loadingScan && (
            <div className="w-full h-44 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-2">Procesando código de guía...</span>
            </div>
          )}

          {/* Scan Result & Status Form */}
          {scannedPackage && !loadingScan && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Scanned Package Header Card */}
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800/80 flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase">Guía Detectada</span>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{scannedPackage.trackingCode}</span>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <MapPin className="w-3 h-3" />
                    <span>Destino: {scannedPackage.destinationCity}</span>
                  </div>
                </div>
                <Badge className={`${getStatusColor(scannedPackage.status)} text-white`}>
                  {scannedPackage.status}
                </Badge>
              </div>

              {/* Status Update Form */}
              {updateSuccess ? (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 flex flex-col items-center justify-center text-center gap-2 py-6 animate-pulse">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <span className="text-sm font-bold">¡Estado actualizado con éxito!</span>
                </div>
              ) : (
                <form onSubmit={handleUpdateStatus} className="space-y-3.5">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="newStatus" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                      Nuevo Estado Asignado
                    </Label>
                    <Select value={newStatus} onValueChange={(val) => setNewStatus(val as PackageStatus)}>
                      <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                        <SelectValue placeholder="Selecciona el nuevo estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REGISTRADO">REGISTRADO (Generado)</SelectItem>
                        <SelectItem value="EN_ALMACEN">EN ALMACÉN (Recibido)</SelectItem>
                        <SelectItem value="EN_TRANSITO">EN TRÁNSITO (Despachado)</SelectItem>
                        <SelectItem value="EN_RUTA">EN RUTA (Repartidor)</SelectItem>
                        <SelectItem value="ENTREGADO">ENTREGADO (Destino)</SelectItem>
                        <SelectItem value="INCIDENCIA">INCIDENCIA (Observación)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="location" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                        Ubicación de Lectura
                      </Label>
                      <Input
                        id="location"
                        value={updateLocation}
                        onChange={(e) => setUpdateLocation(e.target.value)}
                        placeholder="Ej: Hub Lima Principal"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="notes" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                        Notas del Operador
                      </Label>
                      <Input
                        id="notes"
                        value={updateNotes}
                        onChange={(e) => setUpdateNotes(e.target.value)}
                        placeholder="Ej: Envasado rápido"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setScannedPackage(null)}
                      className="flex-grow cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      Re-escanear
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={updating}
                      className="flex-grow cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
                    >
                      {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Estado"}
                    </Button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* Manual Input Search bar (Fallback) */}
          {!scannedPackage && !loadingScan && (
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Label htmlFor="manualCode" className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Ingreso manual del código de guía
              </Label>
              <div className="flex gap-2">
                <Input
                  id="manualCode"
                  placeholder="Ingrese código de guía"
                  value={scanCode}
                  onChange={(e) => setScanCode(e.target.value)}
                  className="h-9 text-xs"
                />
                <Button 
                  size="sm" 
                  onClick={() => handleSimulateScan()}
                  className="h-9 text-xs cursor-pointer px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Consultar
                </Button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
