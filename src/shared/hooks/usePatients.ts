/**
 * usePatients
 *
 * Feature-level hook that wraps patient CRUD actions with
 * notification side-effects, keeping pages thin.
 */
import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { sendLocalNotification } from '../services/notifications';
import type { Patient } from '../types';
import { generateId } from '../lib/utils';

export const usePatients = () => {
  const {
    patients,
    setPatients,
    addPatient,
    updatePatient,
    deletePatient,
    addNotification,
  } = useStore();

  const notify = useCallback(
    (title: string, message: string, type: 'update' | 'critical' = 'update') => {
      addNotification({ title, message, type });
      sendLocalNotification(title, message);
    },
    [addNotification]
  );

  const savePatient = useCallback(
    (patient: Patient, isEdit: boolean) => {
      const withId: Patient = { ...patient, id: patient.id || generateId() };
      if (isEdit) {
        updatePatient(withId);
        notify('Registry Updated', `${withId.name}'s records have been updated.`);
      } else {
        addPatient(withId);
        notify('Patient Registered', `${withId.name} has been added to the system.`);
      }
      return withId;
    },
    [updatePatient, addPatient, notify]
  );

  const removePatient = useCallback(
    (id: string) => {
      const patient = patients.find((p) => p.id === id);
      deletePatient(id);
      if (patient) {
        notify(
          'Record Deleted',
          `${patient.name}'s clinical record has been removed.`,
          'critical'
        );
      }
    },
    [patients, deletePatient, notify]
  );

  return { patients, setPatients, savePatient, removePatient };
};
