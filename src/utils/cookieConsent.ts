export interface CookiePreferences {
  essential: boolean; // Always true: accounting database, PIN hash, session state
  functional: boolean; // Themes, language, font scale, layout options
  advertising: boolean; // Google AdSense & sponsor promotions
}

export interface CookieConsentData {
  status: 'accepted' | 'essential_only' | 'custom' | 'declined';
  timestamp: string;
  version: string;
  preferences: CookiePreferences;
}

const COOKIE_CONSENT_KEY = 'dk_cookie_consent_v1';
const CURRENT_POLICY_VERSION = '2026.1';

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: true,
  advertising: true
};

export const getCookieConsent = (): CookieConsentData | null => {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsentData;
  } catch (e) {
    console.error('Error reading cookie consent:', e);
    return null;
  }
};

export const hasGivenCookieConsent = (): boolean => {
  return getCookieConsent() !== null;
};

export const saveCookieConsent = (
  status: 'accepted' | 'essential_only' | 'custom' | 'declined',
  customPrefs?: Partial<CookiePreferences>
): CookieConsentData => {
  const preferences: CookiePreferences = {
    essential: true,
    functional: status === 'accepted' ? true : status === 'essential_only' ? false : (customPrefs?.functional ?? true),
    advertising: status === 'accepted' ? true : status === 'essential_only' ? false : (customPrefs?.advertising ?? false)
  };

  const data: CookieConsentData = {
    status,
    timestamp: new Date().toISOString(),
    version: CURRENT_POLICY_VERSION,
    preferences
  };

  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
    // Dispatch custom event so listeners can update reactively
    window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: data }));
  } catch (e) {
    console.error('Failed to save cookie consent:', e);
  }

  return data;
};

export const resetCookieConsent = (): void => {
  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: null }));
  } catch (e) {
    console.error('Failed to reset cookie consent:', e);
  }
};
