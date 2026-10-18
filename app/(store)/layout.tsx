"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo redirige cuando la sesión ya terminó de restaurarse. Sin esta guarda,
    // una recarga dura (F5, enlace directo o pestaña nueva) expulsaba a /login a
    // un usuario autenticado, porque `user` aún es null mientras se lee el token.
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Evita que la tienda parpadee mientras se restaura la sesión o se redirige
  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  );
}