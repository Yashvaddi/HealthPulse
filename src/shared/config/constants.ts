/**
 * Application-wide constants.
 */

/** HIPAA-mandated session idle timeout (15 minutes in ms) */
export const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

/** Maximum notifications kept in store */
export const MAX_NOTIFICATIONS = 20;

/** Default doctor display info */
export const DOCTOR_INFO = {
  name: 'Dr. Henry',
  credentials: 'MBBS - FCPS - FRC(Medicine)',
  avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
};

/** Blood type options for patient form */
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

/** Patient status options */
export const PATIENT_STATUSES = ['Stable', 'Recovering', 'Critical'] as const;
export const PATIENT_FILTER_STATUSES = ['All', ...PATIENT_STATUSES] as const;

export type PatientStatus = typeof PATIENT_STATUSES[number];
export type PatientFilterStatus = typeof PATIENT_FILTER_STATUSES[number];
