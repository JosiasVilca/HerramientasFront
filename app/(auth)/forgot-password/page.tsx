"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await authService.sendForgotPasswordEmail(data.email);
      setSuccessMsg(
        "Se ha enviado un enlace de recuperación a tu dirección de correo electrónico si está registrada en el sistema."
      );
      reset();
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al enviar el enlace. Intenta de nuevo más tarde."
      );
    }
  };

  return (
    <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xl shadow-zinc-100/50 dark:shadow-none bg-white dark:bg-zinc-900 transition-all duration-300 w-full animate-fadeIn">
      <CardHeader className="space-y-1.5 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          ¿Olvidaste tu contraseña?
        </CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
          Ingresa tu correo electrónico registrado y te enviaremos instrucciones para restablecerla.
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
          <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
              <span className="font-bold text-sm">Correo de recuperación enviado</span>
            </div>
            <p className="text-xs mt-1 leading-relaxed text-zinc-600 dark:text-zinc-400">
              {successMsg}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
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

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 font-medium active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Enviar instrucciones</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>

          {/* Back to Login Link */}
          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-primary hover:text-primary/95 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
