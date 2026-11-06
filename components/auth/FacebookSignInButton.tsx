"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaFacebookF } from "react-icons/fa";

const FB_SDK_SRC = "https://connect.facebook.net/es_ES/sdk.js";
const FB_DEFAULT_API_VERSION = "v26.0";

/** Permisos por defecto: se conceden sin pasar por App Review. */
const FB_SCOPE = "public_profile,email";

interface FacebookAuthResponse {
  accessToken: string;
  userID: string;
  expiresIn: number;
}

interface FacebookLoginStatusResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: FacebookAuthResponse;
}

interface FacebookSDK {
  init: (options: {
    appId: string;
    cookie?: boolean;
    xfbml?: boolean;
    version: string;
  }) => void;
  login: (
    callback: (response: FacebookLoginStatusResponse) => void,
    options?: { scope?: string; return_scopes?: boolean }
  ) => void;
}

declare global {
  interface Window {
    FB?: FacebookSDK;
    fbAsyncInit?: () => void;
  }
}

/**
 * Inyecta el SDK de Facebook una sola vez y resuelve cuando está disponible.
 * El SDK avisa de que ha terminado llamando a `window.fbAsyncInit`.
 */
function loadFacebookSdk(): Promise<FacebookSDK> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("El SDK de Facebook solo está disponible en el navegador."));
      return;
    }

    if (window.FB) {
      resolve(window.FB);
      return;
    }

    let settled = false;
    const settle = (fn: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      window.clearInterval(poll);
      fn();
    };

    // El SDK se carga por partes: el bootstrap de `sdk.js` no siempre dispara
    // `fbAsyncInit` (lo hace desde un chunk diferido), así que además de
    // engancharnos al callback sondeamos `window.FB` hasta que aparezca.
    const check = () => {
      if (window.FB) settle(() => resolve(window.FB as FacebookSDK));
    };

    const timeout = window.setTimeout(
      () => settle(() => reject(new Error("El SDK de Facebook tardó demasiado en cargar."))),
      15000
    );

    const poll = window.setInterval(check, 100);

    // El SDK invoca este callback al terminar de cargarse. Si ya existía uno
    // (otro montaje del componente), se respeta.
    const previousAsyncInit = window.fbAsyncInit;
    window.fbAsyncInit = () => {
      previousAsyncInit?.();
      check();
    };

    // Si el script ya está en el DOM, no se duplica: bastará con el callback.
    if (document.querySelector(`script[src^="${FB_SDK_SRC}"]`)) {
      return;
    }

    const script = document.createElement("script");
    script.src = FB_SDK_SRC;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onerror = () => {
      window.clearTimeout(timeout);
      settle(() => reject(new Error("No se pudo cargar el SDK de Facebook.")));
    };
    document.body.appendChild(script);
  });
}

interface FacebookSignInButtonProps {
  /** Recibe el access token de usuario para canjearlo en el backend. */
  onAccessToken: (accessToken: string) => void | Promise<void>;
  onError?: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export function FacebookSignInButton({
  onAccessToken,
  onError,
  disabled = false,
  className = "",
}: FacebookSignInButtonProps) {
  const [ready, setReady] = useState(false);
  const sdkRef = useRef<FacebookSDK | null>(null);
  const tokenRef = useRef(onAccessToken);
  const errorRef = useRef(onError);

  useEffect(() => {
    tokenRef.current = onAccessToken;
  }, [onAccessToken]);

  useEffect(() => {
    errorRef.current = onError;
  }, [onError]);

  const clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID;
  const apiVersion = process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || FB_DEFAULT_API_VERSION;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!clientId) return; // el clic dará el aviso concreto
      try {
        const sdk = await loadFacebookSdk();
        if (cancelled) return;
        sdk.init({ appId: clientId, cookie: true, xfbml: false, version: apiVersion });
        sdkRef.current = sdk;
        setReady(true);
      } catch (err) {
        if (cancelled) return;
        errorRef.current?.(
          err instanceof Error ? err.message : "No se pudo cargar Facebook."
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clientId, apiVersion]);

  const handleClick = useCallback(() => {
    if (!clientId) {
      errorRef.current?.("Falta NEXT_PUBLIC_FACEBOOK_CLIENT_ID en el frontend.");
      return;
    }

    const sdk = sdkRef.current;
    if (!ready || !sdk) {
      errorRef.current?.("Facebook aún se está cargando. Inténtalo de nuevo en un momento.");
      return;
    }

    // Debe ejecutarse dentro del gesto del usuario: FB.login abre una ventana.
    sdk.login(
      (response) => {
        if (response.status === "connected" && response.authResponse?.accessToken) {
          Promise.resolve(tokenRef.current(response.authResponse.accessToken)).catch((err) =>
            errorRef.current?.(
              err instanceof Error ? err.message : "No se pudo iniciar sesión con Facebook."
            )
          );
          return;
        }
        errorRef.current?.("Se canceló el inicio de sesión con Facebook.");
      },
      { scope: FB_SCOPE, return_scopes: true }
    );
  }, [clientId, ready]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
      aria-busy={!ready}
    >
      <FaFacebookF className="w-4 h-4 text-blue-600" />
      Facebook
    </button>
  );
}
