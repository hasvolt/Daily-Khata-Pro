import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLanguage } from '../types';
import { 
  Heart, 
  ShieldCheck, 
  Zap, 
  Github, 
  MessageSquare, 
  Share2, 
  CheckCircle2,
  AlertCircle,
  Star,
  ExternalLink,
  Copy,
  Check,
  Mail,
  Send,
  Sparkles
} from 'lucide-react';

interface SupportProjectPageProps {
  language: AppLanguage;
  isDark: boolean;
}

export const SupportProjectPage: React.FC<SupportProjectPageProps> = ({ language, isDark }) => {
  const navigate = useNavigate();
  const isHindi = language === 'hi';
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const tStr = (hi: string, en: string) => isHindi ? hi : en;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://daily-khata-pro.web.app';
  };

  const handleShareApp = async () => {
    const shareUrl = getShareUrl();
    const shareTitle = 'Daily Khata Pro - Offline-First Personal Finance Manager';
    const shareText = isHindi
      ? 'Daily Khata Pro: 100% प्राइवेट, ऑफलाइन और स्मार्ट फंड्स मैनेजमेंट ऐप। आज ही आजमाएं:'
      : 'Daily Khata Pro: 100% Private, Offline-first, Smart Funds & Personal Finance Manager. Check it out:';

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        showToast(isHindi ? 'सफलतापूर्वक शेयर किया गया!' : 'Shared successfully!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyLinkFallback(shareUrl);
        }
      }
    } else {
      copyLinkFallback(shareUrl);
    }
  };

  const copyLinkFallback = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      showToast(isHindi ? 'ऐप लिंक क्लिपबोर्ड पर कॉपी हो गया!' : 'App link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://daily-khata-pro.web.app';
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    (isHindi
      ? 'Daily Khata Pro: 100% प्राइवेट, सुरक्षित व ऑफलाइन स्मार्ट वित्तीय प्रबंधन ऐप: '
      : 'Track daily expenses, income & smart funds offline with Daily Khata Pro: ') + shareUrl
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    'Daily Khata Pro - 100% offline-first personal financial manager with zero telemetry & complete privacy! ' + shareUrl
  )}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
    'Daily Khata Pro - Offline-first smart finance manager'
  )}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 text-[13px] font-bold">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-500/10 border border-red-500/20 mb-2">
          <Heart className="w-8 h-8 text-red-500 fill-red-500 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-display font-extrabold text-[var(--theme-text,#F8FAFC)] tracking-tight">
          {tStr('Daily Khata Pro को सपोर्ट करें', 'Support Daily Khata Pro')}
        </h1>
        <p className="text-base sm:text-lg text-[var(--theme-text-dim,#94A3B8)] max-w-2xl mx-auto leading-relaxed">
          {tStr(
            'आपका वित्तीय अनुशासन और प्राइवेसी हमारी प्राथमिकता है। इस प्रोजेक्ट के विकास और संवर्द्धन में स्टार, शेयर या फीडबैक देकर मदद करें।',
            'Your financial discipline and privacy are our top priorities. Help sustain and grow this project with a GitHub star, sharing with friends, or valuable feedback.'
          )}
        </p>
      </div>

      {/* The Standard Edition & Transparency Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--theme-surface,#0E1A29)] to-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <ShieldCheck className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-[var(--theme-primary,#38BDF8)]" />
            <h2 className="text-xl font-bold text-[var(--theme-text,#F8FAFC)]">
              {tStr('मुफ़्त मानक संस्करण व हमारे सिद्धांत', 'Free Standard Edition & Core Principles')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { 
                title: tStr('मुफ़्त मुख्य लेजर', 'Free Core Ledger'), 
                desc: tStr('मुख्य ऑफलाइन लेजर व फंड नियम बिना किसी अनिवार्य शुल्क के उपलब्ध हैं।', 'Core offline bookkeeping and fund allocation tools without mandatory paywalls.') 
              },
              { 
                title: tStr('पारदर्शी नीतियां', 'Transparent Terms'), 
                desc: tStr('भविष्य के सर्वर इन्फ्रास्ट्रक्चर व प्रो टूल्स के लिए वैकल्पिक सब्सक्रिप्शन या स्पॉन्सरशिप का विकल्प।', 'Open flexibility for optional pro upgrades, curated sponsorships, and clear licensing.') 
              },
              { 
                title: tStr('कोई अनिवार्य वाटरमार्क नहीं', 'Clean Professional Reports'), 
                desc: tStr('प्रोफेशनल रिपोर्ट्स व स्टेटमेंट साफ और सुव्यवस्थित लेआउट में।', 'Export clean, professional financial statements and invoices anytime.') 
              },
              { 
                title: tStr('100% प्राइवेसी व ऑफलाइन', '100% Privacy & Offline'), 
                desc: tStr('डेटा केवल आपके डिवाइस के सैंडबॉक्स में सुरक्षित रहता है।', 'Your personal data stays strictly in your local device storage.') 
              }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[14px] text-[var(--theme-text,#F8FAFC)]">{item.title}</h3>
                  <p className="text-[12px] text-[var(--theme-text-dim,#94A3B8)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Support Section: Share, GitHub Star & Feedback */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-serif-display font-bold text-[var(--theme-text,#F8FAFC)]">
            {tStr('आप कैसे योगदान दे सकते हैं?', 'How You Can Support')}
          </h2>
          <p className="text-[13px] text-[var(--theme-text-dim,#94A3B8)]">
            {tStr('आपका एक छोटा सा सहयोग इस ओपन-सोर्स टूल को हर भारतीय तक पहुंचाने में मदद करेगा', 'Your contribution helps keep this free open-source utility available to everyone')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Action 1: GitHub Star */}
          <div className="p-6 rounded-3xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Star className="w-6 h-6 fill-amber-400/30 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                <span>{tStr('GitHub पर Star दें', 'Star on GitHub')}</span>
                <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-mono font-bold border border-amber-500/30">
                  Open Source
                </span>
              </h3>
              <p className="text-[12.5px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
                {tStr(
                  'अगर आपको Daily Khata Pro उपयोगी लगा, तो गिटहब रिपॉजिटरी पर एक स्टार (★) देकर डेवलपर का उत्साह बढ़ाएं और प्रोजेक्ट को बढ़ावा दें।',
                  'If you find Daily Khata Pro helpful, give our repository a Star on GitHub to help more people discover this offline-first tool.'
                )}
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href="https://github.com/hasvolt/Daily-Khata-Pro"
                target="_blank"
                rel="noopener noreferrer"
                id="btn-support-github-star"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#040D17] font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-amber-500/20 active:scale-95"
              >
                <Github className="w-4 h-4" />
                <span>{tStr('GitHub Repository Star करें ★', 'Give Star on GitHub ★')}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>

              <a
                href="https://github.com/hasvolt/Daily-Khata-Pro/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-text,#F8FAFC)] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{tStr('गिटहब पर कोड व इश्यूज देखें', 'View Code & Issues')}</span>
                <ExternalLink className="w-3 h-3 text-[#64748B]" />
              </a>
            </div>
          </div>

          {/* Action 2: Share with Others */}
          <div className="p-6 rounded-3xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-pink-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20 group-hover:scale-105 transition-transform">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                <span>{tStr('दूसरों के साथ शेयर करें', 'Share with Others')}</span>
                <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-400 font-mono font-bold border border-pink-500/30">
                  Viral
                </span>
              </h3>
              <p className="text-[12.5px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
                {tStr(
                  'Daily Khata Pro को अपने मित्रों, परिवार या बिज़नेस ग्रुप्स में शेयर करें ताकि वे भी बिना विज्ञापनों और डेटा चोरी के अपना वित्तीय हिसाब रख सकें।',
                  'Spread the word with your friends, family, and colleagues so they can also take charge of their personal finances privately.'
                )}
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleShareApp}
                id="btn-support-share-native"
                className="w-full py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-pink-600/20 active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>{tStr('ऐप शेयर करें', 'Share Daily Khata Pro')}</span>
              </button>

              {/* Social One-Click Share Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 font-semibold text-[11.5px] flex items-center justify-center gap-1 transition-colors"
                  title="Share on WhatsApp"
                >
                  <span>WhatsApp</span>
                </a>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2 rounded-lg bg-sky-600/15 hover:bg-sky-600/25 border border-sky-500/30 text-sky-400 font-semibold text-[11.5px] flex items-center justify-center gap-1 transition-colors"
                  title="Share on Telegram"
                >
                  <span>Telegram</span>
                </a>
                <button
                  type="button"
                  onClick={() => copyLinkFallback(shareUrl)}
                  className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--theme-text-muted,#CBD5E1)] font-semibold text-[11.5px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Copy App URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action 3: Feedback & Suggestions */}
          <div className="p-6 rounded-3xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                <span>{tStr('फीडबैक व सुझाव', 'Feedback & Ideas')}</span>
                <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-mono font-bold border border-blue-500/30">
                  Priority
                </span>
              </h3>
              <p className="text-[12.5px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
                {tStr(
                  'क्या आपके पास ऐप को बेहतर बनाने का कोई विचार है? कोई नया कैलकुलेटर या फीचर चाहिए? सीधे हमें बताएं, आपकी सलाह हमारे लिए सबसे मूल्यवान है।',
                  'Have an idea to make Daily Khata Pro better? Found a minor bug or want a new smart calculator? Share it directly with our team.'
                )}
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => navigate('/support?tab=suggestion')}
                id="btn-support-give-feedback"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-blue-600/20 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{tStr('सुझाव फॉर्म खोलें', 'Submit Feature Request')}</span>
              </button>

              <a
                href="mailto:daily-Khata-Pro@gmail.com?subject=Daily%20Khata%20Pro%20Feedback&body=Hi%20Team%2C%0A%0AI%20have%20the%20following%20feedback%20or%20suggestion%20for%20Daily%20Khata%20Pro%3A%0A%0A"
                className="w-full py-2 px-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] hover:text-[var(--theme-text,#F8FAFC)] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{tStr('ईमेल द्वारा फीडबैक भेजें', 'Email Developer Direct')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Assurance Note */}
      <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/15 flex items-center gap-4">
        <AlertCircle className="w-6 h-6 text-blue-400 shrink-0" />
        <p className="text-[12.5px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
          {tStr(
            'Daily Khata Pro का मुख्य ऑफलाइन लेजर बिना किसी अनिवार्य शुल्क के उपलब्ध है। हम कभी भी आपका वित्तीय डेटा किसी रिमोट सर्वर पर बिना आपकी अनुमति के अपलोड नहीं करते हैं।',
            'Daily Khata Pro provides its standard offline core ledger without mandatory paywalls. Your personal financial records remain self-custodied directly on your local device.'
          )}
        </p>
      </div>
    </div>
  );
};

export default SupportProjectPage;
