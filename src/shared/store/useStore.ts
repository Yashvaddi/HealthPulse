import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, User, Patient, ViewMode, Notification } from '../types';
import { generateId } from '../lib/utils';
import { MAX_NOTIFICATIONS } from '../config/constants';

/**
 * Zustand store with persist middleware for user-preference fields.
 *
 * Slice-like organisation:
 *  - authSlice  : user identity + loading flag
 *  - patientSlice: CRUD for patients
 *  - uiSlice    : viewMode, notifications
 */
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      /* ─────────────────── Auth slice ─────────────────── */
      user: null,
      setUser: (user: User | null) => set({ user }),

      isLoading: false,
      setIsLoading: (isLoading: boolean) => set({ isLoading }),

      /* ─────────────────── Patient slice ───────────────── */
      patients: [],
      setPatients: (patients: Patient[]) => set({ patients }),

      addPatient: (patient: Patient) =>
        set((state) => ({ patients: [patient, ...state.patients] })),

      updatePatient: (updatedPatient: Patient) =>
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === updatedPatient.id ? updatedPatient : p
          ),
        })),

      deletePatient: (id: string) =>
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
        })),

      /* ─────────────────── UI slice ────────────────────── */
      viewMode: 'grid',
      setViewMode: (viewMode: ViewMode) => set({ viewMode }),

      notifications: [
        {
          id: '1',
          title: 'Welcome',
          message: 'Welcome to HealthPulse B2B Healthcare SaaS.',
          time: 'Just now',
          type: 'update',
          read: false,
        },
        {
          id: '2',
          title: 'System Ready',
          message: 'All clinical systems are operational.',
          time: '2m ago',
          type: 'update',
          read: false,
        },
      ] as Notification[],

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: generateId(),
              time: 'Just now',
              read: false,
            },
            ...state.notifications,
          ].slice(0, MAX_NOTIFICATIONS),
        })),

      markNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
    }),
    {
      name: 'healthpulse-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist user-preference fields; exclude ephemeral state
      partialize: (state) => ({
        user: state.user,
        viewMode: state.viewMode,
        patients: state.patients,
      }),
    }
  )
);
