import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  Lock,
  EyeOff,
  Mail,
  Sliders
} from 'lucide-react';
import { AppLanguage } from '../types';
import { AdsterraNativeBanner, AdsterraResponsiveLeaderboard } from './AdUnits';

interface AdsPolicyPageProps {
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
  language?: AppLanguage;
}

export const AdsPolicyPage: React.FC<AdsPolicyPageProps> = ({
  onBack,
  onNavigateTab,
  language = 'en'
}) => {
  const isHindi = language === 'hi';
  const email = 'daily-Khata-Pro@gmail.com';
  const devEmail = 'mzhyazdaan@gmail.com';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 text-left">
      {/* Top Header & Breadcrumbs */}
      <div className="flex items-center justify-between gap-3 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-3.5 sm:p-4 rounded-2xl shadow-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-card-hover,#19304A)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] font-bold text-[12.5px] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
          <span>{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
            {isHindi ? 'विज्ञापन नीति' : 'Advertising Policy'}
          </span>
        </div>
      </div>

      {/* Ads Policy Hero Header */}
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--theme-primary,#38BDF8)] opacity-80" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] flex items-center justify-center shrink-0 border border-[var(--theme-primary,#38BDF8)]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif-display text-[24px] sm:text-[30px] font-bold text-[var(--theme-text,#F8FAFC)] tracking-tight">
              {isHindi ? 'विज्ञापन नीति व पारदर्शिता' : 'Advertising Policy & Transparency'}
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-dim,#94A3B8)]">
              {isHindi
                ? 'डेली खाता प्रो में विज्ञापनों के वितरण, सुरक्षा, और उपयोगकर्ता नियंत्रण का स्पष्ट विवरण'
                : 'Standards, ethical delivery, data isolation, and user controls regarding third-party commercial advertisements'}
            </p>
            <div className="text-[11px] font-mono text-[var(--theme-primary,#38BDF8)] mt-1.5 flex items-center gap-1.5">
              <span>📅 {isHindi ? 'प्रभावी तिथि: अक्टूबर 2026 · अंतिम समीक्षा: अक्टूबर 2026' : 'Effective Date: October 2026 · Last Reviewed: October 2026'}</span>
            </div>
          </div>
        </div>

        <p className="text-[13.5px] text-[var(--theme-text-muted,#CBD5E1)] mt-4 leading-relaxed">
          {isHindi
            ? 'डेली खाता प्रो (Daily Khata Pro) एक गोपनीयता-प्रथम (Privacy-First) वित्तीय हिसाब-किताब व विश्लेषणात्मक उपकरण है। यह नीति यह स्पष्ट करती है कि हमारे वेब-एप्लिकेशन में विज्ञापनों का प्रदर्शन किस प्रकार होता है, वे कैसे पृथक (isolated) रहते हैं, और आपका व्यक्तिगत वित्तीय डेटा विज्ञापनों से पूरी तरह सुरक्षित क्यों रहता है।'
            : 'Daily Khata Pro is a privacy-first personal accounting and financial analysis platform. This Advertising Policy provides transparent information regarding commercial advertisements displayed within the application, how third-party ad networks function, and our strict architectural isolation ensuring your ledger data is never accessed or monetized.'}
        </p>

        {/* 3 Core Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-[var(--theme-border,#213E61)]/70">
          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[#10B981] font-bold text-[13px]">
              <EyeOff className="w-4 h-4" />
              <span>{isHindi ? 'खाता डेटा 100% सुरक्षित' : 'Zero Financial Data Sharing'}</span>
            </div>
            <div className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] mt-1">
              {isHindi
                ? 'आपकी आय, व्यय, उधार या बैंक प्रविष्टियां किसी विज्ञापनदाता के पास नहीं जातीं।'
                : 'Your transactions, amounts, clients, and balances are never transmitted to ad networks.'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[var(--theme-primary,#38BDF8)] font-bold text-[13px]">
              <Lock className="w-4 h-4" />
              <span>{isHindi ? 'होमपेज विज्ञापन-मुक्त' : 'Clean Ad-Free Core Flow'}</span>
            </div>
            <div className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] mt-1">
              {isHindi
                ? 'मुख्य होमपेज और त्वरित प्रविष्टि स्क्रीन बिना विज्ञापनों के स्वच्छ रखी जाती है।'
                : 'The primary dashboard and quick entry experience are kept distraction-free.'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[13px]">
              <Sliders className="w-4 h-4" />
              <span>{isHindi ? 'सुरक्षित पृथक कंटेनर' : 'Isolated Sandboxed Slots'}</span>
            </div>
            <div className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] mt-1">
              {isHindi
                ? 'विज्ञापन सैंडबॉक्स्ड इफ्रेम में चलते हैं ताकि आपका डिवाइस सुरक्षित रहे।'
                : 'Ad tags run in isolated sandboxed containers, protecting application memory.'}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-4 text-[13px] text-[var(--theme-text-muted,#CBD5E1)]">
        {/* Section 1: Introduction */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.1</span>
            <span>{isHindi ? 'प्रस्तावना व उद्देश्य (Introduction)' : 'Introduction & Scope'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'यह विज्ञापन नीति यह समझाती है कि डेली खाता प्रो में तृतीय-पक्ष विज्ञापन क्यों, कब और किस प्रकार दिखाए जा सकते हैं। इस नीति को हमारी गोपनीयता नीति (Privacy Policy), कुकीज़ नीति (Cookies Policy) और नियम व शर्तों (Terms of Service) के साथ मिलाकर पढ़ा जाना चाहिए।'
              : 'This Advertising Policy outlines the principles and technical boundaries governing advertisements displayed within the Daily Khata Pro web application. This document should be reviewed in conjunction with our Privacy Policy, Cookies Policy, and Terms of Service.'}
          </p>
          <p className="leading-relaxed">
            {isHindi
              ? 'डेली खाता प्रो एक स्वतंत्र वित्तीय उपयोगिता है। तृतीय-पक्ष विज्ञापनों से प्राप्त आय सर्वर होस्टिंग, डोमेन रखरखाव, और निरंतर सॉफ़्टवेयर विकास को मुफ़्त बनाए रखने में सहायता करती है।'
              : 'Daily Khata Pro is an independent financial technology utility. Advertising revenue assists in supporting server infrastructure, domain maintenance, research initiatives, and keeping our standard financial accounting tools 100% free for all users.'}
          </p>
        </div>

        {/* Section 2: Advertising in Daily Khata Pro */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.2</span>
            <span>{isHindi ? 'डेली खाता प्रो में विज्ञापनों की स्थिति व स्थान' : 'Advertising Placement in the Application'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'हम उपयोगकर्ता अनुभव (User Experience) को सबसे अधिक प्राथमिकता देते हैं। विज्ञापनों का स्थान सावधानीपूर्वक निर्धारित किया गया है:'
              : 'To preserve a clean, distraction-free environment for day-to-day bookkeeping, ad placements follow a strict layout discipline:'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
            <li>
              <strong>{isHindi ? 'मुख्य होमपेज:' : 'Primary Dashboard:'}</strong>{' '}
              {isHindi
                ? 'डेली खाता प्रो के मुख्य होमपेज और त्वरित बैलेंस कार्ड्स पर कोई विज्ञापन नहीं दिखाया जाता है।'
                : 'The primary dashboard, balance cards, and immediate transaction logs remain entirely ad-free.'}
            </li>
            <li>
              <strong>{isHindi ? 'टूल्स व सहायक पृष्ठ:' : 'Utilities & Content Pages:'}</strong>{' '}
              {isHindi
                ? 'विशिष्ट कैलकुलेटर, गाइड/मैन्युअल, सेटिंग्स, उपस्थिति, और ब्लॉग/लेख अनुभागों में नीचे की ओर स्पष्ट रूप से लेबल किए गए "प्रायोजित" (Sponsored / Recommended) बैनर दिख सकते हैं।'
                : 'Utility pages such as Financial Calculators, User Manual, Settings, Attendance, and Editorial Blog sections may display clearly labeled sponsored banners.'}
            </li>
            <li>
              <strong>{isHindi ? 'प्रिंट व PDF रिपोर्ट:' : 'Print Statements & PDFs:'}</strong>{' '}
              {isHindi
                ? 'जब आप रसीद, इनवॉइस या मासिक खाता स्टेटमेंट प्रिंट या डाउनलोड करते हैं, तो विज्ञापनों को पूरी तरह छिपा दिया जाता है ताकि आपका मुद्रित दस्तावेज़ 100% आधिकारिक रहे।'
                : 'When exporting or printing A4 statements, invoices, or receipts, all advertisements are strictly suppressed (print:hidden) to ensure your exported financial slips remain clean and professional.'}
            </li>
          </ul>
        </div>

        {/* Section 3: Third-Party Advertising Providers */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.3</span>
            <span>{isHindi ? 'तृतीय-पक्ष विज्ञापन प्रदाता (Third-Party Providers)' : 'Third-Party Advertising Providers'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'डेली खाता प्रो विज्ञापन प्रदान करने के लिए अधिकृत तृतीय-पक्ष विज्ञापन नेटवर्कों (जैसे Adsterra नेटवर्क व संबंधित CDN bauval.org) के अनुमोदित टैग्स का उपयोग करता है। विज्ञापन सेवाएँ तृतीय-पक्ष सर्वरों द्वारा सीधे आपके ब्राउज़र में लोड की जाती हैं।'
              : 'Daily Khata Pro integrates approved ad units supplied by third-party advertising partners (such as the Adsterra ad network via its delivery domains, e.g., bauval.org). These units are requested and rendered by third-party advertising infrastructure.'}
          </p>
          <p className="leading-relaxed">
            {isHindi
              ? 'ये विज्ञापन प्रदाता स्वतंत्र डेटा नियंत्रक (independent data controllers) के रूप में कार्य करते हैं और उनकी अपनी गोपनीयता नीतियां लागू होती हैं।'
              : 'These advertising providers operate as independent third parties subject to their own data practices, platform standards, and privacy terms.'}
          </p>
        </div>

        {/* Section 4: How Advertising Works */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.4</span>
            <span>{isHindi ? 'विज्ञापन वितरण की तकनीकी प्रक्रिया' : 'How Advertising Delivery Operates'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'जब आप कोई ऐसा पृष्ठ खोलते हैं जिसमें प्रायोजित बैनर शामिल होता है, तो आपका वेब ब्राउज़र विज्ञापन प्रदाता के सर्वर को एक मानक HTTP अनुरोध भेजता है। इसके बाद विज्ञापन प्रदाता एक बैनर, टेक्स्ट अनुशंसा या नेटिव कार्ड वापस भेजता है जो आपके डिवाइस पर प्रदर्शित होता है।'
              : 'When you navigate to a page containing an advertisement slot, your browser issues an automated request to the third-party ad server. The provider returns an ad creative (such as a standard banner or native recommendation unit) for display in that designated slot.'}
          </p>
          <p className="leading-relaxed">
            {isHindi
              ? 'हम पॉप-अंडर (popunders), सोशल बार, या आक्रामक ओवरले का उपयोग नहीं करते हैं, जिससे आपका उपयोग कभी बाधित न हो।'
              : 'To preserve user trust, aggressive formats such as forced pop-unders, unexpected redirects, or invasive overlays are disabled in our integration.'}
          </p>
        </div>

        {/* Section 5: Information That May Be Processed by Ad Providers */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.5</span>
            <span>{isHindi ? 'विज्ञापन प्रदाताओं द्वारा संसाधित की जाने वाली संभावित जानकारी' : 'Information Processed for Advertising'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'यह समझना आवश्यक है कि डेली खाता प्रो और विज्ञापन प्रदाताओं की जिम्मेदारियां अलग-अलग हैं:'
              : 'It is critical to distinguish between data handled by Daily Khata Pro and technical data processed directly by advertising networks:'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]">
              <div className="text-[12px] font-bold text-emerald-400 mb-1">
                {isHindi ? 'डेली खाता प्रो क्या करता है:' : 'Daily Khata Pro Architecture:'}
              </div>
              <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
                {isHindi
                  ? 'हम कभी भी आपका वित्तीय डेटा, प्रविष्टियां, नोट्स या व्यक्तिगत पहचान विज्ञापन नेटवर्क को नहीं भेजते। सभी खाते आपके स्थानीय डिवाइस में रहते हैं।'
                  : 'We do not collect, monetize, or transmit your ledger entries, balances, notes, or identities to any advertising network.'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)]">
              <div className="text-[12px] font-bold text-[var(--theme-primary,#38BDF8)] mb-1">
                {isHindi ? 'विज्ञापन नेटवर्क क्या प्राप्त कर सकते हैं:' : 'Third-Party Ad Network Transmission:'}
              </div>
              <p className="text-[11.5px] text-[var(--theme-text-dim,#94A3B8)] leading-relaxed">
                {isHindi
                  ? 'मानक इंटरनेट प्रोटोकॉल के अनुसार: आईपी एड्रेस (लगभग भौगोलिक स्थान हेतु), ब्राउज़र प्रकार (User-Agent), स्क्रीन आकार, और नेटवर्क अनुरोध विवरण।'
                  : 'Standard web protocol telemetry: your IP address (for regional routing), browser User-Agent, device type, screen dimensions, and standard referrer headers.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Contextual vs. Personalized Advertising */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.6</span>
            <span>{isHindi ? 'प्रासंगिक व व्यक्तिगत विज्ञापन (Contextual & Interest-Based)' : 'Contextual & Personalized Advertising'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'विज्ञापन दो प्रकार के हो सकते हैं: (1) प्रासंगिक (Contextual) — जो पृष्ठ के विषय या सामान्य भाषा पर आधारित होते हैं, या (2) व्यक्तिगत/रुचि-आधारित (Interest-Based) — जो विज्ञापन नेटवर्क के कुकीज़ या पहचानकर्ताओं पर आधारित हो सकते हैं। आप अपने ब्राउज़र या डिवाइस सेटिंग्स के माध्यम से रुचि-आधारित विज्ञापनों को सीमित कर सकते हैं।'
              : 'Advertisements may be contextual (determined by general page topics, category, or broad geography) or interest-based (served by ad networks utilizing cross-site cookies or advertising IDs where permitted by your browser settings). Users can opt out or restrict interest-based profiling via their operating system and browser preferences.'}
          </p>
        </div>

        {/* Section 7: Cookies and Similar Technologies */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.7</span>
            <span>{isHindi ? 'कुकीज़ और संबंधित तकनीकें' : 'Cookies & Similar Ad Technologies'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'तृतीय-पक्ष विज्ञापन नेटवर्क विज्ञापन आवृत्ति को सीमित करने (frequency capping), क्लिक धोखाधड़ी रोकने (fraud prevention), और रिपोर्टिंग के लिए कुकीज़ या स्थानीय स्टोरेज का उपयोग कर सकते हैं। अधिक जानकारी के लिए हमारी कुकीज़ नीति (Cookies Policy) देखें।'
              : 'Third-party advertising partners may set cookies or web storage tokens to regulate ad frequency, prevent fraudulent automated clicks, and measure campaign effectiveness. Please consult our dedicated Cookies Policy for detailed technical controls.'}
          </p>
        </div>

        {/* Section 8: External Links & Advertiser Responsibility */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.8</span>
            <span>{isHindi ? 'विज्ञापनों पर क्लिक व बाहरी वेबसाइटें' : 'Ad Clicks & External Third-Party Websites'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'जब आप किसी विज्ञापन पर क्लिक करते हैं, तो आप डेली खाता प्रो छोड़कर उस तृतीय-पक्ष विज्ञापनदाता की वेबसाइट या ऐप पर जा सकते हैं। डेली खाता प्रो का उन बाहरी वेबसाइटों की सामग्री, सेवाओं या गोपनीयता नीतियों पर कोई नियंत्रण नहीं होता।'
              : 'Clicking an advertisement directs your browser to a third-party website or external destination. Daily Khata Pro maintains no ownership or operational control over third-party domains, their content, or their respective privacy practices.'}
          </p>
          <p className="leading-relaxed">
            {isHindi
              ? 'हम अनुशंसा करते हैं कि किसी भी बाहरी वेबसाइट पर व्यक्तिगत या वित्तीय जानकारी दर्ज करने से पहले उनकी गोपनीयता नीति की सावधानीपूर्वक समीक्षा करें।'
              : 'We advise users to review the privacy terms and security credentials of external web destinations before purchasing services or submitting personal contact details.'}
          </p>
        </div>

        {/* Section 9: Disclaimer of Endorsement */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.9</span>
            <span>{isHindi ? 'गैर-समर्थन अस्वीकरण (No Endorsement Disclaimer)' : 'No Endorsement & Content Representation'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'डेली खाता प्रो में किसी विज्ञापन का प्रदर्शित होना उस उत्पाद, सेवा, ब्रांड या कंपनी का हमारे द्वारा कोई समर्थन, अनुशंसा या गारंटी नहीं है। विज्ञापन की सामग्री पूर्णतः संबंधित विज्ञापनदाता की होती है।'
              : 'The appearance of an advertisement within Daily Khata Pro does not constitute an endorsement, warranty, or recommendation of the advertised product, service, investment, or enterprise. Commercial claims represent the advertiser exclusively.'}
          </p>
        </div>

        {/* Section 10: Prohibited & Inappropriate Advertising */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.10</span>
            <span>{isHindi ? 'प्रतिबंधित व अनुचित विज्ञापन मानक' : 'Prohibited Content & Quality Filtering'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'हम दुर्भावनापूर्ण (malware), भ्रामक (misleading), अवैध या आपत्तिजनक विज्ञापनों को रोकने के लिए विज्ञापन नेटवर्क की सुरक्षा फ़िल्टरिंग का उपयोग करते हैं। यद्यपि अधिकांश विज्ञापन स्वतः फ़िल्टर होते हैं, फिर भी यदि आपको कोई संदिग्ध विज्ञापन दिखाई दे तो कृपया हमें तुरंत सूचित करें।'
              : 'We actively configure category restrictions to prevent malicious code, deceptive financial schemes, adult material, or illegal advertisements. If you encounter an ad that violates community standards or appears deceptive, please notify our team for prompt domain review and blocking.'}
          </p>
        </div>

        {/* Section 11: User Controls & Ad Choices */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.11</span>
            <span>{isHindi ? 'उपयोगकर्ता विकल्प व नियंत्रण (Your Choices & Opt-Outs)' : 'User Controls & Privacy Options'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'आपके पास अपने ब्राउज़िंग वातावरण को प्रबंधित करने के पूर्ण अधिकार हैं:'
              : 'Users possess full autonomy to control advertising delivery within their browsers:'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
            <li>
              <strong>{isHindi ? 'ब्राउज़र कुकीज़ नियंत्रण:' : 'Browser Cookie Controls:'}</strong>{' '}
              {isHindi
                ? 'आप अपने ब्राउज़र सेटिंग्स में जाकर तृतीय-पक्ष कुकीज़ को ब्लॉक कर सकते हैं।'
                : 'Configure your browser (Chrome, Safari, Firefox, Edge) to block third-party cookies or restrict tracking.'}
            </li>
            <li>
              <strong>{isHindi ? 'डिवाइस पहचानकर्ता:' : 'Mobile Advertising IDs:'}</strong>{' '}
              {isHindi
                ? 'Android ("Delete advertising ID") या iOS ("Ask App not to Track") में विज्ञापन ट्रैकिंग रीसेट करें।'
                : 'Reset your advertising identifier via Android Settings > Privacy > Ads or iOS Settings > Tracking.'}
            </li>
            <li>
              <strong>{isHindi ? 'विज्ञापन अवरोधक (Ad-Blockers):' : 'Ad-Blocking Extensions:'}</strong>{' '}
              {isHindi
                ? 'डेली खाता प्रो किसी वैध विज्ञापन-अवरोधक टूल के उपयोग पर आपको ब्लॉक नहीं करता। आपकी मुख्य खाता कार्यक्षमता हमेशा बिना रुकावट काम करती है।'
                : 'Daily Khata Pro does not disable or impede core accounting functionality if an ad blocker is enabled. Your offline ledger remains fully accessible.'}
            </li>
          </ul>
        </div>

        {/* Section 12: Children's Privacy */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.12</span>
            <span>{isHindi ? 'बच्चों की गोपनीयता (Children’s Privacy)' : 'Children’s Privacy & Protection'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'डेली खाता प्रो मुख्य रूप से वयस्कों, पेशेवरों और व्यवसायियों के व्यक्तिगत वित्त प्रबंधन के लिए डिज़ाइन किया गया है। हम 13 वर्ष (या लागू अधिकार क्षेत्र में 16 वर्ष) से कम आयु के बच्चों को लक्षित करने वाले विज्ञापनों का जानबूझकर उपयोग नहीं करते हैं।'
              : 'Daily Khata Pro is intended for general business and personal finance administration. We do not intentionally design features or serve directed advertising toward minors under applicable legal age thresholds.'}
          </p>
        </div>

        {/* Section 13: Security & Sandbox Architecture */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.13</span>
            <span>{isHindi ? 'सुरक्षा व सैंडबॉक्स वास्तुकला' : 'Technical Security & Sandbox Isolation'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'हमारे विज्ञापन कोड समर्पित इफ्रेम कंटेनरों में पृथक किए गए हैं। इसका अर्थ यह है कि तृतीय-पक्ष विज्ञापन स्क्रिप्ट कभी भी आपके खाता डेटा, लोकल स्टोरेज टोकन, या सत्र विवरणों को पढ़ नहीं सकतीं।'
              : 'Our front-end architecture sandboxes third-party ad tags inside isolated frames. This architectural separation prevents external scripts from inspecting React application state, local storage records, or financial memory.'}
          </p>
        </div>

        {/* Section 14: Policy Updates & Contact */}
        <div className="bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl p-5 sm:p-6 space-y-2.5">
          <h2 className="text-[15px] font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
            <span className="text-[var(--theme-primary,#38BDF8)] font-mono">1.14</span>
            <span>{isHindi ? 'नीति में संशोधन व संपर्क विवरण' : 'Policy Revisions & Contact Channels'}</span>
          </h2>
          <p className="leading-relaxed">
            {isHindi
              ? 'जब नए विज्ञापन प्रदाता जोड़े जाते हैं या कानूनी आवश्यकताएं बदलती हैं, तो इस नीति को अद्यतन किया जा सकता है। अद्यतन संस्करण हमेशा इस पृष्ठ पर उपलब्ध रहेगा।'
              : 'This Advertising Policy may be revised periodically to reflect changes in ad providers, technical formats, or statutory requirements. Continued use after revisions represents understanding of updated terms.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">Ad Inquiries &amp; Support</div>
                <div className="font-mono text-[var(--theme-text,#F8FAFC)] font-bold text-[12.5px] truncate">{email}</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#10B981] shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] text-[var(--theme-text-dim,#94A3B8)]">Developer Direct</div>
                <div className="font-mono text-[var(--theme-text,#F8FAFC)] font-bold text-[12.5px] truncate">{devEmail}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsored Responsive Leaderboard */}
      <AdsterraResponsiveLeaderboard className="my-4" />

      {/* Sponsored Recommendation Native Unit */}
      <AdsterraNativeBanner className="my-4" />

      {/* Navigation Footer Links */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[12px] text-[var(--theme-text-dim,#94A3B8)]">
        {onNavigateTab && (
          <>
            <button
              onClick={() => onNavigateTab('about')}
              className="hover:text-white underline cursor-pointer"
            >
              {isHindi ? 'ऐप परिचय' : 'About'}
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('privacy')}
              className="hover:text-white underline cursor-pointer"
            >
              {isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('cookies')}
              className="hover:text-white underline cursor-pointer"
            >
              {isHindi ? 'कुकीज़ नीति' : 'Cookies'}
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('disclaimer')}
              className="hover:text-white underline cursor-pointer"
            >
              {isHindi ? 'अस्वीकरण' : 'Disclaimer'}
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('terms')}
              className="hover:text-white underline cursor-pointer"
            >
              {isHindi ? 'नियम व शर्तें' : 'Terms of Service'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdsPolicyPage;
