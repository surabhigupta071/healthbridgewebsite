import type { ScanResult, UserProfile, Driver } from '@/lib/types';

export const mockScanHistory: ScanResult[] = [
  { id: 'scan1', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'healthy', details: 'All vitals appear normal. Continue regular monitoring.' },
  { id: 'scan2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), status: 'monitor', details: 'Slightly elevated heart rate detected. Please monitor and re-scan in 12 hours.' },
];

export const mockUserProfile: UserProfile = {
  id: 'user1',
  name: 'John Smith',
  contact: '555-0101',
  emergencyContacts: ['Jane Smith (555-0102)'],
  healthNotes: 'Allergic to penicillin.',
  language: 'en',
};

export const mockDrivers: Driver[] = [
  {
    id: 'driver1',
    name: 'Maria Garcia',
    location: { lat: 34.0522, lng: -118.2437 }, // Downtown LA
    vehicle: 'Toyota Prius - ABC 123',
    phone: '555-0301',
  },
  {
    id: 'driver2',
    name: 'Chen Wei',
    location: { lat: 34.0622, lng: -118.2537 }, // Near Downtown LA
    vehicle: 'Honda Civic - DEF 456',
    phone: '555-0302',
  },
  {
    id: 'driver3',
    name: 'Fatima Al-Jamil',
    location: { lat: 34.0422, lng: -118.2337 }, // Also near Downtown LA
    vehicle: 'Ford Escape - GHI 789',
    phone: '555-0303',
  },
];
