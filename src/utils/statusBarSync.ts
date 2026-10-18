import { AppTheme } from '../types';

export const THEME_STATUS_BAR_COLORS: Record<AppTheme, { color: string; isLight: boolean }> = {
  blue: { color: '#020611', isLight: false },
  dark: { color: '#04100C', isLight: false },
  black: { color: '#050810', isLight: false },
  monochrome: { color: '#000000', isLight: false },
  yellow: { color: '#0F0A02', isLight: false },
  orange: { color: '#110804', isLight: false },
  emerald: { color: '#04120A', isLight: false },
  purple: { color: '#0A0614', isLight: false },
  cyan: { color: '#04141A', isLight: false },
  pink: { color: '#12060C', isLight: false },
  white: { color: '#F8FAFC', isLight: true },
  light: { color: '#F0F9FF', isLight: true },
};

/**
 * Synchronizes the mobile phone system status bar (time, date, battery, 5G/Wi-Fi icons)
 * with the currently selected application theme.
 * Works seamlessly on Android Chrome, Samsung Internet, WebAPK, PWA, and iOS Safari.
 */
export function syncThemeWithStatusBar(theme: AppTheme): void {
  if (typeof document === 'undefined') return;

  const config = THEME_STATUS_BAR_COLORS[theme] || THEME_STATUS_BAR_COLORS.blue;
  const { color, isLight } = config;

  // 1. Android & Modern Mobile Browsers Theme Color
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', color);

  // 2. iOS Safari Status Bar Style
  let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (!appleStatusBar) {
    appleStatusBar = document.createElement('meta');
    appleStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
    document.head.appendChild(appleStatusBar);
  }
  appleStatusBar.setAttribute('content', isLight ? 'default' : 'black-translucent');

  // 3. System Color Scheme (instructs OS status bar to render icons in black or white)
  document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';

  // 4. Body & HTML background alignment to prevent letterbox flashing
  document.documentElement.style.backgroundColor = color;
  document.body.style.backgroundColor = color;
}
