// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";           // Google a color
import { FaFacebookF, FaInstagram } from "react-icons/fa"; // Facebook e Instagram

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password, rememberMe });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10">
      {/* Logo y Título */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold">
            E
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            ECOSTORE
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-wide">
          INICIAR SESIÓN
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Accede a tu cuenta y continúa logrando
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@ejemplo.com"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            required
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
            />
            Recordarme
          </label>
          <Link
            href="/forgot-password"
            className="text-purple-600 hover:text-purple-700 font-medium transition"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-400 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          INICIAR SESIÓN
          <span aria-hidden="true">→</span>
        </button>
      </form>

      {/* Separador */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-slate-200"></div>
        <span className="px-3 text-xs text-slate-400 font-medium">
          O CONTINÚA CON
        </span>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      {/* Redes Sociales CON ÍCONOS REALES */}
      <div className="flex justify-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          <FcGoogle className="w-4 h-4" />
          Google
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          <FaFacebookF className="w-4 h-4 text-blue-600" />
          Facebook
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          <FaInstagram className="w-4 h-4 text-pink-500" />
          Instagram
        </button>
      </div>

      {/* Registro */}
      <p className="text-center text-sm text-slate-500 mt-8">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="text-purple-600 font-semibold hover:text-purple-700 transition"
        >
          Crear una cuenta
        </Link>
      </p>
    </div>
  );
};