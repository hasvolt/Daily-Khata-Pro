import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  Twitter,
  Mail,
  QrCode,
  Globe,
  Home,
  Receipt,
  PlusCircle,
  Target,
  Briefcase,
  BarChart3
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { AppLanguage } from '../types';
import { triggerHapticSound } from '../utils/khataCalculations';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavTab;
  language?: AppLanguage;
  onSelectTab?: (tab: NavTab) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  currentTab,
  language = 'en',
  onSelectTab
}) => {
  const [selectedShareTab, setSelectedShareTab] = useState<NavTab>(currentTab);
  const [copied, setCopied] = useState(false);
  const [copiedSpecific, setCopiedSpecific] = useState<string | null>(null);

  if (!isOpen) return null;

  const isHindi = language === 'hi';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rozfiber.com';
  
  const getPageUrl = (tab: NavTab) => {
    if (tab === 'home') return `${baseUrl}/`;
    return `${baseUrl}/${tab}`;
  };

  const currentShareUrl = getPageUrl(selectedShareTab);

  const tabsInfo: { id: NavTab; label: string; desc: string; icon: React.ElementType }[] = [
    { id: 'home', label: isHindi ? 'होम पेज' : 'Home Page', desc: isHindi ? 'नेट बैलेंस और 6-फंड सारांश' : 'Net balance & 6-fund summary', icon: Home },
    { id: 'history', label: isHindi ? 'खाता लेजर' : 'Khata Ledger', desc: isHindi ? 'सभी आय और व्यय का इतिहास' : 'Complete income & expense history', icon: Receipt },
    { id: 'add', label: isHindi ? 'लेन-देन जोड़ें' : 'Add Entry', desc: isHindi ? 'नई आय व व्यय एंट्री फॉर्म' : 'Direct transaction entry form', icon: PlusCircle },
    { id: 'goals', label: isHindi ? 'वित्तीय लक्ष्य' : 'Financial Goals', desc: isHindi ? 'सेविंग्स टारगेट व प्रोग्रेस' : 'Savings targets & milestone progress', icon: Target },
    { id: 'tracker', label: isHindi ? 'वर्क व लाइफ ट्रैकर' : 'Work & Life', desc: isHindi ? 'कार्य घंटे व दैनिक दिनचर्या' : 'Deliverables & daily life routine', icon: Briefcase },
    { id: 'report', label: isHindi ? 'रिपोर्ट व विश्लेषण' : 'Analytics & Reports', desc: isHindi ? 'मासिक चार्ट और पीएफडी एक्सपोर्ट' : 'Fund breakdown & financial reports', icon: BarChart3 }
  ];

  const shareTitle = "Daily Khata Pro — Universal 6-Fund Accounting";
  const shareText = isHindi
    ? `Daily Khata Pro पर मेरा वित्तीय लेजर और 6-फंड अकाउंटिंग देखें: ${currentShareUrl}`
    : `Check out Daily Khata Pro — Universal 6-Fund Accounting & Personal Ledger: ${currentShareUrl}`;

  const handleNativeShare = async () => {
    triggerHapticSound('click');
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentShareUrl
        });
      } catch (err) {
        // Fallback to copy if user dismissed
        console.log('Share dismissed', err);
      }
    } else {
      handleCopy(currentShareUrl);
    }
  };

  const handleCopy = (url: string, id: string = 'main') => {
    triggerHapticSound('click');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      if (id === 'main') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } else {
        setCopiedSpecific(id);
        setTimeout(() => setCopiedSpecific(null), 2200);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 no-print">
      <div className="bg-[#0B1017] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--theme-border,#213E61)] flex items-center justify-between bg-[var(--theme-surface,#0E1A29)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 border border-[var(--theme-primary,#38BDF8)]/30 flex items-center justify-center text-[var(--theme-primary,#38BDF8)]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-[17px] font-bold text-[#F8FAFC]">
                {isHindi ? 'पेज लिंक शेयर करें' : 'Share Page & Direct Links'}
              </h2>
              <p className="text-[11.5px] text-[#94A3B8]">
                {isHindi ? 'किसी भी पेज का डायरेक्ट लिंक कॉपी या शेयर करें' : 'Copy or share direct link to any section'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto bg-[#070E18]">
          {/* Main URL Preview & Copy Card */}
          <div className="p-3.5 rounded-xl bg-[#0E1A29] border border-[var(--theme-primary,#38BDF8)]/40 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span className="font-bold text-[#CBD5E1] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                <span>{isHindi ? 'वर्तमान पेज लिंक' : 'Active Shareable Link'}</span>
              </span>
              <span className="text-[10.5px] text-[var(--theme-primary,#38BDF8)] uppercase font-mono font-bold">
                Tab: {selectedShareTab}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#060B11] border border-[#213E61] font-mono text-[12px]">
              <span className="text-[#38BDF8] truncate select-all">
                {currentShareUrl}
              </span>
              <button
                onClick={() => handleCopy(currentShareUrl, 'main')}
                className="px-3 py-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] text-[11.5px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {typeof navigator !== 'undefined' && (
                <button
                  onClick={handleNativeShare}
                  className="px-3.5 py-1.5 rounded-lg bg-[#132438] hover:bg-[#1E3A5F] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                  <span>{isHindi ? 'सिस्टम शेयर' : 'Share Menu'}</span>
                </button>
              )}

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentShareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/40 text-[#1DA1F2] text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>X (Twitter)</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText)}`}
                className="px-3.5 py-1.5 rounded-lg bg-[#132438] hover:bg-[#1E3A5F] border border-[var(--theme-border,#213E61)] text-[#CBD5E1] text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Section: Select Specific Tab to Copy Link */}
          <div className="space-y-2">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#94A3B8]">
              {isHindi ? 'सभी पेज डायरेक्ट लिंक्स' : 'Direct Links to All Sections'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tabsInfo.map((item) => {
                const Icon = item.icon;
                const url = getPageUrl(item.id);
                const isSelected = selectedShareTab === item.id;
                const isItemCopied = copiedSpecific === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedShareTab(item.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#132438] border-[var(--theme-primary,#38BDF8)] shadow-sm'
                        : 'bg-[#0E1A29] border-[var(--theme-border,#213E61)] hover:border-[#38BDF8]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17]' : 'bg-[#070E18] text-[#94A3B8]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-bold text-[#F8FAFC] truncate">{item.label}</div>
                        <div className="text-[10.5px] text-[#94A3B8] truncate">{item.desc}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(url, item.id);
                      }}
                      className="p-1.5 rounded-md hover:bg-white/10 text-[#CBD5E1] hover:text-[var(--theme-primary,#38BDF8)] transition-colors shrink-0"
                      title={`Copy ${item.label} Link`}
                    >
                      {isItemCopied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between">
          <span className="text-[11.5px] text-[#64748B]">
            {isHindi ? '100% ओपन एवं सुरक्षित शेयरिंग' : '100% Open & Safe Sharing'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#132438] hover:bg-[#1E3A5F] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] text-[12px] font-bold transition-all cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
