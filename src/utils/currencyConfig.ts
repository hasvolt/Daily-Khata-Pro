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
  }
};

export function getCurrencyConfig(lang: AppLanguage = 'en'): CurrencyConfig {
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
  compact: boolean = true
): string {
  const cfg = getCurrencyConfig(lang);
  if (mask) {
    return `${cfg.symbol} •••••`;
  }
  const isNegative = amount < 0;
  const abs = Math.abs(Math.round(amount));
  let formattedNumber = '';

  if (compact && abs >= 10000) {
    const isIndian = cfg.code === 'INR' || cfg.code === 'BDT' || cfg.code === 'PKR';
    const compactLocale = isIndian ? 'en-IN' : 'en-US';
    try {
      formattedNumber = new Intl.NumberFormat(compactLocale, {
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(abs);
    } catch {
      formattedNumber = abs.toLocaleString('en-US');
    }
  } else {
    try {
      formattedNumber = abs.toLocaleString(cfg.locale);
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
