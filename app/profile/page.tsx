"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Mail, Phone, Shield, Camera, ArrowLeft, Check, LogOut, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <Card className="max-w-md w-full text-center p-8 border-zinc-200 dark:border-zinc-800">
          <CardTitle className="text-xl font-bold mb-2">Sesión Requerida</CardTitle>
          <CardDescription className="mb-6 text-sm">
            Debes iniciar sesión para ver los detalles de tu perfil.
          </CardDescription>
          <Link href="/login">
            <Button className="w-full">Ir a Iniciar Sesión</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName)}`;
  const currentAvatar = avatarUrl.trim() || user.avatarUrl || defaultAvatar;

  const handleSaveAvatar = () => {
    // Save to user object in local state / auth-context
    const updatedUser = { ...user, avatarUrl: avatarUrl.trim() };
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    setSavedSuccess(true);
    setIsEditingAvatar(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-foreground py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Back Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5 cursor-pointer text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 overflow-hidden">
          
          {/* Decorative Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-primary via-blue-600 to-sky-500 relative"></div>

          <CardContent className="relative pt-0 pb-8 px-6 md:px-10">
            
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-8">
              <div className="relative group">
                <img
                  src={currentAvatar}
                  alt={user.fullName}
                  className="w-28 h-28 rounded-full border-4 border-white dark:border-zinc-900 shadow-lg object-cover bg-white"
                />
                <button
                  type="button"
                  onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-all cursor-pointer"
                  title="Cambiar foto de perfil"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                    {user.fullName}
                  </h1>
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-bold text-xs uppercase">
                    {user.role}
                  </Badge>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Notification when photo saved */}
            {savedSuccess && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-green-600" />
                <span>¡Foto de perfil actualizada correctamente!</span>
              </div>
            )}

            {/* Avatar Editor Modal / Form */}
            {isEditingAvatar && (
              <div className="mb-8 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  URL de la Foto de Perfil (o enlace de imagen)
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://ejemplo.com/mi-foto.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs"
                  />
                  <Button size="sm" onClick={handleSaveAvatar} className="shrink-0 cursor-pointer font-semibold">
                    Guardar
                  </Button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Se admite cualquier URL directa de imagen (.png, .jpg, .svg) lista para ser almacenada en la base de datos PostgreSQL.
                </p>
              </div>
            )}

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              
              <div className="space-y-1.5 p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-primary" /> Nombre Completo
                </span>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {user.fullName}
                </p>
              </div>

              <div className="space-y-1.5 p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" /> Correo Electrónico
                </span>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {user.email}
                </p>
              </div>

              <div className="space-y-1.5 p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" /> Teléfono
                </span>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {user.phone || "No registrado"}
                </p>
              </div>

              <div className="space-y-1.5 p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary" /> Rol en la Plataforma
                </span>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {user.role}
                </p>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-4 justify-between items-center">
              <Link href="/dashboard">
                <Button variant="outline" className="gap-2 cursor-pointer text-xs font-semibold">
                  <Package className="w-4 h-4 text-primary" />
                  <span>Ir a Gestión de Envíos</span>
                </Button>
              </Link>

              <p className="text-xs text-zinc-400">
                Proveedor de Autenticación: <span className="font-semibold text-zinc-600 dark:text-zinc-300">LOCAL (Servidor Spring Security)</span>
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
