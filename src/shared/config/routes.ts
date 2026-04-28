/**
 * Application route constants.
 * Centralised here so that any refactor only requires changes in one place.
 */
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  ANALYTICS: '/analytics',
  PATIENTS: '/patients',
  PATIENT_VIEW: '/patients/:id',
} as const;

export type RouteKey = keyof typeof ROUTES;
