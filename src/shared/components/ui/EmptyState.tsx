/**
 * EmptyState – shown when a list/search has no results.
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = memo(
  ({ icon: Icon, title, description, action }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-color)]"
    >
      <div className="w-20 h-20 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mb-6 text-slate-300">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{title}</h3>
      {description && (
        <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
);

EmptyState.displayName = 'EmptyState';
