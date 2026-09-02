import React, { useState } from 'react';
import { FundConfig, AppLanguage } from '../types';
import { getFundIcon } from '../utils/iconMap';
import {
  X,
  Check,
  MoveUp,
  MoveDown,
  RotateCcw,
  Sliders,
  Sparkles,
  Layers,
  Plus
} from 'lucide-react';

interface HomepageFundSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  funds: FundConfig[];
  homepageFundIds: string[];
  onSaveHomepageFundIds: (ids: string[]) => void;
  onOpenFundSettings?: () => void;
  language?: AppLanguage;
}

export const HomepageFundSelectorModal: React.FC<HomepageFundSelectorModalProps> = ({
  isOpen,
  onClose,
  funds,
  homepageFundIds,
  onSaveHomepageFundIds,
  onOpenFundSettings,
  language = 'en'
}) => {
  const isHindi = language === 'hi' || language === 'hinglish';

  // Local state for reordering & selection
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    // Ensure 6 valid IDs
    const validIds = funds.map((f) => f.id);
    const filtered = (homepageFundIds || []).filter((id) => validIds.includes(id));
    if (filtered.length >= 6) return filtered.slice(0, 6);
    const missing = validIds.filter((id) => !filtered.includes(id));
    return [...filtered, ...missing].slice(0, 6);
  });

  if (!isOpen) return null;

  // Toggle or select an ID
  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) return; // Keep at least 1
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      if (selectedIds.length >= 6) {
        // Replace the last item or restrict to 6
        setSelectedIds([...selectedIds.slice(0, 5), id]);
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...selectedIds];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setSelectedIds(next);
  };

  const moveDown = (index: number) => {
    if (index >= selectedIds.length - 1) return;
    const next = [...selectedIds];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setSelectedIds(next);
  };

  const handleResetDefault = () => {
    const defaultSix = funds.slice(0, 6).map((f) => f.id);
    setSelectedIds(defaultSix);
  };

  const handleSave = () => {
    // If fewer than 6, fill from remaining funds
    const validIds = funds.map((f) => f.id);
    const finalIds = [...selectedIds];
    if (finalIds.length < 6) {
      const remaining = validIds.filter((id) => !finalIds.includes(id));
      finalIds.push(...remaining.slice(0, 6 - finalIds.length));
    }
    onSaveHomepageFundIds(finalIds);
    onClose();
  };

  return (
    <div
      id="homepage-fund-selector-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="homepage-fund-selector-container"
        className="w-full max-w-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 border border-[var(--theme-primary,#38BDF8)]/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[15px] sm:text-[17px] text-[#F8FAFC]">
                {isHindi ? 'होमपेज श्रेणियां कस्टमाइज़ करें' : 'Customize Homepage Categories'}
              </h3>
              <p className="text-[11px] sm:text-[12px] text-[#94A3B8]">
                {isHindi
                  ? 'होमपेज पर खुले दिखने वाले 6 फंड्स चुनें (बाकी "View More" में रहेंगे)'
                  : 'Select exactly 6 categories to show open on Home (others will be in View More)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[var(--theme-card-hover,#19304A)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Badge & Helper */}
        <div className="px-4 py-2.5 bg-[var(--theme-bg,#070E18)] border-b border-[var(--theme-border,#213E61)] flex items-center justify-between text-[11.5px] sm:text-[12.5px]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#94A3B8]">{isHindi ? 'चयनित श्रेणियां:' : 'Selected on Home:'}</span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                selectedIds.length === 6
                  ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                  : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
              }`}
            >
              {selectedIds.length} / 6
            </span>
          </div>

          <button
            type="button"
            onClick={handleResetDefault}
            className="text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1 font-bold cursor-pointer text-[11.5px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isHindi ? 'डिफ़ॉल्ट 6' : 'Default 6'}</span>
          </button>
        </div>

        {/* Funds List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <p className="text-[11px] text-[#94A3B8] pb-1">
            {isHindi
              ? 'श्रेणियों को ऊपर/नीचे क्रमबद्ध करें या टिक/अनटिक करें:'
              : 'Reorder using arrows or click items to toggle selection for Homepage slots:'}
          </p>

          {/* Section 1: Top 6 (Selected) */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-[var(--theme-primary,#38BDF8)] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHindi ? 'होमपेज पर खुले दिखने वाले (शीर्ष 6)' : 'Visible on Homepage (Top 6)'}</span>
            </div>

            {selectedIds.map((id, index) => {
              const cfg = funds.find((f) => f.id === id);
              if (!cfg) return null;
              const FundIcon = getFundIcon(cfg.id, cfg.iconName);

              return (
                <div
                  key={id}
                  className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)]/40 flex items-center justify-between gap-2 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="w-5 text-center font-mono font-bold text-[12px] text-[#94A3B8]">
                      #{index + 1}
                    </span>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: `${cfg.color}25`, color: cfg.color }}
                    >
                      <FundIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-[13px] text-[#F8FAFC] block truncate">
                        {cfg.label}
                      </span>
                      <span className="text-[10.5px] text-[#94A3B8] block truncate">
                        {cfg.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveUp(index)}
                      className="p-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index >= selectedIds.length - 1}
                      onClick={() => moveDown(index)}
                      className="p-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(id)}
                      className="p-1.5 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/25 cursor-pointer ml-1"
                      title="Remove from Homepage Top 6"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 2: Other Available Funds (Under View More) */}
          {funds.filter((f) => !selectedIds.includes(f.id)).length > 0 && (
            <div className="space-y-1.5 pt-3 border-t border-[var(--theme-border,#213E61)] mt-3">
              <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{isHindi ? 'अतिरिक्त फंड्स ("View More" में उपलब्ध)' : 'Other Funds (Visible in "View More")'}</span>
              </div>

              {funds
                .filter((f) => !selectedIds.includes(f.id))
                .map((cfg) => {
                  const FundIcon = getFundIcon(cfg.id, cfg.iconName);
                  return (
                    <div
                      key={cfg.id}
                      className="p-2.5 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-2 opacity-85 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
                        >
                          <FundIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-[13px] text-[#CBD5E1] block truncate">
                            {cfg.label}
                          </span>
                          <span className="text-[10.5px] text-[#64748B] block truncate">
                            {cfg.description}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggle(cfg.id)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'होम पर जोड़ें' : 'Add to Home'}</span>
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between gap-2">
          {onOpenFundSettings ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFundSettings();
              }}
              className="text-[11.5px] text-[#94A3B8] hover:text-[var(--theme-primary,#38BDF8)] underline cursor-pointer"
            >
              {isHindi ? '+ नया फंड जोड़ें / प्रबंधित करें' : '+ Manage & Add Funds'}
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] hover:text-[#F8FAFC] font-semibold text-[12px] cursor-pointer"
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-[12px] hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isHindi ? 'लागू करें' : 'Save & Apply'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageFundSelectorModal;
