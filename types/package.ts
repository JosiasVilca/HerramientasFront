export type PackageStatus =
  | "REGISTRADO"
  | "EN_ALMACEN"
  | "EN_TRANSITO"
  | "EN_RUTA"
  | "ENTREGADO"
  | "INCIDENCIA";

export interface PackageItem {
  id: number;
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
  packageId: number;
  newStatus: PackageStatus;
  notes?: string;
  location?: string;
}
