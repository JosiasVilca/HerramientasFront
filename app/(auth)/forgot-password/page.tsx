// app/(auth)/forgot-password/page.tsx
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
    <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-10 transition-all duration-500 border-none">
      <CardHeader className="space-y-1.5 pb-8 text-center px-0">
        <CardTitle className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent tracking-tight text-center mb-2 uppercase">
          Recuperar Contraseña
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 text-center font-normal">
          Ingresa tu correo electrónico registrado y te enviaremos instrucciones para restablecerla.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Mensaje de Éxito */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-bold">Correo enviado</span>
            </div>
            <p className="text-xs mt-1 leading-relaxed text-green-700">
              {successMsg}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Correo Electrónico
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                id="email"
                type="email"
                disabled={isSubmitting}
                placeholder="" 
                className={`pl-11 pr-4 py-6 bg-slate-50 border rounded-xl text-sm font-normal transition outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 ${
                  errors.email ? "border-red-500" : "border-slate-200 focus:border-transparent"
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-medium mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-gradient-to-r from-purple-600 to-cyan-400 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 uppercase cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Enviar instrucciones</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Back to Login Link */}
          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors flex items-center justify-center gap-1.5"
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