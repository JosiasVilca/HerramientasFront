"use client";

import { useEffect, useRef } from "react";

const GIS_SRC = "https://accounts.google.com/gsi/client";

interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        locale?: string;
        callback: (response: { credential?: string }) => void;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type?: string;
          theme?: string;
          size?: string;
          text?: string;
          shape?: string;
          logo_alignment?: string;
          width?: number;
        }
      ) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

function loadGis(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.google?.accounts?.id) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("No se pudo cargar Google Identity Services.")));
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Google Identity Services."));
    document.head.appendChild(script);
  });
}

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void | Promise<void>;
  onError?: (message: string) => void;
  width?: number;
}

export function GoogleSignInButton({ onCredential, onError, width = 300 }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const credentialRef = useRef(onCredential);
  const errorRef = useRef(onError);

  useEffect(() => {
    credentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    errorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    let cancelled = false;

    (async () => {
      if (!clientId) {
        errorRef.current?.("Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID en el frontend.");
        return;
      }
      try {
        await loadGis();
        if (cancelled || !containerRef.current || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          locale: "es",
          callback: (response) => {
            if (!response?.credential) {
              errorRef.current?.("Google no devolvió credenciales.");
              return;
            }
            Promise.resolve(credentialRef.current(response.credential)).catch((err) =>
              errorRef.current?.(err instanceof Error ? err.message : "Error al iniciar sesión con Google.")
            );
          },
        });

        containerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "center",
          width,
        });
      } catch (err) {
        errorRef.current?.(err instanceof Error ? err.message : "No se pudo cargar Google.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [width]);

  return <div ref={containerRef} className="flex justify-center" />;
}
