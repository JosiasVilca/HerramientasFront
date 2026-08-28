import { PackageDTO } from "@/types/tracking";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class APIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

export const MOCK_PACKAGES: Record<string, PackageDTO> = {
  "SW-9843-XY": {
    id: 101,
    trackingCode: "SW-9843-XY",
    status: "IN_TRANSIT",
    senderName: "TechNova Inc.",
    recipientName: "John Doe",
    originAddress: "Barcelona, ESP",
    destinationAddress: "Madrid, ESP",
    weight: 4.5,
    description: "Componentes electrónicos de alta precisión",
    estimatedDeliveryDate: "Mañana, 10:00 - 14:00",
    createdAt: "2026-08-27T16:20:00Z",
    updatedAt: "2026-08-28T14:30:00Z",
    history: [
      {
        id: "evt-4",
        timestamp: "Hoy, 14:30h",
        status: "IN_TRANSIT",
        location: "Terminal Madrid, ESP",
        description: "Llegada a terminal Madrid. Actualmente en movimiento al centro de distribución.",
      },
      {
        id: "evt-3",
        timestamp: "Hoy, 08:15h",
        status: "IN_TRANSIT",
        location: "Terminal Barcelona, ESP",
        description: "Salida de terminal Barcelona en ruta terrestre.",
      },
      {
        id: "evt-2",
        timestamp: "Ayer, 19:45h",
        status: "COLLECTED",
        location: "Barcelona Facility, ESP",
        description: "Envío recibido en el centro de procesamiento de origen.",
      },
      {
        id: "evt-1",
        timestamp: "Ayer, 16:20h",
        status: "PENDING",
        location: "Barcelona, ESP",
        description: "Envío registrado e información provista por TechNova Inc.",
      }
    ]
  },
  "TRK-1111-AA": {
    id: 102,
    trackingCode: "TRK-1111-AA",
    status: "DELIVERED",
    senderName: "Amazon ES",
    recipientName: "María García",
    originAddress: "Valencia, ESP",
    destinationAddress: "Alicante, ESP",
    weight: 1.2,
    description: "Libros y artículos de papelería para oficina",
    estimatedDeliveryDate: "Entregado el 27/08/2026",
    createdAt: "2026-08-26T09:00:00Z",
    updatedAt: "2026-08-27T11:45:00Z",
    history: [
      {
        id: "evt-4",
        timestamp: "27/08, 11:45h",
        status: "DELIVERED",
        location: "Alicante, ESP",
        description: "Entregado de manera exitosa con firma digital.",
      },
      {
        id: "evt-3",
        timestamp: "27/08, 08:00h",
        status: "OUT_FOR_DELIVERY",
        location: "Alicante Delivery Center, ESP",
        description: "Envío asignado al repartidor de última milla.",
      },
      {
        id: "evt-2",
        timestamp: "26/08, 14:30h",
        status: "COLLECTED",
        location: "Valencia Hub, ESP",
        description: "Envío clasificado en el centro logístico regional.",
      },
      {
        id: "evt-1",
        timestamp: "26/08, 09:00h",
        status: "PENDING",
        location: "Valencia, ESP",
        description: "Información del envío recibida por el transportista.",
      }
    ]
  }
};

export async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers({
    "Content-Type": "application/json",
    ...(options?.headers || {}),
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        try {
          const text = await response.text();
          if (text) errorMessage = text;
        } catch {}
      }
      throw new APIError(errorMessage, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error(error instanceof Error ? error.message : "Error de conexión con el servidor");
  }
}

export const trackingApi = {
  trackPackage: async (code: string): Promise<PackageDTO> => {
    const cleanedCode = code.trim().toUpperCase();
    
    // Check if mock code is requested
    if (MOCK_PACKAGES[cleanedCode]) {
      // Simulate API lag
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_PACKAGES[cleanedCode];
    }
    
    try {
      return await fetchFromAPI<PackageDTO>(`/api/v1/packages/track/${cleanedCode}`);
    } catch (apiError) {
      // Fallback to local mock db if backend connection fails and code exists in mock database
      if (MOCK_PACKAGES[cleanedCode]) {
        console.warn("API Request failed. Falling back to local mock data.", apiError);
        return MOCK_PACKAGES[cleanedCode];
      }
      throw apiError;
    }
  },
};
