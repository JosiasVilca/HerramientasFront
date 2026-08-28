"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      setSuccessMsg("¡Sesión iniciada correctamente! Redirigiendo...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Credenciales inválidas. Intente de nuevo.");
    }
  };

  return (
    <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-xl shadow-zinc-100/50 dark:shadow-none bg-white dark:bg-zinc-900 transition-all duration-300 w-full animate-fadeIn">
      <CardHeader className="space-y-1.5 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Bienvenido de nuevo
        </CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
          Ingresa tus credenciales para acceder a tu panel.
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
          
          {/* Email input */}
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

          {/* Password input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">
                Contraseña
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-primary hover:underline hover:text-primary/95 transition-all shrink-0"
              >
                ¿Olvidé mi contraseña?
              </Link>
            </div>
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

          {/* Remember me checkbox */}
          <div className="flex items-center space-x-2 py-1">
            <Checkbox
              id="remember"
              disabled={isSubmitting}
              className="border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all cursor-pointer"
              onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
            />
            <Label
              htmlFor="remember"
              className="text-sm text-zinc-600 dark:text-zinc-400 font-medium cursor-pointer select-none"
            >
              Recordarme
            </Label>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 font-medium active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Entrar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          {/* Registration link */}
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 pt-2">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:underline transition-all"
            >
              Registrarse
            </Link>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
