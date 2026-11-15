// app/(auth)/login/page.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi"; // Iconos añadidos
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const [isFloating, setIsFloating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => setIsFloating(false);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFloating(true);
    }
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "El correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Correo inválido";
    if (!password) newErrors.password = "La contraseña es obligatoria";
    else if (password.length < 6) newErrors.password = "Mínimo 6 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!validate()) return;

    setIsSubmitting(true);
    setIsFloating(false);
    try {
      const loggedUser = await login({ email, password });
      setSuccessMsg("¡Sesión iniciada correctamente!");
      setTimeout(
        () =>
          router.push(
            loggedUser.role === "ADMIN" ? "/admin/inventory" : "/"
          ),
        1000
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Credenciales inválidas. Intente de nuevo."
      );
    } finally {
      setIsSubmitting(false);
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
        {/* TÍTULO CON DEGRADADO Y MAYÚSCULAS */}
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent tracking-tight text-center mb-2 uppercase">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm text-slate-500 mt-1 text-center font-normal">
          Accede a tu cuenta y continúa logrando
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Input Correo CON ICONO Y LIMPIO */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiMail className="w-5 h-5" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="" // Vacío como pediste
              className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-normal transition outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 ${
                errors.email ? "border-red-500" : "border-slate-200 focus:border-transparent"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs font-medium mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Input Contraseña CON ICONO Y LIMPIO */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiLock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              placeholder="" // Vacío como pediste
              className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl text-sm font-normal transition outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 ${
                errors.password ? "border-red-500" : "border-slate-200 focus:border-transparent"
              }`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs font-medium mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-normal hover:text-slate-900 transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
            />
            Recordarme
          </label>
          <Link
            href="/forgot-password"
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Botón Principal */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-cyan-400 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 uppercase mt-2"
        >
          {isSubmitting ? "INICIANDO..." : "INICIAR SESIÓN →"}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-slate-200"></div>
        <span className="px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
          O continúa con
        </span>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          <FcGoogle className="w-4 h-4" />
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          <FaFacebookF className="w-4 h-4 text-blue-600" />
          Facebook
        </button>
      </div>
      
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
      >
        <FaInstagram className="w-4 h-4 text-pink-500" />
        Instagram
      </button>

      <p className="text-center text-sm text-slate-500 mt-8 font-normal">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="text-purple-600 font-semibold hover:text-purple-700"
        >
          Crear una cuenta
        </Link>
      </p>
    </div>
  );
}