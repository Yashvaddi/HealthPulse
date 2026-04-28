/**
 * App – root component.
 *
 * Improvements:
 *  - Implements React.lazy + Suspense for code splitting.
 *  - Uses shared ROUTES constants.
 *  - Uses shared LoadingSpinner primitive.
 *  - Optimized auth listener.
 */
import React, { useEffect, Suspense, lazy, memo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './shared/services/firebase';
import { useStore } from './shared/store/useStore';
import { registerServiceWorker, onForegroundMessage } from './shared/services/notifications';
import { LoadingSpinner } from './shared/components/ui/LoadingSpinner';
import { logAuditEvent } from './shared/services/audit';
import { ROUTES } from './shared/config/routes';

/* ─── Lazy loaded pages (Code Splitting) ─── */
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const AnalyticsPage = lazy(() => import('./features/analytics/AnalyticsPage'));
const PatientDetailsPage = lazy(() => import('./features/patients/PatientDetailsPage'));
const PatientViewPage = lazy(() => import('./features/patients/PatientViewPage'));

/* ─── Shared components ─── */
import Layout from './shared/components/Layout';
import IdleTimer from './shared/components/IdleTimer';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useStore();
  if (isLoading) return <LoadingSpinner label="Checking session..." />;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  return <>{children}</>;
};

const AnimatedRoutes: React.FC = () => {
  const { user, isLoading } = useStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner label="Loading page..." />}>
      <Routes>
        <Route 
          path={ROUTES.LOGIN} 
          element={!user ? <LoginPage /> : <Navigate to={ROUTES.DASHBOARD} replace />} 
        />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
          <Route path={ROUTES.PATIENTS} element={<PatientDetailsPage />} />
          <Route path={ROUTES.PATIENT_VIEW} element={<PatientViewPage />} />
        </Route>

        <Route path="*" element={<Navigate to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = memo(() => {
  const { setUser, setIsLoading } = useStore();

  useEffect(() => {
    registerServiceWorker();
    
    const unsubscribeForeground = onForegroundMessage((payload) => {
      console.log('Push notification received:', payload);
    });

    setIsLoading(true);
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        logAuditEvent(userData.uid, userData.email || 'unknown', 'LOGIN', 'Successful user authentication');
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribeForeground?.();
      unsubscribeAuth();
    };
  }, [setUser, setIsLoading]);

  return (
    <BrowserRouter>
      <IdleTimer />
      <AnimatedRoutes />
    </BrowserRouter>
  );
});

App.displayName = 'App';
export default App;
