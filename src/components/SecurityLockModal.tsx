import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Smartphone,
  Shield,
  Clock,
  RotateCcw
} from 'lucide-react';
import { SecurityLockConfig, AppLanguage } from '../types';
import { SECURITY_QUESTIONS, DEFAULT_SECURITY_LOCK } from '../data/defaults';
import { triggerHapticSound } from '../utils/khataCalculations';

interface SecurityLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  securityConfig: SecurityLockConfig;
  onSaveSecurityConfig: (config: SecurityLockConfig) => void;
  onInstantLock: () => void;
  language?: AppLanguage;
}

export const SecurityLockModal: React.FC<SecurityLockModalProps> = ({
  isOpen,
  onClose,
  securityConfig,
  onSaveSecurityConfig,
  onInstantLock,
  language = 'en'
}) => {
  const isHindi = language === 'hi';

  const [isEnabled, setIsEnabled] = useState<boolean>(securityConfig.isEnabled || false);
  const [pin, setPin] = useState<string>(securityConfig.pin || '');
  const [confirmPin, setConfirmPin] = useState<string>(securityConfig.pin || '');
  const [currentPinCheck, setCurrentPinCheck] = useState<string>('');
  const [selectedQuestion, setSelectedQuestion] = useState<string>(
    securityConfig.securityQuestion || SECURITY_QUESTIONS[0].label
  );
  const [customQuestionInput, setCustomQuestionInput] = useState<string>('');
  const [securityAnswer, setSecurityAnswer] = useState<string>(securityConfig.securityAnswer || '');
  const [recoveryHint, setRecoveryHint] = useState<string>(securityConfig.recoveryHint || '');
  const [autoLockOnLeave, setAutoLockOnLeave] = useState<boolean>(
    typeof securityConfig.autoLockOnLeave === 'boolean' ? securityConfig.autoLockOnLeave : true
  );
  const [autoLockTimeoutMinutes, setAutoLockTimeoutMinutes] = useState<number>(
    securityConfig.autoLockTimeoutMinutes || 0
  );

  const [showPin, setShowPin] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const isExistingPinSet = !!securityConfig.pin && securityConfig.isEnabled;

  const handleSave = () => {
    setError('');
    setSuccessMessage('');

    if (isEnabled) {
      // Validate PIN
      if (!pin || pin.length < 4) {
        setError(isHindi ? 'पिन कम से कम 4 अंकों का होना चाहिए।' : 'PIN must be at least 4 digits.');
        triggerHapticSound('error');
        return;
      }

      if (pin !== confirmPin) {
        setError(isHindi ? 'दोनों पिन मेल नहीं खा रहे हैं।' : 'Confirmation PIN does not match.');
        triggerHapticSound('error');
        return;
      }

      // If user had existing PIN and changed it, verify current PIN if required
      if (isExistingPinSet && pin !== securityConfig.pin && currentPinCheck !== securityConfig.pin) {
        setError(isHindi ? 'कृपया पुष्टि हेतु पुराना पिन सही दर्ज करें।' : 'Please enter your correct current PIN to change.');
        triggerHapticSound('error');
        return;
      }

      // Validate Security Question & Answer
      const finalQuestion = selectedQuestion === 'custom' ? customQuestionInput.trim() : selectedQuestion;
      if (!finalQuestion) {
        setError(isHindi ? 'कृपया एक सुरक्षा प्रश्न चुनें।' : 'Please select or enter a security question.');
        triggerHapticSound('error');
        return;
      }

      if (!securityAnswer || securityAnswer.trim().length < 2) {
        setError(
          isHindi
            ? 'पासवर्ड भूलने पर रिकवरी हेतु सुरक्षा उत्तर (कम से कम 2 अक्षर) अनिवार्य है।'
            : 'Security answer is required for password recovery (min 2 chars).'
        );
        triggerHapticSound('error');
        return;
      }

      const updated: SecurityLockConfig = {
        isEnabled: true,
        pin: pin.trim(),
        securityQuestion: finalQuestion,
        securityAnswer: securityAnswer.trim().toLowerCase(),
        recoveryHint: recoveryHint.trim(),
        autoLockOnLeave,
        autoLockTimeoutMinutes,
        createdAt: securityConfig.createdAt || Date.now(),
        lastUnlockedAt: Date.now()
      };

      onSaveSecurityConfig(updated);
      triggerHapticSound('save');
      setSuccessMessage(isHindi ? 'ऐप लॉक सुरक्षा सफलतापूर्वक सक्रिय हो गई!' : 'App Lock enabled successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      // Disable Lock
      const disabled: SecurityLockConfig = {
        ...securityConfig,
        isEnabled: false
      };
      onSaveSecurityConfig(disabled);
      triggerHapticSound('click');
      setSuccessMessage(isHindi ? 'ऐप लॉक निष्क्रिय कर दिया गया।' : 'App Lock has been disabled.');
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in text-left">
      <div className="w-full max-w-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--theme-border,#213E61)] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[16px] sm:text-[18px] font-bold text-[#F8FAFC]">
                {isHindi ? 'ऐप सुरक्षा एवं पिन लॉक' : 'Security & App Passcode Lock'}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                {isHindi ? '100% स्थानीय ब्राउज़र में सुरक्षित • कोई क्लाउड लीक नहीं' : '100% On-Device Protection • Zero Cloud Leak'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Enable/Disable Toggle */}
        <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-[13px] font-bold text-[#F8FAFC] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>{isHindi ? 'ऐप लॉक सक्रिय करें' : 'Enable App Passcode Lock'}</span>
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              {isHindi
                ? 'ऐप खोलते समय या टैब बदलने पर पिन की आवश्यकता होगी।'
                : 'Require 4-digit PIN when opening app or switching browser tabs.'}
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => {
                setIsEnabled(e.target.checked);
                triggerHapticSound('click');
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--theme-border,#213E61)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--theme-primary,#38BDF8)]" />
          </label>
        </div>

        {/* Form Details (Visible when enabled) */}
        {isEnabled && (
          <div className="space-y-4 animate-in fade-in">
            {/* If existing PIN set and changing */}
            {isExistingPinSet && (
              <div className="space-y-1.5 p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
                <label className="text-[11.5px] font-bold text-[#CBD5E1]">
                  {isHindi ? 'वर्तमान पिन दर्ज करें (Current PIN):' : 'Enter Current PIN to modify:'}
                </label>
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={8}
                  value={currentPinCheck}
                  onChange={(e) => setCurrentPinCheck(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[15px] font-mono rounded-xl px-3 py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                />
              </div>
            )}

            {/* PIN Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11.5px] font-bold text-[#CBD5E1]">
                  <span>{isHindi ? '4-अंकीय नया पिन (PIN):' : 'Set 4-Digit PIN:'}</span>
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] flex items-center gap-1 cursor-pointer font-normal text-[10.5px]"
                  >
                    {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPin ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={8}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="1234"
                  className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[18px] font-mono font-bold tracking-widest text-center rounded-xl py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold text-[#CBD5E1] block">
                  {isHindi ? 'पिन पुनः दर्ज करें (Confirm PIN):' : 'Confirm PIN:'}
                </label>
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={8}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="1234"
                  className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[18px] font-mono font-bold tracking-widest text-center rounded-xl py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none shadow-inner"
                />
              </div>
            </div>

            {/* Recovery Section */}
            <div className="p-4 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-3">
              <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)]">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span className="text-[12.5px] font-bold">
                  {isHindi ? 'पासवर्ड भूलने पर रिकवरी सवाल (Recovery Question)' : 'Password Recovery Security Question'}
                </span>
              </div>
              <p className="text-[10.5px] text-[#94A3B8]">
                {isHindi
                  ? 'यदि आप कभी अपना पिन भूल जाते हैं, तो इस प्रश्न का उत्तर देकर आप अपना नया पिन तुरंत बना सकेंगे।'
                  : 'If you ever forget your PIN, answering this question allows you to instantly recover and reset it.'}
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#CBD5E1]">
                  {isHindi ? 'सुरक्षा प्रश्न चुनें:' : 'Select Security Question:'}
                </label>
                <select
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                  className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[12px] rounded-xl px-3 py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none cursor-pointer"
                >
                  {SECURITY_QUESTIONS.map((q) => (
                    <option key={q.id} value={q.label}>
                      {isHindi ? q.hindiLabel : q.label}
                    </option>
                  ))}
                  <option value="custom">{isHindi ? 'कस्टम प्रश्न स्वयं लिखें...' : 'Write custom question...'}</option>
                </select>
              </div>

              {selectedQuestion === 'custom' && (
                <input
                  type="text"
                  value={customQuestionInput}
                  onChange={(e) => setCustomQuestionInput(e.target.value)}
                  placeholder={isHindi ? 'अपना गुप्त प्रश्न यहाँ लिखें...' : 'Type your custom secret question...'}
                  className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[12px] rounded-xl px-3 py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                />
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#CBD5E1]">
                  {isHindi ? 'गुप्त उत्तर (Secret Answer):' : 'Secret Answer (Required for Reset):'}
                </label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder={isHindi ? 'उदा: Tommy, Patna, Cricket' : 'e.g., Milo, Chicago, Blue'}
                  className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[12.5px] rounded-xl px-3 py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#CBD5E1]">
                  {isHindi ? 'वैकल्पिक संकेत (Optional Hint):' : 'Optional Password Hint:'}
                </label>
                <input
                  type="text"
                  value={recoveryHint}
                  onChange={(e) => setRecoveryHint(e.target.value)}
                  placeholder={isHindi ? 'उदा: मेरे डॉग का नाम' : 'e.g., Childhood pet name'}
                  className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] text-[12px] rounded-xl px-3 py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                />
              </div>
            </div>

            {/* Auto Lock Behaviors */}
            <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-bold text-[#CBD5E1] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                  <span>{isHindi ? 'टैब बदलते ही तुरंत लॉक करें' : 'Auto-lock when switching browser tabs'}</span>
                </span>
                <input
                  type="checkbox"
                  checked={autoLockOnLeave}
                  onChange={(e) => setAutoLockOnLeave(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--theme-primary,#38BDF8)] bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {error && (
          <div className="p-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-[11.5px] font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-2.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[11.5px] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          {isEnabled && securityConfig.isEnabled && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onInstantLock();
              }}
              className="py-2.5 px-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[12px] font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isHindi ? 'अभी लॉक करें' : 'Lock Now'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] text-[12px] font-bold cursor-pointer hover:bg-[var(--theme-bg,#070E18)]"
          >
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isHindi ? 'सुरक्षा सहेजें' : 'Save Security Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
