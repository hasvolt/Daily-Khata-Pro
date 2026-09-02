import React, { useState } from 'react';
import { FundConfig, AppLanguage } from '../types';
import { AVAILABLE_FUND_ICONS, getFundIcon } from '../utils/iconMap';
import { X, Check, Palette, Sparkles, Sliders, Layers } from 'lucide-react';

interface FundEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fund: FundConfig) => void;
  editingFund?: FundConfig | null;
  existingFunds: FundConfig[];
  language?: AppLanguage;
}

const COLOR_PALETTE = [
  { name: 'Sky Blue', hex: '#38BDF8' },
  { name: 'Volt Yellow', hex: '#FFC700' },
  { name: 'Royal Purple', hex: '#A855F7' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Rose Red', hex: '#F87171' },
  { name: 'Amber Gold', hex: '#F59E0B' },
  { name: 'Indigo Slate', hex: '#818CF8' },
  { name: 'Hot Pink', hex: '#EC4899' },
  { name: 'Cyan Electric', hex: '#06B6D4' },
  { name: 'Teal Mint', hex: '#14B8A6' },
  { name: 'Deep Violet', hex: '#6366F1' },
  { name: 'Fresh Lime', hex: '#84CC16' }
];

export const FundEditorModal: React.FC<FundEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingFund,
  existingFunds,
  language = 'en'
}) => {
  const isHindi = language === 'hi' || language === 'hinglish';

  const [label, setLabel] = useState(editingFund?.label || '');
  const [hindiLabel, setHindiLabel] = useState(editingFund?.hindiLabel || '');
  const [description, setDescription] = useState(editingFund?.description || '');
  const [color, setColor] = useState(editingFund?.color || '#38BDF8');
  const [iconName, setIconName] = useState(editingFund?.iconName || 'Layers');
  const [pct, setPct] = useState<number>(editingFund?.defaultPct ?? 5);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = label.trim();
    if (!trimmed) {
      setError(isHindi ? 'कृपया फंड का नाम दर्ज करें' : 'Please enter fund category name');
      return;
    }

    // Generate clean unique ID if new
    let id = editingFund?.id;
    if (!id) {
      const slug = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/^_+|_+$/g, '');
      const baseId = slug ? `fund_${slug}` : `fund_${Date.now()}`;
      
      // Ensure unique ID
      let uniqueId = baseId;
      let counter = 1;
      while (existingFunds.some((f) => f.id === uniqueId)) {
        uniqueId = `${baseId}_${counter}`;
        counter++;
      }
      id = uniqueId;
    }

    const updatedFund: FundConfig = {
      id,
      label: trimmed,
      hindiLabel: hindiLabel.trim() || undefined,
      description: description.trim() || (isHindi ? 'कस्टम फंड कैटेगरी' : 'Custom fund category'),
      color,
      iconName,
      defaultPct: Math.max(0, Math.min(100, pct)),
      isCustom: editingFund ? editingFund.isCustom : true
    };

    onSave(updatedFund);
    onClose();
  };

  const PreviewIcon = getFundIcon(editingFund?.id || 'custom', iconName);

  return (
    <div
      id="fund-editor-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="fund-editor-container"
        className="w-full max-w-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
              style={{ backgroundColor: `${color}25`, color: color }}
            >
              <PreviewIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[15px] sm:text-[17px] text-[#F8FAFC]">
                {editingFund
                  ? isHindi
                    ? 'फंड श्रेणी संपादित करें'
                    : 'Edit Fund Category'
                  : isHindi
                  ? 'नया कस्टम फंड जोड़ें'
                  : 'Add Custom Fund Category'}
              </h3>
              <p className="text-[11px] sm:text-[12px] text-[#94A3B8]">
                {isHindi
                  ? 'नाम, आइकन, रंग व विभाजन प्रतिशत निर्धारित करें'
                  : 'Set name, icon, theme color, and split percentage'}
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

        {/* Body Form */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-2.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-[12px] font-medium">
              {error}
            </div>
          )}

          {/* Live Preview Pill */}
          <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                style={{ backgroundColor: `${color}25`, color: color }}
              >
                <PreviewIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-[13px] text-[#F8FAFC] block truncate">
                  {label.trim() || (isHindi ? 'फंड का नाम' : 'Fund Name')}
                </span>
                <span className="text-[10.5px] text-[#94A3B8] block truncate">
                  {description.trim() || (isHindi ? 'फंड विवरण...' : 'Fund description...')}
                </span>
              </div>
            </div>
            <span
              className="font-mono font-bold text-[12px] px-2 py-0.5 rounded-md border"
              style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}35` }}
            >
              {pct}%
            </span>
          </div>

          {/* Fund Name */}
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-[#CBD5E1] block">
              {isHindi ? 'फंड का नाम (Category Name)*' : 'Category Name*'}
            </label>
            <input
              type="text"
              required
              placeholder={isHindi ? 'उदा. Office Tech, Travel, Charity...' : 'e.g. Office Tech, Travel, Charity...'}
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                setError('');
              }}
              className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
          </div>

          {/* Subtitle / Hindi Label */}
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-[#CBD5E1] block">
              {isHindi ? 'उपशीर्षक / हिंदी नाम (वैकल्पिक)' : 'Subtitle / Regional Label (Optional)'}
            </label>
            <input
              type="text"
              placeholder={isHindi ? 'उदा. ऑफिस खर्च व उपकरण' : 'e.g. Work supplies & tech'}
              value={hindiLabel}
              onChange={(e) => setHindiLabel(e.target.value)}
              className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[12px] font-bold text-[#CBD5E1] block">
              {isHindi ? 'विवरण (Description)' : 'Short Description'}
            </label>
            <input
              type="text"
              placeholder={isHindi ? 'उदा. लैपटॉप, इंटरनेट व टूल्स का खर्च' : 'e.g. Software, gadgets & office expenses'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2 text-[13px] text-[#F8FAFC] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
          </div>

          {/* Default Percentage */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold text-[#CBD5E1]">
                {isHindi ? 'विभाजन प्रतिशत (% Split Rule)' : 'Split Allocation Percentage (%)'}
              </label>
              <span className="font-mono font-bold text-[13px] text-[var(--theme-primary,#38BDF8)]">
                {pct}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={pct}
                onChange={(e) => setPct(Number(e.target.value))}
                className="flex-1 accent-[var(--theme-primary,#38BDF8)] cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={pct}
                onChange={(e) => setPct(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                className="w-16 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-lg px-2 py-1 text-right text-[13px] font-mono font-bold text-[#F8FAFC] focus:outline-none"
              />
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[12px] font-bold text-[#CBD5E1] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
              <span>{isHindi ? 'रंग चुनें (Theme Color)' : 'Select Theme Color'}</span>
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 pt-1">
              {COLOR_PALETTE.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                    color.toLowerCase() === c.hex.toLowerCase()
                      ? 'border-white scale-105 shadow-md ring-2 ring-white/30'
                      : 'border-transparent hover:scale-102'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {color.toLowerCase() === c.hex.toLowerCase() && (
                    <Check className="w-4 h-4 text-black font-extrabold" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[12px] font-bold text-[#CBD5E1] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{isHindi ? 'आइकन चुनें (Select Icon)' : 'Select Fund Icon'}</span>
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto pr-1">
              {AVAILABLE_FUND_ICONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = iconName === item.name;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setIconName(item.name)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[var(--theme-primary,#38BDF8)]/20 border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] shadow-xs scale-105'
                        : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                    title={item.label}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-[8.5px] truncate max-w-full font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] hover:text-[#F8FAFC] font-semibold text-[12px] cursor-pointer"
          >
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-[12.5px] hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>{isHindi ? 'सहेजें' : 'Save Fund'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundEditorModal;
