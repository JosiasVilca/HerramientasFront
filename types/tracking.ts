export type TrackingStatus =
  | "REGISTRADO"
  | "EN_ALMACEN"
  | "EN_TRANSITO"
  | "EN_RUTA"
  | "ENTREGADO"
  | "INCIDENCIA";

export interface TrackingEventDTO {
  id: number;
  status: TrackingStatus;
  location: string;
  description: string;
  timestamp: string;
}

export interface TrackingDetailDTO {
  trackingCode: string;
  currentStatus: TrackingStatus;
  originCity: string;
  destinationCity: string;
  senderName: string;
  senderPhone?: string;
  receiverName: string;
  receiverPhone?: string;
  destinationAddress: string;
  estimatedDeliveryDate: string;
  courierName?: string;
  courierPhone?: string;
  courierAvatar?: string;
  weightKg?: number;
  lastUpdate: string;
  history: TrackingEventDTO[];
}

// Backward compatibility interfaces
export type TrackingHistoryEvent = TrackingEventDTO;

export interface TrackingSummaryDTO {
  trackingCode: string;
  currentStatus: TrackingStatus;
  originCity: string;
  destinationCity: string;
  estimatedDeliveryDate: string;
  lastUpdate: string;
  senderName?: string;
  receiverName?: string;
  weight?: number;
  history?: TrackingHistoryEvent[];
}
