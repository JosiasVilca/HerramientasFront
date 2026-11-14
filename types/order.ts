// types/order.ts
// Contrato PROVISIONAL de POST /api/orders. Pendiente de confirmar con backend.
// El cliente NO envía precios ni totales: los calcula el servidor.

export type PaymentMethod = "YAPE_PLIN" | "TRANSFERENCIA" | "CONTRA_ENTREGA";

export interface CreateOrderItem {
  productId: string; // UUID del producto en el backend
  quantity: number;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface CreateOrderRequest {
  items: CreateOrderItem[];
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
}

export interface OrderLine {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  items: OrderLine[];
  total: number;
}

// Formato de error del GlobalExceptionHandler del backend.
export interface OrderErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string; // errores de negocio (p. ej. stock insuficiente)
  details?: Record<string, string>; // errores de validación por campo
}