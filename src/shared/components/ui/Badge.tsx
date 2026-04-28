/**
 * Badge – small coloured status indicator.
 * Covers the repeated status-badge pattern across PatientCard, PatientViewPage, etc.
 */
import React, { memo } from 'react';

type Variant = 'stable' | 'critical' | 'recovering' | 'info' | 'warning';

const VARIANT_CLASSES: Record<Variant, string> = {
  stable: 'bg-emerald-50 text-emerald-600',
  critical: 'bg-rose-50 text-rose-600',
  recovering: 'bg-sky-50 text-sky-600',
  info: 'bg-blue-50 text-blue-600',
  warning: 'bg-amber-50 text-amber-600',
};

interface BadgeProps {
  label: string;
  variant: Variant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = memo(({ label, variant, className = '' }) => (
  <span
    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${VARIANT_CLASSES[variant]} ${className}`}
  >
    {label}
  </span>
));

Badge.displayName = 'Badge';

/** Helper to map patient status string → Badge variant */
export const statusToVariant = (status: string): Variant => {
  switch (status) {
    case 'Stable':     return 'stable';
    case 'Critical':   return 'critical';
    case 'Recovering': return 'recovering';
    default:           return 'info';
  }
};
