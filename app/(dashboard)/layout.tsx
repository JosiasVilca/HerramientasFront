"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ScanBarcode,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Bell,
  Menu,
  X,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    { name: "Inicio", href: "#", icon: LayoutDashboard },
    { name: "Gestión de Paquetes", href: "/packages", icon: Package },
    { name: "Ajustes", href: "#", icon: Settings },
  ];

  const handleLogout = () => {
    // Session cleanup
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-foreground">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900 text-zinc-400 border-r border-zinc-800/80 min-h-screen">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-zinc-800/60">
          <div className="bg-primary p-2 rounded-lg border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_shipping
            </span>
          </div>
          <span className="font-bold text-lg text-white tracking-tight">SwiftLogix</span>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow p-4 space-y-1.5 pt-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/10"
                      : "hover:bg-zinc-800 hover:text-white"
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
        <div className="p-4 border-t border-zinc-800/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-lg hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span className="text-red-500">Cerrar Sesión</span>
          </button>
        </div>

      </aside>

      {/* MOBILE SIDEBAR DRAWERS */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileSidebarOpen(false)}></div>
          
          <div className="relative flex flex-col w-64 max-w-xs bg-zinc-900 text-zinc-400 p-4 border-r border-zinc-800/80 min-h-screen z-50 animate-slideRight">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800/60 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">local_shipping</span>
                <span className="font-bold text-white">SwiftLogix</span>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white cursor-pointer"
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold cursor-pointer ${
                        isActive ? "bg-primary text-white" : "hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-zinc-800/60 pt-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-lg hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-red-500">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT AREA WRAPPER */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        
        {/* TOPBAR */}
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800/80 px-6 py-4 flex justify-between items-center w-full sticky top-0 z-30 shadow-xs">
          
          <div className="flex items-center gap-3">
            {/* Hamburger menu trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-850 text-zinc-600 dark:text-zinc-400 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumbs / Page Context */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              <span>Consola</span>
              <span>/</span>
              <span className="text-zinc-800 dark:text-zinc-200">
                {pathname === "/packages" ? "Gestión de Paquetes" : "Inicio"}
              </span>
            </div>
          </div>

          {/* Topbar Operations */}
          <div className="flex items-center gap-4">
            
            {/* Notifications Button */}
            <button className="relative p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-500 cursor-pointer transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900" />
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger render={<button className="flex items-center gap-2 cursor-pointer focus:outline-none py-1 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors" />}>
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  OP
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold leading-tight text-zinc-800 dark:text-zinc-200">Operador Terminal</p>
                  <p className="text-[10px] text-zinc-400">Lima Central</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg">
                <DropdownMenuLabel className="text-xs text-zinc-500">Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                <DropdownMenuItem className="cursor-pointer text-xs font-semibold">
                  <User className="w-3.5 h-3.5 mr-2" />Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-xs font-semibold">
                  <Settings className="w-3.5 h-3.5 mr-2" />Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-xs font-semibold text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                  <LogOut className="w-3.5 h-3.5 mr-2" />Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

        </header>

        {/* INNER PAGE WRAPPER */}
        <main className="flex-grow p-6 md:p-8 max-w-[1440px] mx-auto w-full">
          {children}
        </main>

      </div>

    </div>
  );
}
