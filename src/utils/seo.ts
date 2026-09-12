/**
 * Daily Khata Pro — Comprehensive Dynamic SEO & Canonical Tag Manager
 * Updates document.title, meta description, canonical URL, and OpenGraph tags
 * dynamically per route so Google Search Console indexes all subpages cleanly
 * without canonical conflicts or duplicate page errors.
 */

import { ACADEMY_ARTICLES } from '../data/wealthAcademy';
import { COMMERCIAL_ARTICLES } from '../data/newsPortalData';

export interface PageSEOMeta {
  title: string;
  description: string;
  canonicalPath: string;
}

const PRIMARY_DOMAIN = 'https://rozfiber.com';

function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    // If running on rozfiber.com or preview run.app domain, preserve canonical domain appropriately
    if (origin.includes('rozfiber.com')) {
      return PRIMARY_DOMAIN;
    }
    return origin;
  }
  return PRIMARY_DOMAIN;
}

export const ROUTE_SEO_MAP: Record<string, PageSEOMeta> = {
  '/': {
    title: 'Daily Khata Pro — Universal Financial Records & 6-Fund Accounting',
    description: 'Universal professional daily income & expense record with automated 6-fund wealth allocation, financial goals, work deliverables, and daily life timeline tracker. 100% offline-first and private.',
    canonicalPath: '/'
  },
  '/academy': {
    title: 'Wealth Academy — Financial Education & Mastery | Daily Khata Pro',
    description: 'Learn the secrets of wealth, budgeting, and financial discipline in our comprehensive Wealth Academy. 40+ articles to help you master your money.',
    canonicalPath: '/academy'
  },
  '/about': {
    title: 'About Daily Khata Pro — Universal Financial Record & Mission',
    description: 'Learn about Daily Khata Pro: 100% offline-first architecture, 6 core financial pillars, open-source MIT license, and private financial wealth management philosophy.',
    canonicalPath: '/about'
  },
  '/privacy': {
    title: 'Privacy Policy — 100% Local Device Storage | Daily Khata Pro',
    description: 'Daily Khata Pro Privacy Policy. Your financial records data is stored 100% locally on your device in IndexedDB/localStorage with zero cloud tracking and zero data collection.',
    canonicalPath: '/privacy'
  },
  '/cookies': {
    title: 'Cookies & Storage Policy — Transparency & User Consent | Daily Khata Pro',
    description: 'Daily Khata Pro Cookies and Storage Policy. Learn how we use local storage and essential cookies to keep your accounting data private on your device.',
    canonicalPath: '/cookies'
  },
  '/terms': {
    title: 'Terms of Service — MIT Open Source | Daily Khata Pro',
    description: 'Terms of Service and legal license agreements for Daily Khata Pro universal financial records application.',
    canonicalPath: '/terms'
  },
  '/disclaimer': {
    title: 'Financial & Legal Disclaimer — Daily Khata Pro',
    description: 'Financial computation and accuracy disclaimer for Daily Khata Pro personal accounting and record tools.',
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
    description: 'Search, filter, edit, and export your complete financial passbook and income/expense transaction record statements.',
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
  },
  '/loans': {
    title: 'Loan & Udhar Ledger — Credit, Debt & Customer Balances | Daily Khata Pro',
    description: 'Track money given (Udhar/Receivable) and money borrowed (Payable) with automatic net balance, due dates, and settlement logs. 100% private.',
    canonicalPath: '/loans'
  },
  '/news': {
    title: 'Commercial News & Market Research Intelligence — Daily Khata Pro',
    description: 'Global macroeconomics, fintech analysis, taxation updates, and financial research reports for smart business decisions.',
    canonicalPath: '/news'
  },
  '/developer': {
    title: 'Developer Profile & Creator — MD Zafeer Hasan (YAZDAAN) | Daily Khata Pro',
    description: 'Meet the independent creator and developer behind Daily Khata Pro. Engineering philosophy, open-source architecture, and transparency.',
    canonicalPath: '/developer'
  },
  '/attendance': {
    title: 'Work Attendance & Shift Tracker — Daily Khata Pro',
    description: 'Track daily work shifts, present/absent logs, overtime hours, and monthly attendance records directly inside your financial ledger.',
    canonicalPath: '/attendance'
  },
  '/add': {
    title: 'Add Income or Expense Entry — Daily Khata Pro',
    description: 'Log daily earnings and expenses with automatic 6-fund disciplined allocation or custom category deduction.',
    canonicalPath: '/add'
  },
  '/support-project': {
    title: 'Support Daily Khata Pro — Star, Share & Contribute',
    description: 'Support the offline-first personal financial manager Daily Khata Pro. Star on GitHub, share with friends, or send feature feedback.',
    canonicalPath: '/support-project'
  }
};

/**
 * Updates document meta tags, canonical URL, and title for SEO bots & browsers
 */
export function updatePageSEO(pathname: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  
  let seo = ROUTE_SEO_MAP[cleanPath];

  // Dynamic Academy Article SEO
  if (!seo && cleanPath.startsWith('/academy/')) {
    const articleId = cleanPath.split('/').pop();
    const article = ACADEMY_ARTICLES.find(a => a.id === articleId);
    if (article) {
      seo = {
        title: `${article.title} — Wealth Academy | Daily Khata Pro`,
        description: article.description,
        canonicalPath: cleanPath
      };
    }
  }

  // Dynamic News & Research Article SEO
  if (!seo && cleanPath.startsWith('/news/')) {
    const newsId = cleanPath.split('/').pop();
    const newsItem = COMMERCIAL_ARTICLES.find(a => a.id === newsId);
    if (newsItem) {
      seo = {
        title: `${newsItem.title} — Commercial News & Research | Daily Khata Pro`,
        description: newsItem.subtitle || newsItem.hindiSubtitle || 'Commercial and market research whitepaper.',
        canonicalPath: cleanPath
      };
    }
  }

  if (!seo) {
    seo = {
      title: 'Daily Khata Pro — Universal Financial Records',
      description: 'Universal daily income and expense record with automated 6-fund allocation. 100% offline-first and private.',
      canonicalPath: cleanPath
    };
  }

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
  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;
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
