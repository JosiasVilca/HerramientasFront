import {
  TrackingDetailDTO,
  TrackingEventDTO,
  TrackingStatus,
  TrackingSummaryDTO,
} from "@/types/tracking";

/**
 * Contrato real de `GET /api/v1/tracking/{code}` del backend.
 * Las fechas llegan en ISO-8601 y se formatean aquí para la vista.
 */
export interface ApiTrackingEvent {
  id: string;
  status: TrackingStatus;
  location: string;
  description: string | null;
  timestamp: string;
}

export interface ApiTrackingDetail {
  trackingCode: string;
  currentStatus: TrackingStatus;
  originCity: string;
  destinationCity: string;
  senderName: string | null;
  senderPhone: string | null;
  receiverName: string;
  receiverPhone: string | null;
  destinationAddress: string;
  estimatedDeliveryDate: string | null;
  courierName: string | null;
  courierPhone: string | null;
  courierAvatar: string | null;
  weightKg: number | null;
  lastUpdate: string;
  history: ApiTrackingEvent[] | null;
}

const LIMA_TIME_ZONE = "America/Lima";

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: LIMA_TIME_ZONE,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: LIMA_TIME_ZONE,
});

export function formatTrackingDateTime(value: string | null | undefined): string {
  if (!value) return "Por confirmar";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : DATE_TIME_FORMATTER.format(date);
}

export function formatTrackingDate(value: string | null | undefined): string {
  if (!value) return "Por confirmar";
  // Las fechas sin hora ("YYYY-MM-DD") se interpretan a mediodía UTC para que
  // el cambio de zona no las desplace al día anterior en Lima.
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00Z` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? value : DATE_FORMATTER.format(date);
}

function toTrackingEvent(event: ApiTrackingEvent): TrackingEventDTO {
  return {
    id: event.id,
    status: event.status,
    location: event.location,
    description: event.description ?? "",
    timestamp: formatTrackingDateTime(event.timestamp),
  };
}

export function toTrackingDetail(api: ApiTrackingDetail): TrackingDetailDTO {
  return {
    trackingCode: api.trackingCode,
    currentStatus: api.currentStatus,
    originCity: api.originCity,
    destinationCity: api.destinationCity,
    senderName: api.senderName ?? "Remitente no disponible",
    senderPhone: api.senderPhone ?? undefined,
    receiverName: api.receiverName,
    receiverPhone: api.receiverPhone ?? undefined,
    destinationAddress: api.destinationAddress,
    estimatedDeliveryDate: formatTrackingDate(api.estimatedDeliveryDate),
    courierName: api.courierName ?? undefined,
    courierPhone: api.courierPhone ?? undefined,
    courierAvatar: api.courierAvatar ?? undefined,
    weightKg: api.weightKg ?? undefined,
    lastUpdate: formatTrackingDateTime(api.lastUpdate),
    history: (api.history ?? []).map(toTrackingEvent),
  };
}

export function toTrackingSummary(api: ApiTrackingDetail): TrackingSummaryDTO {
  return {
    trackingCode: api.trackingCode,
    currentStatus: api.currentStatus,
    originCity: api.originCity,
    destinationCity: api.destinationCity,
    estimatedDeliveryDate: formatTrackingDate(api.estimatedDeliveryDate),
    lastUpdate: formatTrackingDateTime(api.lastUpdate),
    senderName: api.senderName ?? undefined,
    receiverName: api.receiverName,
    weight: api.weightKg ?? undefined,
    history: (api.history ?? []).map(toTrackingEvent),
  };
}
