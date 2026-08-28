"use client";

import React, { useState } from "react";
import QuickTrackingForm from "@/components/tracking/quick-tracking-form";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md">
      
      {/* HEADER: Responsive NavBar */}
      <header className="bg-surface dark:bg-surface-dim w-full sticky top-0 border-b border-outline-variant dark:border-outline z-50 transition-all duration-300 shadow-xs">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-md max-w-[1440px] mx-auto w-full relative">
          
          {/* Logo */}
          <div className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
            SwiftLogix
          </div>

          {/* Desktop Navigation - Changed from text-on-surface-variant to text-on-surface (dark navy) for readability/contrast */}
          <nav className="hidden md:flex items-center space-x-lg">
            <a 
              className="text-on-surface dark:text-inverse-on-surface hover:text-primary dark:hover:text-primary-fixed-dim transition-all scale-95 active:scale-90 font-semibold" 
              href="#"
            >
              Soluciones
            </a>
            <a 
              className="text-on-surface dark:text-inverse-on-surface hover:text-primary dark:hover:text-primary-fixed-dim transition-all scale-95 active:scale-90 font-semibold" 
              href="#"
            >
              Cobertura
            </a>
          </nav>

          {/* Right Header Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-md">
            <button className="text-primary dark:text-primary-fixed-dim font-label-md text-label-md hover:text-primary-container transition-colors cursor-pointer">
              Login
            </button>
            <button className="bg-primary text-on-primary hover:bg-primary-container px-lg py-sm rounded-lg font-label-md text-label-md active:scale-95 transition-all shadow-sm cursor-pointer">
              Iniciar Sesión
            </button>
          </div>

          {/* Hamburger Menu Button (Mobile) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-xs text-on-surface-variant focus:outline-none cursor-pointer"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>

          {/* Mobile Dropdown Menu (Absolute Popover based on Elevation rules in DESIGN.md) */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 border-b border-outline-variant bg-surface-container-lowest dark:bg-surface-dim px-margin-mobile py-md flex flex-col gap-md animate-fadeIn z-50 shadow-md">
              <a 
                className="text-on-surface dark:text-inverse-on-surface hover:text-primary dark:hover:text-primary-fixed-dim py-sm font-semibold border-b border-outline-variant/30"
                href="#"
                onClick={() => setMobileMenuOpen(false)}
              >
                Soluciones
              </a>
              <a 
                className="text-on-surface dark:text-inverse-on-surface hover:text-primary dark:hover:text-primary-fixed-dim py-sm font-semibold border-b border-outline-variant/30"
                href="#"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cobertura
              </a>
              <div className="pt-sm flex flex-col gap-sm">
                <button 
                  className="w-full text-center py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface dark:text-surface-variant hover:bg-surface-variant transition-colors cursor-pointer bg-surface-container-lowest dark:bg-surface-dim"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </button>
                <button 
                  className="w-full text-center py-sm bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md active:scale-95 transition-all cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        
        {/* HERO SECTION (DESKTOP VERSION) */}
        <section className="hidden md:block relative bg-surface-container-lowest overflow-hidden">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <div 
              className="bg-cover bg-center w-full h-full opacity-30" 
              style={{ 
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMnIqcmm1lMSgWf7f403rdWztsn3Xe4D_uZ3NEJHeWUOGv_RR3T_uclvrTA739W3Dnvehug9VdjhBbI28MX5RAUaYJZUWxTtF0hnrmsNMuHccfjyFZLLbALV4usfMrKXj6rlQPtRQ3PfLrfry3MWhCw1gGq-6hBlP4t40F5rTAVgyr-wiR_unEkbsBaK9Va0qWUoc6580p5k3d5Zb2Pf28zVck3qW4XuI1Kaq6Hb6PirpmYUPfIj3m')` 
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-surface/80 to-background/95"></div>
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-32 text-center flex flex-col items-center">
            <h1 className="font-display text-display text-on-surface mb-lg max-w-3xl">
              Logística Inteligente para Envíos Globales
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-2xl">
              Optimiza tu cadena de suministro con datos en tiempo real y envíos exprés a nivel mundial.
            </p>
            
            {/* Quick Tracking Form */}
            <QuickTrackingForm />
          </div>
        </section>

        {/* HERO SECTION (MOBILE VERSION) */}
        <section className="md:hidden px-margin-mobile py-lg flex flex-col gap-lg bg-surface">
          <div className="flex flex-col gap-sm">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
              Tu logística, simplificada y en tiempo real.
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Soluciones express para empresas que no pueden esperar.
            </p>
          </div>
          
          {/* Quick Tracking Form */}
          <QuickTrackingForm />
        </section>

        {/* METRICS & SERVICES (DESKTOP VERSION) */}
        <section className="hidden md:block py-24 bg-background border-t border-outline-variant">
          <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              
              {/* Card 1 */}
              <div className="bg-surface rounded-xl border border-outline-variant p-lg flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center mb-md text-[#1e40af]">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mb-xs font-bold">25M+</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Paquetes entregados</p>
              </div>

              {/* Card 2 */}
              <div className="bg-surface rounded-xl border border-outline-variant p-lg flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-secondary-container/10 flex items-center justify-center mb-md text-[#f97316]">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mb-xs font-bold">99.9%</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Tiempos de entrega</p>
              </div>

              {/* Card 3 */}
              <div className="bg-surface rounded-xl border border-outline-variant p-lg flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center mb-md text-[#1e40af]">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mb-xs font-bold">120+</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Países cubiertos</p>
              </div>

            </div>
          </div>
        </section>

        {/* BENTO GRID & SCROLLING METRICS (MOBILE VERSION) */}
        <section className="md:hidden px-margin-mobile pb-xl flex flex-col gap-lg">
          
          {/* Bento Grid */}
          <div className="flex flex-col gap-md">
            <h3 className="font-label-md text-label-md text-on-surface font-semibold">Nuestros Servicios</h3>
            <div className="grid grid-cols-1 gap-md">
              
              {/* Bento Card 1: Envíos Express */}
              <div 
                className="bg-primary text-on-primary rounded-xl p-lg flex flex-col justify-between h-48 relative overflow-hidden shadow-sm"
                style={{ 
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuByoQ2MjT1M1o8Bvz8yseQYKMTPdGHCkbA_2DBHNddYK1jjOH9DrdEA032Ah1L6DPCDjYMoKXEEnADyaSs7ZJIYUJ45ITNP4-aFS4GhzK-EvmQ5cW34MzNw4TdTKDq-LI3CPpe9Gupjx3wETwzSsIH2mPKfvSYVVH0lEcKfYpKfZjB0441hh1yjukKvhlFkPmyOqYDmehJK--dwdjjiAPf5tG72sWaq2lbgizH6l-boGgoncWfwNrhY')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="absolute inset-0 bg-primary/80"></div>
                <div className="relative z-10 flex flex-col items-start">
                  <span className="material-symbols-outlined mb-sm text-2xl text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  <h2 className="font-headline-sm text-headline-sm font-semibold">Envíos Express</h2>
                </div>
                <button className="relative z-10 w-fit bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-md py-sm rounded-lg scale-95 active:scale-90 transition-transform font-bold shadow-sm cursor-pointer">
                  Cotizar Ahora
                </button>
              </div>

              {/* Bento Card 2: Gestión de Carga */}
              <div className="grid grid-cols-2 gap-md">
                <div className="bg-surface-container-high rounded-xl p-md flex flex-col gap-sm justify-center items-center text-center border border-outline-variant shadow-xs">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">Gestión de Carga</span>
                </div>
                <div className="bg-surface-container-high rounded-xl p-md flex flex-col gap-sm justify-center items-center text-center border border-outline-variant shadow-xs">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">Flota Dedicada</span>
                </div>
              </div>

            </div>
          </div>

          {/* Scrolling Metrics */}
          <div className="flex flex-col gap-xs">
            <h3 className="font-label-md text-label-md text-on-surface font-semibold">Nuestra Cobertura</h3>
            <div className="flex gap-md overflow-x-auto snap-x snap-mandatory pb-sm no-scrollbar">
              
              <div className="min-w-[80vw] bg-surface p-lg rounded-xl border border-outline-variant shadow-sm snap-center flex flex-col gap-xs">
                <div className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">99.9%</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Entregas a tiempo</div>
              </div>

              <div className="min-w-[80vw] bg-surface p-lg rounded-xl border border-outline-variant shadow-sm snap-center flex flex-col gap-xs">
                <div className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">+50K</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Envíos mensuales</div>
              </div>

              <div className="min-w-[80vw] bg-surface p-lg rounded-xl border border-outline-variant shadow-sm snap-center flex flex-col gap-xs">
                <div className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">24/7</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Soporte logístico</div>
              </div>

            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="flex flex-col gap-md">
            <h3 className="font-label-md text-label-md text-on-surface font-semibold">Actividad Reciente</h3>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex relative">
              <div className="w-1 bg-[#fd761a]"></div>
              <div className="p-md flex-grow flex flex-col gap-sm">
                <div className="flex justify-between items-start">
                  <div className="font-code-tracking text-code-tracking text-on-surface font-bold">SLX-882-NY</div>
                  <span className="bg-orange-100 text-[#fd761a] font-label-sm text-label-sm px-sm py-[2px] rounded-full border border-orange-200 font-semibold">
                    En tránsito
                  </span>
                </div>
                <div className="flex items-center gap-sm text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[16px] text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  <span>Última ubicación: Centro de Distribución Norte</span>
                </div>
              </div>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER: Responsive Footer */}
      <footer className="bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant dark:border-outline text-primary dark:text-primary-fixed-dim font-body-sm w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-lg max-w-[1440px] mx-auto gap-md text-center md:text-left">
          
          <div className="font-label-md text-label-md font-bold text-on-surface dark:text-on-surface-variant opacity-80 hover:opacity-100">
            © 2024 SwiftLogix Express. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center gap-md">
            <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100 font-medium" href="#">
              Privacy Policy
            </a>
            <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100 font-medium" href="#">
              Terms of Service
            </a>
            <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100 font-medium" href="#">
              API Documentation
            </a>
            <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100 font-medium" href="#">
              Global Network
            </a>
          </div>

        </div>
      </footer>

      {/* Scrollbar styling for mobile scrolling metrics */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
