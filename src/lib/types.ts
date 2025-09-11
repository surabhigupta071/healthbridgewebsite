export type HealthStatus = 'healthy' | 'monitor' | 'urgent';

export type ScanResult = {
  id: string;
  timestamp: Date;
  status: HealthStatus;
  details: string;
};

export type RideRequest = {
  id: string;
  userId: string;
  userName: string;
  userLocation: string;
  userHealthStatus: HealthStatus;
  destination: string;
  requestTime: Date;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  driverId?: string;
  eta?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  contact: string;
  emergencyContacts: string[];
  healthNotes?: string;
  language: string;
};

export type Driver = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  vehicle: string;
  phone: string;
};
