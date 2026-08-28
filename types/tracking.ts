export type TrackingStatus =
  | "REGISTRADO"
  | "EN_ALMACEN"
  | "EN_TRANSITO"
  | "EN_RUTA"
  | "ENTREGADO"
  | "INCIDENCIA";

export interface TrackingHistoryEvent {
  id: number;
  status: TrackingStatus;
  location: string;
  description: string;
  timestamp: string;
}

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
