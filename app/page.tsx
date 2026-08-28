"use client";

import React, { useState } from "react";
import Link from "next/link";
import QuickTrackingForm from "@/components/tracking/quick-tracking-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Truck,
  Clock,
  Globe,
  TrendingUp,
  MapPin,
  Menu,
  X,
  Phone,
  Mail,
  Zap,
  ArrowRight,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
      
      {/* Navigation Header */}
      <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md w-full sticky top-0 border-b border-zinc-200 dark:border-zinc-800 z-50 transition-all duration-300 shadow-sm">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-[1440px] mx-auto w-full relative">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/10">
              <span className="material-symbols-outlined text-primary text-[22px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_shipping
              </span>
            </div>
            <span className="font-bold text-xl text-zinc-900 dark:text-white">
              SwiftLogix
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-zinc-600 dark:text-zinc-300 hover:text-primary dark:hover:text-primary-fixed-dim transition-colors text-sm font-semibold">
              Servicios
            </a>
            <a href="#metrics" className="text-zinc-600 dark:text-zinc-300 hover:text-primary dark:hover:text-primary-fixed-dim transition-colors text-sm font-semibold">
              Métricas
            </a>
            <a href="#cobertura" className="text-zinc-600 dark:text-zinc-300 hover:text-primary dark:hover:text-primary-fixed-dim transition-colors text-sm font-semibold">
              Cobertura
            </a>
          </nav>

          {/* Right Header Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold cursor-pointer">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="font-semibold cursor-pointer shadow-md bg-primary hover:bg-primary/90 text-primary-foreground">
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Hamburger Menu Button (Mobile) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-zinc-600 dark:text-zinc-400 focus:outline-none cursor-pointer rounded-lg border border-zinc-200/50 dark:border-zinc-800"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Mobile Dropdown Menu Popover */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-4 right-4 mt-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-6 flex flex-col gap-4 animate-fadeIn z-50 shadow-xl">
              <a 
                href="#services" 
                className="text-zinc-600 dark:text-zinc-300 hover:text-primary py-2 text-sm font-semibold border-b border-zinc-100 dark:border-zinc-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Servicios
              </a>
              <a 
                href="#metrics" 
                className="text-zinc-600 dark:text-zinc-300 hover:text-primary py-2 text-sm font-semibold border-b border-zinc-100 dark:border-zinc-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Métricas
              </a>
              <a 
                href="#cobertura" 
                className="text-zinc-600 dark:text-zinc-300 hover:text-primary py-2 text-sm font-semibold border-b border-zinc-100 dark:border-zinc-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cobertura
              </a>
              <div className="pt-2 flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full cursor-pointer">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full cursor-pointer shadow-md bg-primary hover:bg-primary/90 text-primary-foreground">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Sections */}
      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-zinc-950 dark:to-zinc-950 py-16 md:py-24 px-6 overflow-hidden">
          
          {/* Subtle Grid Backdrop */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Logística Digital de Extremo a Extremo
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
              Innovación que <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-sky-500">mueve el mundo</span>.
            </h1>
            
            <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              La plataforma de envíos exprés inteligente y rastreable que optimiza tu cadena de suministro con datos confiables en tiempo real.
            </p>

            {/* Quick Tracking Search Form Wrapper */}
            <div className="pt-4 max-w-2xl mx-auto">
              <QuickTrackingForm />
            </div>

            <p className="text-xs text-zinc-400">
              Prueba con el código de prueba <span className="font-semibold text-primary">SW-9843-XY</span> o <span className="font-semibold text-primary">TRK-1111-AA</span> para verificar el historial del timeline.
            </p>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-20 bg-white dark:bg-zinc-900 border-t border-b border-zinc-100 dark:border-zinc-800/80 px-6">
          <div className="max-w-[1200px] mx-auto space-y-12">
            
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Nuestros Servicios Integrados
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-sm">
                Soluciones ágiles diseñadas para satisfacer las demandas logísticas más complejas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <Card className="border-zinc-200/80 dark:border-zinc-800 hover:shadow-lg hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg border border-primary/10">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                    Envío Express
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Entregas locales e internacionales prioritarias en tiempo récord con conductores especializados y seguros integrados.
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="border-zinc-200/80 dark:border-zinc-800 hover:shadow-lg hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg border border-primary/10">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                    Control en Tiempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Localización satelital y actualización de estado en tiempo real. Historial de eventos y alertas automáticas por correo.
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="border-zinc-200/80 dark:border-zinc-800 hover:shadow-lg hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg border border-primary/10">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                    Seguridad y Garantía
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Protocolos estrictos de resguardo y firmas digitales de verificación en destino para asegurar que tu carga llegue intacta.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* METRICS SECTION */}
        <section id="metrics" className="py-20 bg-slate-50/50 dark:bg-zinc-950 px-6">
          <div className="max-w-[1200px] mx-auto space-y-12">
            
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Métricas que Respaldan Nuestra Eficiencia
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-sm">
                Monitoreamos cada indicador de rendimiento para superar las expectativas logísticas de nuestros socios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
                <div className="bg-primary/10 p-3 rounded-full mb-3 text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-3xl font-extrabold text-primary">99.8%</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">Eficiencia de Entrega</span>
                <span className="text-xs text-zinc-400 mt-1">Cumplimiento estricto de plazos</span>
              </div>

              <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
                <div className="bg-primary/10 p-3 rounded-full mb-3 text-primary">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-3xl font-extrabold text-primary">15 min</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">Tiempo de Respuesta</span>
                <span className="text-xs text-zinc-400 mt-1">Soporte y despacho acelerado</span>
              </div>

              <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
                <div className="bg-primary/10 p-3 rounded-full mb-3 text-primary">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-3xl font-extrabold text-primary">500+</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">Transportes Activos</span>
                <span className="text-xs text-zinc-400 mt-1">Flota inteligente en carreteras</span>
              </div>

              <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
                <div className="bg-primary/10 p-3 rounded-full mb-3 text-primary">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="text-3xl font-extrabold text-primary">120+</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">Ciudades Conectadas</span>
                <span className="text-xs text-zinc-400 mt-1">Cobertura nacional garantizada</span>
              </div>

            </div>
          </div>
        </section>

        {/* COBERTURA SECTION */}
        <section id="cobertura" className="py-20 bg-white dark:bg-zinc-900 px-6">
          <div className="max-w-[1200px] mx-auto space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 font-semibold px-3 py-1 text-xs">
                  Red de Cobertura Nacional
                </Badge>
                <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                  Una red logística diseñada para llegar a cada rincón.
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                  SwiftLogix cuenta con almacenes estratégicos en las principales capitales y una red vial interconectada que reduce los tiempos de entrega terrestre en más del 25%. Monitoreamos de forma activa cada ruta de tránsito para evitar demoras causadas por imprevistos climáticos o de tráfico.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sm block">Hubs Logísticos</span>
                      <span className="text-xs text-zinc-400">Lima, Trujillo, Arequipa, Cusco</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sm block">Optimización</span>
                      <span className="text-xs text-zinc-400">Rutas dinámicas satelitales</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic/Map Placeholder using CSS and Lucide Icons */}
              <div className="relative h-[320px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(#8080800d_1.5px,transparent_1.5px)] bg-[size:20px_20px]"></div>
                <div className="relative z-10 flex flex-col items-center gap-3 text-center p-6">
                  <Globe className="w-16 h-16 text-primary/20 dark:text-primary/10 animate-spin" style={{ animationDuration: "30s" }} />
                  <span className="font-bold text-sm">Conectividad Dinámica Satelital</span>
                  <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                    Monitoreo continuo mediante GPS de nuestra flota interconectada a nivel nacional.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800 py-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_shipping
              </span>
              <span className="font-bold text-lg">SwiftLogix</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">
              Solución inteligente de logística y rastreo terrestre nacional con tecnología avanzada en tiempo real.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-sm text-white block">Enlaces</span>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#metrics" className="hover:text-white transition-colors">Métricas</a></li>
              <li><a href="#cobertura" className="hover:text-white transition-colors">Cobertura</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-sm text-white block">Soporte</span>
            <ul className="space-y-2 text-xs">
              <li><a href="/login" className="hover:text-white transition-colors">Iniciar Sesión</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Crear Cuenta</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-sm text-white block">Contacto</span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>+51 1 234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>contacto@swiftlogix.com</span>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-[1200px] mx-auto border-t border-zinc-800/80 mt-8 pt-6 text-center text-[10px] text-zinc-600">
          <p>© {new Date().getFullYear()} SwiftLogix. Todos los derechos reservados. Diseñado bajo las pautas de Stitch.</p>
        </div>
      </footer>

    </div>
  );
}
