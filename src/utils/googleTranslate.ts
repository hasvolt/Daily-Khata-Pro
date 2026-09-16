export interface GoogleLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  category: 'indian' | 'global';
}

export const INDIAN_LANGUAGES: GoogleLanguage[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', category: 'indian' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', category: 'indian' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', category: 'indian' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', category: 'indian' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', category: 'indian' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', category: 'indian' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', category: 'indian' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', category: 'indian' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', category: 'indian' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', category: 'indian' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', category: 'indian' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', category: 'indian' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', category: 'indian' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', flag: '🇮🇳', category: 'indian' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🇮🇳', category: 'indian' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇮🇳', category: 'indian' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', flag: '🇮🇳', category: 'indian' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी', flag: '🇮🇳', category: 'indian' }
];

export const GLOBAL_LANGUAGES: GoogleLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', category: 'global' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', category: 'global' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', category: 'global' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', category: 'global' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', category: 'global' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', category: 'global' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', category: 'global' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', category: 'global' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', category: 'global' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', category: 'global' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', category: 'global' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', category: 'global' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', category: 'global' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', category: 'global' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', category: 'global' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', category: 'global' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', category: 'global' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', category: 'global' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' , category: 'global' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', category: 'global' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', category: 'global' },
  { code: 'tl', name: 'Filipino / Tagalog', nativeName: 'Tagalog', flag: '🇵🇭', category: 'global' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', category: 'global' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', category: 'global' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', category: 'global' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', category: 'global' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', category: 'global' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', category: 'global' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', category: 'global' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', category: 'global' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', category: 'global' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', category: 'global' }
];

export const ALL_GOOGLE_LANGUAGES: GoogleLanguage[] = [
  ...INDIAN_LANGUAGES,
  ...GLOBAL_LANGUAGES
];

/**
 * Get the currently active Google Translate language from cookie
 */
export function getActiveGoogleLanguage(): string | null {
  try {
    const cookies = document.cookie.split(';');
    for (const c of cookies) {
      const trimmed = c.trim();
      if (trimmed.startsWith('googtrans=')) {
        const val = trimmed.substring('googtrans='.length);
        // format is usually /en/hi or /auto/hi
        const parts = val.split('/');
        if (parts.length >= 3 && parts[2]) {
          return decodeURIComponent(parts[2]);
        }
      }
    }
  } catch (e) {
    console.error('Failed to read googtrans cookie', e);
  }
  return null;
}

/**
 * Trigger Google Translate for the entire page
 */
export function applyGoogleTranslateLanguage(langCode: string): boolean {
  if (!langCode || langCode === 'original' || langCode === 'en_reset') {
    resetGoogleTranslate();
    return true;
  }

  try {
    // 1. Set cookie for root path and host domain
    const hostname = window.location.hostname;
    const cookieValues = [
      `googtrans=/auto/${langCode}; path=/;`,
      `googtrans=/en/${langCode}; path=/;`
    ];

    cookieValues.forEach((cookieStr) => {
      document.cookie = cookieStr;
      if (hostname) {
        document.cookie = `${cookieStr} domain=${hostname};`;
      }
    });

    // 2. Trigger native select element if it exists in DOM
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change'));
      return true;
    } else {
      // If combo is not rendered yet, reload to let Google Translate read the cookie
      window.location.reload();
      return true;
    }
  } catch (err) {
    console.error('Failed to apply Google Translate', err);
    return false;
  }
}

/**
 * Reset Google Translate back to English / default language
 */
export function resetGoogleTranslate(): void {
  try {
    const hostname = window.location.hostname;
    
    // Clear cookie
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    if (hostname) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
    }

    // Reset select
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (combo) {
      combo.value = '';
      combo.dispatchEvent(new Event('change'));
    }

    // Reload page to restore original DOM texts cleanly
    window.location.reload();
  } catch (e) {
    console.error('Failed to reset Google Translate', e);
    window.location.reload();
  }
}
