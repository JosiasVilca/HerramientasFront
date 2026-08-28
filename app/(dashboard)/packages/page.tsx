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
        return <Badge className="bg-green-600 hover:bg-green-650 text-white font-semibold shadow-inner">Entregado</Badge>;
      case "EN_RUTA":
        return <Badge className="bg-blue-600 hover:bg-blue-655 text-white font-semibold shadow-inner">En Ruta</Badge>;
      case "EN_TRANSITO":
        return <Badge className="bg-sky-600 hover:bg-sky-655 text-white font-semibold shadow-inner">En Tránsito</Badge>;
      case "EN_ALMACEN":
        return <Badge className="bg-orange-500 hover:bg-orange-550 text-white font-semibold shadow-inner">En Almacén</Badge>;
      case "REGISTRADO":
        return <Badge className="bg-zinc-500 hover:bg-zinc-550 text-white font-semibold shadow-inner">Registrado</Badge>;
      case "INCIDENCIA":
        return <Badge variant="destructive" className="font-semibold shadow-inner">Incidencia</Badge>;
      default:
        return <Badge>{status}</Badge>;
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
    <div className="space-y-6 animate-fadeIn">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Panel Operativo de Paquetes</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Administra, crea, filtra e inspecciona el estado de los despachos terrestres.</p>
        </div>
        <div className="flex gap-2">
          <ScannerModal onStatusUpdated={loadPackages} />
          <CreatePackageDialog onSuccess={() => loadPackages()} />
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Envíos</span>
            <Package className="w-4 h-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">{totalCount}</span>
            <p className="text-[10px] text-zinc-400 mt-1">Registrados en base de datos</p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">En Tránsito</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-extrabold text-primary">{transitCount}</span>
            <p className="text-[10px] text-zinc-400 mt-1">En viaje o ruta de entrega</p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Entregados</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-extrabold text-green-600">{deliveredCount}</span>
            <p className="text-[10px] text-zinc-400 mt-1">Finalizados satisfactoriamente</p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Incidencias</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-extrabold text-red-655">{incidenceCount}</span>
            <p className="text-[10px] text-zinc-400 mt-1">Paquetes con observaciones</p>
          </CardContent>
        </Card>

      </div>

      {/* FILTER & CONTROL BAR CARD */}
      <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          
          {/* Search Control */}
          <div className="relative flex-grow">
            <Input
              placeholder="Buscar por código de guía o nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 border-zinc-200 dark:border-zinc-800"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          </div>

          {/* Select filter */}
          <div className="w-full md:w-56 shrink-0">
            <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
              <SelectTrigger className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
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
            className="h-10 w-10 shrink-0 cursor-pointer border-zinc-200 dark:border-zinc-800"
            title="Refrescar lista"
          >
            <RefreshCw className={`w-4 h-4 text-zinc-500 ${loading ? "animate-spin" : ""}`} />
          </Button>

        </CardContent>
      </Card>

      {/* PACKAGE LISTING TABLE */}
      <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800">
              <TableRow>
                <TableHead className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">Código de Guía</TableHead>
                <TableHead className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">Remitente</TableHead>
                <TableHead className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">Destinatario</TableHead>
                <TableHead className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">Destino</TableHead>
                <TableHead className="font-semibold text-xs text-zinc-700 dark:text-zinc-300 text-center">Peso</TableHead>
                <TableHead className="font-semibold text-xs text-zinc-700 dark:text-zinc-300 text-center">Estado</TableHead>
                <TableHead className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">Última Actualización</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      <span className="text-xs font-medium">Obteniendo despachos...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-zinc-500 font-medium text-xs">
                    Ningún paquete coincide con la búsqueda o filtros.
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <TableCell className="font-bold text-xs text-primary">{pkg.trackingCode}</TableCell>
                    <TableCell className="font-medium text-xs text-zinc-800 dark:text-zinc-200">{pkg.senderName}</TableCell>
                    <TableCell className="font-medium text-xs text-zinc-800 dark:text-zinc-200">{pkg.receiverName}</TableCell>
                    <TableCell className="text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{pkg.destinationCity}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-center font-semibold text-zinc-700 dark:text-zinc-300">{pkg.weightKg} kg</TableCell>
                    <TableCell className="text-center">{getStatusBadge(pkg.status)}</TableCell>
                    <TableCell className="text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{pkg.updatedAt}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer text-zinc-500 rounded-md" />}>
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-md">
                          <DropdownMenuLabel className="text-xs text-zinc-500">Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-850" />
                          <DropdownMenuItem onClick={() => handleOpenUpdateDialog(pkg)} className="cursor-pointer text-xs font-semibold">
                            <Edit2 className="w-3.5 h-3.5 mr-2 text-primary" />Actualizar Estado
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
          <DialogContent className="max-w-md w-[95vw] rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <DialogHeader className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Actualizar Estado de Envío
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
                Modifica el estado físico de la guía {selectedPackage.trackingCode}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="statusSelect" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  Nuevo Estado
                </Label>
                <Select value={newStatus} onValueChange={(val) => setNewStatus(val as PackageStatus)}>
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
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
                <Label htmlFor="updateLocation" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  Ubicación Física de Operación
                </Label>
                <Input
                  id="updateLocation"
                  value={updateLocation}
                  onChange={(e) => setUpdateLocation(e.target.value)}
                  placeholder="Ej: Hub Arequipa Entrada"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="updateNotes" className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  Notas / Observaciones del Operador
                </Label>
                <Input
                  id="updateNotes"
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Ej: Embalaje reforzado"
                />
              </div>

              <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsUpdateDialogOpen(false)}
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={updating}
                  className="cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
