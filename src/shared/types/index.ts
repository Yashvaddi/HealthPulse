export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  lastVisit: string;
  status: 'Stable' | 'Critical' | 'Recovering';
  diagnosis: string;
  image: string;
}

export interface AnalyticsData {
  month: string;
  patients: number;
  recoveries: number;
}

export type ViewMode = 'grid' | 'list';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'appointment' | 'payment' | 'update' | 'critical';
  read: boolean;
}

export interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markNotificationsAsRead: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
