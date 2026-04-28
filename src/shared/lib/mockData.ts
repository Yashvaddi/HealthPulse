import type { Patient } from '../types';

/**
 * Seed/mock patient data – lives in a single place so every feature module
 * can import from here rather than duplicating the array.
 */
export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    bloodType: 'O+',
    lastVisit: '2024-05-20',
    status: 'Stable',
    diagnosis: 'Hypertension',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    age: 32,
    gender: 'Female',
    bloodType: 'A-',
    lastVisit: '2024-05-22',
    status: 'Recovering',
    diagnosis: 'Post-Surgery Recovery',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    name: 'Robert Fox',
    age: 68,
    gender: 'Male',
    bloodType: 'B+',
    lastVisit: '2024-05-21',
    status: 'Critical',
    diagnosis: 'Acute Cardiac Arrest',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  },
];
