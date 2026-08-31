import { fetchFromAPI } from "@/lib/api-client";
import { TrackingDetailDTO, TrackingEventDTO } from "@/types/tracking";

const MOCK_TRACKING_DETAILS: Record<string, TrackingDetailDTO> = {
  "SW-9843-XY": {
    trackingCode: "SW-9843-XY",
    currentStatus: "EN_TRANSITO",
    originCity: "Lima, PER",
    destinationCity: "Arequipa, PER",
    senderName: "TechNova Inc. (Distribuidora Andina)",
    senderPhone: "+51 1 456 7890",
    receiverName: "Josías Vilca",
    receiverPhone: "+51 987 654 321",
    destinationAddress: "Av. Ejército 450, Yanahuara, Arequipa",
    estimatedDeliveryDate: "Mañana, 10:00 - 14:00 hrs",
    courierName: "Carlos Mendoza",
    courierPhone: "+51 987 123 456",
    courierAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    weightKg: 4.5,
    lastUpdate: "Hoy, 10:15 hrs",
    history: [
      {
        id: 1,
        status: "REGISTRADO",
        location: "Lima - Central",
        description: "Envío registrado en el sistema y preparado para recojo.",
        timestamp: "Ayer, 16:20 hrs",
      },
      {
        id: 2,
        status: "EN_ALMACEN",
        location: "Lima - Hub Principal",
        description: "Paquete recibido en almacén central y clasificado por ruta.",
        timestamp: "Ayer, 19:45 hrs",
      },
      {
        id: 3,
        status: "EN_TRANSITO",
        location: "Panamericana Sur Km 250",
        description: "El vehículo de transporte está en camino al destino central de Arequipa.",
        timestamp: "Hoy, 10:15 hrs",
      },
    ],
  },
  "TRK-1111-AA": {
    trackingCode: "TRK-1111-AA",
    currentStatus: "ENTREGADO",
    originCity: "Trujillo, PER",
    destinationCity: "Lima, PER",
    senderName: "Calzados del Norte S.A.C.",
    senderPhone: "+51 44 234 567",
    receiverName: "María Rojas",
    receiverPhone: "+51 977 889 900",
    destinationAddress: "Calle Las Flores 123, San Isidro, Lima",
    estimatedDeliveryDate: "Entregado el 26 de Agosto",
    courierName: "Pedro Gómez",
    courierPhone: "+51 999 444 333",
    courierAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    weightKg: 1.2,
    lastUpdate: "26 Ago, 14:20 hrs",
    history: [
      {
        id: 1,
        status: "REGISTRADO",
        location: "Trujillo",
        description: "Envío registrado por el remitente.",
        timestamp: "25 Ago, 09:00 hrs",
      },
      {
        id: 2,
        status: "EN_ALMACEN",
        location: "Trujillo - Centro",
        description: "Paquete recibido e ingresado al almacén de salida.",
        timestamp: "25 Ago, 14:10 hrs",
      },
      {
        id: 3,
        status: "EN_TRANSITO",
        location: "Lima - Hub Norte",
        description: "Tránsito terrestre nacional hacia Lima completado.",
        timestamp: "26 Ago, 04:30 hrs",
      },
      {
        id: 4,
        status: "EN_RUTA",
        location: "Lima - San Isidro",
        description: "Paquete en manos del repartidor asignado a la zona residencial.",
        timestamp: "26 Ago, 10:00 hrs",
      },
      {
        id: 5,
        status: "ENTREGADO",
        location: "Lima - Destino Final",
        description: "Entregado a María Rojas. Firma digital registrada.",
        timestamp: "26 Ago, 14:20 hrs",
      },
    ],
  },
  "SW-4321-LZ": {
    trackingCode: "SW-4321-LZ",
    currentStatus: "EN_ALMACEN",
    originCity: "Arequipa, PER",
    destinationCity: "Lima, PER",
    senderName: "Josías Vilca",
    senderPhone: "+51 912 345 678",
    receiverName: "Distribuidora Andina S.A.",
    receiverPhone: "+51 987 654 321",
    destinationAddress: "Av. Argentina 1400, Callao, Lima",
    estimatedDeliveryDate: "En 2 días",
    courierName: "Asignación pendiente",
    courierPhone: "N/D",
    weightKg: 12.0,
    lastUpdate: "Hoy, 07:15 hrs",
    history: [
      {
        id: 1,
        status: "REGISTRADO",
        location: "Arequipa - Centro",
        description: "Solicitud de envío recepcionada.",
        timestamp: "Hoy, 06:00 hrs",
      },
      {
        id: 2,
        status: "EN_ALMACEN",
        location: "Arequipa - Hub Regional",
        description: "Ingresado al almacén regional para consolidación de carga.",
        timestamp: "Hoy, 07:15 hrs",
      },
    ],
  },
  "SW-5566-ER": {
    trackingCode: "SW-5566-ER",
    currentStatus: "INCIDENCIA",
    originCity: "Lima, PER",
    destinationCity: "Piura, PER",
    senderName: "TechStore SAC",
    senderPhone: "+51 1 999 8888",
    receiverName: "Juan Carlos Baca",
    receiverPhone: "+51 966 555 444",
    destinationAddress: "Av. Grau 820, Piura",
    estimatedDeliveryDate: "Pendiente de reprogramación",
    courierName: "Roberto Sánchez",
    courierPhone: "+51 955 112 233",
    weightKg: 0.5,
    lastUpdate: "Ayer, 09:10 hrs",
    history: [
      {
        id: 1,
        status: "REGISTRADO",
        location: "Lima",
        description: "Guía creada por el remitente.",
        timestamp: "26 Ago, 10:00 hrs",
      },
      {
        id: 2,
        status: "EN_ALMACEN",
        location: "Lima - Central",
        description: "Procesado en almacén origen.",
        timestamp: "26 Ago, 16:30 hrs",
      },
      {
        id: 3,
        status: "EN_TRANSITO",
        location: "Ruta Panamericana Norte",
        description: "En tránsito a Piura.",
        timestamp: "27 Ago, 02:00 hrs",
      },
      {
        id: 4,
        status: "INCIDENCIA",
        location: "Piura - Terminal",
        description: "Dirección de entrega no ubicada o incompleta. Contactando al destinatario.",
        timestamp: "Ayer, 09:10 hrs",
      },
    ],
  },
};

export const trackingService = {
  getTrackingDetail: async (trackingCode: string): Promise<TrackingDetailDTO> => {
    try {
      return await fetchFromAPI<TrackingDetailDTO>(`/api/v1/tracking/${trackingCode}`);
    } catch (error) {
      console.warn(`Backend REST Tracking API offline. Checking mock details for ${trackingCode}.`, error);
      
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      const codeUpper = trackingCode.trim().toUpperCase();
      const detail = MOCK_TRACKING_DETAILS[codeUpper];

      if (detail) {
        return detail;
      }

      throw new Error(`No se encontró información para el código de seguimiento: ${trackingCode}`);
    }
  },

  getTrackingEvents: async (trackingCode: string): Promise<TrackingEventDTO[]> => {
    try {
      return await fetchFromAPI<TrackingEventDTO[]>(`/api/v1/tracking/${trackingCode}/events`);
    } catch (error) {
      console.warn(`Backend REST Events API offline. Checking mock events for ${trackingCode}.`, error);
      
      const detail = await trackingService.getTrackingDetail(trackingCode);
      return detail.history || [];
    }
  },
};
