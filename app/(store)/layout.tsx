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
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario no está logueado, lo envía al login
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Evita que la tienda parpadee mientras se hace la redirección
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  );
}