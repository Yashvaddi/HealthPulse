/**
 * PageHeader – reusable page-level header with title, subtitle and optional actions.
 */
import React, { memo } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = memo(({ title, subtitle, actions }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">{subtitle}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
));

PageHeader.displayName = 'PageHeader';
