import QRCode from 'qrcode';
import {
  Invoice,
  InvoiceItem,
  InvoiceBusinessProfile,
  InvoiceTaxType,
  InvoicePaymentTerms
} from '../types';

export const INVOICE_STORAGE_KEY = 'dailykhata_invoices_v1';
export const INVOICE_PROFILE_STORAGE_KEY = 'dailykhata_invoice_profile_v1';

// Supported currencies
export interface CurrencyOption {
  symbol: string;
  code: string;
  name: string;
  subunit: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { symbol: '₹', code: 'INR', name: 'Indian Rupee (INR)', subunit: 'Paise' },
  { symbol: '$', code: 'USD', name: 'US Dollar (USD)', subunit: 'Cents' },
  { symbol: '€', code: 'EUR', name: 'Euro (EUR)', subunit: 'Cents' },
  { symbol: '£', code: 'GBP', name: 'British Pound (GBP)', subunit: 'Pence' },
  { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham (AED)', subunit: 'Fils' },
  { symbol: '৳', code: 'BDT', name: 'Bangladeshi Taka (BDT)', subunit: 'Poisha' },
  { symbol: '₨', code: 'PKR', name: 'Pakistani Rupee (PKR)', subunit: 'Paisa' },
  { symbol: 'S$', code: 'SGD', name: 'Singapore Dollar (SGD)', subunit: 'Cents' },
  { symbol: 'A$', code: 'AUD', name: 'Australian Dollar (AUD)', subunit: 'Cents' },
  { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar (CAD)', subunit: 'Cents' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen (JPY)', subunit: 'Sen' }
];

export const COMMON_UNITS = [
  'Pcs',
  'Nos',
  'Hours',
  'Days',
  'Kg',
  'Gram',
  'Mtr',
  'Feet',
  'Sq.ft',
  'Box',
  'Set',
  'Units',
  'Month',
  'Year',
  'Job',
  'Packet'
];

export const COMMON_GST_RATES = [0, 5, 12, 18, 28];

export const PAYMENT_TERMS_LABELS: Record<InvoicePaymentTerms, { en: string; hi: string; days: number }> = {
  receipt: { en: 'Due on Receipt', hi: 'प्राप्ति पर देय', days: 0 },
  net7: { en: 'Net 7 Days', hi: '7 दिनों में देय', days: 7 },
  net15: { en: 'Net 15 Days', hi: '15 दिनों में देय', days: 15 },
  net30: { en: 'Net 30 Days', hi: '30 दिनों में देय', days: 30 },
  net45: { en: 'Net 45 Days', hi: '45 दिनों में देय', days: 45 },
  net60: { en: 'Net 60 Days', hi: '60 दिनों में देय', days: 60 },
  custom: { en: 'Custom Terms', hi: 'कस्टम शर्तें', days: 0 }
};

// Precise Number to Words converter (supports Indian Lakhs/Crores numbering for INR and Millions for others)
const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanOneThousand(n: number): string {
  let rem = n;
  let word = '';

  if (rem >= 100) {
    word += ONES[Math.floor(rem / 100)] + ' Hundred ';
    rem %= 100;
  }

  if (rem >= 20) {
    word += TENS[Math.floor(rem / 10)] + ' ';
    rem %= 10;
  }

  if (rem > 0) {
    word += ONES[rem] + ' ';
  }

  return word.trim();
}

export function convertNumberToWords(num: number, currencyCode: string = 'INR'): string {
  if (isNaN(num) || num <= 0) return 'Zero Only';

  const isINR = currencyCode === 'INR';
  const curr = CURRENCY_OPTIONS.find(c => c.code === currencyCode) || CURRENCY_OPTIONS[0];

  const whole = Math.floor(num);
  const decimal = Math.round((num - whole) * 100);

  let result = '';

  if (isINR) {
    // Indian numbering: Crores, Lakhs, Thousands, Hundreds
    let n = whole;
    const crores = Math.floor(n / 10000000);
    n %= 10000000;
    const lakhs = Math.floor(n / 100000);
    n %= 100000;
    const thousands = Math.floor(n / 1000);
    n %= 1000;
    const hundredsAndRest = n;

    if (crores > 0) {
      result += convertLessThanOneThousand(crores) + ' Crore ';
    }
    if (lakhs > 0) {
      result += convertLessThanOneThousand(lakhs) + ' Lakh ';
    }
    if (thousands > 0) {
      result += convertLessThanOneThousand(thousands) + ' Thousand ';
    }
    if (hundredsAndRest > 0) {
      result += convertLessThanOneThousand(hundredsAndRest) + ' ';
    }
  } else {
    // International numbering: Billions, Millions, Thousands
    let n = whole;
    const billions = Math.floor(n / 1000000000);
    n %= 1000000000;
    const millions = Math.floor(n / 1000000);
    n %= 1000000;
    const thousands = Math.floor(n / 1000);
    n %= 1000;
    const rest = n;

    if (billions > 0) {
      result += convertLessThanOneThousand(billions) + ' Billion ';
    }
    if (millions > 0) {
      result += convertLessThanOneThousand(millions) + ' Million ';
    }
    if (thousands > 0) {
      result += convertLessThanOneThousand(thousands) + ' Thousand ';
    }
    if (rest > 0) {
      result += convertLessThanOneThousand(rest) + ' ';
    }
  }

  result = result.trim();
  if (!result) result = 'Zero';

  const currencyUnit = isINR ? 'Rupees' : curr.code;
  result += ` ${currencyUnit}`;

  if (decimal > 0) {
    const decimalWords = convertLessThanOneThousand(decimal);
    result += ` and ${decimalWords} ${curr.subunit}`;
  }

  return `${result} Only`;
}

// Calculate individual item
export function calculateItemTotal(
  rate: number,
  quantity: number,
  discountType: 'percent' | 'flat',
  discountValue: number,
  taxRate: number
): { taxableAmount: number; taxAmount: number; totalAmount: number; discountAmount: number } {
  const base = Math.max(0, rate) * Math.max(0, quantity);
  let discountAmount = 0;

  if (discountType === 'percent') {
    discountAmount = (base * Math.min(100, Math.max(0, discountValue))) / 100;
  } else {
    discountAmount = Math.min(base, Math.max(0, discountValue));
  }

  const taxableAmount = Math.max(0, base - discountAmount);
  const taxAmount = (taxableAmount * Math.max(0, taxRate)) / 100;
  const totalAmount = taxableAmount + taxAmount;

  return {
    taxableAmount,
    taxAmount,
    totalAmount,
    discountAmount
  };
}

// Calculate entire invoice
export function calculateInvoiceTotals(
  items: InvoiceItem[],
  extraDiscountType: 'percent' | 'flat',
  extraDiscountValue: number,
  taxType: InvoiceTaxType,
  shippingCharges: number = 0,
  enableRoundOff: boolean = true,
  currencyCode: string = 'INR'
) {
  let subtotal = 0;
  let itemDiscountTotal = 0;
  let rawTaxTotal = 0;

  const processedItems = items.map((item) => {
    const calc = calculateItemTotal(
      item.rate,
      item.quantity,
      item.discountType,
      item.discountValue,
      taxType === 'none' ? 0 : item.taxRate
    );
    subtotal += item.rate * item.quantity;
    itemDiscountTotal += calc.discountAmount;
    rawTaxTotal += calc.taxAmount;

    return {
      ...item,
      taxableAmount: calc.taxableAmount,
      taxAmount: calc.taxAmount,
      totalAmount: calc.totalAmount
    };
  });

  const intermediateTaxable = Math.max(0, subtotal - itemDiscountTotal);

  let extraDiscountTotal = 0;
  if (extraDiscountType === 'percent') {
    extraDiscountTotal = (intermediateTaxable * Math.min(100, Math.max(0, extraDiscountValue))) / 100;
  } else {
    extraDiscountTotal = Math.min(intermediateTaxable, Math.max(0, extraDiscountValue));
  }

  const totalDiscount = itemDiscountTotal + extraDiscountTotal;

  // Scale tax if extra discount is applied
  let taxTotal = rawTaxTotal;
  if (intermediateTaxable > 0 && extraDiscountTotal > 0) {
    const factor = Math.max(0, (intermediateTaxable - extraDiscountTotal) / intermediateTaxable);
    taxTotal = rawTaxTotal * factor;
  }
  if (taxType === 'none') {
    taxTotal = 0;
  }

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (taxType === 'cgst_sgst') {
    cgst = taxTotal / 2;
    sgst = taxTotal / 2;
    igst = 0;
  } else if (taxType === 'igst') {
    cgst = 0;
    sgst = 0;
    igst = taxTotal;
  } else if (taxType === 'single') {
    cgst = 0;
    sgst = 0;
    igst = 0;
  }

  const preRoundGrand = Math.max(0, intermediateTaxable - extraDiscountTotal + taxTotal + Math.max(0, shippingCharges));

  let roundOff = 0;
  let grandTotal = preRoundGrand;

  if (enableRoundOff) {
    const rounded = Math.round(preRoundGrand);
    roundOff = Number((rounded - preRoundGrand).toFixed(2));
    grandTotal = rounded;
  } else {
    grandTotal = Number(preRoundGrand.toFixed(2));
  }

  const amountInWords = convertNumberToWords(grandTotal, currencyCode);

  return {
    items: processedItems,
    subtotal: Number(subtotal.toFixed(2)),
    itemDiscountTotal: Number(itemDiscountTotal.toFixed(2)),
    extraDiscountTotal: Number(extraDiscountTotal.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
    taxTotal: Number(taxTotal.toFixed(2)),
    cgst: Number(cgst.toFixed(2)),
    sgst: Number(sgst.toFixed(2)),
    igst: Number(igst.toFixed(2)),
    shippingCharges: Number(Math.max(0, shippingCharges).toFixed(2)),
    roundOff,
    grandTotal,
    amountInWords
  };
}

// Generate QR Code data URL for UPI Payments
export async function generateUpiQrCode(
  upiId: string,
  payeeName: string,
  amount: number,
  invoiceNumber: string
): Promise<string> {
  if (!upiId || !upiId.includes('@')) return '';

  const cleanUpi = upiId.trim();
  const cleanName = payeeName.trim() || 'Merchant';
  const cleanAmount = Math.max(0, amount).toFixed(2);
  const note = `Invoice ${invoiceNumber || ''}`.trim();

  const upiUrl = `upi://pay?pa=${encodeURIComponent(cleanUpi)}&pn=${encodeURIComponent(cleanName)}&am=${encodeURIComponent(cleanAmount)}&cu=INR&tn=${encodeURIComponent(note)}`;

  try {
    const dataUrl = await QRCode.toDataURL(upiUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 220,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating UPI QR Code:', err);
    return '';
  }
}

// LocalStorage helpers
export function loadInvoicesFromStorage(): Invoice[] {
  try {
    const data = localStorage.getItem(INVOICE_STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load invoices from localStorage:', err);
    return [];
  }
}

export function saveInvoicesToStorage(invoices: Invoice[]): boolean {
  try {
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoices));
    return true;
  } catch (err) {
    console.error('Failed to save invoices to localStorage:', err);
    return false;
  }
}

export function loadBusinessProfileFromStorage(): InvoiceBusinessProfile {
  try {
    const data = localStorage.getItem(INVOICE_PROFILE_STORAGE_KEY);
    if (!data) return getDefaultBusinessProfile();
    return { ...getDefaultBusinessProfile(), ...JSON.parse(data) };
  } catch (err) {
    console.error('Failed to load business profile:', err);
    return getDefaultBusinessProfile();
  }
}

export function saveBusinessProfileToStorage(profile: InvoiceBusinessProfile): boolean {
  try {
    localStorage.setItem(INVOICE_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch (err) {
    console.error('Failed to save business profile:', err);
    return false;
  }
}

export function getDefaultBusinessProfile(): InvoiceBusinessProfile {
  return {
    businessName: '',
    logoUrl: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    gstin: '',
    phone: '',
    email: '',
    website: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    upiId: 'Hasvolt@upi',
    upiPayeeName: '',
    paymentLink: '',
    acceptedMethods: ['upi', 'bank', 'cash'],
    defaultNotes: 'Thank you for your business! We appreciate your partnership.',
    defaultTerms: '1. Payment is due according to agreed terms.\n2. Goods once sold will not be taken back without prior approval.\n3. All disputes subject to local jurisdiction.',
    defaultCurrency: '₹',
    defaultCurrencyCode: 'INR',
    signatureType: 'text',
    signatureText: 'Authorized Signatory'
  };
}

export function getNextInvoiceNumber(existingInvoices: Invoice[]): string {
  const currentYear = new Date().getFullYear();
  const prefix = `INV-${currentYear}-`;

  const yearInvoices = existingInvoices.filter((inv) =>
    inv.invoiceNumber && inv.invoiceNumber.startsWith(prefix)
  );

  let maxNum = 0;
  yearInvoices.forEach((inv) => {
    const suffix = inv.invoiceNumber.replace(prefix, '');
    const parsed = parseInt(suffix, 10);
    if (!isNaN(parsed) && parsed > maxNum) {
      maxNum = parsed;
    }
  });

  const nextNum = maxNum + 1;
  return `${prefix}${String(nextNum).padStart(3, '0')}`;
}

export function calculateDueDateFromTerms(dateStr: string, terms: InvoicePaymentTerms): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const daysToAdd = PAYMENT_TERMS_LABELS[terms]?.days || 0;
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().split('T')[0];
}
