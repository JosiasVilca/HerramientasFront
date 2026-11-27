import { fetchFromAPI } from "@/lib/api-client";
import { ApiTrackingDetail, toTrackingDetail } from "@/lib/tracking";
import { TrackingDetailDTO, TrackingEventDTO } from "@/types/tracking";

export const trackingService = {
  /**
   * Consulta pública por código de guía. El backend devuelve el historial del
   * paquete (o el evento REGISTRADO sintetizado si aún no hay eventos).
   */
  getTrackingDetail: async (trackingCode: string): Promise<TrackingDetailDTO> => {
    const code = trackingCode.trim();
    if (!code) {
      throw new Error("El código de seguimiento es obligatorio.");
    }

    const detail = await fetchFromAPI<ApiTrackingDetail>(
      `/api/v1/tracking/${encodeURIComponent(code)}`,
    );
    return toTrackingDetail(detail);
  },

  getTrackingEvents: async (trackingCode: string): Promise<TrackingEventDTO[]> => {
    const detail = await trackingService.getTrackingDetail(trackingCode);
    return detail.history;
  },
};
