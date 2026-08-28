<<<<<<< HEAD
import { TrackingSummaryDTO } from "@/types/tracking";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const MOCK_TRACKING_DATABASE: Record<string, TrackingSummaryDTO> = {
  "SW-9843-XY": {
    trackingCode: "SW-9843-XY",
    currentStatus: "EN_TRANSITO",
    originCity: "Lima",
    destinationCity: "Arequipa",
    estimatedDeliveryDate: "2026-08-30",
    lastUpdate: "2026-08-28 10:15",
    senderName: "Distribuidora Andina S.A.",
    receiverName: "Josías Vilca",
    weight: 4.5,
    history: [
      {
        id: 1,
        status: "REGISTRADO",
        location: "Lima - Central",
        description: "Envío registrado en el sistema y preparado para recojo.",
        timestamp: "2026-08-27 08:30",
      },
      {
        id: 2,
        status: "EN_ALMACEN",
        location: "Lima - Principal",
        description: "Paquete recibido en almacén central y clasificado por ruta.",
        timestamp: "2026-08-27 15:45",
      },
      {
        id: 3,
        status: "EN_TRANSITO",
        location: "Panamericana Sur Km 250",
        description: "El vehículo de transporte está en camino al destino central de Arequipa.",
        timestamp: "2026-08-28 10:15",
      },
    ],
  },
  "TRK-1111-AA": {
    trackingCode: "TRK-1111-AA",
    currentStatus: "ENTREGADO",
    originCity: "Trujillo",
    destinationCity: "Lima",
    estimatedDeliveryDate: "2026-08-26",
    lastUpdate: "2026-08-26 14:20",
    senderName: "Calzados del Norte",
    receiverName: "María Rojas",
    weight: 1.2,
    history: [
      {
        id: 1,
        status: "REGISTRADO",
        location: "Trujillo",
        description: "Envío registrado por el remitente.",
        timestamp: "2026-08-25 09:00",
      },
      {
        id: 2,
        status: "EN_ALMACEN",
        location: "Trujillo - Centro",
        description: "Paquete recibido e ingresado al almacén de salida.",
        timestamp: "2026-08-25 14:10",
      },
      {
        id: 3,
        status: "EN_TRANSITO",
        location: "Lima - Hub Norte",
        description: "Tránsito terrestre nacional hacia Lima completado.",
        timestamp: "2026-08-26 04:30",
      },
      {
        id: 4,
        status: "EN_RUTA",
        location: "Lima - San Isidro",
        description: "Paquete en manos del repartidor asignado a la zona residencial.",
        timestamp: "2026-08-26 10:00",
      },
      {
        id: 5,
        status: "ENTREGADO",
        location: "Lima - Destino Final",
        description: "Entregado a María Rojas. Firma digital registrada.",
        timestamp: "2026-08-26 14:20",
      },
    ],
  },
};
=======
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
>>>>>>> aef57aa (feat(SCRUM-11): implementa vistas de login y registro con validacion Zod)

export async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMsg = `Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMsg = errorData.message;
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

<<<<<<< HEAD
=======
  // Handle empty responses or HTTP 204
>>>>>>> aef57aa (feat(SCRUM-11): implementa vistas de login y registro con validacion Zod)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
<<<<<<< HEAD

export async function trackPackage(trackingCode: string): Promise<TrackingSummaryDTO> {
  try {
    return await fetchFromAPI<TrackingSummaryDTO>(`/api/v1/packages/track/${trackingCode}`, {
      method: "GET",
    });
  } catch (error) {
    console.warn(`REST call failed. Checking local mock database for code ${trackingCode}`, error);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    const uppercaseCode = trackingCode.trim().toUpperCase();
    const result = MOCK_TRACKING_DATABASE[uppercaseCode];
    
    if (result) {
      return result;
    }
    
    throw new Error("Código de rastreo no encontrado. Verifica la guía e intenta de nuevo.");
  }
}
=======
>>>>>>> aef57aa (feat(SCRUM-11): implementa vistas de login y registro con validacion Zod)
