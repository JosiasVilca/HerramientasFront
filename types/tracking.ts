export type PackageStatus = 
  | 'PENDING' 
  | 'COLLECTED' 
  | 'IN_TRANSIT' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'FAILED_DELIVERY' 
  | 'RETURNED'
  | 'CANCELLED';

export interface TrackingEvent {
  id: string;
  timestamp: string;
  status: PackageStatus;
  location: string;
  description: string;
}

export interface PackageDTO {
  id: number;
  trackingCode: string;
  status: PackageStatus;
  senderName: string;
  recipientName: string;
  originAddress: string;
  destinationAddress: string;
  weight: number;
  description: string;
  estimatedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
  history: TrackingEvent[];
}

export interface TrackingState {
  packageData: PackageDTO | null;
  loading: boolean;
  error: string | null;
}
