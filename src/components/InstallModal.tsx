import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  Laptop,
  Apple,
  CheckCircle2,
  Share2,
  PlusSquare,
  WifiOff,
  Zap,
  ShieldCheck,
  HardDriveDownload,
  ExternalLink,
  Copy,
  Check,
  Globe,
  FileCode,
  Sparkles,
  Info,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { HasVoltLogo } from './HasVoltLogo';
import { AppLanguage } from '../types';
import { APP_VERSION_TAG } from '../utils/version';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: AppLanguage;
  installPrompt?: BeforeInstallPromptEvent | null;
  onTriggerInstall?: () => void;
}

type PlatformTab = 'android' | 'ios' | 'desktop';

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
  installPrompt = null,
  onTriggerInstall
}) => {
  const [activeTab, setActiveTab] = useState<PlatformTab>('android');
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const [downloadingOffline, setDownloadingOffline] = useState(false);
  const [downloadingBackup, setDownloadingBackup] = useState(false);
  const [installStatusMsg, setInstallStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    // Detect if inside an iframe (like AI Studio preview or embedded viewer)
    try {
      if (window.self !== window.top) {
        setIsIframe(true);
      }
    } catch {
      setIsIframe(true);
    }

    // Detect device OS for smart default tab
    const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream) {
      setActiveTab('ios');
    } else if (/android/i.test(userAgent)) {
      setActiveTab('android');
    } else {
      setActiveTab('desktop');
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  if (!isOpen) return null;

  const isHindi = language === 'hi';

  const handleInstallClick = async () => {
    // Check available prompt (passed prop or global window fallback)
    const promptEvent =
      installPrompt ||
      (typeof window !== 'undefined' && (window as any).deferredPrompt) ||
      (typeof window !== 'undefined' && (window as any).__DAILY_KHATA_PWA_PROMPT__);

    if (promptEvent && typeof promptEvent.prompt === 'function') {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallSuccess(true);
          setInstallStatusMsg(isHindi ? 'Daily Khata Pro सफलतापूर्वक इंस्टॉल हो गया!' : 'Daily Khata Pro added to your home screen!');
          setTimeout(() => {
            onClose();
          }, 2500);
        } else {
          setInstallStatusMsg(isHindi ? 'इंस्टॉलेशन रद्द किया गया। आप कभी भी मेनू से इंस्टॉल कर सकते हैं।' : 'Install was dismissed. You can try again anytime.');
        }
      } catch (err) {
        console.error('Install prompt error:', err);
        showFallbackGuide();
      }
    } else if (onTriggerInstall) {
      onTriggerInstall();
    } else {
      showFallbackGuide();
    }
  };

  const showFallbackGuide = () => {
    if (isIframe) {
      setInstallStatusMsg(
        isHindi
          ? 'iFrame प्रीव्यू में डायरेक्ट इंस्टॉल सपोर्टेड नहीं है। कृपया "नये टैब में खोलें" बटन दबाएं।'
          : 'Direct install is restricted inside iframe preview. Please click "Open in New Tab" to install.'
      );
    } else if (activeTab === 'ios') {
      setInstallStatusMsg(
        isHindi
          ? 'iPhone / Safari में इंस्टॉल करने के लिए नीचे दिए गए 3 आसान स्टेप्स फॉलो करें।'
          : 'To install on iPhone/iPad, please follow the 3 steps below using Safari Share menu.'
      );
    } else {
      setInstallStatusMsg(
        isHindi
          ? 'ब्राउज़र मेनू (⋮) खोलकर "Add to Home screen" या "Install app" चुनें।'
          : 'Open your browser menu (⋮) and tap "Install app" or "Add to Home screen".'
      );
    }
  };

  const handleOpenInNewTab = () => {
    const fullUrl = window.location.href;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setInstallStatusMsg(isHindi ? 'ऐप लिंक सफलतापूर्वक कॉपी हो गया!' : 'App link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback copy
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setIsCopied(true);
      setInstallStatusMsg(isHindi ? 'ऐप लिंक सफलतापूर्वक कॉपी हो गया!' : 'App link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Export full JSON backup of all khata transactions and funds
  const handleExportDataBackup = () => {
    setDownloadingBackup(true);
    try {
      const allData: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('daily_khata') || key.startsWith('khata_') || key.includes('khata'))) {
          try {
            allData[key] = JSON.parse(localStorage.getItem(key) || '{}');
          } catch {
            allData[key] = localStorage.getItem(key);
          }
        }
      }
      const dataStr = JSON.stringify(allData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Daily-Khata-Pro-Backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setInstallStatusMsg(isHindi ? 'सभी खाता डेटा का JSON बैकअप डाउनलोड हो गया!' : 'All Khata Data JSON backup downloaded successfully!');
    } catch (err) {
      console.error('Backup error:', err);
    } finally {
      setTimeout(() => setDownloadingBackup(false), 1200);
    }
  };

  // 100% Functional Standalone Single-File Offline Khata Application HTML
  const handleDownloadOfflineHTML = () => {
    setDownloadingOffline(true);
    try {
      const currentUrl = window.location.href;
      const offlineDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Daily Khata Pro - Offline Edition</title>
  <meta name="theme-color" content="#070E18" />
  <style>
    :root {
      --bg: #070E18;
      --surface: #0E1A29;
      --card: #132438;
      --border: #213E61;
      --primary: #38BDF8;
      --text: #F8FAFC;
      --text-dim: #94A3B8;
      --green: #10B981;
      --red: #EF4444;
      --gold: #F59E0B;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: var(--bg); color: var(--text); padding: 16px; min-height: 100vh; }
    .container { max-width: 680px; margin: 0 auto; }
    header { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 16px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .logo-box { width: 42px; height: 42px; background: #0A1624; border: 2px solid var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px; color: var(--gold); }
    h1 { font-size: 18px; font-weight: 800; color: #fff; }
    .tagline { font-size: 12px; color: var(--primary); font-weight: 600; }
    .badge { font-size: 10px; font-weight: 800; background: rgba(16,185,129,0.15); color: var(--green); border: 1px solid rgba(16,185,129,0.3); padding: 4px 10px; border-radius: 20px; text-transform: uppercase; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 16px; }
    .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 14px; text-align: center; }
    .stat-label { font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px; }
    .stat-val { font-size: 18px; font-weight: 800; }
    .stat-income { color: var(--green); }
    .stat-expense { color: var(--red); }
    .stat-net { color: var(--primary); }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 18px; margin-bottom: 16px; }
    .card-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    label { font-size: 12px; font-weight: 600; color: var(--text-dim); }
    input, select { width: 100%; padding: 10px 14px; background: #070E18; border: 1px solid var(--border); border-radius: 10px; color: #fff; font-size: 14px; outline: none; }
    input:focus, select:focus { border-color: var(--primary); }
    .btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
    .btn { padding: 12px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; gap: 6px; transition: 0.15s; }
    .btn-income { background: var(--green); color: #04140D; }
    .btn-expense { background: var(--red); color: #fff; }
    .btn-sync { width: 100%; background: var(--primary); color: #040D17; margin-top: 12px; text-decoration: none; display: flex; justify-content: center; padding: 12px; border-radius: 10px; font-weight: 800; font-size: 14px; }
    .tx-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .tx-desc { font-weight: 600; font-size: 13.5px; color: #fff; }
    .tx-meta { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
    .tx-amount { font-weight: 800; font-size: 15px; }
    .funds-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
    .fund-box { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 8px; text-align: center; }
    .fund-name { font-size: 10px; font-weight: 700; color: var(--text-dim); }
    .fund-amt { font-size: 13px; font-weight: 800; color: var(--gold); margin-top: 2px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <div class="logo-box">₹</div>
        <div>
          <h1>Daily Khata Pro</h1>
          <div class="tagline">Income & Expense Tracker (100% Offline)</div>
        </div>
      </div>
      <div class="badge">Offline Active</div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Income</div>
        <div class="stat-val stat-income" id="totalIncome">₹0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Expense</div>
        <div class="stat-val stat-expense" id="totalExpense">₹0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Net Balance</div>
        <div class="stat-val stat-net" id="netBalance">₹0</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Add Daily Transaction</div>
      <div class="form-group">
        <label>Amount (₹)</label>
        <input type="number" id="txAmount" placeholder="e.g. 500" />
      </div>
      <div class="form-group">
        <label>Title / Description</label>
        <input type="text" id="txTitle" placeholder="e.g. Client Payment, Groceries, Fuel" />
      </div>
      <div class="form-group">
        <label>Category</label>
        <select id="txCategory">
          <option value="General">General Income / Expense</option>
          <option value="Client Payment">Client / Customer Payment</option>
          <option value="Salary">Salary / Wage</option>
          <option value="Food & Ration">Food, Groceries & Ration</option>
          <option value="Shop Supplies">Shop / Business Supplies</option>
          <option value="Bills & Rent">Electricity, Rent & Utilities</option>
          <option value="Fuel & Transport">Fuel, Travel & Commute</option>
        </select>
      </div>
      <div class="btn-row">
        <button class="btn btn-income" onclick="addTx('income')">+ Add Income</button>
        <button class="btn btn-expense" onclick="addTx('expense')">- Add Expense</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">6-Fund Money Split (Auto-Calculated)</div>
      <div class="funds-grid">
        <div class="fund-box"><div class="fund-name">Necessity (55%)</div><div class="fund-amt" id="fundNec">₹0</div></div>
        <div class="fund-box"><div class="fund-name">Emergency (10%)</div><div class="fund-amt" id="fundEmg">₹0</div></div>
        <div class="fund-box"><div class="fund-name">Investment (10%)</div><div class="fund-amt" id="fundInv">₹0</div></div>
        <div class="fund-box"><div class="fund-name">Education (10%)</div><div class="fund-amt" id="fundEdu">₹0</div></div>
        <div class="fund-box"><div class="fund-name">Play & Life (10%)</div><div class="fund-amt" id="fundPlay">₹0</div></div>
        <div class="fund-box"><div class="fund-name">Give / Charity (5%)</div><div class="fund-amt" id="fundGive">₹0</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Recent Transactions</div>
      <div id="txList"></div>
    </div>

    <a href="${currentUrl}" class="btn-sync">Open Live Web App &amp; Sync Full Cloud</a>
  </div>

  <script>
    let transactions = JSON.parse(localStorage.getItem('offline_khata_txs') || '[]');
    function render() {
      let inc = 0, exp = 0;
      const list = document.getElementById('txList');
      list.innerHTML = '';
      if (transactions.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-dim); font-size: 13px;">No offline transactions recorded yet.</div>';
      } else {
        transactions.slice().reverse().forEach((t) => {
          if (t.type === 'income') inc += t.amount; else exp += t.amount;
          const row = document.createElement('div');
          row.className = 'tx-item';
          row.innerHTML = '<div><div class="tx-desc">' + (t.title || 'Untitled') + '</div><div class="tx-meta">' + t.category + ' • ' + t.date + '</div></div><div class="tx-amount ' + (t.type === 'income' ? 'stat-income' : 'stat-expense') + '">' + (t.type === 'income' ? '+' : '-') + '₹' + t.amount.toLocaleString() + '</div>';
          list.appendChild(row);
        });
      }
      document.getElementById('totalIncome').innerText = '₹' + inc.toLocaleString();
      document.getElementById('totalExpense').innerText = '₹' + exp.toLocaleString();
      document.getElementById('netBalance').innerText = '₹' + (inc - exp).toLocaleString();
      document.getElementById('fundNec').innerText = '₹' + Math.round(inc * 0.55).toLocaleString();
      document.getElementById('fundEmg').innerText = '₹' + Math.round(inc * 0.10).toLocaleString();
      document.getElementById('fundInv').innerText = '₹' + Math.round(inc * 0.10).toLocaleString();
      document.getElementById('fundEdu').innerText = '₹' + Math.round(inc * 0.10).toLocaleString();
      document.getElementById('fundPlay').innerText = '₹' + Math.round(inc * 0.10).toLocaleString();
      document.getElementById('fundGive').innerText = '₹' + Math.round(inc * 0.05).toLocaleString();
    }
    function addTx(type) {
      const amt = parseFloat(document.getElementById('txAmount').value);
      const title = document.getElementById('txTitle').value.trim();
      const cat = document.getElementById('txCategory').value;
      if (!amt || amt <= 0) { alert('Please enter a valid amount'); return; }
      transactions.push({
        id: Date.now(),
        type: type,
        amount: amt,
        title: title || (type === 'income' ? 'Daily Income' : 'Daily Expense'),
        category: cat,
        date: new Date().toLocaleDateString()
      });
      localStorage.setItem('offline_khata_txs', JSON.stringify(transactions));
      document.getElementById('txAmount').value = '';
      document.getElementById('txTitle').value = '';
      render();
    }
    render();
  </script>
</body>
</html>`;

      const blob = new Blob([offlineDoc], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Daily-Khata-Pro-Offline-App-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setInstallStatusMsg(isHindi ? 'ऑफलाइन HTML ऐप सफलतापूर्वक डाउनलोड हो गया!' : 'Standalone Offline App HTML downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloadingOffline(false), 1200);
    }
  };

  const hasNativePrompt = Boolean(installPrompt || (typeof window !== 'undefined' && (window as unknown as { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 no-print text-left">
      <div className="bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--theme-border,#213E61)] flex justify-between items-center bg-[var(--theme-surface,#0E1A29)] shrink-0">
          <div className="flex items-center gap-3">
            <HasVoltLogo size={34} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-[17px] font-bold text-[#F8FAFC]">
                  {isHindi ? 'Daily Khata Pro इंस्टॉल / डाउनलोड करें' : 'Install & Download Daily Khata Pro'}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  OFFLINE PWA
                </span>
              </div>
              <p className="text-[11.5px] text-[#94A3B8]">
                {isHindi ? '100% ऑफलाइन इस्तेमाल के लिए अपने फोन या कंप्यूटर पर जोड़ें' : 'Add to home screen for instant 100% offline access'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-[#CBD5E1]">
          {/* Main Action Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--theme-surface,#0E1A29)] to-[var(--theme-card,#132438)] border border-[var(--theme-primary,#38BDF8)]/40 shadow-lg relative overflow-hidden space-y-3.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[var(--theme-primary,#38BDF8)]/20 border border-[var(--theme-primary,#38BDF8)]/40 flex items-center justify-center text-[var(--theme-primary,#38BDF8)] shrink-0 shadow-inner">
                  <Download className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="font-bold text-[15px] text-[#F8FAFC] flex items-center gap-2">
                    <span>Daily Khata Pro</span>
                    <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">{APP_VERSION_TAG}</span>
                  </div>
                  <div className="text-[12px] text-[#94A3B8] flex items-center gap-1.5 mt-0.5">
                    <WifiOff className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{isHindi ? 'बिना इंटरनेट के भी 100% काम करता है' : 'Works 100% Offline with zero internet'}</span>
                  </div>
                </div>
              </div>

              {/* Install / Already Installed Button */}
              {isInstalled ? (
                <div className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] font-bold text-[13px] flex items-center justify-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isHindi ? 'होम स्क्रीन पर इंस्टॉल है' : 'Installed on Device'}</span>
                </div>
              ) : installSuccess ? (
                <div className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#10B981] text-[#04140D] font-bold text-[13px] flex items-center justify-center gap-1.5 shrink-0 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isHindi ? 'सफलतापूर्वक इंस्टॉल हुआ!' : 'Installed Successfully!'}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] font-extrabold text-[13.5px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <HardDriveDownload className="w-4.5 h-4.5" />
                  <span>{hasNativePrompt ? (isHindi ? 'होम स्क्रीन पर इंस्टॉल करें' : 'Install App Now') : (isHindi ? 'होम स्क्रीन पर जोड़ें' : 'Add to Home Screen')}</span>
                </button>
              )}
            </div>

            {/* If inside iframe preview, show direct open link */}
            {isIframe && (
              <div className="p-2.5 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px]">
                <div className="flex items-center gap-2 text-[#38BDF8]">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{isHindi ? 'प्रीव्यू में हैं? फुल ब्राउज़र टैब में खोलकर 1-क्लिक इंस्टॉल करें:' : 'Inside preview? Open in standalone tab to trigger native install:'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenInNewTab}
                  className="px-3 py-1 rounded-lg bg-[var(--theme-primary,#38BDF8)] text-[#040D17] font-bold text-[11.5px] flex items-center gap-1 shrink-0 hover:brightness-110 cursor-pointer"
                >
                  <span>{isHindi ? 'नये टैब में खोलें' : 'Open in New Tab'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Status Message / Notification */}
            {installStatusMsg && (
              <div className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[12px] text-[#F8FAFC] flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>{installStatusMsg}</span>
              </div>
            )}
          </div>

          {/* Quick Utility Downloads (Offline HTML, Backup JSON, Launch Tab & Copy Link) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] text-[12px] font-semibold text-[#F8FAFC] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
            >
              <Globe className="w-4 h-4 text-[#38BDF8]" />
              <span>{isHindi ? 'नये टैब में खोलें' : 'Launch Full Tab'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadOfflineHTML}
              disabled={downloadingOffline}
              className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#10B981] text-[12px] font-semibold text-[#F8FAFC] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
            >
              <FileCode className="w-4 h-4 text-[#10B981]" />
              <span>{downloadingOffline ? (isHindi ? 'डाउनलोडिंग...' : 'Saving...') : (isHindi ? 'ऑफलाइन HTML ऐप' : 'Download Offline App')}</span>
            </button>

            <button
              type="button"
              onClick={handleExportDataBackup}
              disabled={downloadingBackup}
              className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#A855F7] text-[12px] font-semibold text-[#F8FAFC] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
            >
              <Database className="w-4 h-4 text-[#A855F7]" />
              <span>{downloadingBackup ? (isHindi ? 'डाउनलोडिंग...' : 'Exporting...') : (isHindi ? 'डेटा बैकअप (JSON)' : 'Data Backup (JSON)')}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-[#F59E0B] text-[12px] font-semibold text-[#F8FAFC] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
            >
              {isCopied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-[#F59E0B]" />}
              <span>{isCopied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'ऐप लिंक कॉपी' : 'Copy App Link')}</span>
            </button>
          </div>

          {/* Platform Guide Tabs */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#94A3B8]">
                {isHindi ? 'डिवाइस अनुसार होम स्क्रीन पर जोड़ने का तरीका:' : 'Device-Specific Add to Home Screen Guide:'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`py-2 px-2 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`py-2 px-2 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`py-2 px-2 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>PC / Laptop</span>
              </button>
            </div>

            {/* TAB CONTENT: ANDROID */}
            {activeTab === 'android' && (
              <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-4 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#F8FAFC]">
                    <Smartphone className="w-4 h-4 text-[#10B981]" />
                    <span>{isHindi ? 'Android (Chrome / Samsung / Brave)' : 'Android Chrome / Samsung Internet'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30">Auto-Update</span>
                </div>
                <div className="space-y-2 text-[12.5px] text-[#94A3B8]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      {isHindi ? (
                        <>ऊपर दिए गए <strong className="text-[#F8FAFC]">"होम स्क्रीन पर इंस्टॉल करें"</strong> बटन को दबाएं, या Chrome में ऊपर दाएं कोने पर <strong>3 डॉट्स (⋮)</strong> मेनू खोलें।</>
                      ) : (
                        <>Tap the <strong className="text-[#F8FAFC]">"Install App Now"</strong> button above, or tap the top-right <strong>3 dots (⋮)</strong> menu in Chrome.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      {isHindi ? (
                        <>मेन्यू में से <strong className="text-[#F8FAFC]">"Install app"</strong> या <strong className="text-[#F8FAFC]">"Add to Home screen" (होम स्क्रीन में जोड़ें)</strong> चुनें।</>
                      ) : (
                        <>Select <strong className="text-[#F8FAFC]">"Install app"</strong> or <strong className="text-[#F8FAFC]">"Add to Home screen"</strong> from the menu.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[#10B981] text-[#10B981] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      {isHindi ? (
                        <><strong className="text-[#10B981]">"Install"</strong> पर कन्फर्म करें। ऐप का नाम <strong className="text-[#F8FAFC]">"Daily Khata Pro"</strong> आपके फोन की होम स्क्रीन पर आ जाएगा!</>
                      ) : (
                        <>Confirm <strong className="text-[#10B981]">"Install"</strong>. The app will be added as <strong className="text-[#F8FAFC]">"Daily Khata Pro"</strong> on your phone screen!</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: IOS */}
            {activeTab === 'ios' && (
              <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-4 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#F8FAFC]">
                    <Apple className="w-4 h-4 text-[#38BDF8]" />
                    <span>{isHindi ? 'iPhone और iPad (Apple Safari ब्राउज़र)' : 'iPhone & iPad (Apple Safari Browser)'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-2 py-0.5 rounded-full border border-[#38BDF8]/30">iOS Safari</span>
                </div>
                <div className="space-y-2 text-[12.5px] text-[#94A3B8]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      {isHindi ? (
                        <>Safari ब्राउज़र में सबसे नीचे दिए गए <strong className="text-[#F8FAFC]">Share बटन ( <Share2 className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong> पर टैप करें।</>
                      ) : (
                        <>In Apple Safari, tap the bottom <strong className="text-[#F8FAFC]">Share button ( <Share2 className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong>.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      {isHindi ? (
                        <>नीचे स्क्रॉल करके <strong className="text-[#F8FAFC]">"Add to Home Screen" ( <PlusSquare className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong> पर टैप करें।</>
                      ) : (
                        <>Scroll down and tap <strong className="text-[#F8FAFC]">"Add to Home Screen" ( <PlusSquare className="w-3.5 h-3.5 inline text-[#38BDF8]" /> )</strong>.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[#10B981] text-[#10B981] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      {isHindi ? (
                        <>ऊपर दाएं कोने में <strong className="text-[#10B981]">"Add"</strong> दबाएं। Daily Khata Pro अब आपके iPhone पर बिना इंटरनेट के भी सुपरफास्ट चलेगा!</>
                      ) : (
                        <>Tap <strong className="text-[#10B981]">"Add"</strong> in the top right corner. Daily Khata Pro is now installed on your iOS home screen!</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DESKTOP */}
            {activeTab === 'desktop' && (
              <div className="bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] rounded-xl p-4 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#F8FAFC]">
                    <Laptop className="w-4 h-4 text-[#F59E0B]" />
                    <span>{isHindi ? 'Windows PC / Mac / Chrome / Edge' : 'Windows PC / Mac (Chrome & Edge)'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/15 px-2 py-0.5 rounded-full border border-[#F59E0B]/30">Desktop PWA</span>
                </div>
                <div className="space-y-2 text-[12.5px] text-[#94A3B8]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-primary,#38BDF8)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      {isHindi ? (
                        <>ब्राउज़र के एड्रेस बार (URL bar) के दाएं तरफ <strong className="text-[#F8FAFC]">Install Icon (⤓)</strong> देखें या ऊपर दिए गए बटन को दबाएं।</>
                      ) : (
                        <>Look for the <strong className="text-[#F8FAFC]">Install Icon (⤓)</strong> on the right side of the address bar or click the install button above.</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[var(--theme-surface,#0E1A29)] border border-[#10B981] text-[#10B981] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      {isHindi ? (
                        <><strong className="text-[#10B981]">"Install"</strong> पर क्लिक करें। यह आपके कंप्यूटर पर एक अलग नेटिव डेस्कटॉप ऐप की तरह खुल जाएगा!</>
                      ) : (
                        <>Click <strong className="text-[#10B981]">"Install"</strong>. Daily Khata Pro will now run as a standalone desktop app with its own taskbar shortcut!</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#94A3B8]">
              {isHindi ? 'Daily Khata Pro की मुख्य विशेषताएं:' : 'Daily Khata Pro Key Features & Benefits:'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#10B981]/20 text-[#10B981] shrink-0 mt-0.5">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[12.5px] text-[#F8FAFC]">
                    {isHindi ? '100% ऑफलाइन चलता है' : '100% Offline Ready'}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {isHindi ? 'इंटरनेट कटे होने पर भी हिसाब जोड़ें और देखें' : 'Add & view income/expenses without active internet'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[var(--theme-primary,#38BDF8)]/20 text-[var(--theme-primary,#38BDF8)] shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[12.5px] text-[#F8FAFC]">
                    {isHindi ? 'सुपरफास्ट स्पीड' : 'Instant Launch'}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {isHindi ? 'सीधे फुलस्क्रीन ऐप की तरह खुलता है' : 'Opens immediately from home screen in fullscreen'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[12.5px] text-[#F8FAFC]">
                    {isHindi ? 'सुरक्षित और प्राइवेट' : '100% Private Local Storage'}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {isHindi ? 'आपका वित्तीय डेटा केवल आपके डिवाइस में सुरक्षित रहता है' : 'All accounts stay safely on your local device only'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#A855F7]/20 text-[#A855F7] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[12.5px] text-[#F8FAFC]">
                    {isHindi ? '6-फंड सिस्टम और पूर्ण गोपनीयता' : '6-Fund Rule & 100% Privacy'}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {isHindi ? 'बिना किसी शुल्क या रुकावट के पूरा खाता बही' : 'Automated 55/10/10/10/10/5 money allocation'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>{isHindi ? 'PWA सर्विस वर्कर एक्टिव' : 'PWA Service Worker Active'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] hover:bg-[var(--theme-border,#213E61)] text-[#F8FAFC] font-bold text-[12px] cursor-pointer transition-colors"
          >
            {isHindi ? 'ठीक है (Done)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
