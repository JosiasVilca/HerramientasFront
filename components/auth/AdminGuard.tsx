"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/auth-context";

/**
 * Barrera de UX para `/admin/*`.
 *
 * La autorización real la impone el backend (`@PreAuthorize("hasRole('ADMIN')")`
 * devuelve 403). Esto solo evita que un usuario no autorizado vea pantallas que
 * no puede usar: sin sesión → `/login`; con sesión pero sin rol ADMIN → `/`.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (loading) return;

    // Diferido con microtask: evita setState/navegación síncrona en el efecto
    // (misma convención que el resto del panel).
    queueMicrotask(() => {
      if (!user) {
        router.replace("/login");
      } else if (!isAdmin) {
        router.replace("/");
      }
    });
  }, [loading, user, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="text-xs text-muted-foreground">Verificando permisos…</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <ShieldAlert className="h-10 w-10 text-amber-500" />
        <h2 className="text-sm font-bold uppercase text-foreground">Acceso restringido</h2>
        <p className="max-w-md text-xs text-muted-foreground">
          Esta sección es exclusiva para administradores. Te estamos redirigiendo…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
