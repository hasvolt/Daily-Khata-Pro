import React, { useState } from 'react';
import {
  Invoice,
  InvoiceItem,
  InvoiceBusinessProfile,
  InvoiceClientInfo,
  InvoiceTaxType,
  InvoicePaymentTerms,
  InvoiceStatus,
  InvoiceTemplateTheme,
  AppLanguage
} from '../../types';
import {
  Plus,
  Trash2,
  Copy,
  Upload,
  Image as ImageIcon,
  Building,
  User,
  Calendar,
  CreditCard,
  Percent,
  FileText,
  DollarSign,
  QrCode,
  Save,
  Eye,
  Check,
  ChevronDown,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  CURRENCY_OPTIONS,
  COMMON_UNITS,
  COMMON_GST_RATES,
  PAYMENT_TERMS_LABELS,
  calculateDueDateFromTerms
} from '../../utils/invoiceCalculations';
import { triggerHapticSound } from '../../utils/khataCalculations';

interface InvoiceEditorViewProps {
  invoice: Invoice;
  onChange: (updated: Invoice) => void;
  onSave: () => void;
  onPreview: () => void;
  onSaveAsDefaultProfile: (profile: InvoiceBusinessProfile) => void;
  language?: AppLanguage;
}

export const InvoiceEditorView: React.FC<InvoiceEditorViewProps> = ({
  invoice,
  onChange,
  onSave,
  onPreview,
  onSaveAsDefaultProfile,
  language = 'en'
}) => {
  const isHindi = language === 'hi';
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Field change helpers
  const updateSender = (field: keyof InvoiceBusinessProfile, value: any) => {
    onChange({
      ...invoice,
      sender: {
        ...invoice.sender,
        [field]: value
      }
    });
  };

  const updateClient = (field: keyof InvoiceClientInfo, value: any) => {
    onChange({
      ...invoice,
      client: {
        ...invoice.client,
        [field]: value
      }
    });
  };

  const updateMeta = (field: keyof Invoice, value: any) => {
    let updated = { ...invoice, [field]: value };
    if (field === 'paymentTerms' && value !== 'custom') {
      const calculatedDue = calculateDueDateFromTerms(invoice.invoiceDate, value as InvoicePaymentTerms);
      updated.dueDate = calculatedDue;
    }
    onChange(updated);
  };

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(isHindi ? 'कृपया 2MB से कम साइज का लोगो अपलोड करें' : 'Please upload an image smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateSender('logoUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Signature upload handler
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({
          ...invoice,
          signatureType: 'upload',
          signatureData: reader.result
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Line Item Handlers
  const handleAddItem = () => {
    triggerHapticSound('click');
    const newItem: InvoiceItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      description: '',
      hsnSac: '',
      quantity: 1,
      unit: 'Pcs',
      rate: 0,
      discountType: 'percent',
      discountValue: 0,
      taxRate: invoice.taxType === 'none' ? 0 : 18,
      taxableAmount: 0,
      taxAmount: 0,
      totalAmount: 0
    };
    onChange({
      ...invoice,
      items: [...invoice.items, newItem]
    });
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoice.items.map((it) => {
      if (it.id === id) {
        return { ...it, [field]: value };
      }
      return it;
    });
    onChange({
      ...invoice,
      items: updatedItems
    });
  };

  const handleDuplicateItem = (item: InvoiceItem) => {
    triggerHapticSound('click');
    const duplicated: InvoiceItem = {
      ...item,
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
    };
    onChange({
      ...invoice,
      items: [...invoice.items, duplicated]
    });
  };

  const handleRemoveItem = (id: string) => {
    triggerHapticSound('click');
    if (invoice.items.length <= 1) {
      // Keep at least 1 item
      return;
    }
    onChange({
      ...invoice,
      items: invoice.items.filter((it) => it.id !== id)
    });
  };

  const handleSaveProfileClick = () => {
    triggerHapticSound('click');
    onSaveAsDefaultProfile(invoice.sender);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* 1. TOP CONTROLS & TEMPLATE / STATUS SELECTOR */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)]">
              Status:
            </span>
            <select
              value={invoice.status}
              onChange={(e) => updateMeta('status', e.target.value as InvoiceStatus)}
              className="py-1 px-2.5 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none capitalize"
            >
              <option value="draft">Draft</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Currency selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)]">
              Currency:
            </span>
            <select
              value={invoice.currencyCode}
              onChange={(e) => {
                const opt = CURRENCY_OPTIONS.find((c) => c.code === e.target.value);
                if (opt) {
                  onChange({
                    ...invoice,
                    currencyCode: opt.code,
                    currency: opt.symbol
                  });
                }
              }}
              className="py-1 px-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none"
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Template */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[var(--theme-text-dim,#94A3B8)]">
              Template:
            </span>
            <select
              value={invoice.templateTheme}
              onChange={(e) => updateMeta('templateTheme', e.target.value as InvoiceTemplateTheme)}
              className="py-1 px-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none capitalize"
            >
              <option value="modern">Modern Clean</option>
              <option value="corporate">Professional Corporate</option>
              <option value="minimal">Minimalist</option>
              <option value="retail">Tax / Retail Invoice</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHapticSound('click');
              onPreview();
            }}
            className="py-1.5 px-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[var(--theme-primary,#38BDF8)]" />
            <span>{isHindi ? 'प्रीव्यू व प्रिंट' : 'Preview & Print'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHapticSound('click');
              onSave();
            }}
            className="py-1.5 px-3.5 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all"
          >
            <Save className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isHindi ? 'इनवॉइस सेव करें' : 'Save Invoice'}</span>
          </button>
        </div>
      </div>

      {/* 2. SENDER (BUSINESS) & CLIENT (BUYER) INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Business / Sender Card */}
        <div className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--theme-border,#213E61)]/70 pb-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
              <h3 className="text-xs sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? '1. आपकी दुकान / व्यवसाय की जानकारी' : '1. Your Business Info (Sender)'}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleSaveProfileClick}
              className="text-[10px] font-bold text-[var(--theme-primary,#38BDF8)] hover:underline flex items-center gap-1"
            >
              {profileSavedToast ? (
                <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> Saved!
                </span>
              ) : (
                <span>Save as Default</span>
              )}
            </button>
          </div>

          <div className="flex items-start gap-3">
            {/* Logo upload thumbnail */}
            <div className="relative group shrink-0">
              {invoice.sender.logoUrl ? (
                <div className="relative">
                  <img
                    src={invoice.sender.logoUrl}
                    alt="Logo"
                    className="w-16 h-16 object-contain rounded-xl border border-[var(--theme-border,#213E61)] bg-white p-1"
                  />
                  <button
                    type="button"
                    onClick={() => updateSender('logoUrl', '')}
                    className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-rose-600 text-white text-[9px] shadow-sm"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="w-16 h-16 rounded-xl border border-dashed border-[var(--theme-border,#213E61)] hover:border-[var(--theme-primary,#38BDF8)] bg-[var(--theme-surface,#0E1A29)] flex flex-col items-center justify-center text-[var(--theme-text-dim,#94A3B8)] cursor-pointer group-hover:text-[var(--theme-primary,#38BDF8)] transition-colors">
                  <Upload className="w-4 h-4 mb-0.5" />
                  <span className="text-[8.5px] font-bold leading-tight">Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Business Name & GSTIN */}
            <div className="flex-1 space-y-2 min-w-0">
              <input
                type="text"
                value={invoice.sender.businessName}
                onChange={(e) => updateSender('businessName', e.target.value)}
                placeholder="Business Name / Store Name *"
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
              />
              <input
                type="text"
                value={invoice.sender.gstin || ''}
                onChange={(e) => updateSender('gstin', e.target.value.toUpperCase())}
                placeholder="GSTIN / Tax ID (Optional)"
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)] uppercase"
              />
            </div>
          </div>

          {/* Address */}
          <textarea
            value={invoice.sender.address}
            onChange={(e) => updateSender('address', e.target.value)}
            rows={2}
            placeholder="Street Address, Area, Landmark *"
            className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
          />

          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={invoice.sender.city || ''}
              onChange={(e) => updateSender('city', e.target.value)}
              placeholder="City"
              className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
            <input
              type="text"
              value={invoice.sender.state || ''}
              onChange={(e) => updateSender('state', e.target.value)}
              placeholder="State"
              className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
            <input
              type="text"
              value={invoice.sender.pincode || ''}
              onChange={(e) => updateSender('pincode', e.target.value)}
              placeholder="Pincode"
              className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={invoice.sender.phone || ''}
              onChange={(e) => updateSender('phone', e.target.value)}
              placeholder="Phone Number"
              className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
            <input
              type="email"
              value={invoice.sender.email || ''}
              onChange={(e) => updateSender('email', e.target.value)}
              placeholder="Email Address"
              className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
          </div>
        </div>

        {/* Client / Buyer Card */}
        <div className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--theme-border,#213E61)]/70 pb-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? '2. ग्राहक की जानकारी (Buyer / Client)' : '2. Client / Buyer Info (Bill To)'}
              </h3>
            </div>
            <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={!!invoice.client.hasShippingAddress}
                onChange={(e) => updateClient('hasShippingAddress', e.target.checked)}
                className="rounded"
              />
              <span>Ship to different address</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={invoice.client.clientName}
              onChange={(e) => updateClient('clientName', e.target.value)}
              placeholder="Client / Person Name *"
              className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none focus:border-emerald-400"
            />
            <input
              type="text"
              value={invoice.client.companyName || ''}
              onChange={(e) => updateClient('companyName', e.target.value)}
              placeholder="Company Name (Optional)"
              className="px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
          </div>

          <textarea
            value={invoice.client.billingAddress}
            onChange={(e) => updateClient('billingAddress', e.target.value)}
            rows={2}
            placeholder="Billing Address (Street, City, Pincode) *"
            className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none focus:border-emerald-400"
          />

          {invoice.client.hasShippingAddress && (
            <textarea
              value={invoice.client.shippingAddress || ''}
              onChange={(e) => updateClient('shippingAddress', e.target.value)}
              rows={2}
              placeholder="Shipping Address (Delivery Location)"
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-emerald-500/40 text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
          )}

          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={invoice.client.gstin || ''}
              onChange={(e) => updateClient('gstin', e.target.value.toUpperCase())}
              placeholder="GSTIN (Optional)"
              className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none uppercase"
            />
            <input
              type="text"
              value={invoice.client.phone || ''}
              onChange={(e) => updateClient('phone', e.target.value)}
              placeholder="Phone"
              className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
            <input
              type="email"
              value={invoice.client.email || ''}
              onChange={(e) => updateClient('email', e.target.value)}
              placeholder="Email"
              className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. INVOICE META (NUMBER, DATES, TERMS, PO) */}
      <div className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-[var(--theme-border,#213E61)]/70 pb-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
            {isHindi ? '3. इनवॉइस विवरण (Invoice Meta & Dates)' : '3. Invoice Meta & Terms'}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div>
            <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1">
              Invoice Number *
            </label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => updateMeta('invoiceNumber', e.target.value)}
              placeholder="INV-2026-001"
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-mono font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1">
              Invoice Date *
            </label>
            <input
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) => updateMeta('invoiceDate', e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1">
              Payment Terms
            </label>
            <select
              value={invoice.paymentTerms}
              onChange={(e) => updateMeta('paymentTerms', e.target.value as InvoicePaymentTerms)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none"
            >
              {Object.entries(PAYMENT_TERMS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {isHindi ? v.hi : v.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateMeta('dueDate', e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1">
              PO Number (Optional)
            </label>
            <input
              type="text"
              value={invoice.poNumber || ''}
              onChange={(e) => updateMeta('poNumber', e.target.value)}
              placeholder="e.g. PO-9842"
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. LINE ITEMS TABLE */}
      <div className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--theme-border,#213E61)]/70 pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
              {isHindi ? '4. आइटम / प्रोडक्ट तालिका (Line Items)' : '4. Line Items Table'}
            </h3>
          </div>

          {/* Tax Mode Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)]">
              Tax Mode:
            </span>
            <select
              value={invoice.taxType}
              onChange={(e) => updateMeta('taxType', e.target.value as InvoiceTaxType)}
              className="py-1 px-2 rounded-lg bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none"
            >
              <option value="cgst_sgst">GST Intra-State (CGST + SGST)</option>
              <option value="igst">GST Inter-State (IGST)</option>
              <option value="single">Single Tax / VAT</option>
              <option value="none">No Tax (Non-GST)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="space-y-2.5">
          {invoice.items.map((item, idx) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2"
            >
              {/* Top Row: Description & Actions */}
              <div className="flex items-center gap-2">
                <span className="w-6 text-center font-mono text-xs font-bold text-[var(--theme-text-dim,#94A3B8)] shrink-0">
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                  placeholder="Item Name / Description / Service *"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs font-semibold text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none focus:border-[var(--theme-primary,#38BDF8)]"
                />
                <input
                  type="text"
                  value={item.hsnSac || ''}
                  onChange={(e) => handleUpdateItem(item.id, 'hsnSac', e.target.value)}
                  placeholder="HSN/SAC"
                  className="w-24 sm:w-28 px-2 py-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none text-center"
                />
                <button
                  type="button"
                  onClick={() => handleDuplicateItem(item)}
                  title="Duplicate Row"
                  className="p-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Delete Row"
                  disabled={invoice.items.length <= 1}
                  className="p-1.5 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text-dim,#94A3B8)] hover:text-rose-400 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Row: Qty, Unit, Rate, Discount, Tax, Total Amount */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 pl-8">
                <div>
                  <label className="text-[9px] font-bold text-[var(--theme-text-dim,#94A3B8)] block">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs font-mono font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none text-right"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-[var(--theme-text-dim,#94A3B8)] block">
                    Unit
                  </label>
                  <select
                    value={item.unit}
                    onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                    className="w-full px-1.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                  >
                    {COMMON_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-[var(--theme-text-dim,#94A3B8)] block">
                    Rate ({invoice.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.rate === 0 ? '' : item.rate}
                    onChange={(e) => handleUpdateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs font-mono font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none text-right"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-bold text-[var(--theme-text-dim,#94A3B8)]">
                      Discount
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateItem(
                          item.id,
                          'discountType',
                          item.discountType === 'percent' ? 'flat' : 'percent'
                        )
                      }
                      className="text-[9px] font-bold text-[var(--theme-primary,#38BDF8)]"
                    >
                      {item.discountType === 'percent' ? '%' : invoice.currency}
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.discountValue === 0 ? '' : item.discountValue}
                    onChange={(e) => handleUpdateItem(item.id, 'discountValue', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-2 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-[var(--theme-text,#F8FAFC)] focus:outline-none text-right"
                  />
                </div>

                {invoice.taxType !== 'none' ? (
                  <div>
                    <label className="text-[9px] font-bold text-[var(--theme-text-dim,#94A3B8)] block">
                      Tax Rate (%)
                    </label>
                    <select
                      value={item.taxRate}
                      onChange={(e) => handleUpdateItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-1.5 py-1 rounded-lg bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-[var(--theme-text,#F8FAFC)] focus:outline-none"
                    >
                      {COMMON_GST_RATES.map((r) => (
                        <option key={r} value={r}>
                          {r}%
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div />
                )}

                <div>
                  <label className="text-[9px] font-bold text-[var(--theme-text-dim,#94A3B8)] block text-right">
                    Line Total
                  </label>
                  <div className="py-1 text-right font-mono font-bold text-xs text-[var(--theme-text,#F8FAFC)]">
                    {invoice.currency} {item.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Row Button */}
        <button
          type="button"
          onClick={handleAddItem}
          className="w-full py-2.5 rounded-xl border border-dashed border-[var(--theme-primary,#38BDF8)]/40 hover:border-[var(--theme-primary,#38BDF8)] bg-[var(--theme-primary,#38BDF8)]/5 hover:bg-[var(--theme-primary,#38BDF8)]/10 text-[var(--theme-primary,#38BDF8)] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{isHindi ? '+ नया आइटम जोड़ें (Add Item Row)' : '+ Add Another Item'}</span>
        </button>
      </div>

      {/* 5. EXTRA CHARGES & SUMMARY CALCULATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Extra discount & Shipping */}
        <div className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[var(--theme-border,#213E61)]/70 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
              {isHindi ? '5. अतिरिक्त छूट व शिपिंग' : '5. Additional Discounts & Charges'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)]">
                  Overall Discount
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateMeta(
                      'extraDiscountType',
                      invoice.extraDiscountType === 'percent' ? 'flat' : 'percent'
                    )
                  }
                  className="text-[10px] font-bold text-[var(--theme-primary,#38BDF8)]"
                >
                  {invoice.extraDiscountType === 'percent' ? '%' : invoice.currency}
                </button>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={invoice.extraDiscountValue === 0 ? '' : invoice.extraDiscountValue}
                onChange={(e) => updateMeta('extraDiscountValue', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-[var(--theme-text,#F8FAFC)] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1">
                Shipping / Delivery ({invoice.currency})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={invoice.shippingCharges === 0 ? '' : invoice.shippingCharges}
                onChange={(e) => updateMeta('shippingCharges', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-[var(--theme-text,#F8FAFC)] focus:outline-none"
              />
            </div>
          </div>

          {/* Amount In Words live preview */}
          <div className="p-2.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs space-y-0.5">
            <span className="text-[9.5px] font-bold text-[var(--theme-text-dim,#94A3B8)] uppercase tracking-wider block">
              Amount In Words (Auto):
            </span>
            <p className="font-semibold text-emerald-400 italic">
              {invoice.amountInWords}
            </p>
          </div>
        </div>

        {/* Live Calculation Summary */}
        <div className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs space-y-2 text-xs">
          <div className="flex items-center gap-2 border-b border-[var(--theme-border,#213E61)]/70 pb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
              {isHindi ? 'गणना सारांश (Calculation Breakdown)' : 'Calculation Breakdown'}
            </h3>
          </div>

          <div className="flex justify-between py-1 border-b border-[var(--theme-border,#213E61)]/40 text-[var(--theme-text-dim,#94A3B8)]">
            <span>Subtotal:</span>
            <span className="font-mono text-[var(--theme-text,#F8FAFC)] font-semibold">
              {invoice.currency} {invoice.subtotal.toFixed(2)}
            </span>
          </div>

          {invoice.totalDiscount > 0 && (
            <div className="flex justify-between py-1 border-b border-[var(--theme-border,#213E61)]/40 text-emerald-400">
              <span>Total Discount:</span>
              <span className="font-mono font-semibold">
                - {invoice.currency} {invoice.totalDiscount.toFixed(2)}
              </span>
            </div>
          )}

          {invoice.taxType === 'cgst_sgst' && invoice.taxTotal > 0 && (
            <>
              <div className="flex justify-between py-1 border-b border-[var(--theme-border,#213E61)]/40 text-[var(--theme-text-dim,#94A3B8)]">
                <span>CGST:</span>
                <span className="font-mono text-[var(--theme-text,#F8FAFC)]">
                  {invoice.currency} {invoice.cgst.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--theme-border,#213E61)]/40 text-[var(--theme-text-dim,#94A3B8)]">
                <span>SGST:</span>
                <span className="font-mono text-[var(--theme-text,#F8FAFC)]">
                  {invoice.currency} {invoice.sgst.toFixed(2)}
                </span>
              </div>
            </>
          )}

          {invoice.taxType === 'igst' && invoice.taxTotal > 0 && (
            <div className="flex justify-between py-1 border-b border-[var(--theme-border,#213E61)]/40 text-[var(--theme-text-dim,#94A3B8)]">
              <span>IGST:</span>
              <span className="font-mono text-[var(--theme-text,#F8FAFC)]">
                {invoice.currency} {invoice.igst.toFixed(2)}
              </span>
            </div>
          )}

          {invoice.taxType === 'single' && invoice.taxTotal > 0 && (
            <div className="flex justify-between py-1 border-b border-[var(--theme-border,#213E61)]/40 text-[var(--theme-text-dim,#94A3B8)]">
              <span>Tax (VAT):</span>
              <span className="font-mono text-[var(--theme-text,#F8FAFC)]">
                {invoice.currency} {invoice.taxTotal.toFixed(2)}
              </span>
            </div>
          )}

          {invoice.shippingCharges > 0 && (
            <div className="flex justify-between py-1 border-b border-[var(--theme-border,#213E61)]/40 text-[var(--theme-text-dim,#94A3B8)]">
              <span>Shipping:</span>
              <span className="font-mono text-[var(--theme-text,#F8FAFC)]">
                {invoice.currency} {invoice.shippingCharges.toFixed(2)}
              </span>
            </div>
          )}

          {invoice.roundOff !== 0 && (
            <div className="flex justify-between py-1 border-b border-[var(--theme-border,#213E61)]/40 text-[var(--theme-text-dim,#94A3B8)]">
              <span>Round Off:</span>
              <span className="font-mono text-[var(--theme-text,#F8FAFC)]">
                {invoice.roundOff > 0 ? `+${invoice.roundOff}` : invoice.roundOff}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-primary,#38BDF8)]/40 font-bold text-sm">
            <span className="text-[var(--theme-text,#F8FAFC)]">Grand Total:</span>
            <span className="font-mono text-base text-[var(--theme-primary,#38BDF8)]">
              {invoice.currency} {invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 6. PAYMENT INFO (BANK & UPI QR) */}
      <div className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-[var(--theme-border,#213E61)]/70 pb-2">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)]">
            {isHindi ? '6. भुगतान विवरण व UPI QR कोड' : '6. Payment Information & UPI QR Code'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bank Details */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block uppercase tracking-wider">
              Bank Account (Optional)
            </span>
            <input
              type="text"
              value={invoice.bankDetails?.bankName || ''}
              onChange={(e) =>
                onChange({
                  ...invoice,
                  bankDetails: { ...invoice.bankDetails, bankName: e.target.value }
                })
              }
              placeholder="Bank Name (e.g. State Bank of India)"
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={invoice.bankDetails?.accountName || ''}
                onChange={(e) =>
                  onChange({
                    ...invoice,
                    bankDetails: { ...invoice.bankDetails, accountName: e.target.value }
                  })
                }
                placeholder="A/C Holder Name"
                className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
              />
              <input
                type="text"
                value={invoice.bankDetails?.accountNumber || ''}
                onChange={(e) =>
                  onChange({
                    ...invoice,
                    bankDetails: { ...invoice.bankDetails, accountNumber: e.target.value }
                  })
                }
                placeholder="A/C Number"
                className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={invoice.bankDetails?.ifscCode || ''}
                onChange={(e) =>
                  onChange({
                    ...invoice,
                    bankDetails: { ...invoice.bankDetails, ifscCode: e.target.value.toUpperCase() }
                  })
                }
                placeholder="IFSC Code"
                className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-mono uppercase text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
              />
              <input
                type="text"
                value={invoice.bankDetails?.branchName || ''}
                onChange={(e) =>
                  onChange({
                    ...invoice,
                    bankDetails: { ...invoice.bankDetails, branchName: e.target.value }
                  })
                }
                placeholder="Branch"
                className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
              />
            </div>
          </div>

          {/* UPI ID & Live QR preview */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block uppercase tracking-wider">
              UPI ID (Enables Direct Scan & Pay on Invoice)
            </span>
            <input
              type="text"
              value={invoice.upiDetails?.upiId || ''}
              onChange={(e) =>
                onChange({
                  ...invoice,
                  upiDetails: { ...invoice.upiDetails, upiId: e.target.value.trim() }
                })
              }
              placeholder="e.g. shopname@okhdfcbank or 9876543210@paytm"
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-emerald-400 placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
            <p className="text-[10px] text-[var(--theme-text-dim,#94A3B8)]">
              {isHindi
                ? 'UPI ID डालने पर बिल पर ऑटोमैटिक QR कोड प्रिंट होगा जिससे ग्राहक स्कैन करके पेमेंट कर सकेंगे।'
                : 'Entering a UPI ID automatically adds an instant scan-to-pay QR code to the printed invoice.'}
            </p>
          </div>
        </div>
      </div>

      {/* 7. EXTRAS: TERMS, NOTES & SIGNATURE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Notes & Terms */}
        <div className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)] border-b border-[var(--theme-border,#213E61)]/70 pb-2">
            {isHindi ? '7. नियम, शर्तें व नोट्स' : '7. Terms, Conditions & Notes'}
          </h3>
          <div>
            <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1">
              Terms & Conditions
            </label>
            <textarea
              value={invoice.terms || ''}
              onChange={(e) => updateMeta('terms', e.target.value)}
              rows={3}
              placeholder="1. Payment due within specified period.&#10;2. Goods once sold are not returnable."
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1">
              Client Note (Optional)
            </label>
            <input
              type="text"
              value={invoice.notes || ''}
              onChange={(e) => updateMeta('notes', e.target.value)}
              placeholder="e.g. Thank you for your business!"
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />
          </div>
        </div>

        {/* Signature Box */}
        <div className="p-4 rounded-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] shadow-xs space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-[var(--theme-text,#F8FAFC)] border-b border-[var(--theme-border,#213E61)]/70 pb-2">
            {isHindi ? 'अधिकृत हस्ताक्षर (Authorized Signatory)' : 'Authorized Signatory'}
          </h3>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block">
              Signatory Name / Designation
            </label>
            <input
              type="text"
              value={invoice.signatureText || ''}
              onChange={(e) => updateMeta('signatureText', e.target.value)}
              placeholder="e.g. Authorized Signatory / Manager"
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs text-[var(--theme-text,#F8FAFC)] placeholder-[var(--theme-text-dim,#94A3B8)] focus:outline-none"
            />

            <div className="pt-1">
              <label className="text-[10px] font-bold text-[var(--theme-text-dim,#94A3B8)] block mb-1">
                Upload Digital Signature Image (Optional)
              </label>
              {invoice.signatureData ? (
                <div className="relative inline-block">
                  <img
                    src={invoice.signatureData}
                    alt="Signature"
                    className="h-12 bg-white rounded-lg p-1 border border-[var(--theme-border,#213E61)] object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => updateMeta('signatureData', '')}
                    className="absolute -top-1 -right-1 p-0.5 rounded-full bg-rose-600 text-white text-[8px]"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-[var(--theme-border,#213E61)] bg-[var(--theme-surface,#0E1A29)] hover:border-[var(--theme-primary,#38BDF8)] text-xs text-[var(--theme-text-dim,#94A3B8)] cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Signature PNG/JPG</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Action Bar */}
      <div className="sticky bottom-4 z-20 p-3 rounded-2xl bg-[var(--theme-card,#132438)]/95 backdrop-blur-xl border border-[var(--theme-border,#213E61)] shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-[var(--theme-text-dim,#94A3B8)] block">
            Total Payable
          </span>
          <span className="font-mono font-black text-lg text-[var(--theme-primary,#38BDF8)]">
            {invoice.currency} {invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHapticSound('click');
              onPreview();
            }}
            className="py-2 px-3.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[var(--theme-primary,#38BDF8)]" />
            <span>{isHindi ? 'प्रीव्यू' : 'Preview'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHapticSound('click');
              onSave();
            }}
            className="py-2 px-4 rounded-xl bg-[var(--theme-primary,#38BDF8)] hover:brightness-110 text-[#040D17] text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isHindi ? 'इनवॉइस सेव करें' : 'Save Invoice'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
