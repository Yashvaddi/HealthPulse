/**
 * IdleTimer – thin wrapper around useIdleTimer hook.
 * Renders nothing; only exists to register the hook inside the Router context.
 */
import { useIdleTimer } from '../hooks/useIdleTimer';

const IdleTimer: React.FC = () => {
  useIdleTimer();
  return null;
};

export default IdleTimer;
