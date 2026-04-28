/**
 * PatientModal – create / edit patient form.
 * Uses a controlled form hook pattern and shared constants for blood types / statuses.
 */
import React, { useState, useEffect, useCallback, memo } from 'react';
import { X, User, HeartPulse, Image as ImageIcon, Eye } from 'lucide-react';
import type { Patient } from '../../shared/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOOD_TYPES, PATIENT_STATUSES } from '../../shared/config/constants';
import { generateId } from '../../shared/lib/utils';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  patient?: Patient | null;
}

const defaultForm = (): Partial<Patient> => ({
  name: '',
  age: 0,
  gender: 'Male',
  bloodType: 'O+',
  status: 'Stable',
  diagnosis: '',
  image: '',
  lastVisit: new Date().toISOString().split('T')[0],
});

const PatientModal: React.FC<PatientModalProps> = memo(({ isOpen, onClose, onSave, patient }) => {
  const [formData, setFormData] = useState<Partial<Patient>>(defaultForm());
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setFormData(patient ? { ...patient } : defaultForm());
    setShowPreview(!!patient?.image);
  }, [patient, isOpen]);

  const update = useCallback(
    (patch: Partial<Patient>) => setFormData((prev) => ({ ...prev, ...patch })),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ ...formData, id: patient?.id || generateId() } as Patient);
      onClose();
    },
    [formData, patient?.id, onSave, onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-[var(--bg-secondary)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                    {patient ? 'Edit Patient' : 'Register Patient'}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 uppercase tracking-widest">
                    Clinical Records Entry
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="w-10 h-10 flex items-center justify-center bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <FieldWrapper label="Full Name">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => update({ name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className={inputCls}
                      />
                    </div>
                  </FieldWrapper>

                  {/* Diagnosis */}
                  <FieldWrapper label="Diagnosis">
                    <div className="relative">
                      <HeartPulse className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input
                        required
                        type="text"
                        value={formData.diagnosis}
                        onChange={(e) => update({ diagnosis: e.target.value })}
                        placeholder="e.g. Hypertension"
                        className={inputCls}
                      />
                    </div>
                  </FieldWrapper>

                  {/* Age */}
                  <FieldWrapper label="Age">
                    <input
                      required
                      type="number"
                      min={0}
                      max={150}
                      value={formData.age}
                      onChange={(e) => update({ age: parseInt(e.target.value, 10) })}
                      className={`${inputCls} pl-4`}
                    />
                  </FieldWrapper>

                  {/* Blood Type */}
                  <FieldWrapper label="Blood Type">
                    <select
                      value={formData.bloodType}
                      onChange={(e) => update({ bloodType: e.target.value })}
                      className={`${inputCls} pl-4 appearance-none`}
                    >
                      {BLOOD_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </FieldWrapper>

                  {/* Clinical Status */}
                  <FieldWrapper label="Clinical Status">
                    <select
                      value={formData.status}
                      onChange={(e) => update({ status: e.target.value as Patient['status'] })}
                      className={`${inputCls} pl-4 appearance-none`}
                    >
                      {PATIENT_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </FieldWrapper>

                  {/* Profile Image URL */}
                  <FieldWrapper 
                    label="Profile Image URL"
                    action={
                      formData.image && (
                        <button
                          type="button"
                          onClick={() => setShowPreview(!showPreview)}
                          className="text-[9px] font-bold text-sky-500 hover:text-sky-600 uppercase tracking-widest transition-all"
                        >
                          {showPreview ? 'Hide Preview' : 'Preview'}
                        </button>
                      )
                    }
                  >
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => {
                          update({ image: e.target.value });
                          if (e.target.value && !showPreview) setShowPreview(true);
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className={`${inputCls} ${formData.image ? 'pr-11' : ''}`}
                      />
                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => window.open(formData.image, '_blank')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-all p-1"
                          title="Open image in new tab"
                        >
                          <Eye size={14} />
                        </button>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {showPreview && formData.image && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 flex items-center gap-3 p-2 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-[var(--border-color)]">
                              <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center -z-10">
                                <ImageIcon size={16} className="text-slate-300" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-0.5">Live Preview</p>
                              <p className="text-[10px] text-[var(--text-primary)] font-medium truncate">
                                {formData.image}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FieldWrapper>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 h-11 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all border border-[var(--border-color)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 h-11 bg-sky-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-95"
                  >
                    {patient ? 'Update Registry' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

PatientModal.displayName = 'PatientModal';
export default PatientModal;

/* ─── Shared form helpers ─── */
const inputCls =
  'w-full pl-11 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl focus:ring-4 focus:ring-sky-500/5 focus:bg-[var(--bg-secondary)] outline-none transition-all text-xs font-semibold text-[var(--text-primary)]';

const FieldWrapper: React.FC<{ 
  label: string; 
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ label, children, action }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center px-1">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
        {label}
      </label>
      {action}
    </div>
    {children}
  </div>
);
