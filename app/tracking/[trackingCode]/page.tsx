"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { trackingService } from "@/services/tracking.service";
import { TrackingDetailDTO, TrackingStatus } from "@/types/tracking";
import StatusStepper from "@/components/tracking/status-stepper";
import EventTimeline from "@/components/tracking/event-timeline";
import ShipmentInfoCard from "@/components/tracking/shipment-info-card";
import TrackingSkeleton from "@/components/tracking/tracking-skeleton";
import QuickTrackingForm from "@/components/tracking/quick-tracking-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Check,
  Share2,
  AlertCircle,
  ArrowLeft,
  Search,
  Package,
  Calendar,
  MapPin,
  Clock,
  Menu,
  X,
} from "lucide-react";

export default function TrackingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trackingCode = (params.trackingCode as string) || "";

  const [detail, setDetail] = useState<TrackingDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!trackingCode) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await trackingService.getTrackingDetail(trackingCode);
        setDetail(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al obtener detalles del envío.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [trackingCode]);

  const handleCopyCode = () => {
    if (!trackingCode) return;
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearchNewCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      router.push(`/tracking/${searchCode.trim()}`);
    }
  };

  const getStatusBadge = (status: TrackingStatus) => {
    switch (status) {
      case "ENTREGADO":
        return <Badge className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 text-xs">ENTREGADO</Badge>;
      case "EN_RUTA":
        return <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 text-xs">EN RUTA DE ENTREGA</Badge>;
      case "EN_TRANSITO":
        return <Badge className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1 text-xs">EN TRÁNSITO</Badge>;
      case "EN_ALMACEN":
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1 text-xs">EN ALMACÉN</Badge>;
      case "REGISTRADO":
        return <Badge className="bg-zinc-500 hover:bg-zinc-600 text-white font-bold px-3 py-1 text-xs">REGISTRADO</Badge>;
      case "INCIDENCIA":
        return <Badge variant="destructive" className="font-bold px-3 py-1 text-xs">INCIDENCIA</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
      
      {/* Navigation Header */}
      <header className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md w-full sticky top-0 border-b border-zinc-200 dark:border-zinc-800 z-50 transition-all duration-300 shadow-xs">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-[1440px] mx-auto w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/10">
              <span className="material-symbols-outlined text-primary text-[22px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_shipping
              </span>
            </div>
            <span className="font-bold text-xl text-zinc-900 dark:text-white">SwiftLogix</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors text-sm font-semibold flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Inicio</span>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="font-semibold cursor-pointer text-sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="font-semibold cursor-pointer shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
            <Link href="/" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 py-1">
              Volver a Inicio
            </Link>
            <Link href="/login" className="block text-sm font-semibold text-primary py-1">
              Iniciar Sesión
            </Link>
          </div>
        )}
      </header>

      {/* Main Section */}
      <main className="flex-grow p-6 md:p-12 max-w-[1440px] mx-auto w-full space-y-8">
        
        {/* LOADING STATE */}
        {loading && <TrackingSkeleton />}

        {/* ERROR / NOT FOUND STATE */}
        {!loading && error && (
          <div className="max-w-2xl mx-auto py-12 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Guía No Encontrada
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
                No pudimos localizar información para el código <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">"{trackingCode}"</span>. Por favor revisa que el número esté bien escrito o consulta otro código.
              </p>
            </div>

            {/* Retry Form */}
            <form onSubmit={handleSearchNewCode} className="flex gap-2 max-w-md mx-auto">
              <Input
                placeholder="Ingresar nuevo código (Ej: SW-9843-XY)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              />
              <Button type="submit" className="h-11 px-6 font-semibold bg-primary text-primary-foreground">
                <Search className="w-4 h-4 mr-1.5" />
                Buscar
              </Button>
            </form>

            <div className="pt-4">
              <Link href="/">
                <Button variant="outline" className="cursor-pointer">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Regresar a la página principal
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* SUCCESSFUL TRACKING DETAIL */}
        {!loading && !error && detail && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Navigation & Breadcrumb */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                  <span>/</span>
                  <span className="text-zinc-700 dark:text-zinc-300">Rastreo de Guía</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">
                  Detalles del Seguimiento
                </h1>
              </div>

              {/* Retry Search Bar inline */}
              <form onSubmit={handleSearchNewCode} className="flex gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Buscar otro código..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="h-9 text-xs w-full sm:w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                />
                <Button type="submit" size="sm" className="h-9 px-3 bg-primary text-primary-foreground">
                  <Search className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>

            {/* HEADER SUMMARY CARD */}
            <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xs relative overflow-hidden bg-white dark:bg-zinc-900">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
              
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                      Código de Seguimiento
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                        {detail.trackingCode}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyCode}
                        className="h-8 px-2.5 text-xs border-zinc-200 dark:border-zinc-800 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600 mr-1" />
                            <span className="text-green-600 font-bold">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-500 mr-1" />
                            <span>Copiar</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(detail.currentStatus)}
                  </div>
                </div>

                {/* Sub Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-400 font-medium block">Ruta de Envío</span>
                    <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                      {detail.originCity} → {detail.destinationCity}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-zinc-400 font-medium block">Fecha Estimada de Entrega</span>
                    <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span>{detail.estimatedDeliveryDate}</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-zinc-400 font-medium block">Última Actualización</span>
                    <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span>{detail.lastUpdate}</span>
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* MAIN DETAILED GRID: STEPPER, TIMELINE & INFO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column (2 Cols): Stepper & Detailed History */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* State Machine Stepper */}
                <StatusStepper currentStatus={detail.currentStatus} />

                {/* Event Timeline History */}
                <EventTimeline events={detail.history} />

              </div>

              {/* Right Column (1 Col): Shipment Info & Courier Card */}
              <div className="space-y-8">
                <ShipmentInfoCard detail={detail} />
              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800 py-8 px-6 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <span>© {new Date().getFullYear()} SwiftLogix Express. Todos los derechos reservados.</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/login" className="hover:text-white transition-colors">Iniciar Sesión</Link>
            <Link href="/packages" className="hover:text-white transition-colors">Panel Operativo</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
