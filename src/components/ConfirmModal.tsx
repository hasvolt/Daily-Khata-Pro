import React from 'react';
import { AlertTriangle, Trash2, Check } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  description?: string;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary' | string;
  isDanger?: boolean;
  type?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  description,
  confirmLabel,
  confirmText,
  cancelLabel,
  cancelText,
  confirmVariant = 'danger',
  isDanger,
  type,
  onConfirm,
  onCancel,
  onClose
}) => {
  if (!isOpen) return null;

  const displayMessage = message || description || '';
  const displayConfirmLabel = confirmLabel || confirmText || 'Confirm Action';
  const displayCancelLabel = cancelLabel || cancelText || 'Cancel';
  const handleCancel = onCancel || onClose || (() => {});
  const isDangerMode = isDanger || type === 'danger' || confirmVariant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 no-print">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-left">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isDangerMode
                ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                : 'border'
            }`}
            style={{
              backgroundColor: !isDangerMode ? 'var(--theme-primary-dim, rgba(56,189,248,0.15))' : undefined,
              color: !isDangerMode ? 'var(--theme-primary, #38BDF8)' : undefined,
              borderColor: !isDangerMode ? 'var(--theme-primary-border, rgba(56,189,248,0.3))' : undefined
            }}
          >
            {isDangerMode ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-serif-display text-[16.5px] font-bold text-[#F8FAFC] leading-snug">
              {title}
            </h3>
            {displayMessage && (
              <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
                {displayMessage}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[var(--theme-border,#213E61)]">
          <button
            type="button"
            onClick={handleCancel}
            className="py-2.5 px-3 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] text-[#94A3B8] hover:text-[#F8FAFC] text-[13px] font-bold cursor-pointer transition-colors"
          >
            {displayCancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2.5 px-3 rounded-xl text-[13px] font-bold cursor-pointer transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: isDangerMode ? '#EF4444' : 'var(--theme-btn-bg, #38BDF8)',
              color: isDangerMode ? '#F8FAFC' : 'var(--theme-btn-text, #040D17)'
            }}
          >
            {displayConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
