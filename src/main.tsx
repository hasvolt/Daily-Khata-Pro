import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Auto-recover from dynamic import chunk failures (standard when a new version is deployed)
window.addEventListener('vite:preloadError', (event) => {
  console.warn('[Daily Khata] Vite chunk preload error detected:', event);
  // CRITICAL: When the user is offline, DO NOT clear caches or trigger forced network reloads
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    console.log('[Daily Khata] Offline mode active — preserving cached bundle');
    return;
  }
  const reloadKey = 'khata_chunk_reload_attempt';
  const lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
  const now = Date.now();
  // Debounce to prevent reload loops (max once per 10s)
  if (now - lastReload > 10000) {
    sessionStorage.setItem(reloadKey, now.toString());
    const targetUrl = window.location.origin + window.location.pathname + '?_heal=' + now;
    const cachesApi = window.caches;
    if (cachesApi) {
      cachesApi.keys().then((keys) => Promise.all(keys.map((k) => cachesApi.delete(k)))).finally(() => {
        window.location.replace(targetUrl);
      });
    } else {
      window.location.replace(targetUrl);
    }
  }
});

// Mount React Root
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary 
        fallbackTitle="Application Boot Issue" 
        fallbackMessage="A display error occurred during app startup. Your saved records in device storage are 100% safe."
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>,
  );
}

// Safely dismiss preloader once React has painted its initial DOM
const dismissPreloader = () => {
  (window as unknown as { __APP_MOUNTED__?: boolean }).__APP_MOUNTED__ = true;
  sessionStorage.removeItem('khata_boot_recovery_attempt_v271');
  sessionStorage.removeItem('khata_boot_recovery_attempt_v272');
  sessionStorage.removeItem('khata_boot_recovery_attempt_v273');
  const preloader = document.getElementById('app-preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 400);
  }
};

if (typeof requestAnimationFrame !== 'undefined') {
  requestAnimationFrame(() => {
    requestAnimationFrame(dismissPreloader);
  });
} else {
  setTimeout(dismissPreloader, 100);
}

