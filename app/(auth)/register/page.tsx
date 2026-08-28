"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User as UserIcon, Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      role: "CLIENTE",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password,
      });
      setSuccessMsg("¡Cuenta creada correctamente! Iniciando sesión...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al crear la cuenta. Intente de nuevo.");
    }
  };

  return (
    <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xl shadow-zinc-100/50 dark:shadow-none bg-white dark:bg-zinc-900 transition-all duration-300 w-full animate-fadeIn">
      <CardHeader className="space-y-1.5 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Crea tu cuenta
        </CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
          Regístrate para gestionar y realizar tus envíos rápidos.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600 text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Message */}
        {successMsg && (
          <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Full Name Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
              Nombre Completo
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <Input
                id="fullName"
                type="text"
                disabled={isSubmitting}
                placeholder="Juan Pérez"
                className={`pl-9 bg-zinc-50/30 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all ${
                  errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                {...register("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-xs font-semibold">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
              Correo Electrónico
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                id="email"
                type="email"
                disabled={isSubmitting}
                placeholder="ejemplo@empresa.com"
                className={`pl-9 bg-zinc-50/30 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all ${
                  errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-semibold">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
              Número de Teléfono
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Phone className="w-4 h-4" />
              </div>
              <Input
                id="phone"
                type="tel"
                disabled={isSubmitting}
                placeholder="+51987654321"
                className={`pl-9 bg-zinc-50/30 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all ${
                  errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs font-semibold">{errors.phone.message}</p>
            )}
          </div>

          {/* Role Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="role" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
              Tipo de Cuenta
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 z-10">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full pl-9 bg-zinc-50/30 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all">
                      <SelectValue placeholder="Selecciona el rol de la cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENTE">Cliente (Enviar y recibir paquetes)</SelectItem>
                      <SelectItem value="REPARTIDOR">Repartidor (Entregar envíos)</SelectItem>
                      <SelectItem value="ADMIN">Administrador (Gestión global)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs font-semibold">{errors.role.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
              Contraseña
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                disabled={isSubmitting}
                placeholder="••••••••"
                className={`pl-9 pr-10 bg-zinc-50/30 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all ${
                  errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                {...register("password")}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer flex items-center"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-semibold">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                disabled={isSubmitting}
                placeholder="••••••••"
                className={`pl-9 pr-10 bg-zinc-50/30 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all ${
                  errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer flex items-center"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs font-semibold">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 font-medium active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Crear cuenta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 pt-2">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="font-bold text-primary hover:underline transition-all"
            >
              Iniciar Sesión
            </Link>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
