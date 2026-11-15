import { getApiUrl, getAuthHeaders } from "@/lib/api-client";
import type {
  CreateOrderRequest,
  OrderErrorBody,
  OrderResponse,
} from "@/types/order";

export class OrderError extends Error {
  status: number;
  details?: Record<string, string>;

  constructor(message: string, status: number, details?: Record<string, string>) {
    super(message);
    this.name = "OrderError";
    this.status = status;
    this.details = details;
  }
}

export async function createOrder(
  payload: CreateOrderRequest
): Promise<OrderResponse> {
  const response = await fetch(getApiUrl("/api/orders"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let body: OrderErrorBody = {};
    try {
      body = (await response.json()) as OrderErrorBody;
    } catch {
      // La respuesta de error puede no ser JSON.
    }

    const message =
      body.message ||
      body.error ||
      (response.status === 401 || response.status === 403
        ? "Debes iniciar sesión para finalizar la compra."
        : `Error ${response.status}: no se pudo crear el pedido.`);

    throw new OrderError(message, response.status, body.details);
  }

  return (await response.json()) as OrderResponse;
}