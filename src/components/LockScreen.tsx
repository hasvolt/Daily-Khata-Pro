import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  HelpCircle,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { SecurityLockConfig, AppLanguage } from '../types';
import { HasVoltLogo } from './HasVoltLogo';
import { triggerHapticSound } from '../utils/khataCalculations';

interface LockScreenProps {
  securityConfig: SecurityLockConfig;
  onUnlockSuccess: () => void;
  onUpdateSecurityConfig: (config: SecurityLockConfig) => void;
  onResetAllData?: () => void;
  language?: AppLanguage;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  securityConfig,
  onUnlockSuccess,
  onUpdateSecurityConfig,
  onResetAllData,
  language = 'en'
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState<boolean>(false);
  const [recoveryAnswerInput, setRecoveryAnswerInput] = useState<string>('');
  const [recoveryError, setRecoveryError] = useState<string>('');
  const [isResetPinStep, setIsResetPinStep] = useState<boolean>(false);
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState<string>('');
  const [isEmergencyResetConfirmOpen, setIsEmergencyResetConfirmOpen] = useState<boolean>(false);

  const isHindi = language === 'hi';
  const expectedPin = (securityConfig.pin || '').trim();
  const targetPinLength = expectedPin.length > 0 ? expectedPin.length : 4;

  const triggerErrorAnimation = (msg: string) => {
    setErrorMessage(msg);
    setIsShaking(true);
    triggerHapticSound('error');
    setTimeout(() => setIsShaking(false), 500);
    setPinInput('');
  };

  const handleVerifyPin = useCallback(
    (entered: string) => {
      if (entered === expectedPin) {
        triggerHapticSound('save');
        setErrorMessage('');
        onUnlockSuccess();
      } else {
        triggerErrorAnimation(isHindi ? 'ग़लत पिन / पासवर्ड! पुनः प्रयास करें।' : 'Incorrect PIN! Please try again.');
      }
    },
    [expectedPin, isHindi, onUnlockSuccess]
  );

  // Keypad click handler
  const handleDigitPress = (digit: string) => {
    triggerHapticSound('click');
    setErrorMessage('');
    if (pinInput.length < 12) {
      const next = pinInput + digit;
      setPinInput(next);
      // If PIN length reached and matches standard 4-digit PIN
      if (next.length === targetPinLength) {
        setTimeout(() => handleVerifyPin(next), 50);
      }
    }
  };

  const handleBackspace = () => {
    triggerHapticSound('click');
    setErrorMessage('');
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    triggerHapticSound('click');
    setPinInput('');
    setErrorMessage('');
  };

  // Keyboard shortcut listener for fast typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRecoveryOpen) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (pinInput.length > 0) {
          handleVerifyPin(pinInput);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pinInput, isRecoveryOpen, handleVerifyPin]);

  // Handle Security Question Recovery Verification
  const handleVerifyRecovery = () => {
    const cleanUserAnswer = recoveryAnswerInput.trim().toLowerCase();
    const cleanStoredAnswer = (securityConfig.securityAnswer || '').trim().toLowerCase();

    if (!cleanUserAnswer) {
      setRecoveryError(isHindi ? 'कृपया उत्तर दर्ज करें।' : 'Please enter your recovery answer.');
      triggerHapticSound('error');
      return;
    }

    if (cleanUserAnswer === cleanStoredAnswer) {
      triggerHapticSound('save');
      setRecoveryError('');
      setIsResetPinStep(true);
    } else {
      setRecoveryError(isHindi ? 'सुरक्षा उत्तर मेल नहीं खा रहा है!' : 'Security answer does not match!');
      triggerHapticSound('error');
    }
  };

  // Handle setting new PIN after recovery
  const handleSaveNewPin = () => {
    if (newPinInput.length < 4) {
      setRecoveryError(isHindi ? 'पिन कम से कम 4 अंकों का होना चाहिए।' : 'PIN must be at least 4 digits.');
      triggerHapticSound('error');
      return;
    }
    if (newPinInput !== confirmNewPinInput) {
      setRecoveryError(isHindi ? 'दोनों पिन मेल नहीं खा रहे हैं।' : 'PINs do not match.');
      triggerHapticSound('error');
      return;
    }

    const updated: SecurityLockConfig = {
      ...securityConfig,
      pin: newPinInput,
      isEnabled: true,
      lastUnlockedAt: Date.now()
    };

    onUpdateSecurityConfig(updated);
    triggerHapticSound('save');
    setIsRecoveryOpen(false);
    setIsResetPinStep(false);
    onUnlockSuccess();
  };

  // Handle Emergency Factory Reset
  const handleConfirmEmergencyReset = () => {
    if (onResetAllData) {
      onResetAllData();
      triggerHapticSound('delete');
      setIsEmergencyResetConfirmOpen(false);
      setIsRecoveryOpen(false);
      onUnlockSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--theme-bg,#070E18)]/98 backdrop-blur-2xl select-none">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-[var(--theme-primary,#38BDF8)]/10 via-transparent to-transparent pointer-events-none" />

      <div
        className={`w-full max-w-sm bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative transition-transform duration-200 ${
          isShaking ? 'translate-x-2' : ''
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px -10px var(--theme-primary-dim, rgba(56,189,248,0.2))'
        }}
      >
        {/* Header Branding & Security Icon */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-center justify-center shadow-inner relative z-10">
                <HasVoltLogo size={36} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)] flex items-center justify-center shadow-md z-20">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-extrabold text-[#F8FAFC] tracking-tight">
              {isHindi ? 'डेली खाता प्रो सुरक्षित लॉक' : 'Daily Khata Pro Locked'}
            </h2>
            <p className="text-[12px] text-[#94A3B8] flex items-center justify-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{isHindi ? '100% ऑन-डिवाइस सुरक्षित डाटा' : '100% Offline Local Device Protection'}</span>
            </p>
          </div>
        </div>

        {/* PIN Indicators Display */}
        <div className="space-y-2 text-center">
          <div className="text-[12px] font-bold text-[#CBD5E1]">
            {isHindi ? 'अपना सुरक्षा पिन दर्ज करें' : 'Enter Passcode / PIN'}
          </div>

          {/* Dots representation */}
          <div className="flex items-center justify-center gap-3 py-2">
            {Array.from({ length: Math.max(4, targetPinLength) }).map((_, idx) => {
              const isFilled = idx < pinInput.length;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-150 border ${
                    isFilled
                      ? 'bg-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary,#38BDF8)] scale-110 shadow-sm'
                      : 'bg-[var(--theme-bg,#070E18)] border-[var(--theme-border,#213E61)]'
                  }`}
                />
              );
            })}
          </div>

          {/* Show plain text preview toggle if needed */}
          {showPasswordText && pinInput.length > 0 && (
            <div className="text-[14px] font-mono font-bold text-[var(--theme-primary,#38BDF8)]">
              {pinInput}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="text-[11.5px] font-bold text-[#EF4444] animate-in fade-in flex items-center justify-center gap-1 bg-[#EF4444]/10 py-1 px-2.5 rounded-lg border border-[#EF4444]/20">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitPress(digit)}
              className="h-13 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] active:bg-[var(--theme-primary,#38BDF8)]/20 active:scale-95 text-[#F8FAFC] text-[22px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs select-none"
            >
              {digit}
            </button>
          ))}

          {/* Bottom row: Clear, 0, Backspace */}
          <button
            type="button"
            onClick={handleClear}
            className="h-13 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:border-[#EF4444] active:scale-95 text-[#94A3B8] hover:text-[#EF4444] text-[12px] font-bold flex items-center justify-center transition-all cursor-pointer"
            title="Clear"
          >
            C
          </button>

          <button
            type="button"
            onClick={() => handleDigitPress('0')}
            className="h-13 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] active:bg-[var(--theme-primary,#38BDF8)]/20 active:scale-95 text-[#F8FAFC] text-[22px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs select-none"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="h-13 rounded-2xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] active:scale-95 text-[#CBD5E1] text-[16px] font-bold flex items-center justify-center transition-all cursor-pointer"
            title="Backspace"
          >
            ⌫
          </button>
        </div>

        {/* Enter Submit Button (if custom length) */}
        {pinInput.length >= 4 && (
          <button
            type="button"
            onClick={() => handleVerifyPin(pinInput)}
            className="w-full py-3 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-extrabold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 animate-in fade-in"
          >
            <Unlock className="w-4 h-4" />
            <span>{isHindi ? 'अनलॉक करें (Unlock)' : 'Unlock Vault'}</span>
          </button>
        )}

        {/* Footer Actions: Show/Hide & Forgot PIN */}
        <div className="flex items-center justify-between pt-1 text-[11.5px] border-t border-[var(--theme-border,#213E61)]">
          <button
            type="button"
            onClick={() => setShowPasswordText(!showPasswordText)}
            className="text-[#94A3B8] hover:text-[#CBD5E1] flex items-center gap-1 cursor-pointer transition-colors"
          >
            {showPasswordText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPasswordText ? (isHindi ? 'छुपाएं' : 'Hide') : (isHindi ? 'देखें' : 'Show')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRecoveryOpen(true);
              setRecoveryError('');
              setRecoveryAnswerInput('');
              setIsResetPinStep(false);
              triggerHapticSound('click');
            }}
            className="text-[var(--theme-primary,#38BDF8)] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isHindi ? 'पासवर्ड भूल गए?' : 'Forgot Passcode?'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RECOVERY MODAL (SECURITY QUESTION ANSWER) */}
      {/* ========================================================================= */}
      {isRecoveryOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in text-left">
          <div className="w-full max-w-md bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--theme-border,#213E61)] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-primary,#38BDF8)]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#F8FAFC]">
                    {isHindi ? 'पासवर्ड रिकवरी (सुरक्षा प्रश्न)' : 'Passcode Recovery'}
                  </h3>
                  <p className="text-[10.5px] text-[#94A3B8]">
                    {isHindi ? 'अपने गुप्त उत्तर से अनलॉक करें' : 'Verify security question to reset'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRecoveryOpen(false)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-surface,#0E1A29)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isResetPinStep ? (
              /* Step 1: Security Question Verification */
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5">
                  <div className="text-[11px] font-bold text-[#CBD5E1] flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                    <span>{isHindi ? 'सुरक्षा प्रश्न (Security Question):' : 'Security Question:'}</span>
                  </div>
                  <div className="text-[13px] font-medium text-[#F8FAFC] pl-5">
                    {securityConfig.securityQuestion || 'What was the name of your first pet?'}
                  </div>
                  {securityConfig.recoveryHint && (
                    <div className="text-[11px] text-[#94A3B8] pl-5 italic">
                      Hint: {securityConfig.recoveryHint}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-[#CBD5E1]">
                    {isHindi ? 'आपका गुप्त उत्तर (Secret Answer):' : 'Your Secret Answer:'}
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={recoveryAnswerInput}
                    onChange={(e) => setRecoveryAnswerInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerifyRecovery();
                    }}
                    placeholder={isHindi ? 'अपना उत्तर यहाँ लिखें...' : 'Type your answer here...'}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[13px] rounded-xl px-3.5 py-2.5 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                  />
                </div>

                {recoveryError && (
                  <div className="text-[11.5px] font-bold text-[#EF4444] bg-[#EF4444]/10 p-2 rounded-lg border border-[#EF4444]/20 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsRecoveryOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] text-[12px] font-bold cursor-pointer hover:bg-[var(--theme-bg,#070E18)]"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>

                  <button
                    type="button"
                    onClick={handleVerifyRecovery}
                    className="flex-1 py-2.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-extrabold text-[12px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>{isHindi ? 'सत्यापित करें' : 'Verify Answer'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Emergency Reset Fallback */}
                {onResetAllData && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setIsEmergencyResetConfirmOpen(true)}
                      className="text-[10.5px] text-[#EF4444]/80 hover:text-[#EF4444] hover:underline cursor-pointer"
                    >
                      {isHindi ? 'उत्तर भी याद नहीं? आपातकालीन रीसेट (Emergency Reset)' : 'Forgot answer too? Emergency App Reset'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Step 2: Set New PIN */
              <div className="space-y-3.5">
                <div className="p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[12px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{isHindi ? 'सुरक्षा उत्तर सत्यापित! नया पिन बनाएं:' : 'Answer verified! Set a new 4-digit PIN:'}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-[#CBD5E1]">
                    {isHindi ? 'नया 4-अंकीय पिन (New PIN):' : 'New 4-Digit PIN:'}
                  </label>
                  <input
                    type="password"
                    maxLength={8}
                    autoFocus
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[18px] font-mono font-bold tracking-widest text-center rounded-xl py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-[#CBD5E1]">
                    {isHindi ? 'नया पिन दोबारा दर्ज करें (Confirm PIN):' : 'Confirm New PIN:'}
                  </label>
                  <input
                    type="password"
                    maxLength={8}
                    value={confirmNewPinInput}
                    onChange={(e) => setConfirmNewPinInput(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[18px] font-mono font-bold tracking-widest text-center rounded-xl py-2 focus:border-[var(--theme-primary,#38BDF8)] focus:outline-none"
                  />
                </div>

                {recoveryError && (
                  <div className="text-[11.5px] font-bold text-[#EF4444] bg-[#EF4444]/10 p-2 rounded-lg border border-[#EF4444]/20 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSaveNewPin}
                  className="w-full py-3 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[var(--theme-btn-text,#040D17)] font-extrabold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isHindi ? 'नया पिन सहेजें व अनलॉक करें' : 'Save New PIN & Unlock'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Emergency Data Reset Warning Modal */}
      {isEmergencyResetConfirmOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in text-left">
          <div className="w-full max-w-sm bg-[var(--theme-card,#132438)] border border-[#EF4444]/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#EF4444]">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-[15px] font-bold text-[#F8FAFC]">
                {isHindi ? 'आपातकालीन डेटा रीसेट?' : 'Emergency Factory Reset?'}
              </h3>
            </div>

            <p className="text-[12px] text-[#CBD5E1] leading-relaxed">
              {isHindi
                ? 'यदि आप पिन और गुप्त उत्तर दोनों भूल गए हैं, तो ऐप को अनलॉक करने के लिए स्थानीय डेटा साफ़ किया जाएगा। क्या आप वाकई आगे बढ़ना चाहते हैं?'
                : 'If you have lost both your PIN and security recovery answer, resetting will wipe local browser data to unlock the app. Do you want to proceed?'}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEmergencyResetConfirmOpen(false)}
                className="flex-1 py-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] text-[12px] font-bold cursor-pointer"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmEmergencyReset}
                className="flex-1 py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white text-[12px] font-bold cursor-pointer shadow-md"
              >
                {isHindi ? 'हाँ, रीसेट करें' : 'Wipe & Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
