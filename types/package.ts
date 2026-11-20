export type PackageStatus =
  | "REGISTRADO"
  | "EN_ALMACEN"
  | "EN_TRANSITO"
  | "EN_RUTA"
  | "ENTREGADO"
  | "INCIDENCIA";

export interface PackageItem {
  // The backend persists package IDs as UUIDs.
  id: string;
  trackingCode: string;
  senderName: string | null;
  senderPhone: string | null;
  receiverName: string;
  receiverPhone: string;
  originCity: string;
  destinationCity: string;
  destinationAddress: string;
  weightKg: number;
  status: PackageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageDTO {
  receiverName: string;
  receiverPhone: string;
  destinationAddress: string;
  destinationCity: string;
  weightKg: number;
}

export interface UpdatePackageStatusDTO {
  packageId: string;
  newStatus: PackageStatus;
  notes?: string;
  location?: string;
}
