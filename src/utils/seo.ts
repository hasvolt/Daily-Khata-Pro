/**
 * Daily Khata Pro — Comprehensive Dynamic SEO & Canonical Tag Manager
 * Updates document.title, meta description, canonical URL, and OpenGraph tags
 * dynamically per route so Google Search Console indexes all subpages cleanly
 * without canonical conflicts or duplicate page errors.
 */

export interface PageSEOMeta {
  title: string;
  description: string;
  canonicalPath: string;
}

const BASE_URL = 'https://rozfiber.com';

export const ROUTE_SEO_MAP: Record<string, PageSEOMeta> = {
  '/': {
    title: 'Daily Khata Pro — Universal Financial Ledger & 6-Fund Accounting',
    description: 'Universal professional daily income & expense ledger with automated 6-fund wealth allocation, financial goals, work deliverables, and daily life timeline tracker. 100% offline-first and private.',
    canonicalPath: '/'
  },
  '/developer': {
    title: 'Developer Profile — MD Zafeer Hasan (YAZDAAN) | Daily Khata Pro',
    description: 'Official developer profile and background of MD Zafeer Hasan (YAZDAAN), independent software developer, security researcher, and creator of Daily Khata Pro.',
    canonicalPath: '/developer'
  },
  '/dev': {
    title: 'Developer Profile — MD Zafeer Hasan (YAZDAAN) | Daily Khata Pro',
    description: 'Official developer profile and background of MD Zafeer Hasan (YAZDAAN), creator of Daily Khata Pro.',
    canonicalPath: '/developer'
  },
  '/about': {
    title: 'About Daily Khata Pro — Universal Financial Record & Mission',
    description: 'Learn about Daily Khata Pro: 100% offline-first architecture, 6 core financial pillars, open-source MIT license, and private financial wealth management philosophy.',
    canonicalPath: '/about'
  },
  '/privacy': {
    title: 'Privacy Policy — 100% Local Device Storage | Daily Khata Pro',
    description: 'Daily Khata Pro Privacy Policy. Your financial ledger data is stored 100% locally on your device in IndexedDB/localStorage with zero cloud tracking and zero data collection.',
    canonicalPath: '/privacy'
  },
  '/terms': {
    title: 'Terms of Service — MIT Open Source | Daily Khata Pro',
    description: 'Terms of Service and legal license agreements for Daily Khata Pro universal financial ledger application.',
    canonicalPath: '/terms'
  },
  '/disclaimer': {
    title: 'Financial & Legal Disclaimer — Daily Khata Pro',
    description: 'Financial computation and accuracy disclaimer for Daily Khata Pro personal accounting and ledger calculator tools.',
    canonicalPath: '/disclaimer'
  },
  '/guide': {
    title: 'User Manual & 6-Fund Wealth Guide — Daily Khata Pro',
    description: 'Comprehensive operational manual, keyboard shortcuts, PIN security guide, and 6-fund wealth allocation rules for Daily Khata Pro.',
    canonicalPath: '/guide'
  },
  '/safety': {
    title: 'Safety, Security & Source Code Audit — Daily Khata Pro',
    description: 'Security protocols, PIN lock vault isolation, cryptographic data backup procedures, and open-source verification for Daily Khata Pro.',
    canonicalPath: '/safety'
  },
  '/calculator': {
    title: 'Financial & Mathematical Calculators — Daily Khata Pro',
    description: 'Advanced financial calculation suite: 6-Fund Rule Calculator, Compound Interest, SIP Planner, GST Calculator, Split Bill, and Currency Tools.',
    canonicalPath: '/calculator'
  },
  '/support': {
    title: 'Help Centre & Technical Support — Daily Khata Pro',
    description: 'Official Help Centre, diagnostic reporting, bug reporting, and contact portal for Daily Khata Pro users.',
    canonicalPath: '/support'
  },
  '/history': {
    title: 'Passbook & Transaction History — Daily Khata Pro',
    description: 'Search, filter, edit, and export your complete financial passbook and income/expense transaction ledger statements.',
    canonicalPath: '/history'
  },
  '/report': {
    title: 'Financial Analytics & Fund Breakdown — Daily Khata Pro',
    description: 'Interactive analytics, category charts, 6-fund distribution percentages, and net wealth accumulation reports.',
    canonicalPath: '/report'
  },
  '/goals': {
    title: 'Savings Goals & Target Milestones — Daily Khata Pro',
    description: 'Track long-term and short-term savings targets, milestone progress bars, and dedicated goal vaults.',
    canonicalPath: '/goals'
  },
  '/tracker': {
    title: 'Work Deliverables & Daily Life Journal — Daily Khata Pro',
    description: 'Integrated work attendance, daily milestone logging, shift tracker, and life event journal.',
    canonicalPath: '/tracker'
  },
  '/notes': {
    title: 'Confidential Notes & Scratchpad — Daily Khata Pro',
    description: 'Secure, offline personal notes, financial ideas, bill reminders, and encrypted scratchpad.',
    canonicalPath: '/notes'
  }
};

/**
 * Updates document meta tags, canonical URL, and title for SEO bots & browsers
 */
export function updatePageSEO(pathname: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  const seo = ROUTE_SEO_MAP[cleanPath] || {
    title: 'Daily Khata Pro — Universal Financial Ledger',
    description: 'Universal daily income and expense ledger with automated 6-fund allocation. 100% offline-first and private.',
    canonicalPath: cleanPath
  };

  // 1. Update Title
  document.title = seo.title;

  // 2. Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', seo.description);

  // 3. Update Canonical Tag (Crucial for Google Search Console)
  const canonicalUrl = `${BASE_URL}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonicalUrl);

  // 4. Update OpenGraph URL and Title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', seo.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', seo.description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

  // 5. Update Twitter URL and Title
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', seo.title);

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', seo.description);

  const twUrl = document.querySelector('meta[name="twitter:url"]');
  if (twUrl) twUrl.setAttribute('content', canonicalUrl);
}
