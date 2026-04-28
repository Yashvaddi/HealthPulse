/**
 * PatientCard – memoised card rendered in both grid and list view modes.
 * Uses shared Badge primitive instead of inline conditional class strings.
 */
import React, { memo, useCallback } from 'react';
import { HeartPulse, User, Eye, Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Patient, ViewMode } from '../../shared/types';
import { Badge, statusToVariant } from '../../shared/components/ui/Badge';

interface PatientCardProps {
  patient: Patient;
  viewMode: ViewMode;
  onEdit?: (patient: Patient) => void;
  onDelete?: (id: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = memo(({ patient, viewMode, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleView   = useCallback(() => navigate(`/patients/${patient.id}`), [navigate, patient.id]);
  const handleEdit   = useCallback(() => onEdit?.(patient), [onEdit, patient]);
  const handleDelete = useCallback(() => {
    onDelete?.(patient.id);
  }, [onDelete, patient.id]);

  const Avatar = () =>
    patient.image ? (
      <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-slate-300">
        <User size={viewMode === 'list' ? 24 : 32} />
      </div>
    );

  if (viewMode === 'list') {
    return (
      <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] hover:shadow-lg hover:shadow-slate-200/50 transition-all flex items-center justify-between gap-6 group">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] overflow-hidden border border-[var(--border-color)] shrink-0">
            <Avatar />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">{patient.name}</h4>
            <p className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-widest">
              {patient.diagnosis}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 flex-1">
          <div className="text-center">
            <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">Age</p>
            <p className="text-xs font-bold text-[var(--text-primary)]">{patient.age}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">Blood</p>
            <p className="text-xs font-bold text-[var(--text-primary)]">{patient.bloodType}</p>
          </div>
          <Badge label={patient.status} variant={statusToVariant(patient.status)} />
        </div>

        <ActionButtons onView={handleView} onEdit={handleEdit} onDelete={handleDelete} size="sm" />
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] overflow-hidden border border-[var(--border-color)] ring-4 ring-[var(--bg-tertiary)]">
          <Avatar />
        </div>
        <Badge label={patient.status} variant={statusToVariant(patient.status)} />
      </div>

      <div className="mb-6 flex-1">
        <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">{patient.name}</h4>
        <div className="flex items-center gap-2">
          <HeartPulse size={14} className="text-sky-500" />
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
            {patient.diagnosis}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[var(--border-color)] mb-6">
        <div>
          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">Age Profile</p>
          <p className="text-sm font-bold text-[var(--text-primary)]">
            {patient.age} <span className="text-[10px] text-[var(--text-secondary)]">Years</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">Blood Index</p>
          <p className="text-sm font-bold text-[var(--text-primary)]">{patient.bloodType}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-color)]">
        <button
          onClick={handleView}
          className="flex-1 h-10 bg-sky-50 text-sky-600 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-500 hover:text-white transition-all shadow-sm"
        >
          <Eye size={14} />
          View Profile
        </button>
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} size="md" />
      </div>
    </div>
  );
});

PatientCard.displayName = 'PatientCard';
export default PatientCard;

/* ─── Internal sub-component ─── */
interface ActionButtonsProps {
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  size: 'sm' | 'md';
}

const ActionButtons: React.FC<ActionButtonsProps> = memo(({ onView, onEdit, onDelete, size }) => {
  const btn = size === 'sm'
    ? 'p-2 rounded-lg'
    : 'w-10 h-10 flex items-center justify-center rounded-xl';

  return (
    <div className="flex items-center gap-2">
      {onView && (
        <button onClick={onView} className={`${btn} text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-all border border-transparent hover:border-sky-100`}>
          <Eye size={size === 'sm' ? 18 : 16} />
        </button>
      )}
      <button onClick={onEdit} className={`${btn} text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 bg-[var(--bg-tertiary)] transition-all border border-[var(--border-color)] hover:border-emerald-100`}>
        <Edit3 size={size === 'sm' ? 18 : 16} />
      </button>
      <button onClick={onDelete} className={`${btn} text-slate-400 hover:text-rose-500 hover:bg-rose-50 bg-[var(--bg-tertiary)] transition-all border border-[var(--border-color)] hover:border-rose-100`}>
        <Trash2 size={size === 'sm' ? 18 : 16} />
      </button>
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';
