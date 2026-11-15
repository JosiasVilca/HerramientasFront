// Contrato de POST /api/orders. Incluye los datos de entrega (customer).
// El cliente NO envía precios ni totales: los calcula el servidor.


export type PaymentMethod = "YAPE" | "TRANSFERENCIA" | "EFECTIVO";

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
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderLine[];
  total: number;
  customer?: OrderCustomer | null;
}

// Formato de error del GlobalExceptionHandler del backend.
export interface OrderErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string; // errores de negocio (p. ej. stock insuficiente)
  details?: Record<string, string>; // errores de validación por campo
}