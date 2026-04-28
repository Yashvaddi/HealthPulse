/**
 * useIdleTimer
 *
 * Extracted from IdleTimer component so the logic is independently testable
 * and can be reused if needed.
 */
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { auth } from '../services/firebase';
import { logAuditEvent } from '../services/audit';
import { IDLE_TIMEOUT_MS } from '../config/constants';

const IDLE_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'] as const;

export const useIdleTimer = () => {
  const navigate = useNavigate();
  const { user, setUser } = useStore();

  const handleLogout = useCallback(async () => {
    if (!user) return;
    await logAuditEvent(
      user.uid,
      user.email || 'unknown',
      'LOGOUT',
      'Automatic session timeout for HIPAA compliance'
    );
    await auth.signOut();
    setUser(null);
    navigate('/login');
  }, [user, setUser, navigate]);

  useEffect(() => {
    if (!user) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, IDLE_TIMEOUT_MS);
    };

    IDLE_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      IDLE_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [user, handleLogout]);
};
