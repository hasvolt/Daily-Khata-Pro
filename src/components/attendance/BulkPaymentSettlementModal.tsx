import React, { useState, useMemo } from 'react';
import { AttendanceLog, PaymentMode, FundType, AppLanguage } from '../../types';
import { formatCurrency, triggerHapticSound } from '../../utils/khataCalculations';
import { 
  X, 
  CheckCircle2, 
  Coins, 
  Calendar, 
  Building, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { EmployerSummary, getWorkCategoryMeta } from './attendanceTypes';

interface BulkPaymentSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceLogs: AttendanceLog[];
  initialEmployer?: string;
  employerSummaries: EmployerSummary[];
  onBatchUpdateAttendanceLogs?: (updatedLogs: AttendanceLog[], toastMessage?: string) => void;
  onRecordBulkAttendancePaymentToKhata?: (data: {
    amount: number;
    date: string;
    employerName?: string;
    workType?: string;
    note?: string;
    fund?: FundType;
    paymentMode?: PaymentMode;
  }) => void;
  isHindi?: boolean;
  privacyMask?: boolean;
}

export const BulkPaymentSettlementModal: React.FC<BulkPaymentSettlementModalProps> = ({
  isOpen,
  onClose,
  attendanceLogs,
  initialEmployer = 'all',
  employerSummaries,
  onBatchUpdateAttendanceLogs,
  onRecordBulkAttendancePaymentToKhata,
  isHindi = false,
  privacyMask = false
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedEmployer, setSelectedEmployer] = useState<string>(initialEmployer);

  // Eligible pending logs for selected employer
  const pendingLogs = useMemo(() => {
    return attendanceLogs
      .filter((l) => {
        if (selectedEmployer !== 'all' && l.employerName !== selectedEmployer) return false;
        const rate = l.salaryOrRate || 0;
        const rec = l.paymentReceived || 0;
        const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec);
        return pend > 0 && l.paymentStatus !== 'paid';
      })
      .sort((a, b) => a.date.localeCompare(b.date)); // Oldest first
  }, [attendanceLogs, selectedEmployer]);

  const totalPendingAmount = useMemo(() => {
    return pendingLogs.reduce((sum, l) => {
      const rate = l.salaryOrRate || 0;
      const rec = l.paymentReceived || 0;
      const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec);
      return sum + pend;
    }, 0);
  }, [pendingLogs]);

  // Form State
  const [amount, setAmount] = useState<string>(() => totalPendingAmount > 0 ? String(totalPendingAmount) : '');
  const [paymentDate, setPaymentDate] = useState<string>(todayStr);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [note, setNote] = useState<string>('');
  const [recordToKhata, setRecordToKhata] = useState<boolean>(true);
  const [targetFund, setTargetFund] = useState<FundType>('personal');

  // Update amount if employer selection changes
  const handleEmployerChange = (emp: string) => {
    setSelectedEmployer(emp);
    const logs = attendanceLogs.filter((l) => {
      if (emp !== 'all' && l.employerName !== emp) return false;
      const rate = l.salaryOrRate || 0;
      const rec = l.paymentReceived || 0;
      const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec);
      return pend > 0 && l.paymentStatus !== 'paid';
    });
    const total = logs.reduce((sum, l) => {
      const rate = l.salaryOrRate || 0;
      const rec = l.paymentReceived || 0;
      const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec);
      return sum + pend;
    }, 0);
    setAmount(total > 0 ? String(total) : '');
    triggerHapticSound('click');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(amount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    let remaining = amountVal;
    const updated = [...attendanceLogs];
    let daysSettled = 0;

    // Distribute from oldest to newest
    pendingLogs.forEach((target) => {
      if (remaining <= 0) return;
      const rate = target.salaryOrRate || 0;
      const currentRec = target.paymentReceived || 0;
      const currentPend = target.pendingPayment !== undefined ? target.pendingPayment : Math.max(0, rate - currentRec);

      if (currentPend <= 0) return;

      const idx = updated.findIndex((x) => x.id === target.id);
      if (idx === -1) return;

      daysSettled++;

      if (remaining >= currentPend) {
        remaining -= currentPend;
        updated[idx] = {
          ...updated[idx],
          paymentReceived: currentRec + currentPend,
          pendingPayment: 0,
          paymentStatus: 'paid',
          paymentDate: paymentDate,
          paymentNotes: note ? `${note} (बल्क निपटान)` : 'Bulk settlement',
          updatedAt: Date.now()
        };
      } else {
        const alloc = remaining;
        remaining = 0;
        updated[idx] = {
          ...updated[idx],
          paymentReceived: currentRec + alloc,
          pendingPayment: currentPend - alloc,
          paymentStatus: 'partial',
          paymentDate: paymentDate,
          paymentNotes: note ? `${note} (आंशिक बल्क निपटान)` : 'Partial bulk settlement',
          updatedAt: Date.now()
        };
      }
    });

    // Save batch
    if (onBatchUpdateAttendanceLogs) {
      const successMsg = isHindi
        ? `₹${amountVal.toLocaleString('en-IN')} का भुगतान ${daysSettled} दिनों के रिकॉर्ड में सफलतापूर्वक दर्ज हुआ!`
        : `₹${amountVal.toLocaleString('en-IN')} payment settled across ${daysSettled} work days!`;
      onBatchUpdateAttendanceLogs(updated, successMsg);
    }

    // Add to Khata Income
    if (recordToKhata && onRecordBulkAttendancePaymentToKhata) {
      const empLabel = selectedEmployer !== 'all' ? selectedEmployer : (isHindi ? 'विभिन्न नियोक्ता' : 'Multiple Employers');
      onRecordBulkAttendancePaymentToKhata({
        amount: amountVal,
        date: paymentDate,
        employerName: selectedEmployer !== 'all' ? selectedEmployer : undefined,
        workType: isHindi ? 'हाजिरी वेतन निपटान' : 'Attendance Wage Settlement',
        note: note || (isHindi ? `${daysSettled} दिनों का वेतन निपटान (${empLabel})` : `${daysSettled} days wage settlement (${empLabel})`),
        fund: targetFund,
        paymentMode: paymentMode
      });
    }

    triggerHapticSound('save');
    onClose();
  };

  const employersWithDues = employerSummaries.filter((e) => e.totalPending > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[16px] sm:text-[17px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'बल्क भुगतान निपटान (Clear Dues)' : 'Settle Attendance Dues'}
              </h3>
              <p className="text-[11px] text-[var(--theme-text-muted,#94A3B8)]">
                {isHindi ? '10-20 दिन, मासिक वेतन या प्रोजेक्ट का भुगतान एक बार में दर्ज करें' : 'Record lump sum or monthly wage payments across work days'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--theme-text-dim,#94A3B8)] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          
          {/* Step 1: Select Employer / Company */}
          <div>
            <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
              {isHindi ? 'नियोक्ता / कंपनी / काम का चयन करें' : 'Select Employer / Client'}
            </label>
            <select
              value={selectedEmployer}
              onChange={(e) => handleEmployerChange(e.target.value)}
              className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-3 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)] font-semibold"
            >
              <option value="all">
                {isHindi ? `सभी नियोक्ता (कुल ₹${totalPendingAmount.toLocaleString('en-IN')} बाकी)` : `All Employers (Total ${totalPendingAmount.toLocaleString('en-IN')} Pending)`}
              </option>
              {employersWithDues.map((emp) => (
                <option key={emp.name} value={emp.name}>
                  {emp.name} — {isHindi ? `₹${emp.totalPending.toLocaleString('en-IN')} बाकी (${emp.pendingLogsCount} दिन)` : `₹${emp.totalPending.toLocaleString('en-IN')} pending (${emp.pendingLogsCount} days)`}
                </option>
              ))}
              {employersWithDues.length === 0 && (
                <option value="none" disabled>
                  {isHindi ? 'कोई बकाया भुगतान नहीं है' : 'No pending dues found'}
                </option>
              )}
            </select>
          </div>

          {/* Pending Balance Banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                {isHindi ? 'कुल बकाया राशि (Total Pending)' : 'Total Pending Balance'}
              </div>
              <div className="text-[20px] sm:text-[22px] font-mono font-extrabold text-amber-400 mt-0.5">
                {formatCurrency(totalPendingAmount, privacyMask)}
              </div>
              <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">
                {isHindi ? `${pendingLogs.length} कार्य दिवसों का भुगतान बाकी है` : `${pendingLogs.length} pending work days logged`}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAmount(String(totalPendingAmount));
                  triggerHapticSound('click');
                }}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-xs transition-colors"
              >
                {isHindi ? 'पूरा चुकता करें' : 'Settle Full'}
              </button>
              {totalPendingAmount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setAmount(String(Math.round(totalPendingAmount / 2)));
                    triggerHapticSound('click');
                  }}
                  className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-lg bg-[var(--theme-card,#132438)] text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 cursor-pointer transition-colors"
                >
                  {isHindi ? '50% (आधा)' : '50% Partial'}
                </button>
              )}
            </div>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                {isHindi ? 'प्राप्त हुई राशि (Amount Received ₹)' : 'Amount Received (₹)'} *
              </label>
              <input
                type="number"
                step="any"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] font-mono font-bold text-[14px] px-3 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                {isHindi ? 'भुगतान दिनांक (Payment Date)' : 'Payment Date'} *
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-3 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)]"
              />
            </div>
          </div>

          {/* Payment Mode & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                {isHindi ? 'भुगतान माध्यम (Mode)' : 'Payment Mode'}
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-3 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden font-semibold"
              >
                <option value="cash">{isHindi ? '💵 नकद (Cash)' : 'Cash'}</option>
                <option value="upi">{isHindi ? '📱 UPI (GPay / PhonePe / Paytm)' : 'UPI'}</option>
                <option value="bank">{isHindi ? '🏦 बैंक ट्रांसफर (NEFT / IMPS)' : 'Bank Transfer'}</option>
                <option value="cheque">{isHindi ? '📑 चेक (Cheque)' : 'Cheque'}</option>
                <option value="other">{isHindi ? 'अन्य' : 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[var(--theme-text-muted,#94A3B8)] mb-1">
                {isHindi ? 'संदर्भ / नोट (Reference / Note)' : 'Note / Reference'}
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={isHindi ? 'उदा. 15 दिन की मजदूरी, अगस्त का वेतन...' : 'e.g. 15 days wage, August salary...'}
                className="w-full bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text,#F8FAFC)] text-[13px] px-3 py-2.5 rounded-xl border border-[var(--theme-border,#213E61)] focus:outline-hidden focus:border-[var(--theme-primary,#38BDF8)]"
              />
            </div>
          </div>

          {/* Khata Income Auto-Record Toggle */}
          <div className="p-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)]/80 border border-[var(--theme-border,#213E61)] space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={recordToKhata}
                onChange={(e) => setRecordToKhata(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 border-[var(--theme-border,#213E61)] focus:ring-0 cursor-pointer accent-emerald-500"
              />
              <span className="text-[12.5px] font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'डेली खाता में आय (Income) के रूप में भी दर्ज करें' : 'Record this as Income in Daily Khata'}
              </span>
            </label>

            {recordToKhata && (
              <div className="pl-6 pt-1 flex items-center gap-3">
                <span className="text-[11.5px] text-[var(--theme-text-muted,#94A3B8)] font-semibold">
                  {isHindi ? 'फंड चुनें:' : 'Credit into Fund:'}
                </span>
                <select
                  value={targetFund}
                  onChange={(e) => setTargetFund(e.target.value as FundType)}
                  className="bg-[var(--theme-card,#132438)] text-[var(--theme-text,#F8FAFC)] text-[12px] px-2.5 py-1.5 rounded-lg border border-[var(--theme-border,#213E61)] font-semibold outline-hidden"
                >
                  <option value="personal">{isHindi ? 'पर्सनल / मुख्य खाता' : 'Personal / Main'}</option>
                  <option value="necessities">{isHindi ? 'दैनिक आवश्यकता' : 'Necessities'}</option>
                  <option value="emergency">{isHindi ? 'आपातकालीन फंड' : 'Emergency Fund'}</option>
                  <option value="investment">{isHindi ? 'निवेश व बचत' : 'Investment'}</option>
                  <option value="education">{isHindi ? 'शिक्षा व कौशल' : 'Education'}</option>
                </select>
              </div>
            )}
          </div>

          {/* Preview of Days that will be cleared */}
          {pendingLogs.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11.5px] font-bold text-[var(--theme-text-muted,#94A3B8)] flex items-center justify-between">
                <span>{isHindi ? 'निपटाए जाने वाले कार्य दिवस (Earliest Unpaid Days):' : 'Pending Work Days (Clearing Oldest First):'}</span>
                <span className="text-[10.5px] text-[var(--theme-primary,#38BDF8)]">{pendingLogs.length} {isHindi ? 'दिन' : 'days'}</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 border border-[var(--theme-border,#213E61)]/50 rounded-xl p-2 bg-[var(--theme-surface,#0E1A29)]/40 text-[11.5px]">
                {pendingLogs.slice(0, 10).map((l) => {
                  const rate = l.salaryOrRate || 0;
                  const rec = l.paymentReceived || 0;
                  const pend = l.pendingPayment !== undefined ? l.pendingPayment : Math.max(0, rate - rec);
                  return (
                    <div key={l.id} className="flex items-center justify-between py-1 px-2 rounded-lg bg-[var(--theme-card,#132438)]/60 text-[var(--theme-text,#F8FAFC)]">
                      <div className="flex items-center gap-2 min-w-0">
                        <Calendar className="w-3.5 h-3.5 text-[var(--theme-text-dim,#94A3B8)] shrink-0" />
                        <span className="font-mono font-bold truncate">{l.date}</span>
                        {l.employerName && (
                          <span className="text-[10px] text-[var(--theme-text-muted,#94A3B8)] truncate">({l.employerName})</span>
                        )}
                      </div>
                      <div className="font-mono font-bold text-amber-400 shrink-0">
                        {formatCurrency(pend, privacyMask)}
                      </div>
                    </div>
                  );
                })}
                {pendingLogs.length > 10 && (
                  <div className="text-center text-[10.5px] text-[var(--theme-text-dim,#94A3B8)] py-1">
                    +{pendingLogs.length - 10} {isHindi ? 'और कार्य दिवस...' : 'more work days...'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--theme-border,#213E61)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-white border border-[var(--theme-border,#213E61)] text-[12.5px] font-bold cursor-pointer"
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0 || pendingLogs.length === 0}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[13px] flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isHindi ? 'बकाया चुकता करें' : 'Settle Payment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
