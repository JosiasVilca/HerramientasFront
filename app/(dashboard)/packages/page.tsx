"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Package,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Search,
  MoreVertical,
  Calendar,
  MapPin,
  Truck,
  Edit2,
  Trash2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { packageService } from "@/services/package.service";
import { PackageItem, PackageStatus } from "@/types/package";
import CreatePackageDialog from "@/components/packages/create-package-dialog";
import ScannerModal from "@/components/packages/scanner-modal";

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Status modification state
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<PackageStatus>("REGISTRADO");
  const [updateLocation, setUpdateLocation] = useState("");
  const [updateNotes, setUpdateNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch Packages Callback
  const loadPackages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await packageService.getAll(searchQuery, statusFilter);
      setPackages(data);
    } catch (err) {
      console.error("Failed to load packages:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  // Calculate KPIs
  const totalCount = packages.length;
  const transitCount = packages.filter((p) => p.status === "EN_TRANSITO" || p.status === "EN_RUTA").length;
  const deliveredCount = packages.filter((p) => p.status === "ENTREGADO").length;
  const incidenceCount = packages.filter((p) => p.status === "INCIDENCIA").length;

  const getStatusBadge = (status: PackageStatus) => {
    switch (status) {
      case "ENTREGADO":
        return <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-2xs">Entregado</Badge>;
      case "EN_RUTA":
        return <Badge className="bg-purple-600/20 text-purple-400 border border-purple-500/30 font-semibold shadow-2xs">En Ruta</Badge>;
      case "EN_TRANSITO":
        return <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold shadow-2xs">En Tránsito</Badge>;
      case "EN_ALMACEN":
        return <Badge className="bg-slate-800/80 text-slate-300 border border-slate-700 font-semibold shadow-2xs">En Almacén</Badge>;
      case "REGISTRADO":
        return <Badge variant="outline" className="border-slate-700 text-slate-400 font-semibold">Registrado</Badge>;
      case "INCIDENCIA":
        return <Badge className="bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold shadow-2xs">Incidencia</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleOpenUpdateDialog = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setNewStatus(pkg.status);
    setUpdateLocation("Hub Central " + pkg.originCity);
    setUpdateNotes("Actualizado desde control de panel de operador");
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    setUpdating(true);
    try {
      await packageService.updateStatus({
        packageId: selectedPackage.id,
        newStatus: newStatus,
        location: updateLocation,
        notes: updateNotes,
      });
      setIsUpdateDialogOpen(false);
      loadPackages();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
            Módulo de Envíos y Logística
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Gestión Operativa de Paquetes
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60 font-semibold">
              NEXORA Logistics
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administra, crea, filtra e inspecciona el estado de las guías de transporte en tiempo real.
          </p>
        </div>
        <div className="flex gap-2">
          <ScannerModal onStatusUpdated={loadPackages} />
          <CreatePackageDialog onSuccess={() => loadPackages()} />
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Envíos</span>
            <Package className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-extrabold text-white">{totalCount}</span>
            <p className="text-[10px] text-slate-400 mt-1">Registrados en el sistema</p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">En Tránsito</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-extrabold text-cyan-400">{transitCount}</span>
            <p className="text-[10px] text-slate-400 mt-1">En viaje o ruta de entrega</p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Entregados</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-extrabold text-emerald-400">{deliveredCount}</span>
            <p className="text-[10px] text-slate-400 mt-1">Finalizados con éxito</p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Incidencias</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-extrabold text-amber-400">{incidenceCount}</span>
            <p className="text-[10px] text-slate-400 mt-1">Guías observadas</p>
          </CardContent>
        </Card>

      </div>

      {/* FILTER & CONTROL BAR CARD */}
      <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          
          {/* Search Control */}
          <div className="relative flex-grow">
            <Input
              placeholder="Buscar por código de guía o nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 border-slate-800 bg-slate-950/70 text-xs text-slate-200 placeholder:text-slate-500 focus:border-purple-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          {/* Select filter */}
          <div className="w-full md:w-56 shrink-0">
            <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
              <SelectTrigger className="h-10 bg-slate-950/70 border-slate-800 text-xs text-slate-200">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="ALL">Todos los Estados</SelectItem>
                <SelectItem value="REGISTRADO">REGISTRADO (Generado)</SelectItem>
                <SelectItem value="EN_ALMACEN">EN ALMACÉN (Recibido)</SelectItem>
                <SelectItem value="EN_TRANSITO">EN TRÁNSITO (Despachado)</SelectItem>
                <SelectItem value="EN_RUTA">EN RUTA (Repartidor)</SelectItem>
                <SelectItem value="ENTREGADO">ENTREGADO (Destino)</SelectItem>
                <SelectItem value="INCIDENCIA">INCIDENCIA (Observado)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Refresh Action */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={loadPackages} 
            className="h-10 w-10 shrink-0 cursor-pointer border-slate-800 bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-800"
            title="Refrescar lista"
          >
            <RefreshCw className={`w-4 h-4 text-purple-400 ${loading ? "animate-spin" : ""}`} />
          </Button>

        </CardContent>
      </Card>

      {/* PACKAGE LISTING TABLE */}
      <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader className="bg-slate-950/80 border-b border-slate-800">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="font-bold text-xs text-slate-400 uppercase">Código de Guía</TableHead>
                <TableHead className="font-bold text-xs text-slate-400 uppercase">Remitente</TableHead>
                <TableHead className="font-bold text-xs text-slate-400 uppercase">Destinatario</TableHead>
                <TableHead className="font-bold text-xs text-slate-400 uppercase">Destino</TableHead>
                <TableHead className="font-bold text-xs text-slate-400 uppercase text-center">Peso</TableHead>
                <TableHead className="font-bold text-xs text-slate-400 uppercase text-center">Estado</TableHead>
                <TableHead className="font-bold text-xs text-slate-400 uppercase">Última Actualización</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableCell colSpan={8} className="h-32 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                      <span className="text-xs font-semibold">Cargando lista de paquetes...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : packages.length === 0 ? (
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableCell colSpan={8} className="h-32 text-center text-slate-400 font-medium text-xs">
                    Ningún paquete coincide con la búsqueda o filtros.
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id} className="border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                    <TableCell className="font-mono font-bold text-xs text-purple-400">{pkg.trackingCode}</TableCell>
                    <TableCell className="font-semibold text-xs text-slate-200">{pkg.senderName}</TableCell>
                    <TableCell className="font-semibold text-xs text-slate-200">{pkg.receiverName}</TableCell>
                    <TableCell className="text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{pkg.destinationCity}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-center font-bold text-slate-200">{pkg.weightKg} kg</TableCell>
                    <TableCell className="text-center">{getStatusBadge(pkg.status)}</TableCell>
                    <TableCell className="text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{pkg.updatedAt}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800 rounded-md" />}>
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-800 text-slate-200 shadow-xl">
                          <DropdownMenuLabel className="text-xs text-slate-400">Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem onClick={() => handleOpenUpdateDialog(pkg)} className="cursor-pointer text-xs font-semibold hover:bg-purple-900/30 hover:text-purple-300">
                            <Edit2 className="w-3.5 h-3.5 mr-2 text-purple-400" />Actualizar Estado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* QUICK STATUS UPDATE POPUP DIALOG */}
      {selectedPackage && (
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="max-w-md w-[95vw] rounded-xl border-border bg-card shadow-xl">
            <DialogHeader className="pb-2 border-b border-border/80">
              <DialogTitle className="text-lg font-bold text-foreground">
                Actualizar Estado de Envío
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Modifica la situación física de la guía #{selectedPackage.trackingCode}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="statusSelect" className="text-xs font-semibold text-foreground">
                  Nuevo Estado Logístico
                </Label>
                <Select value={newStatus} onValueChange={(val) => setNewStatus(val as PackageStatus)}>
                  <SelectTrigger className="w-full bg-transparent border-input text-xs">
                    <SelectValue />
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

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="updateLocation" className="text-xs font-semibold text-foreground">
                  Ubicación Física / Hub
                </Label>
                <Input
                  id="updateLocation"
                  value={updateLocation}
                  onChange={(e) => setUpdateLocation(e.target.value)}
                  placeholder="Ej: Hub Arequipa Entrada"
                  className="text-xs"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="updateNotes" className="text-xs font-semibold text-foreground">
                  Notas u Observaciones del Operador
                </Label>
                <Input
                  id="updateNotes"
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Ej: Embalaje reforzado en almacén central"
                  className="text-xs"
                />
              </div>

              <DialogFooter className="pt-4 border-t border-border/80 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsUpdateDialogOpen(false)}
                  className="cursor-pointer text-xs"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={updating}
                  className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

