"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  
}[] = [
  {
    value: "YAPE",
    label: "Yape / Plin",
    
  },
  {
    value: "TRANSFERENCIA",
    label: "Transferencia bancaria",
    
  },
  {
    value: "EFECTIVO",
    label: "Pago contra entrega",
  },
];

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  YAPE: "Yape / Plin",
  TRANSFERENCIA: "Transferencia bancaria",
  EFECTIVO: "Pago contra entrega",
};

const NEXT_STEP: Record<PaymentMethod, string> = {
  YAPE: "Realiza el pago por Yape / Plin y envíanos la captura para confirmar tu pedido.",
  TRANSFERENCIA:
    "Realiza la transferencia bancaria y envíanos el comprobante para confirmar tu pedido.",
  EFECTIVO:
    "Pagarás al recibir tu pedido. Te contactaremos para coordinar la entrega.",
};

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
}[] = [
  { name: "fullName", label: "Nombre completo", autoComplete: "name" },
  { name: "email", label: "Correo", type: "email", autoComplete: "email" },
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel" },
  { name: "address", label: "Dirección", autoComplete: "street-address" },
  { name: "city", label: "Ciudad", autoComplete: "address-level2" },
];

const inputClass =
  "min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

const primaryLinkClass =
  "mt-6 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90";

const formatPrice = (value: number) => `S/ ${value.toFixed(2)}`;

function Shell({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>;
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
    useState<PaymentMethod>("YAPE");
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
  const renderField = (name: keyof FormState) => {
    const f = TEXT_FIELDS.find((x) => x.name === name);
    if (!f) return null;
    return (
      <div key={f.name}>
        <label htmlFor={f.name} className="mb-1 block text-sm font-medium">
          {f.label} <span className="text-destructive">*</span>
        </label>
        <input
          id={f.name}
          name={f.name}
          type={f.type ?? "text"}
          autoComplete={f.autoComplete}
          required
          value={values[f.name]}
          onChange={(e) => setField(f.name, e.target.value)}
          aria-invalid={fieldErrors[f.name] ? true : undefined}
          className={inputClass}
        />
        {fieldErrors[f.name] && (
          <p className="mt-1 text-sm text-destructive">{fieldErrors[f.name]}</p>
        )}
      </div>
    );
  };

  if (loading || !user) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </Shell>
    );
  }

   if (order) {
    const method = order.paymentMethod as PaymentMethod;
    return (
      <Shell>
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold">¡Pedido creado!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gracias por tu compra. Guarda tu número de pedido.
          </p>

          <p className="mt-6 rounded-lg bg-muted px-4 py-3 text-xl font-bold tracking-wide">
            {order.orderNumber}
          </p>

          <dl className="mt-6 space-y-2 text-left text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Método de pago</dt>
              <dd className="font-medium">
                {PAYMENT_LABELS[method] ?? order.paymentMethod}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Estado del pago</dt>
              <dd className="font-medium">Pendiente</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold">{formatPrice(order.total)}</dd>
            </div>
          </dl>

          {NEXT_STEP[method] && (
            <p className="mt-6 rounded-lg border border-border p-3 text-left text-sm">
              <strong>Siguiente paso:</strong> {NEXT_STEP[method]}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/productos"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Seguir comprando
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </Shell>
    );
  }


  if (items.length === 0) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <Link href="/productos" className={primaryLinkClass}>
          Ver productos
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <Link
        href="/carrito"
        className="mb-3 inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <span aria-hidden="true">←</span>
        Volver al carrito
      </Link>
      <h1 className="text-2xl font-bold">Finalizar compra</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start"
      >
        {/* Columna izquierda: datos */}
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                1
              </span>
              Datos de contacto
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {renderField("fullName")}
              {renderField("email")}
              {renderField("phone")}
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                2
              </span>
              Dirección de entrega
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {renderField("address")}
              {renderField("city")}
              <div className="sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="mb-1 block text-sm font-medium"
                >
                  Notas (opcional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={values.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  className={`${inputClass} py-2`}
                />
              </div>
            </div>
          </section>

          <section>
            <fieldset>
              <legend className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                  3
                </span>
                Método de pago
              </legend>
                            <div className="grid gap-3 sm:grid-cols-3">
                {PAYMENT_OPTIONS.map((opt) => {
                  const selected = paymentMethod === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex min-h-14 cursor-pointer items-center rounded-xl border px-4 py-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring/40 ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-2 font-semibold">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={opt.value}
                          checked={selected}
                          onChange={() => setPaymentMethod(opt.value)}
                          className="accent-primary"
                        />
                        {opt.label}
                      </span>
        
                    </label>
                  );
                })}
              </div>

            </fieldset>
          </section>
        </div>

        {/* Columna derecha: resumen fijo */}
        <aside className="rounded-xl border border-border bg-muted/40 p-5 lg:sticky lg:top-24">
          <h2 className="text-base font-semibold">Resumen del pedido</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4">
                <span>
                  {i.nombre} × {i.cantidad}
                </span>
                <span>{formatPrice(i.precio * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
            <span>Total estimado</span>
            <span>{formatPrice(total)}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            El total final lo confirma el servidor.
          </p>

          {error && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-brand mt-5 min-h-12 w-full rounded-lg text-base font-semibold disabled:opacity-60"
          >
            {submitting ? "Enviando..." : "Confirmar pedido"}
          </button>
        </aside>
      </form>
    </Shell>
  );
}

