"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Building2,
  Check,
  Landmark,
  Lock,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { EMPTY_CART, readCart, subscribeToCart, writeCart } from "@/lib/cart";
import { createOrder, OrderError } from "@/lib/orders";
import type {
  CreateOrderRequest,
  OrderResponse,
  PaymentMethod,
} from "@/types/order";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "YAPE_PLIN",
    label: "Yape / Plin",
    description: "Paga desde tu celular",
    icon: Smartphone,
  },
  {
    value: "TRANSFERENCIA",
    label: "Transferencia bancaria",
    description: "Depósito o transferencia",
    icon: Landmark,
  },
  {
    value: "CONTRA_ENTREGA",
    label: "Pago contra entrega",
    description: "Paga cuando recibas tu pedido",
    icon: Banknote,
  },
];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

const TEXT_FIELDS: {
  name: keyof FormState;
  label: string;
  type?: string;
  autoComplete: string;
  icon: LucideIcon;
  full?: boolean;
}[] = [
  { name: "fullName", label: "Nombre completo", autoComplete: "name", icon: User, full: true },
  { name: "email", label: "Correo", type: "email", autoComplete: "email", icon: Mail },
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel", icon: Phone },
  { name: "address", label: "Dirección", autoComplete: "street-address", icon: MapPin, full: true },
  { name: "city", label: "Ciudad", autoComplete: "address-level2", icon: Building2, full: true },
];

const inputClass =
  "min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30";

const gradientButton =
  "bg-gradient-to-r from-purple-600 to-cyan-400 text-white shadow-lg shadow-purple-500/20 transition hover:brightness-110";

const primaryLinkClass = `mt-6 inline-flex min-h-11 items-center rounded-xl px-6 text-sm font-bold uppercase tracking-wide ${gradientButton}`;

const formatPrice = (value: number) => `S/ ${value.toFixed(2)}`;

function Shell({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>;
}

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Carrito", "Datos", "Confirmación"];
  return (
    <ol className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide">
      {steps.map((label, idx) => {
        const n = idx + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                active || done
                  ? "bg-gradient-to-r from-purple-600 to-cyan-400 text-white"
                  : "border border-slate-300 text-slate-500"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : n}
            </span>
            <span className={active ? "text-slate-900" : "text-slate-500"}>
              {label}
            </span>
            {n < steps.length && <span className="h-px w-8 bg-slate-300" />}
          </li>
        );
      })}
    </ol>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const items = useSyncExternalStore(
    subscribeToCart,
    readCart,
    () => EMPTY_CART,
  );

  // Solo guardamos lo que la usuaria edita; el resto viene de su perfil.
  const [edits, setEdits] = useState<Partial<FormState>>({});
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("YAPE_PLIN");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<OrderResponse | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const values: FormState = {
    fullName: edits.fullName ?? user?.fullName ?? "",
    email: edits.email ?? user?.email ?? "",
    phone: edits.phone ?? user?.phone ?? "",
    address: edits.address ?? "",
    city: edits.city ?? "",
    notes: edits.notes ?? "",
  };

  const setField = (field: keyof FormState, value: string) =>
    setEdits((prev) => ({ ...prev, [field]: value }));

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (items.some((i) => !UUID_REGEX.test(i.id))) {
      setError(
        "Tu carrito tiene productos de prueba que no se pueden comprar. Vacía el carrito y agrega productos del catálogo.",
      );
      return;
    }

    const request: CreateOrderRequest = {
      items: items.map((i) => ({ productId: i.id, quantity: i.cantidad })),
      customer: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
        notes: values.notes.trim() || undefined,
      },
      paymentMethod,
    };

    setSubmitting(true);
    try {
      const created = await createOrder(request);
      writeCart([]);
      setOrder(created);
    } catch (err) {
      if (err instanceof OrderError) {
        setError(err.message);
        setFieldErrors(err.details ?? {});
      } else {
        setError("No se pudo crear el pedido. Inténtalo de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <Shell>
        <p className="text-sm text-slate-500">Cargando...</p>
      </Shell>
    );
  }

  if (order) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-6 flex justify-center">
            <Steps current={3} />
          </div>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 text-white">
            <Check className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            ¡Pedido creado!
          </h1>
          <p className="mt-2 text-slate-600">
            Tu número de pedido es <strong>{order.orderNumber}</strong>.
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Total: {formatPrice(order.total)}
          </p>
          <Link href="/productos" className={primaryLinkClass}>
            Seguir comprando
          </Link>
        </div>
      </Shell>
    );
  }

  if (items.length === 0) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Tu carrito está vacío
          </h1>
          <Link href="/productos" className={primaryLinkClass}>
            Ver productos
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Finalizar compra
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Completa tus datos y elige cómo quieres pagar.
          </p>
        </div>
        <Steps current={2} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start"
      >
        <div className="space-y-6">
          <Card title="Datos de envío">
            <div className="grid gap-4 sm:grid-cols-2">
              {TEXT_FIELDS.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
                    <label
                      htmlFor={f.name}
                      className="mb-1 block text-sm font-semibold text-slate-700"
                    >
                      {f.label}
                    </label>
                    <div className="relative">
                      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id={f.name}
                        name={f.name}
                        type={f.type ?? "text"}
                        autoComplete={f.autoComplete}
                        required
                        value={values[f.name]}
                        onChange={(e) => setField(f.name, e.target.value)}
                        aria-invalid={fieldErrors[f.name] ? true : undefined}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                    {fieldErrors[f.name] && (
                      <p className="mt-1 text-sm text-red-600">
                        {fieldErrors[f.name]}
                      </p>
                    )}
                  </div>
                );
              })}

              <div className="sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="mb-1 block text-sm font-semibold text-slate-700"
                >
                  Notas (opcional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={values.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  placeholder="Referencias de entrega, horario, etc."
                  className={`${inputClass} py-2`}
                />
              </div>
            </div>
          </Card>

          <Card title="Método de pago">
            <fieldset>
              <legend className="sr-only">Método de pago</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {PAYMENT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = paymentMethod === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`relative flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition ${
                        selected
                          ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10"
                          : "border-slate-200 bg-white hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={opt.value}
                        checked={selected}
                        onChange={() => setPaymentMethod(opt.value)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          selected
                            ? "bg-gradient-to-r from-purple-600 to-cyan-400 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {opt.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {opt.description}
                      </span>
                      {selected && (
                        <Check className="absolute right-3 top-3 h-4 w-4 text-purple-600" />
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </Card>
        </div>

        <aside className="rounded-2xl bg-[#0b1c30] p-6 text-white shadow-xl lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Resumen del pedido</h2>

          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={i.imagen}
                  alt={i.nombre}
                  className="h-12 w-12 shrink-0 rounded-lg bg-white/10 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{i.nombre}</p>
                  <p className="text-xs text-slate-400">
                    Cantidad: {i.cantidad}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {formatPrice(i.precio * i.cantidad)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="flex items-end justify-between">
              <span className="font-bold">Total estimado</span>
              <span className="bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-2xl font-extrabold text-transparent">
                {formatPrice(total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              El total final lo confirma el servidor.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`mt-5 min-h-12 w-full rounded-xl text-sm font-bold uppercase tracking-wide disabled:opacity-60 ${gradientButton}`}
          >
            {submitting ? "Enviando..." : "Confirmar pedido"}
          </button>

          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Lock className="h-3.5 w-3.5" />
            Revisa tus datos antes de confirmar.
          </p>

          <Link
            href="/carrito"
            className="mt-4 block text-center text-xs font-semibold text-cyan-300 underline-offset-4 hover:underline"
          >
            ← Volver al carrito
          </Link>
        </aside>
      </form>
    </Shell>
  );
}
