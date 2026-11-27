import { fetchFromAPI } from "@/lib/api-client";
import { CreatePackageDTO, PackageItem, UpdatePackageStatusDTO } from "@/types/package";

export const packageService = {
  getAll: async (search = "", statusFilter = ""): Promise<PackageItem[]> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (statusFilter && statusFilter !== "ALL") params.append("status", statusFilter);
    const query = params.toString();
    return fetchFromAPI<PackageItem[]>(`/api/v1/packages${query ? `?${query}` : ""}`);
  },

  create: async (dto: CreatePackageDTO): Promise<PackageItem> => {
    return fetchFromAPI<PackageItem>("/api/v1/packages", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  getById: async (id: string): Promise<PackageItem> => {
    return fetchFromAPI<PackageItem>(`/api/v1/packages/${encodeURIComponent(id)}`);
  },

  updateStatus: async (dto: UpdatePackageStatusDTO): Promise<PackageItem> => {
    // El id va en la ruta; el backend rechaza campos desconocidos en el cuerpo.
    return fetchFromAPI<PackageItem>(
      `/api/v1/packages/${encodeURIComponent(dto.packageId)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          newStatus: dto.newStatus,
          location: dto.location,
          notes: dto.notes,
        }),
      },
    );
  },

  getByTrackingCode: async (code: string): Promise<PackageItem> => {
    return fetchFromAPI<PackageItem>(
      `/api/v1/packages/track/${encodeURIComponent(code.trim())}`,
    );
  },
};
