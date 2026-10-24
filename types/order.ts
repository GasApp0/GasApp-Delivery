export type CylinderSize = 'Small' | 'Medium' | 'Large';

export type DeliveryStage = 'arrived' | 'filling' | 'completed';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  cylinderSize: CylinderSize;
  cylinderCount: number;
  amount: number;
  tip?: number;
  fillingStationName: string;
  dropoffAddress: string;
  pickupLocation: LatLng;
  dropoffLocation: LatLng;
  etaMinutes?: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  area: string;
  size: CylinderSize;
  amount: number;
  status: 'completed' | 'cancelled';
  time: string;
}

export interface RiderStats {
  todayDeliveries: number;
  totalEarned: number;
  rating: number;
}

export type QueueOrderStatus = 'queued' | 'up_next' | 'filled' | 'delivered';

export interface QueueOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  area: string;
  cylinderSize: CylinderSize;
  amount: number;
  tip?: number;
  dropoffLocation: LatLng;
  status: QueueOrderStatus;
}
