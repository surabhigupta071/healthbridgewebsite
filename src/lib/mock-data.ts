import type { ScanResult, RideRequest, UserProfile, VolunteerProfile, AvailabilitySlot } from '@/lib/types';

export const mockScanHistory: ScanResult[] = [
  { id: 'scan1', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'healthy', details: 'All vitals appear normal. Continue regular monitoring.' },
  { id: 'scan2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), status: 'monitor', details: 'Slightly elevated heart rate detected. Please monitor and re-scan in 12 hours.' },
];

export const mockRideRequests: RideRequest[] = [
  { 
    id: 'ride1', 
    userId: 'user2', 
    userName: 'Jane Doe', 
    userLocation: '123 Main St, Anytown, USA',
    userHealthStatus: 'urgent',
    destination: 'Anytown General Hospital',
    requestTime: new Date(Date.now() - 1000 * 60 * 5),
    status: 'pending',
  },
  { 
    id: 'ride2', 
    userId: 'user3', 
    userName: 'Peter Jones', 
    userLocation: '456 Oak Ave, Anytown, USA',
    userHealthStatus: 'urgent',
    destination: 'Anytown General Hospital',
    requestTime: new Date(Date.now() - 1000 * 60 * 12),
    status: 'pending',
  },
];

export const mockUserProfile: UserProfile = {
  id: 'user1',
  name: 'John Smith',
  contact: '555-0101',
  emergencyContacts: ['Jane Smith (555-0102)'],
  healthNotes: 'Allergic to penicillin.',
  language: 'en',
};

export const mockVolunteerProfile: VolunteerProfile = {
  id: 'volunteer1',
  name: 'Sarah Chen',
  contact: '555-0201',
  emergencyContacts: ['Mark Chen (555-0202)'],
  qualifications: 'First Aid Certified',
  language: 'en',
  notificationPreferences: {
    email: true,
    sms: false,
    push: true,
  }
};

export const mockAvailability: AvailabilitySlot[] = [
  { day: 'Mon', time: 'Morning' },
  { day: 'Wed', time: 'Afternoon' },
  { day: 'Fri', time: 'Evening' },
];
