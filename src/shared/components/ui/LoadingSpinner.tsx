/**
 * LoadingSpinner – full-screen loading indicator.
 * Extracted from App.tsx so it can be reused for lazy-loaded routes too.
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(
  ({ label = 'Initialising HealthPulse...' }) => (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 50%, #f3e8ff 100%)',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: '4px solid #e2e8f0',
          borderTopColor: '#3b82f6',
        }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          marginTop: 20,
          color: '#64748b',
          fontWeight: 700,
          letterSpacing: '0.1em',
          fontSize: 12,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </motion.p>
    </div>
  )
);

LoadingSpinner.displayName = 'LoadingSpinner';
