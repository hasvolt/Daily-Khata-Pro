import React, { useState, useEffect, useMemo } from 'react';
import {
  Invoice,
  InvoiceItem,
  InvoiceBusinessProfile,
  InvoiceStatus,
  AppLanguage,
  Entry,
  FundType,
  FundConfig
} from '../types';
import {
  ArrowLeft,
  FileText,
  Printer,
  History,
  Settings,
  Plus,
  Share2,
  CheckCircle2,
  ArrowUpRight,
  Download,
  Copy,
  Building,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import { triggerHapticSound, triggerCelebration } from '../utils/khataCalculations';
import {
  loadInvoicesFromStorage,
  saveInvoicesToStorage,
  loadBusinessProfileFromStorage,
  saveBusinessProfileToStorage,
  getNextInvoiceNumber,
  calculateInvoiceTotals,
  generateUpiQrCode,
  calculateDueDateFromTerms
} from '../utils/invoiceCalculations';
import { InvoiceEditorView } from './invoice/InvoiceEditorView';
import { InvoicePrintView } from './invoice/InvoicePrintView';
import { InvoiceHistoryView } from './invoice/InvoiceHistoryView';

export type InvoiceTab = 'editor' | 'preview' | 'history' | 'profile';

interface InvoiceGeneratorPageProps {
  onBack: () => void;
  onRecordIncomeToKhata?: (entry: Omit<Entry, 'id' | 'createdAt'>) => void;
  language?: AppLanguage;
  funds?: FundConfig[];
}

export const InvoiceGeneratorPage: React.FC<InvoiceGeneratorPageProps> = ({
  onBack,
  onRecordIncomeToKhata,
  language = 'en',
  funds = []
}) => {
  const isHindi = language === 'hi';
  const [activeTab, setActiveTab] = useState<InvoiceTab>('editor');
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadInvoicesFromStorage());
  const [businessProfile, setBusinessProfile] = useState<InvoiceBusinessProfile>(() =>
    loadBusinessProfileFromStorage()
  );

  // Active working invoice
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(() => {
    const today = new Date().toISOString().split('T')[0];
    const initialDue = calculateDueDateFromTerms(today, 'net15');
    const existing = loadInvoicesFromStorage();
    const nextNum = getNextInvoiceNumber(existing);
    const profile = loadBusinessProfileFromStorage();

    const initialItem: InvoiceItem = {
      id: 'item_' + Date.now(),
      description: '',
      hsnSac: '',
      quantity: 1,
      unit: 'Pcs',
      rate: 0,
      discountType: 'percent',
      discountValue: 0,
      taxRate: 0,
      taxableAmount: 0,
      taxAmount: 0,
      totalAmount: 0
    };

    const totals = calculateInvoiceTotals([initialItem], 'percent', 0, 'cgst_sgst', 0, true, profile.defaultCurrencyCode || 'INR');

    return {
      id: 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      invoiceNumber: nextNum,
      invoiceDate: today,
      dueDate: initialDue,
      paymentTerms: 'net15',
      status: 'unpaid',
      sender: profile,
      client: {
        clientName: '',
        companyName: '',
        billingAddress: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        phone: '',
        email: ''
      },
      items: totals.items,
      subtotal: totals.subtotal,
      itemDiscountTotal: totals.itemDiscountTotal,
      extraDiscountType: 'percent',
      extraDiscountValue: 0,
      extraDiscountTotal: totals.extraDiscountTotal,
      totalDiscount: totals.totalDiscount,
      taxType: 'cgst_sgst',
      taxTotal: totals.taxTotal,
      cgst: totals.cgst,
      sgst: totals.sgst,
      igst: totals.igst,
      shippingCharges: 0,
      roundOff: totals.roundOff,
      grandTotal: totals.grandTotal,
      amountInWords: totals.amountInWords,
      currency: profile.defaultCurrency || '₹',
      currencyCode: profile.defaultCurrencyCode || 'INR',
      templateTheme: 'modern',
      notes: profile.defaultNotes || '',
      terms: profile.defaultTerms || '',
      bankDetails: {
        bankName: profile.bankName || '',
        accountName: profile.accountName || '',
        accountNumber: profile.accountNumber || '',
        ifscCode: profile.ifscCode || '',
        branchName: profile.branchName || ''
      },
      upiDetails: {
        upiId: (profile.upiId === 'Hasvolt@upi' || profile.upiId === '7827817295@upi') ? '' : (profile.upiId || ''),
        payeeName: profile.businessName || ''
      },
      acceptedMethods: ['upi', 'bank', 'cash'],
      signatureType: profile.signatureType || 'text',
      signatureText: profile.signatureText || 'Authorized Signatory',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  });

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Recalculate totals automatically whenever items, discounts, taxes, or shipping changes
  const handleInvoiceChange = (updated: Invoice) => {
    const totals = calculateInvoiceTotals(
      updated.items,
      updated.extraDiscountType,
      updated.extraDiscountValue,
      updated.taxType,
      updated.shippingCharges,
      true,
      updated.currencyCode
    );

    setCurrentInvoice({
      ...updated,
      items: totals.items,
      subtotal: totals.subtotal,
      itemDiscountTotal: totals.itemDiscountTotal,
      extraDiscountTotal: totals.extraDiscountTotal,
      totalDiscount: totals.totalDiscount,
      taxTotal: totals.taxTotal,
      cgst: totals.cgst,
      sgst: totals.sgst,
      igst: totals.igst,
      roundOff: totals.roundOff,
      grandTotal: totals.grandTotal,
      amountInWords: totals.amountInWords,
      updatedAt: Date.now()
    });
  };

  // Generate UPI QR code on invoice change
  useEffect(() => {
    let isCancelled = false;
    const upiId = currentInvoice.upiDetails?.upiId || currentInvoice.sender.upiId;
    if (upiId && currentInvoice.grandTotal > 0) {
      generateUpiQrCode(
        upiId,
        currentInvoice.sender.businessName,
        currentInvoice.grandTotal,
        currentInvoice.invoiceNumber
      ).then((url) => {
        if (!isCancelled) setQrCodeDataUrl(url);
      });
    } else {
      setQrCodeDataUrl('');
    }
    return () => {
      isCancelled = true;
    };
  }, [
    currentInvoice.upiDetails?.upiId,
    currentInvoice.sender.upiId,
    currentInvoice.sender.businessName,
    currentInvoice.grandTotal,
    currentInvoice.invoiceNumber
  ]);

  // Save current invoice
  const handleSaveInvoice = () => {
    const existingIndex = invoices.findIndex((inv) => inv.id === currentInvoice.id);
    let updatedList: Invoice[];

    if (existingIndex >= 0) {
      updatedList = invoices.map((inv) => (inv.id === currentInvoice.id ? currentInvoice : inv));
    } else {
      updatedList = [currentInvoice, ...invoices];
    }

    setInvoices(updatedList);
    saveInvoicesToStorage(updatedList);
    triggerCelebration();
    showToast(isHindi ? 'इनवॉइस सफलतापूर्वक सुरक्षित कर लिया गया!' : 'Invoice saved successfully!');
  };

  // Create new blank invoice
  const handleCreateNew = () => {
    const today = new Date().toISOString().split('T')[0];
    const initialDue = calculateDueDateFromTerms(today, 'net15');
    const nextNum = getNextInvoiceNumber(invoices);

    const emptyItem: InvoiceItem = {
      id: 'item_' + Date.now(),
      description: '',
      hsnSac: '',
      quantity: 1,
      unit: 'Pcs',
      rate: 0,
      discountType: 'percent',
      discountValue: 0,
      taxRate: 0,
      taxableAmount: 0,
      taxAmount: 0,
      totalAmount: 0
    };

    const newInv: Invoice = {
      id: 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      invoiceNumber: nextNum,
      invoiceDate: today,
      dueDate: initialDue,
      paymentTerms: 'net15',
      status: 'unpaid',
      sender: businessProfile,
      client: {
        clientName: '',
        companyName: '',
        billingAddress: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        phone: '',
        email: ''
      },
      items: [emptyItem],
      subtotal: 0,
      itemDiscountTotal: 0,
      extraDiscountType: 'percent',
      extraDiscountValue: 0,
      extraDiscountTotal: 0,
      totalDiscount: 0,
      taxType: 'cgst_sgst',
      taxTotal: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      shippingCharges: 0,
      roundOff: 0,
      grandTotal: 0,
      amountInWords: 'Zero Only',
      currency: businessProfile.defaultCurrency || '₹',
      currencyCode: businessProfile.defaultCurrencyCode || 'INR',
      templateTheme: 'modern',
      notes: businessProfile.defaultNotes || '',
      terms: businessProfile.defaultTerms || '',
      bankDetails: {
        bankName: businessProfile.bankName || '',
        accountName: businessProfile.accountName || '',
        accountNumber: businessProfile.accountNumber || '',
        ifscCode: businessProfile.ifscCode || '',
        branchName: businessProfile.branchName || ''
      },
      upiDetails: {
        upiId: businessProfile.upiId || '',
        payeeName: businessProfile.businessName || ''
      },
      acceptedMethods: ['upi', 'bank', 'cash'],
      signatureType: businessProfile.signatureType || 'text',
      signatureText: businessProfile.signatureText || 'Authorized Signatory',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setCurrentInvoice(newInv);
    setActiveTab('editor');
    showToast(isHindi ? 'नया इनवॉइस तैयार है' : 'New blank invoice created');
  };

  // Duplicate invoice
  const handleDuplicateInvoice = (invoiceToDuplicate: Invoice) => {
    const nextNum = getNextInvoiceNumber(invoices);
    const duplicated: Invoice = {
      ...invoiceToDuplicate,
      id: 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      invoiceNumber: nextNum,
      status: 'draft',
      isRecordedInKhata: false,
      recordedKhataEntryId: undefined,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const updated = [duplicated, ...invoices];
    setInvoices(updated);
    saveInvoicesToStorage(updated);
    setCurrentInvoice(duplicated);
    setActiveTab('editor');
    showToast(isHindi ? `इनवॉइस डुप्लिकेट किया गया (${nextNum})` : `Invoice duplicated as ${nextNum}`);
  };

  // Delete invoice
  const handleDeleteInvoice = (id: string) => {
    const updated = invoices.filter((i) => i.id !== id);
    setInvoices(updated);
    saveInvoicesToStorage(updated);
    showToast(isHindi ? 'इनवॉइस हटा दिया गया' : 'Invoice deleted');
  };

  // Update status
  const handleUpdateStatus = (id: string, newStatus: InvoiceStatus) => {
    const updated = invoices.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv));
    setInvoices(updated);
    saveInvoicesToStorage(updated);
    if (currentInvoice.id === id) {
      setCurrentInvoice({ ...currentInvoice, status: newStatus });
    }
    showToast(`Status updated to ${newStatus}`);
  };

  // Save Default Profile
  const handleSaveAsDefaultProfile = (profile: InvoiceBusinessProfile) => {
    setBusinessProfile(profile);
    saveBusinessProfileToStorage(profile);
    showToast(isHindi ? 'डिफ़ॉल्ट व्यापार प्रोफ़ाइल सुरक्षित!' : 'Default business profile saved!');
  };

  // Record to Khata as Income
  const handleRecordToKhata = (inv: Invoice) => {
    if (!onRecordIncomeToKhata) {
      alert(isHindi ? 'खाता रिकॉर्डिंग उपलब्ध नहीं है' : 'Khata recording handler not connected');
      return;
    }

    const defaultFundId = funds[0]?.id || 'business';
    const entryData: Omit<Entry, 'id' | 'createdAt'> = {
      type: 'income',
      amount: inv.grandTotal,
      source: `Invoice ${inv.invoiceNumber} - ${inv.client.clientName || 'Client'}`,
      date: inv.invoiceDate || new Date().toISOString().split('T')[0],
      paymentMode: 'upi',
      fund: defaultFundId,
      note: `Payment for Invoice #${inv.invoiceNumber}. Total items: ${inv.items.length}. Tax: ${inv.taxTotal.toFixed(2)}.`
    };

    onRecordIncomeToKhata(entryData);

    // Update invoice record status
    const updated = invoices.map((i) =>
      i.id === inv.id ? { ...i, status: 'paid' as InvoiceStatus, isRecordedInKhata: true } : i
    );
    setInvoices(updated);
    saveInvoicesToStorage(updated);
    if (currentInvoice.id === inv.id) {
      setCurrentInvoice({ ...currentInvoice, status: 'paid', isRecordedInKhata: true });
    }

    triggerCelebration();
    showToast(
      isHindi
        ? `₹${inv.grandTotal.toLocaleString('en-IN')} का भुगतान डेली खाता आय में दर्ज कर दिया गया!`
        : `₹${inv.grandTotal.toLocaleString('en-IN')} recorded as income in Daily Khata!`
    );
  };

  // Print Invoice (clean window print with automatic PDF title)
  const handlePrint = () => {
    triggerHapticSound('click');
    if (activeTab !== 'preview') {
      setActiveTab('preview');
    }
    const oldTitle = document.title;
    const sanitizedNumber = (currentInvoice.invoiceNumber || 'INV').replace(/[^a-zA-Z0-9_-]/g, '_');
    document.title = `Invoice_${sanitizedNumber}_Rozfiber`;

    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.error('Print trigger failed', e);
      }
      setTimeout(() => {
        document.title = oldTitle;
      }, 1500);
    }, 150);
  };

  // Download standalone printable HTML invoice
  const handleDownloadHTML = () => {
    triggerHapticSound('click');
    const sheetEl = document.getElementById('invoice-printable-sheet');
    const content = sheetEl ? sheetEl.outerHTML : '';
    const htmlDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${currentInvoice.invoiceNumber} - Rozfiber</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: A4 portrait; margin: 8mm 10mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 12px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div style="max-width: 850px; margin: 0 auto;">
    ${content}
  </div>
</body>
</html>`;
    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${(currentInvoice.invoiceNumber || 'INV').replace(/[^a-zA-Z0-9_-]/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(isHindi ? 'HTML इनवॉइस डाउनलोड हो गया!' : 'Invoice HTML downloaded!');
  };

  // Share invoice summary / Web Share
  const handleShare = async () => {
    triggerHapticSound('click');
    const shareText = `*INVOICE: ${currentInvoice.invoiceNumber}*\nFrom: ${currentInvoice.sender.businessName}\nTo: ${currentInvoice.client.clientName || 'Client'}\nTotal: ${currentInvoice.currency} ${currentInvoice.grandTotal.toLocaleString('en-IN')}\nDue Date: ${currentInvoice.dueDate || 'On Receipt'}\n\nGenerated with Daily Khata Pro (rozfiber.com)`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${currentInvoice.invoiceNumber}`,
          text: shareText
        });
        showToast('Shared successfully!');
      } catch (e) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        showToast('Summary copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      showToast('Invoice summary copied to clipboard!');
    }
  };

  return (
    <div className="invoice-page-container min-h-screen bg-[var(--theme-bg,#07101C)] text-[var(--theme-text,#F8FAFC)] pb-24 print:bg-white print:text-slate-900 print:min-h-0 print:p-0 print:m-0 touch-pan-y overscroll-y-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-500 text-[#040D17] font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="sticky top-14 sm:top-16 z-30 bg-[var(--theme-card,#132438)]/95 backdrop-blur-md border-b border-[var(--theme-border,#213E61)] px-4 py-3 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                onBack();
              }}
              className="p-2 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-[var(--theme-text,#F8FAFC)] flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-[var(--theme-primary,#38BDF8)] shrink-0" />
                <span>{isHindi ? 'इनवॉइस / बिल जनरेटर' : 'Invoice & Bill Generator'}</span>
                <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-primary,#38BDF8)]/15 text-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)]/30">
                  Pro Free
                </span>
              </h1>
              <p className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] truncate">
                {isHindi
                  ? 'दुकान, फ्रीलांसिंग व व्यापार के लिए प्रोफेशनल बिल बनाएं'
                  : 'Universal multi-purpose GST bill & invoice creator with QR code'}
              </p>
            </div>
          </div>

          {/* Navigation Tab Buttons */}
          <div className="flex items-center gap-1 bg-[var(--theme-surface,#0E1A29)] p-1 rounded-xl border border-[var(--theme-border,#213E61)]">
            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                setActiveTab('editor');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] shadow-xs'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
              }`}
            >
              {isHindi ? 'एडिट करें' : 'Editor'}
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                setActiveTab('preview');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] shadow-xs'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
              }`}
            >
              {isHindi ? 'प्रीव्यू / प्रिंट' : 'Preview'}
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHapticSound('click');
                setActiveTab('history');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'history'
                  ? 'bg-[var(--theme-primary,#38BDF8)] text-[#040D17] shadow-xs'
                  : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isHindi ? 'इतिहास' : 'History'}</span>
              <span className="text-[10px] px-1.5 rounded-full bg-[var(--theme-card,#132438)] font-mono">
                {invoices.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-6xl mx-auto px-4 pt-5">
        {activeTab === 'editor' && (
          <InvoiceEditorView
            invoice={currentInvoice}
            onChange={handleInvoiceChange}
            onSave={handleSaveInvoice}
            onPreview={() => {
              handleSaveInvoice();
              setActiveTab('preview');
            }}
            onSaveAsDefaultProfile={handleSaveAsDefaultProfile}
            language={language}
          />
        )}

        {activeTab === 'preview' && (
          <div className="space-y-4">
            {/* Preview Toolbar */}
            <div className="p-3.5 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHapticSound('click');
                    setActiveTab('editor');
                  }}
                  className="py-1.5 px-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] hover:bg-[var(--theme-border,#213E61)] transition-colors cursor-pointer"
                >
                  ← {isHindi ? 'एडिट मोड' : 'Edit Details'}
                </button>
                <span className="font-mono text-xs font-bold text-[var(--theme-primary,#38BDF8)]">
                  {currentInvoice.invoiceNumber}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-1.5 px-3.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] text-[#040D17] text-xs font-bold flex items-center gap-1.5 shadow-sm hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'प्रिंट या PDF सेव करें' : 'Print / Save PDF'}</span>
                </button>

                {/* Download HTML Button */}
                <button
                  type="button"
                  onClick={handleDownloadHTML}
                  className="py-1.5 px-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5 hover:text-white cursor-pointer"
                  title="Download standalone printable HTML file"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xs:inline">{isHindi ? 'HTML डाउनलोड' : 'Download HTML'}</span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="py-1.5 px-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5 hover:text-white cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isHindi ? 'शेयर करें' : 'Share'}</span>
                </button>

                {/* Record to Khata Income */}
                {!currentInvoice.isRecordedInKhata ? (
                  <button
                    type="button"
                    onClick={() => handleRecordToKhata(currentInvoice)}
                    className="py-1.5 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/25 transition-all cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'खाता में आय दर्ज करें' : 'Record in Khata'}</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <Check className="w-3.5 h-3.5" /> {isHindi ? 'खाता में दर्ज' : 'Recorded in Khata'}
                  </span>
                )}
              </div>
            </div>

            {/* A4 Sheet Component */}
            <div className="overflow-x-auto touch-pan-y overscroll-x-contain py-2 print:overflow-visible print:p-0 print:m-0">
              <InvoicePrintView
                invoice={currentInvoice}
                qrDataUrl={qrCodeDataUrl}
                isHindi={isHindi}
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <InvoiceHistoryView
            invoices={invoices}
            onSelectInvoice={(inv) => {
              setCurrentInvoice(inv);
              setActiveTab('preview');
            }}
            onEditInvoice={(inv) => {
              setCurrentInvoice(inv);
              setActiveTab('editor');
            }}
            onDuplicateInvoice={handleDuplicateInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onUpdateStatus={handleUpdateStatus}
            onRecordToKhata={handleRecordToKhata}
            onCreateNew={handleCreateNew}
            language={language}
          />
        )}
      </div>
    </div>
  );
};
