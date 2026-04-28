import React, { memo } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = memo(({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  const variantStyles = {
    danger: {
      icon: <AlertTriangle size={24} className="text-rose-500" />,
      bg: 'bg-rose-50',
      btn: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20',
    },
    warning: {
      icon: <AlertTriangle size={24} className="text-amber-500" />,
      bg: 'bg-amber-50',
      btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
    },
    info: {
      icon: <AlertTriangle size={24} className="text-sky-500" />,
      bg: 'bg-sky-50',
      btn: 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20',
    }
  };

  const style = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-[var(--bg-secondary)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 shrink-0 rounded-2xl ${style.bg} flex items-center justify-center`}>
                  {style.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 leading-relaxed">
                    {message}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg hover:bg-rose-50 hover:text-rose-500 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 h-10 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all border border-[var(--border-color)]"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-6 h-10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95 ${style.btn}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

ConfirmModal.displayName = 'ConfirmModal';
