/**
 * Toast – animated in-app notification bar.
 * Used by PatientDetailsPage and any other page needing transient feedback.
 */
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = memo(({ message, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed top-6 right-6 z-[110] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-xl"
      >
        <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
          <CheckCircle2 className="text-white" size={18} />
        </div>
        <span className="text-xs font-bold tracking-tight">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
));

Toast.displayName = 'Toast';
