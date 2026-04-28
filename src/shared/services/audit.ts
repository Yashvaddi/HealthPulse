import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type AuditEventType = 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'PATIENT_VIEW' 
  | 'PATIENT_CREATE' 
  | 'PATIENT_EDIT' 
  | 'PATIENT_DELETE' 
  | 'DATA_EXPORT';

export const logAuditEvent = async (
  userId: string, 
  userEmail: string, 
  eventType: AuditEventType, 
  details: string,
  patientId?: string
) => {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      userId,
      userEmail,
      eventType,
      details,
      patientId,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      ipAddress: 'tracked-by-server' // In a real app, this would be set by a Cloud Function
    });
    console.log(`[Audit Log] ${eventType} recorded for user ${userEmail}`);
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
};
