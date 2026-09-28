"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers3,
  Search,
  LogOut,
  User,
  ChevronDown,
  Bell,
  Menu,
  X,
  Store,
  MapPin,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigation = [
    { name: "Inventario & Dashboard", href: "/admin/inventory", icon: LayoutDashboard },
    { name: "Gestión de Paquetes", href: "/packages", icon: Package },
    { name: "Categorías y Catálogos", href: "/admin/categories", icon: Layers3 },
    { name: "Seguimiento Envíos", href: "/tracking-list", icon: MapPin },
    { name: "Tienda NEXORA", href: "/productos", icon: Store },
  ];

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex bg-background font-sans antialiased text-foreground selection:bg-purple-500/20">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0f172a] text-slate-300 border-r border-slate-800 shrink-0 min-h-screen">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="bg-gradient-to-br from-purple-600 to-cyan-500 p-2 rounded-xl text-white flex items-center justify-center shadow-xs">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base text-white tracking-wider uppercase block leading-tight">
              NEXORA
            </span>
            <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase block">
              Store &amp; Logistics
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow p-4 space-y-1.5 pt-6">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Control de Administración
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-purple-600 text-white shadow-xs"
                      : "hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Area / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 text-xs font-semibold rounded-lg text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </aside>

      {/* MOBILE SIDEBAR DRAWERS */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileSidebarOpen(false)}></div>
          
          <div className="relative flex flex-col w-64 max-w-xs bg-[#0f172a] text-slate-300 p-4 border-r border-slate-800 min-h-screen z-50 animate-slideRight">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-purple-600 p-1.5 rounded-md text-white">
                  <Zap className="w-4 h-4 fill-white text-white" />
                </div>
                <span className="font-bold text-white text-sm uppercase tracking-wider">NEXORA STORE</span>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-grow space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href} onClick={() => setMobileSidebarOpen(false)}>
                    <div
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        isActive ? "bg-purple-600 text-white" : "hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-800 pt-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3.5 py-2.5 text-xs font-semibold rounded-lg text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT AREA WRAPPER */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        
        {/* TOPBAR */}
        <header className="bg-card border-b border-border/80 px-6 py-3.5 flex justify-between items-center w-full sticky top-0 z-30 shadow-2xs">
          
          <div className="flex items-center gap-3">
            {/* Hamburger menu trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumbs / Page Context */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span>NEXORA Console</span>
              <span>/</span>
              <span className="text-foreground font-bold">
                {pathname === "/packages"
                  ? "Gestión de Paquetes"
                  : pathname === "/admin/categories"
                  ? "Catálogos y Categorías"
                  : "Inventario Matriz"}
              </span>
            </div>
          </div>

          {/* Topbar Operations */}
          <div className="flex items-center gap-4">
            
            {/* Notifications Button */}
            <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-card" />
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger render={<button className="flex items-center gap-2.5 cursor-pointer focus:outline-none py-1 px-2 rounded-lg hover:bg-muted transition-colors" />}>
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 font-extrabold text-xs">
                  NX
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold leading-tight text-foreground">Operador NEXORA</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Lima Central HQ</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border shadow-md">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Mi Sesión</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-xs font-semibold text-destructive focus:bg-destructive/10">
                  <LogOut className="w-3.5 h-3.5 mr-2" />Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

        </header>

        {/* INNER PAGE WRAPPER */}
        <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full">
          {children}
        </main>

      </div>

    </div>
  );
}


