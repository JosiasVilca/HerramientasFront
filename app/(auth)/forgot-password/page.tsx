// app/(auth)/forgot-password/page.tsx
"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
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

  const [isFloating, setIsFloating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => setIsFloating(false);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFloating(true);
    }
  };

  const onSubmit = async (data: ForgotPasswordInput) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsFloating(false);

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
    <div
      ref={containerRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-10 transition-all duration-500 ${
        isFloating ? "animate-float" : "translate-y-0"
      }`}
    >
      {/* Logo y título */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/logotipo.png"
          alt="NEXORA STORE"
          className="w-40 sm:w-52 h-auto object-contain mb-4"
        />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide text-center">
          RECUPERAR CONTRASEÑA
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 text-center font-normal">
          Ingresa tu correo y te enviaremos las instrucciones
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Correo electrónico */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2"
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            disabled={isSubmitting}
            placeholder="ejemplo@ejemplo.com"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm font-normal transition outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.email ? "border-red-500" : "border-slate-200"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-medium mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-400 text-white font-extrabold text-sm tracking-wider rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 uppercase"
        >
          {isSubmitting ? "ENVIANDO..." : "ENVIAR INSTRUCCIONES →"}
        </button>
      </form>

      {/* Volver al login */}
      <p className="text-center text-sm text-slate-500 mt-8 font-normal">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}
