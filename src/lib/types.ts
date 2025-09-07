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
  volunteerId?: string;
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

export type VolunteerProfile = {
  id: string;
  name: string;
  contact: string;
  emergencyContacts: string[];
  qualifications?: string;
  language: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
};

export type AvailabilitySlot = {
  day: 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  time: 'Morning' | 'Afternoon' | 'Evening';
};
