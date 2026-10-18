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
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', flag: '🇮🇳', category: 'indian' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇮🇳', category: 'indian' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी', flag: '🇮🇳', category: 'indian' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', flag: '🇮🇳', category: 'indian' },
  { code: 'mni-Mtei', name: 'Manipuri (Meitei)', nativeName: 'মৈতৈলোন্', flag: '🇮🇳', category: 'indian' },
  { code: 'lus', name: 'Mizo (Lushai)', nativeName: 'Mizo ṭawng', flag: '🇮🇳', category: 'indian' }
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
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', category: 'global' },
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
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', category: 'global' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', category: 'global' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', category: 'global' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', category: 'global' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲', category: 'global' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', category: 'global' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸', category: 'global' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾', category: 'global' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦', category: 'global' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', category: 'global' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸', category: 'global' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Bisaya', flag: '🇵🇭', category: 'global' },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu', flag: '🇫🇷', category: 'global' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', category: 'global' },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', flag: '🌐', category: 'global' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', category: 'global' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸', category: 'global' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', category: 'global' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', flag: '🇭🇹', category: 'global' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', category: 'global' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', flag: '🇺🇸', category: 'global' },
  { code: 'hmn', name: 'Hmong', nativeName: 'Hmoob', flag: '🇱🇦', category: 'global' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', category: 'global' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬', category: 'global' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪', category: 'global' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', flag: '🇮🇩', category: 'global' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ тілі', flag: '🇰🇿', category: 'global' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭', category: 'global' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼', category: 'global' },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', flag: '🇮🇶', category: 'global' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬', category: 'global' },
  { code: 'lo', name: 'Lao', nativeName: 'ພາສາລາວ', flag: '🇱🇦', category: 'global' },
  { code: 'la', name: 'Latin', nativeName: 'Latīna', flag: '🇻🇦', category: 'global' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', category: 'global' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', category: 'global' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', flag: '🇱🇺', category: 'global' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', category: 'global' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Fiteny Malagasy', flag: '🇲🇬', category: 'global' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹', category: 'global' },
  { code: 'mi', name: 'Maori', nativeName: 'Te Reo Māori', flag: '🇳🇿', category: 'global' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол хэл', flag: '🇲🇳', category: 'global' },
  { code: 'my', name: 'Myanmar (Burmese)', nativeName: 'မြန်မာစာ', flag: '🇲🇲', category: 'global' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫', category: 'global' },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Sāmoa', flag: '🇼🇸', category: 'global' },
  { code: 'gd', name: 'Scots Gaelic', nativeName: 'Gàidhlig', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', category: 'global' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', category: 'global' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', flag: '🇱🇸', category: 'global' },
  { code: 'sn', name: 'Shona', nativeName: 'chiShona', flag: '🇿🇼', category: 'global' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', category: 'global' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', category: 'global' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', category: 'global' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaaliga', flag: '🇸🇴', category: 'global' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', flag: '🇮🇩', category: 'global' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', category: 'global' },
  { code: 'tt', name: 'Tatar', nativeName: 'Татар теле', flag: '🇷🇺', category: 'global' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen dili', flag: '🇹🇲', category: 'global' },
  { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە', flag: '🇨🇳', category: 'global' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha', flag: '🇺🇿', category: 'global' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', category: 'global' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', category: 'global' },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', flag: '🇮🇱', category: 'global' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬', category: 'global' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', category: 'global' }
];

export const ALL_GOOGLE_LANGUAGES: GoogleLanguage[] = [
  ...INDIAN_LANGUAGES,
  ...GLOBAL_LANGUAGES
];

/**
 * Check if browser is online
 */
export function isNetworkOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * Ensure Google Translate script & container are mounted
 */
export function ensureGoogleTranslateInitialized(): void {
  if (typeof document === 'undefined') return;

  // 1. Ensure anchor div exists
  let el = document.getElementById('google_translate_element');
  if (!el) {
    el = document.createElement('div');
    el.id = 'google_translate_element';
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    el.style.top = '-9999px';
    el.style.width = '1px';
    el.style.height = '1px';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }

  // 2. Define callback function if not set
  if (typeof (window as any).googleTranslateElementInit !== 'function') {
    (window as any).googleTranslateElementInit = function () {
      try {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              autoDisplay: false
            },
            'google_translate_element'
          );
        }
      } catch (e) {
        console.warn('Google Translate element init error:', e);
      }
    };
  }

  // 3. Ensure script tag is loaded if online
  if (typeof window !== 'undefined' && !(window as any).google?.translate && isNetworkOnline()) {
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }
}

/**
 * Get the currently active Google Translate language from cookie or localStorage
 */
export function getActiveGoogleLanguage(): string | null {
  try {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (const c of cookies) {
      const trimmed = c.trim();
      if (trimmed.startsWith('googtrans=')) {
        const val = trimmed.substring('googtrans='.length);
        const parts = val.split('/');
        if (parts.length >= 3 && parts[2]) {
          return decodeURIComponent(parts[2]);
        }
      }
    }
    const stored = localStorage.getItem('dailykhata_active_google_lang');
    if (stored && stored !== 'en') return stored;
  } catch (e) {
    console.error('Failed to read googtrans cookie', e);
  }
  return null;
}

/**
 * Check if Google Translate is actively translating the page
 */
export function isGoogleTranslateActive(): boolean {
  const current = getActiveGoogleLanguage();
  return Boolean(current && current !== 'en');
}

export interface TranslateResult {
  success: boolean;
  reason?: 'offline' | 'error' | 'success';
  message?: string;
}

/**
 * Trigger Google Translate for the entire page
 */
export function applyGoogleTranslateLanguage(langCode: string): TranslateResult {
  if (!langCode || langCode === 'original' || langCode === 'en_reset' || langCode === 'en') {
    resetGoogleTranslate();
    return { success: true, reason: 'success' };
  }

  if (!isNetworkOnline()) {
    return {
      success: false,
      reason: 'offline',
      message: 'Internet connection is required for Google Translate.'
    };
  }

  try {
    ensureGoogleTranslateInitialized();

    const hostname = window.location.hostname;
    const cleanHost = hostname.replace(/^www\./, '');

    // Set cookie across root and domain variations
    const cookiesToSet = [
      `googtrans=/auto/${langCode}; path=/;`,
      `googtrans=/en/${langCode}; path=/;`,
      `googtrans=/auto/${langCode}; path=/; domain=${hostname};`,
      `googtrans=/en/${langCode}; path=/; domain=${hostname};`
    ];

    if (cleanHost && cleanHost !== hostname && cleanHost !== 'localhost') {
      cookiesToSet.push(`googtrans=/auto/${langCode}; path=/; domain=.${cleanHost};`);
      cookiesToSet.push(`googtrans=/en/${langCode}; path=/; domain=.${cleanHost};`);
    }

    cookiesToSet.forEach((c) => {
      try {
        document.cookie = c;
      } catch (e) {}
    });

    try {
      localStorage.setItem('dailykhata_active_google_lang', langCode);
    } catch (e) {}

    // Try finding Google Translate dropdown combo
    const combo = (document.querySelector('.goog-te-combo') || document.querySelector('select.goog-te-combo')) as HTMLSelectElement | null;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change', { bubbles: true }));
      combo.dispatchEvent(new Event('input', { bubbles: true }));
      return { success: true, reason: 'success' };
    } else {
      // Reload so the cookie triggers Google Translate init across the entire DOM
      setTimeout(() => {
        window.location.reload();
      }, 150);
      return { success: true, reason: 'success' };
    }
  } catch (err) {
    console.error('Failed to apply Google Translate', err);
    return { success: false, reason: 'error', message: 'Failed to apply translation.' };
  }
}

/**
 * Reset Google Translate back to English / default language
 */
export function resetGoogleTranslate(): void {
  try {
    const hostname = window.location.hostname;
    const cleanHost = hostname.replace(/^www\./, '');

    const clearCookies = [
      'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;',
      'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + hostname + ';'
    ];
    if (cleanHost && cleanHost !== hostname && cleanHost !== 'localhost') {
      clearCookies.push(`googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${cleanHost};`);
    }

    clearCookies.forEach((c) => {
      try {
        document.cookie = c;
      } catch (e) {}
    });

    try {
      localStorage.removeItem('dailykhata_active_google_lang');
    } catch (e) {}

    const combo = (document.querySelector('.goog-te-combo') || document.querySelector('select.goog-te-combo')) as HTMLSelectElement | null;
    if (combo) {
      combo.value = '';
      combo.dispatchEvent(new Event('change', { bubbles: true }));
    }

    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (e) {
    console.error('Failed to reset Google Translate', e);
    window.location.reload();
  }
}
