import { AppLanguage } from '../types';

export interface CurrencyConfig {
  symbol: string;
  code: string;
  name: string;
  locale: string;
  symbolPosition: 'prefix' | 'suffix';
  spaceAfterSymbol: boolean;
}

export const LANGUAGE_CURRENCY_MAP: Record<AppLanguage, CurrencyConfig> = {
  en: {
    symbol: '₹',
    code: 'INR',
    name: 'Indian Rupee (Default)',
    locale: 'en-IN',
    symbolPosition: 'prefix',
    spaceAfterSymbol: false
  },
  hi: {
    symbol: '₹',
    code: 'INR',
    name: 'भारतीय रुपया (INR)',
    locale: 'hi-IN',
    symbolPosition: 'prefix',
    spaceAfterSymbol: false
  },
  hinglish: {
    symbol: '₹',
    code: 'INR',
    name: 'Indian Rupee (INR)',
    locale: 'en-IN',
    symbolPosition: 'prefix',
    spaceAfterSymbol: false
  },
  es: {
    symbol: '€',
    code: 'EUR',
    name: 'Euro (€)',
    locale: 'es-ES',
    symbolPosition: 'suffix',
    spaceAfterSymbol: true
  },
  ar: {
    symbol: 'د.إ',
    code: 'AED',
    name: 'درهم إماراتي (AED)',
    locale: 'ar-AE',
    symbolPosition: 'prefix',
    spaceAfterSymbol: true
  },
  fr: {
    symbol: '€',
    code: 'EUR',
    name: 'Euro (€)',
    locale: 'fr-FR',
    symbolPosition: 'suffix',
    spaceAfterSymbol: true
  },
  de: {
    symbol: '€',
    code: 'EUR',
    name: 'Euro (€)',
    locale: 'de-DE',
    symbolPosition: 'suffix',
    spaceAfterSymbol: true
  },
  ru: {
    symbol: '₽',
    code: 'RUB',
    name: 'Российский рубль (₽)',
    locale: 'ru-RU',
    symbolPosition: 'suffix',
    spaceAfterSymbol: true
  },
  pt: {
    symbol: 'R$',
    code: 'BRL',
    name: 'Real brasileiro (R$)',
    locale: 'pt-BR',
    symbolPosition: 'prefix',
    spaceAfterSymbol: true
  },
  bn: {
    symbol: '৳',
    code: 'BDT',
    name: 'বাংলাদেশি টাকা (৳)',
    locale: 'bn-BD',
    symbolPosition: 'prefix',
    spaceAfterSymbol: false
  },
  ur: {
    symbol: 'Rs',
    code: 'PKR',
    name: 'روپیہ (PKR)',
    locale: 'ur-PK',
    symbolPosition: 'prefix',
    spaceAfterSymbol: true
  },
  id: {
    symbol: 'Rp',
    code: 'IDR',
    name: 'Rupiah (Rp)',
    locale: 'id-ID',
    symbolPosition: 'prefix',
    spaceAfterSymbol: true
  },
  ja: {
    symbol: '¥',
    code: 'JPY',
    name: '日本円 (¥)',
    locale: 'ja-JP',
    symbolPosition: 'prefix',
    spaceAfterSymbol: false
  },
  zh: {
    symbol: '¥',
    code: 'CNY',
    name: '人民币 (¥)',
    locale: 'zh-CN',
    symbolPosition: 'prefix',
    spaceAfterSymbol: false
  },
  mr: { symbol: '₹', code: 'INR', name: 'भारतीय रुपया (INR)', locale: 'mr-IN', symbolPosition: 'prefix', spaceAfterSymbol: false },
  gu: { symbol: '₹', code: 'INR', name: 'ભારતીય રૂપિયો (INR)', locale: 'gu-IN', symbolPosition: 'prefix', spaceAfterSymbol: false },
  pa: { symbol: '₹', code: 'INR', name: 'ਭਾਰਤੀ ਰੁਪਿਆ (INR)', locale: 'pa-IN', symbolPosition: 'prefix', spaceAfterSymbol: false },
  ta: { symbol: '₹', code: 'INR', name: 'இந்திய ரூபாய் (INR)', locale: 'ta-IN', symbolPosition: 'prefix', spaceAfterSymbol: false },
  te: { symbol: '₹', code: 'INR', name: 'భారతీయ రూపాయి (INR)', locale: 'te-IN', symbolPosition: 'prefix', spaceAfterSymbol: false },
  kn: { symbol: '₹', code: 'INR', name: 'ಭಾರತೀಯ ರೂಪಾಯಿ (INR)', locale: 'kn-IN', symbolPosition: 'prefix', spaceAfterSymbol: false },
  ml: { symbol: '₹', code: 'INR', name: 'ഇന്ത്യൻ രൂപ (INR)', locale: 'ml-IN', symbolPosition: 'prefix', spaceAfterSymbol: false },
  or: { symbol: '₹', code: 'INR', name: 'ଭାରତୀୟ ଟଙ୍କା (INR)', locale: 'or-IN', symbolPosition: 'prefix', spaceAfterSymbol: false },
  as: { symbol: '₹', code: 'INR', name: 'ভাৰতীয় টকা (INR)', locale: 'as-IN', symbolPosition: 'prefix', spaceAfterSymbol: false },
  ne: { symbol: '₨', code: 'NPR', name: 'नेपाली रुपैयाँ (NPR)', locale: 'ne-NP', symbolPosition: 'prefix', spaceAfterSymbol: false }
};

export const UNIVERSAL_CURRENCY_MAP: Record<string, CurrencyConfig> = {
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee (INR)', locale: 'en-IN', symbolPosition: 'prefix', spaceAfterSymbol: false },
  USD: { symbol: '$', code: 'USD', name: 'US Dollar (USD)', locale: 'en-US', symbolPosition: 'prefix', spaceAfterSymbol: false },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro (EUR)', locale: 'de-DE', symbolPosition: 'suffix', spaceAfterSymbol: true },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound (GBP)', locale: 'en-GB', symbolPosition: 'prefix', spaceAfterSymbol: false },
  AED: { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham (AED)', locale: 'ar-AE', symbolPosition: 'prefix', spaceAfterSymbol: true },
  SAR: { symbol: '﷼', code: 'SAR', name: 'Saudi Riyal (SAR)', locale: 'ar-SA', symbolPosition: 'prefix', spaceAfterSymbol: true },
  CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar (CAD)', locale: 'en-CA', symbolPosition: 'prefix', spaceAfterSymbol: false },
  AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar (AUD)', locale: 'en-AU', symbolPosition: 'prefix', spaceAfterSymbol: false },
  SGD: { symbol: 'S$', code: 'SGD', name: 'Singapore Dollar (SGD)', locale: 'en-SG', symbolPosition: 'prefix', spaceAfterSymbol: false },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen (JPY)', locale: 'ja-JP', symbolPosition: 'prefix', spaceAfterSymbol: false },
  BDT: { symbol: '৳', code: 'BDT', name: 'Bangladeshi Taka (BDT)', locale: 'bn-BD', symbolPosition: 'prefix', spaceAfterSymbol: false },
  PKR: { symbol: '₨', code: 'PKR', name: 'Pakistani Rupee (PKR)', locale: 'ur-PK', symbolPosition: 'prefix', spaceAfterSymbol: true },
  BRL: { symbol: 'R$', code: 'BRL', name: 'Real brasileiro (R$)', locale: 'pt-BR', symbolPosition: 'prefix', spaceAfterSymbol: true },
  RUB: { symbol: '₽', code: 'RUB', name: 'Russian Ruble (₽)', locale: 'ru-RU', symbolPosition: 'suffix', spaceAfterSymbol: true },
  IDR: { symbol: 'Rp', code: 'IDR', name: 'Indonesian Rupiah (Rp)', locale: 'id-ID', symbolPosition: 'prefix', spaceAfterSymbol: true },
  CNY: { symbol: '¥', code: 'CNY', name: 'Chinese Yuan (¥)', locale: 'zh-CN', symbolPosition: 'prefix', spaceAfterSymbol: false }
};

let userPreferredCurrency: string | null = null;
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    userPreferredCurrency = window.localStorage.getItem('dailykhata_preferred_currency');
  }
} catch {
  // ignore
}

export function setPreferredCurrency(code: string | null) {
  userPreferredCurrency = code;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (code) {
        window.localStorage.setItem('dailykhata_preferred_currency', code);
      } else {
        window.localStorage.removeItem('dailykhata_preferred_currency');
      }
    }
  } catch {
    // ignore
  }
}

export function getPreferredCurrency(): string | null {
  return userPreferredCurrency;
}

export function getCurrencyConfig(lang: AppLanguage = 'en'): CurrencyConfig {
  if (userPreferredCurrency && UNIVERSAL_CURRENCY_MAP[userPreferredCurrency]) {
    return UNIVERSAL_CURRENCY_MAP[userPreferredCurrency];
  }
  return LANGUAGE_CURRENCY_MAP[lang] || LANGUAGE_CURRENCY_MAP.en;
}

let currentLang: AppLanguage = 'en';

export function setCurrentLanguage(lang: AppLanguage) {
  currentLang = lang;
}

export function getCurrentLanguage(): AppLanguage {
  return currentLang;
}

export function formatCurrencyByLang(
  amount: number,
  lang: AppLanguage = currentLang,
  mask: boolean = false,
  compact: boolean = false
): string {
  const cfg = getCurrencyConfig(lang);
  if (mask) {
    return `${cfg.symbol} •••••`;
  }
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  let formattedNumber = '';

  if (compact && abs >= 10000000) {
    const isIndian = cfg.code === 'INR' || cfg.code === 'BDT' || cfg.code === 'PKR';
    const compactLocale = isIndian ? 'en-IN' : 'en-US';
    try {
      formattedNumber = new Intl.NumberFormat(compactLocale, {
        notation: 'compact',
        maximumFractionDigits: 2
      }).format(abs);
    } catch {
      formattedNumber = abs.toLocaleString('en-US');
    }
  } else {
    try {
      const hasDecimals = Math.abs(abs - Math.round(abs)) >= 0.005;
      formattedNumber = abs.toLocaleString(cfg.locale, {
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: 2
      });
    } catch {
      formattedNumber = abs.toLocaleString('en-US');
    }
  }

  const prefixSign = isNegative ? '-' : '';
  const space = cfg.spaceAfterSymbol ? ' ' : '';

  if (cfg.symbolPosition === 'prefix') {
    return `${prefixSign}${cfg.symbol}${space}${formattedNumber}`;
  } else {
    return `${prefixSign}${formattedNumber}${space}${cfg.symbol}`;
  }
}
