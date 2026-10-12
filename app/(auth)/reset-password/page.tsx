"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/auth.service";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!token.trim()) {
      setErrorMsg("El token de recuperación es obligatorio.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.resetPassword(token.trim(), newPassword);
      setSuccessMsg(response.message || "¡Contraseña actualizada con éxito!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al restablecer la contraseña.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 w-full animate-fadeIn">
      <CardHeader className="space-y-1.5 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Restablecer Contraseña
        </CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
          Crea una nueva contraseña segura para tu cuenta en NEXORA STORE.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="font-bold">{successMsg}</p>
              <p className="text-xs text-green-700">Redirigiendo al inicio de sesión...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!tokenFromUrl && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="token" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
                Token de Recuperación
              </Label>
              <Input
                id="token"
                type="text"
                disabled={isSubmitting}
                placeholder="Pega el token recibido por correo"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="newPassword" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
              Nueva Contraseña
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                disabled={isSubmitting}
                placeholder="Mínimo 6 caracteres"
                className="pl-9 pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

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
                placeholder="Repite la nueva contraseña"
                className="pl-9 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 font-bold bg-gradient-to-r from-purple-600 to-cyan-400 text-white shadow-md hover:opacity-95 transition"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
              </span>
            ) : (
              "Guardar Nueva Contraseña"
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1.5"
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Cargando formulario...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
