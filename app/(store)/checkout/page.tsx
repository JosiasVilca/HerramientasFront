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

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "YAPE_PLIN", label: "Yape / Plin" },
  { value: "TRANSFERENCIA", label: "Transferencia bancaria" },
  { value: "CONTRA_ENTREGA", label: "Pago contra entrega" },
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
  return <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>;
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
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </Shell>
    );
  }

  if (order) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold">¡Pedido creado!</h1>
        <p className="mt-2 text-muted-foreground">
          Tu número de pedido es <strong>{order.orderNumber}</strong>.
        </p>
        <p className="mt-1 text-lg font-semibold">
          Total: {formatPrice(order.total)}
        </p>
        <Link href="/productos" className={primaryLinkClass}>
          Seguir comprando
        </Link>
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
      <h1 className="text-2xl font-bold">Finalizar compra</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {TEXT_FIELDS.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block text-sm font-medium">
              {f.label}
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
              <p className="mt-1 text-sm text-destructive">
                {fieldErrors[f.name]}
              </p>
            )}
          </div>
        ))}

        <div>
          <label htmlFor="notes" className="mb-1 block text-sm font-medium">
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

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Método de pago</legend>
          <div className="space-y-2">
            {PAYMENT_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={() => setPaymentMethod(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold">Resumen</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4">
                <span>
                  {i.nombre} × {i.cantidad}
                </span>
                <span>{formatPrice(i.precio * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between font-semibold">
            <span>Total estimado</span>
            <span>{formatPrice(total)}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            El total final lo confirma el servidor.
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="min-h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? "Enviando..." : "Confirmar pedido"}
        </button>
      </form>
    </Shell>
  );
}
