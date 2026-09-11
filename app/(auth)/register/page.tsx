// app/(auth)/register/page.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
  }>({});

  const [isFloating, setIsFloating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => setIsFloating(false);
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFloating(true);
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio";
    else if (name.trim().length < 3) newErrors.name = "Mínimo 3 caracteres";

    if (!email) newErrors.email = "El correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Correo inválido";

    if (!password) newErrors.password = "La contraseña es obligatoria";
    else if (password.length < 6) newErrors.password = "Mínimo 6 caracteres";

    if (!confirmPassword) newErrors.confirmPassword = "Confirma tu contraseña";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";

    if (!acceptTerms) newErrors.acceptTerms = "Debes aceptar los términos";

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Registro exitoso:", { name, email, password });
      setSuccessMsg("¡Cuenta creada correctamente! Redirigiendo...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Error al crear la cuenta. Intente de nuevo."
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
      className={`w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-10 my-8 transition-all duration-500 ${
        isFloating ? "animate-float" : "translate-y-0"
      }`}
    >
      {/* Logo y título */}
      <div className="flex flex-col items-center mb-6">
        <img
          src="/logotipo.png"
          alt="NEXORA STORE"
          className="w-40 sm:w-52 h-auto object-contain mb-1"
        />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide text-center">
          CREAR CUENTA
        </h1>
        <p className="text-sm text-slate-500 mt-1 text-center font-normal">
          Únete y comienza a comprar con nosotros
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre completo */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
            Nombre Completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Danna Abad"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm font-normal transition outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.name ? "border-red-500" : "border-slate-200"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs font-medium mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            placeholder="ejemplo@ejemplo.com"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm font-normal transition outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.email ? "border-red-500" : "border-slate-200"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-medium mt-1">{errors.email}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm font-normal transition outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.password ? "border-red-500" : "border-slate-200"
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
            <p className="text-red-500 text-xs font-medium mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm font-normal transition outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.confirmPassword ? "border-red-500" : "border-slate-200"
              }`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs font-medium mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Términos y condiciones */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer text-slate-600 font-normal text-sm">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 accent-purple-600 cursor-pointer mt-0.5 shrink-0"
            />
            <span>
              Acepto los{" "}
              <Link href="/terms" className="text-purple-600 hover:underline font-medium">
                términos y condiciones
              </Link>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-red-500 text-xs font-medium mt-1">{errors.acceptTerms}</p>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-400 text-white font-extrabold text-sm tracking-wider rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 uppercase"
        >
          {isSubmitting ? "CREANDO CUENTA..." : "CREAR CUENTA →"}
        </button>
      </form>

      {/* Separador */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-slate-200"></div>
        <span className="px-3 text-xs text-slate-400 font-bold uppercase tracking-widest">
          O regístrate con
        </span>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      {/* Redes sociales */}
      <div className="flex justify-center gap-2 sm:gap-3">
        <button
          type="button"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600 font-medium hover:bg-slate-50 transition"
        >
          <FcGoogle className="w-4 h-4" />
          Google
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600 font-medium hover:bg-slate-50 transition"
        >
          <FaFacebookF className="w-4 h-4 text-blue-600" />
          Facebook
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600 font-medium hover:bg-slate-50 transition"
        >
          <FaInstagram className="w-4 h-4 text-pink-500" />
          Instagram
        </button>
      </div>

      {/* Login link */}
      <p className="text-center text-sm text-slate-500 mt-8 font-normal">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="text-purple-600 font-semibold hover:text-purple-700"
        >
          Inicia Sesión
        </Link>
      </p>
    </div>
  );
}