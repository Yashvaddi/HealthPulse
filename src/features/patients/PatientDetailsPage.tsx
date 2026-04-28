/**
 * PatientDetailsPage – patients list feature module.
 *
 * Improvements:
 *  - Uses usePatients hook (CRUD + notifications)
 *  - Uses useToast hook
 *  - Uses Toast, EmptyState, PageHeader shared primitives
 *  - MOCK_PATIENTS imported from shared lib (no duplication)
 *  - PATIENT_FILTER_STATUSES imported from constants
 *  - Wrapped with React.memo
 */
import React, { useState, useMemo, useEffect, memo } from 'react';
import { LayoutGrid, List, Search, UserPlus } from 'lucide-react';
import { useStore } from '../../shared/store/useStore';
import { usePatients } from '../../shared/hooks/usePatients';
import { useToast } from '../../shared/hooks/useToast';
import PatientCard from './PatientCard';
import PatientModal from './PatientModal';
import { Toast } from '../../shared/components/ui/Toast';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { ConfirmModal } from '../../shared/components/ui/ConfirmModal';
import type { Patient } from '../../shared/types';
import { requestNotificationPermission } from '../../shared/services/notifications';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PATIENTS } from '../../shared/lib/mockData';
import { PATIENT_FILTER_STATUSES } from '../../shared/config/constants';
import type { PatientFilterStatus } from '../../shared/config/constants';

const PatientDetailsPage: React.FC = memo(() => {
  const { viewMode, setViewMode } = useStore();
  const { patients, setPatients, savePatient, removePatient } = usePatients();
  const { toast, showToast } = useToast();

  const [searchTerm, setSearchTerm]     = useState('');
  const [filterStatus, setFilterStatus] = useState<PatientFilterStatus>('All');
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientIdToDelete, setPatientIdToDelete] = useState<string | null>(null);

  // Seed mock data once
  useEffect(() => {
    if (patients.length === 0) setPatients(MOCK_PATIENTS);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredPatients = useMemo(
    () =>
      patients.filter((p) => {
        const q = searchTerm.toLowerCase();
        const matchSearch = p.name.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q);
        const matchStatus = filterStatus === 'All' || p.status === filterStatus;
        return matchSearch && matchStatus;
      }),
    [searchTerm, filterStatus, patients]
  );

  const handleSave = (patient: Patient) => {
    const saved = savePatient(patient, !!editingPatient);
    showToast(
      editingPatient
        ? `${saved.name}'s records have been updated.`
        : `${saved.name} has been added to the system.`
    );
    setEditingPatient(null);
  };

  const handleEdit = (p: Patient) => {
    setEditingPatient(p);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setPatientIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (patientIdToDelete) {
      removePatient(patientIdToDelete);
      showToast('Clinical record has been removed.');
      setPatientIdToDelete(null);
    }
  };

  const openNewModal = async () => {
    await requestNotificationPermission();
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 bg-[var(--bg-primary)] -m-8 p-8 min-h-screen text-[var(--text-primary)]">
      <Toast message={toast.message} visible={toast.visible} />

      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        patient={editingPatient}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Patient Record?"
        message="This action is permanent and cannot be undone. All clinical data associated with this patient will be removed from the registry."
        confirmText="Delete Record"
        variant="danger"
      />

      <PageHeader
        title="My Patients"
        subtitle="Manage and monitor your clinical records"
        actions={
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 px-6 h-11 bg-sky-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-95"
          >
            <UserPlus size={16} />
            Register Patient
          </button>
        }
      />

      {/* Toolbar */}
      <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-xs font-medium focus:ring-4 focus:ring-sky-500/5 focus:bg-[var(--bg-secondary)] transition-all outline-none text-[var(--text-primary)]"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
          {/* View toggle */}
          <div className="flex bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[var(--bg-secondary)] shadow-sm text-sky-500' : 'text-slate-400'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[var(--bg-secondary)] shadow-sm text-sky-500' : 'text-slate-400'}`}
            >
              <List size={18} />
            </button>
          </div>

          <div className="h-6 w-px bg-[var(--border-color)] hidden lg:block" />

          {/* Status filters */}
          <div className="flex items-center gap-2">
            {PATIENT_FILTER_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filterStatus === status
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient list */}
      <div
        className={
          filteredPatients.length > 0
            ? viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
            : ''
        }
      >
        <AnimatePresence mode="popLayout">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <PatientCard
                  patient={patient}
                  viewMode={viewMode}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))
          ) : (
            <EmptyState
              icon={Search}
              title="No patients found"
              description={
                searchTerm
                  ? `No records match "${searchTerm}". Try different keywords.`
                  : 'No patients match the selected filter.'
              }
              action={
                <button
                  onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
                  className="text-sky-500 text-xs font-bold uppercase tracking-widest hover:underline"
                >
                  Clear all filters
                </button>
              }
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

PatientDetailsPage.displayName = 'PatientDetailsPage';
export default PatientDetailsPage;
