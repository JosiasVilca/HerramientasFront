// app/(store)/perfil/page.tsx
"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiAlertCircle,
  FiCamera,
  FiCheckCircle,
  FiCreditCard,
  FiHeart,
  FiLoader,
  FiLogIn,
  FiLogOut,
  FiMessageCircle,
  FiPackage,
  FiShoppingCart,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import ProductCard from "@/components/store/ProductCard";
import Reveal from "@/components/ui/reveal";
import { useAuth } from "@/context/auth-context";
import { authService } from "@/services/auth.service";
import { useCombinedProducts } from "@/lib/use-combined-products";
import {
  EMPTY_FAVORITES,
  readFavorites,
  subscribeToFavorites,
} from "@/lib/favorites";
import type { User } from "@/types/auth";

type Feedback = { text: string; type: "success" | "error" } | null;

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";

  let numberPart = digits;
  if (digits.startsWith("51")) {
    numberPart = digits.slice(2);
  }

  numberPart = numberPart.slice(0, 9);

  const formatted = numberPart.replace(
    /(\d{3})(\d{0,3})(\d{0,3})/,
    (_, a, b, c) => {
      let result = a;
      if (b) result += ` ${b}`;
      if (c) result += ` ${c}`;
      return result;
    },
  );

  return `+51 ${formatted}`;
};

const roleLabel = (role: User["role"]) => {
  if (role === "ADMIN") return "Administrador";
  if (role === "REPARTIDOR") return "Repartidor";
  return "Cliente";
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "NX";

function AccountView({ user }: { user: User }) {
  const router = useRouter();
  const { logout, updateUser } = useAuth();
  const { allProducts, isLoaded } = useCombinedProducts();
  const favoriteIds = useSyncExternalStore(
    subscribeToFavorites,
    readFavorites,
    () => EMPTY_FAVORITES,
  );

  const [name, setName] = useState(user.fullName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [avatar, setAvatar] = useState(user.avatarUrl || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const favoriteProducts = allProducts
    .filter((product) => favoriteIds.includes(product.id))
    .slice(0, 4);

  const whatsappHref = `https://wa.me/51987654321?text=${encodeURIComponent(
    "Hola NEXORA, quiero coordinar mi pedido.",
  )}`;

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (name.trim().length < 3) {
      setFeedback({
        text: "Escribe tu nombre completo para continuar.",
        type: "error",
      });
      return;
    }

    setIsSaving(true);
    try {
      const updated = await authService.updateProfile({
        fullName: name.trim(),
        phone: phone.trim(),
      });
      setName(updated.fullName || name.trim());
      setPhone(updated.phone || "");
      updateUser(updated);
      setIsEditing(false);
      setFeedback({ text: "Tus datos se actualizaron.", type: "success" });
    } catch (error) {
      setFeedback({
        text:
          error instanceof Error
            ? error.message
            : "No pudimos guardar tus datos. Inténtalo de nuevo.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user.fullName || "");
    setPhone(user.phone || "");
    setIsEditing(false);
    setFeedback(null);
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFeedback({
        text: "Elige una imagen en formato JPG, PNG o WebP.",
        type: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({
        text: "La imagen no puede superar los 5 MB.",
        type: "error",
      });
      return;
    }

    setIsUploadingPhoto(true);
    setFeedback(null);
    try {
      const updated = await authService.uploadAvatar(file);
      setAvatar(updated.avatarUrl || "");
      updateUser(updated);
      setFeedback({ text: "Foto de perfil actualizada.", type: "success" });
    } catch (error) {
      setFeedback({
        text:
          error instanceof Error
            ? error.message
            : "No pudimos subir la imagen. Inténtalo de nuevo.",
        type: "error",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
      <aside className="hero-rise overflow-hidden rounded-xl bg-[#0b1c30] text-white lg:sticky lg:top-8">
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white/10 text-xl font-bold">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initialsOf(name)
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0b1c30] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60"
                aria-label="Cambiar foto de perfil"
              >
                {isUploadingPhoto ? (
                  <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <FiCamera className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xl font-semibold leading-tight">{name}</p>
              <p className="mt-1 break-all text-base text-white/60">
                {user.email}
              </p>
            </div>
          </div>

          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              aria-hidden="true"
            />
            {roleLabel(user.role)}
          </p>

          <nav
            aria-label="Accesos de la cuenta"
            className="mt-7 rounded-lg bg-white/[0.06] p-2"
          >
            <Link
              href="/favoritos"
              className="flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-base text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span className="flex items-center gap-3">
                <FiHeart className="h-4 w-4" aria-hidden="true" />
                Favoritos
              </span>
              <span className="tabular-nums text-white/50">
                {favoriteIds.length}
              </span>
            </Link>
            <Link
              href="/carrito"
              className="flex min-h-11 items-center gap-3 rounded-md px-3 text-base text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              <FiShoppingCart className="h-4 w-4" aria-hidden="true" />
              Mi carrito
            </Link>
            <Link
              href="/productos"
              className="flex min-h-11 items-center gap-3 rounded-md px-3 text-base text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              <FiPackage className="h-4 w-4" aria-hidden="true" />
              Catálogo completo
            </Link>
          </nav>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={handleLogout}
            className="flex min-h-12 w-full items-center gap-3 rounded-lg bg-white/[0.06] px-4 text-base text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40"
          >
            <FiLogOut className="h-4 w-4" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="space-y-6">
        <Reveal>
          <section className="rounded-xl bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Datos personales
                </h2>
                <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">
                  Tu nombre y teléfono son los que usamos para coordinar la
                  entrega de tu pedido.
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setFeedback(null);
                  }}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-muted px-4 text-base font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  Editar datos
                </button>
              )}
            </div>

            {feedback && (
              <div
                role={feedback.type === "error" ? "alert" : "status"}
                className={`mt-5 flex items-start gap-3 rounded-lg p-4 text-base ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {feedback.type === "success" ? (
                  <FiCheckCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                ) : (
                  <FiAlertCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                    aria-hidden="true"
                  />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave} className="mt-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-muted-foreground">
                      Nombre completo
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      minLength={3}
                      autoComplete="name"
                      className="mt-1.5 h-12 w-full rounded-lg bg-muted px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-muted-foreground">
                      Teléfono
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(formatPhone(event.target.value))
                      }
                      placeholder="+51 999 999 999"
                      autoComplete="tel"
                      className="mt-1.5 h-12 w-full rounded-lg bg-muted px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </label>

                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Correo electrónico
                    </p>
                    <p className="mt-1.5 text-base text-foreground">
                      {user.email}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      El correo de acceso no se cambia desde aquí.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60"
                  >
                    {isSaving && (
                      <FiLoader
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    {isSaving ? "Guardando…" : "Guardar cambios"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="inline-flex min-h-12 items-center justify-center rounded-lg bg-muted px-5 text-base font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Nombre completo
                  </dt>
                  <dd className="mt-1 text-base font-medium text-foreground">
                    {name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Teléfono</dt>
                  <dd className="mt-1 text-base font-medium text-foreground">
                    {phone || "Sin registrar"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-muted-foreground">
                    Correo electrónico
                  </dt>
                  <dd className="mt-1 break-all text-base font-medium text-foreground">
                    {user.email}
                  </dd>
                </div>
              </dl>
            )}
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section id="entrega" className="rounded-xl bg-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Entrega y pago
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Cada pedido se cierra con nuestro equipo por WhatsApp. No se
              realiza ningún cobro en esta web.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-muted p-5">
                <FiTruck
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  Envío
                </h3>
                <p className="mt-1 text-base leading-relaxed text-foreground/80">
                  Confirmamos la dirección y el costo de envío antes de
                  despachar. Entregamos en Lima y enviamos a todo el Perú.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-5">
                <FiCreditCard
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  Pago
                </h3>
                <p className="mt-1 text-base leading-relaxed text-foreground/80">
                  No guardamos tarjetas ni datos de pago. La forma de pago se
                  acuerda al confirmar stock y envío.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <FiMessageCircle className="h-4 w-4" aria-hidden="true" />
                Escribir por WhatsApp
              </a>
              <Link
                href="/productos"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-muted px-5 text-base font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                Ver catálogo
              </Link>
            </div>
          </section>
        </Reveal>

        <Reveal delay={140}>
          <section className="rounded-xl bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Tus favoritos
                </h2>
                <p className="mt-2 text-base text-muted-foreground">
                  {favoriteIds.length === 0
                    ? "Todavía no guardaste productos."
                    : `${favoriteIds.length} ${
                        favoriteIds.length === 1
                          ? "producto guardado"
                          : "productos guardados"
                      } para volver cuando quieras.`}
                </p>
              </div>
              <Link
                href="/favoritos"
                className="inline-flex min-h-11 items-center text-base font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
              >
                Ver todos
              </Link>
            </div>

            {isLoaded && favoriteProducts.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
                {favoriteProducts.map((product, index) => (
                  <Reveal key={product.id} delay={(index % 4) * 60}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            )}
          </section>
        </Reveal>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  const { user, loading } = useAuth();

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-8 sm:px-6 lg:px-8 lg:pt-10">
      <nav
        aria-label="Migas de pan"
        className="hero-rise flex items-center gap-2 text-base text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">Mi cuenta</span>
      </nav>

      <h1 className="hero-rise mt-5 text-[clamp(2.75rem,6vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground [animation-delay:60ms]">
        Mi cuenta
      </h1>
      <p className="hero-rise mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:120ms]">
        Gestiona tus datos, revisa tus favoritos y coordina tu próximo pedido.
      </p>

      {loading ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="h-80 rounded-xl bg-muted" aria-hidden="true" />
          <div className="space-y-6">
            <div className="h-64 rounded-xl bg-muted" aria-hidden="true" />
            <div className="h-52 rounded-xl bg-muted" aria-hidden="true" />
          </div>
          <span className="sr-only">Cargando tu cuenta…</span>
        </div>
      ) : user ? (
        <AccountView key={String(user.id)} user={user} />
      ) : (
        <div className="hero-rise mt-10 rounded-xl bg-card p-10 sm:p-14 [animation-delay:180ms]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FiUser
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <h2 className="mt-5 text-2xl font-semibold text-foreground">
            Inicia sesión para ver tu cuenta
          </h2>
          <p className="mt-2 max-w-md text-base leading-relaxed text-muted-foreground">
            Desde tu cuenta puedes actualizar tus datos, revisar tus favoritos
            y coordinar tus pedidos.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <FiLogIn className="h-4 w-4" aria-hidden="true" />
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-muted px-5 text-base font-semibold text-foreground transition-colors hover:bg-accent"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
