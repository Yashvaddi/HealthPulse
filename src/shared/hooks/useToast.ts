/**
 * useNotification
 *
 * Provides a simple toast-like notification that auto-dismisses.
 * Keeps transient UI state out of the global store.
 */
import { useState, useCallback } from 'react';

interface ToastState {
  message: string;
  visible: boolean;
}

const TOAST_DURATION_MS = 2000;

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), TOAST_DURATION_MS);
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, hideToast };
};
