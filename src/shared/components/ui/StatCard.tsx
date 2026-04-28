/**
 * StatCard – reusable metric card used on Dashboard.
 * Memoised to prevent re-renders when sibling cards update.
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;   // e.g. "bg-blue-500"
  shadowClass: string;  // e.g. "shadow-blue-500/20"
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = memo(
  ({ label, value, icon: Icon, colorClass, shadowClass, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${colorClass} p-6 rounded-2xl text-white shadow-xl ${shadowClass} relative overflow-hidden group cursor-pointer`}
    >
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full -z-0 translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-3xl font-bold leading-none">{value}</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-80">
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  )
);

StatCard.displayName = 'StatCard';
