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
  senderName: string;
  senderPhone?: string;
  receiverName: string;
  receiverPhone?: string;
  originCity: string;
  destinationCity: string;
  destinationAddress?: string;
  weightKg: number;
  status: PackageStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageDTO {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  destinationAddress: string;
  destinationCity: string;
  weightKg: number;
  description?: string;
}

export interface UpdatePackageStatusDTO {
  packageId: string;
  newStatus: PackageStatus;
  notes?: string;
  location?: string;
}
