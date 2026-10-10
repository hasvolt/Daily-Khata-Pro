/**
 * Rozfiber Ecosystem Applications Directory
 * -------------------------------------------------------------
 * Central configuration file for all official Rozfiber digital products,
 * platforms, and developer tools.
 * 
 * To add a new Rozfiber app in the future:
 * 1. Add an entry to the `ROZFIBER_APPS` array below.
 * 2. It will automatically appear in:
 *    - Main Menu Drawer (under "Rozfiber Apps & Ecosystem")
 *    - Quick Apps Launcher Modal (RozfiberAppsModal)
 *    - Dedicated Ecosystem Hub Page (/apps route)
 *    - Global Search Palette (PageSearchModal)
 *    - Global Footer Links
 */

export interface RozfiberAppItem {
  id: string;
  name: string;
  tagline: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  url: string;
  displayUrl: string;
  category: 'business' | 'documentation' | 'finance' | 'utility';
  categoryLabel: {
    en: string;
    hi: string;
  };
  status: 'live' | 'deployment' | 'new' | 'beta' | 'coming-soon';
  statusBadge: {
    en: string;
    hi: string;
  };
  badgeTheme: 'emerald' | 'sky' | 'amber' | 'indigo' | 'purple';
  iconType: 'users' | 'book-open' | 'wallet' | 'layers' | 'building' | 'globe';
  colorGradient: string;
  highlights: {
    en: string[];
    hi: string[];
  };
  isOfficial: boolean;
  isCurrentApp?: boolean;
  featured?: boolean;
  releaseYear: string;
}

export const ROZFIBER_ECOSYSTEM_META = {
  brandName: 'Rozfiber',
  ecosystemTitle: {
    en: 'Rozfiber Official Apps Ecosystem',
    hi: 'रॉज़फ़ाइबर आधिकारिक ऐप्स इकोसिस्टम'
  },
  ecosystemSubtitle: {
    en: 'Modern, privacy-first digital tools & platforms built for local business owners, contractors, creators & professionals.',
    hi: 'स्थानीय व्यापार मालिकों, ठेकेदारों, दुकानदारों और पेशेवरों के लिए आधुनिक व सुरक्षित डिजिटल टूल्स।'
  },
  officialWebsite: 'https://www.rozfiber.com',
  officialDocs: 'https://docs.rozfiber.com',
  supportEmail: 'daily-Khata-Pro@gmail.com'
};

export const ROZFIBER_APPS: RozfiberAppItem[] = [
  // 1. Staff Manager (New Universal Staff Management System)
  {
    id: 'staff-manager',
    name: 'Staff Manager',
    tagline: {
      en: 'Universal Staff, Attendance, Wage & Contractor Management System',
      hi: 'यूनिवर्सल स्टाफ, दैनिक हाजिरी, दिहाड़ी व ठेकेदार प्रबंधन प्रणाली'
    },
    description: {
      en: 'A standalone progressive web app for local business owners, shopkeepers, contractors, workshops, farms, small factories and households. Track daily attendance, work entries, wages, advances, deductions, salary slips, and professional reports. Works 100% offline with multi-device cloud sync.',
      hi: 'लोकल बिजनेस ओनर्स, दुकानदारों, ठेकेदारों, वर्कशॉप, फार्म और छोटे कारखानों के लिए यूनिवर्सल स्टाफ प्रबंधन। दैनिक हाजिरी (अटेंडेंस), काम का रिकॉर्ड, दैनिक मजदूरी, एडवांस, कटौती, वेतन पर्ची और विस्तृत रिपोर्ट्स ट्रैक करें। 100% ऑफलाइन कार्य और मल्टी-डिवाइस क्लाउड सिंक सुविधा।'
    },
    url: 'https://staff.rozfiber.com',
    displayUrl: 'staff.rozfiber.com',
    category: 'business',
    categoryLabel: {
      en: 'Business & Workforce',
      hi: 'व्यापार व स्टाफ प्रबंधन'
    },
    status: 'deployment',
    statusBadge: {
      en: 'Live Deployment',
      hi: 'लाइव डिप्लॉयमेंट'
    },
    badgeTheme: 'emerald',
    iconType: 'users',
    colorGradient: 'from-emerald-500 to-teal-600',
    featured: true,
    releaseYear: '2026',
    isOfficial: true,
    highlights: {
      en: [
        '1-Tap Daily Attendance (Present, Absent, Half-Day, Leave, Overtime)',
        'Daily wage, monthly salary, hourly & piece-rate automatic math',
        'Staff advances (उधार / पेशगी), bonuses, deductions & staff ledger',
        'Printable salary slips & PDF statements with business logo',
        '100% Offline-first (IndexedDB) with real-time cloud sync',
        'Multi-user role access (Owner, Manager, Supervisor, Accountant)'
      ],
      hi: [
        'एक-टैप में दैनिक हाजिरी (उपस्थित, अनुपस्थित, हाफ-डे, छुट्टी, ओवरटाइम)',
        'दैनिक दिहाड़ी, मासिक वेतन, घंटे व प्रति-पीस दर की स्वचालित गणना',
        'स्टाफ एडवांस (उधार / पेशगी), बोनस, कटौती व संपूर्ण स्टाफ खाता',
        'बिज़नेस लोगो सहित सैलरी स्लिप व विस्तृत पीडीएफ रिपोर्ट्स',
        '100% ऑफलाइन लोकल स्टोरेज + मल्टी-डिवाइस रियल-टाइम क्लाउड सिंक',
        'मालिक, मैनेजर, सुपरवाइजर व अकाउंटेंट मल्टी-रोल सपोर्ट'
      ]
    }
  },

  // 2. Rozfiber Docs (Official Documentation App)
  {
    id: 'docs',
    name: 'Rozfiber Docs',
    tagline: {
      en: 'Official Documentation & Knowledge Base for Rozfiber Apps',
      hi: 'रोज़फाइबर के सभी आधिकारिक ऐप्स के लिए यूज़र मैनुअल व गाइड'
    },
    description: {
      en: 'Comprehensive step-by-step documentation, user guides, setup tutorials, calculation formulas, and best practices for all official Rozfiber applications and digital tools.',
      hi: 'रोज़फाइबर के सभी आधिकारिक डिजिटल प्रोडक्ट्स व टूल्स के लिए संपूर्ण यूजर गाइड्स, विस्तृत ट्यूटोरियल्स, फीचर स्पष्टीकरण और सर्वोत्तम उपयोग नियम।'
    },
    url: 'https://docs.rozfiber.com',
    displayUrl: 'docs.rozfiber.com',
    category: 'documentation',
    categoryLabel: {
      en: 'Official Documentation',
      hi: 'आधिकारिक दस्तावेज़'
    },
    status: 'live',
    statusBadge: {
      en: 'Official Docs',
      hi: 'आधिकारिक डॉक्स'
    },
    badgeTheme: 'sky',
    iconType: 'book-open',
    colorGradient: 'from-sky-500 to-blue-600',
    featured: true,
    releaseYear: '2026',
    isOfficial: true,
    highlights: {
      en: [
        'Complete user manuals for Daily Khata Pro & Staff Manager',
        'Offline storage & Google Drive cloud backup walkthroughs',
        '6-pot wealth rule & mathematical calculation formulas',
        'Instant keyword topic search & multilingual help articles'
      ],
      hi: [
        'डेली खाता प्रो और स्टाफ मैनेजर के लिए संपूर्ण यूजर मैनुअल',
        'ऑफलाइन स्टोरेज व गूगल ड्राइव बैकअप ट्यूटोरियल',
        '6-फंड वित्तीय नियम व गणितीय फॉर्मूला व्याख्या',
        'त्वरित विषय खोज व बहुभाषी सहायता दस्तावेज़'
      ]
    }
  },

  // 3. Daily Khata Pro (Current Active App)
  {
    id: 'daily-khata-pro',
    name: 'Daily Khata Pro',
    tagline: {
      en: 'Privacy-First Financial Ledger & 6-Fund Wealth Pot System',
      hi: 'प्राइवेसी-फर्स्ट डिजिटल बहीखाता व 6-फंड वित्तीय प्रणाली'
    },
    description: {
      en: 'The flagship 100% offline digital income and expense ledger. Features 6-pot disciplined fund budgeting, multi-currency support, loans & EMIs, attendance, invoice generator, and wealth academy.',
      hi: 'फ्लैगशिप 100% ऑफलाइन आय-व्यय व डिजिटल बहीखाता। 6-फंड बचत अनुशासन, बहु-मुद्रा सपोर्ट, ऋण व किश्तें, अटेंडेंस, इनवॉइस जनरेटर और वेल्थ अकादमी।'
    },
    url: 'https://www.rozfiber.com',
    displayUrl: 'rozfiber.com',
    category: 'finance',
    categoryLabel: {
      en: 'Finance & Ledger',
      hi: 'वित्त व बहीखाता'
    },
    status: 'live',
    statusBadge: {
      en: 'Active App',
      hi: 'वर्तमान ऐप'
    },
    badgeTheme: 'indigo',
    iconType: 'wallet',
    colorGradient: 'from-indigo-500 to-purple-600',
    isCurrentApp: true,
    featured: false,
    releaseYear: '2026',
    isOfficial: true,
    highlights: {
      en: [
        'Zero-telemetry 100% offline privacy',
        'Automated 6-pot income splitting rule',
        'Loan, udhar, and monthly EMI tracker',
        'Built-in financial calculators & wealth academy'
      ],
      hi: [
        'शून्य ट्रैकिंग 100% ऑफलाइन प्राइवेसी',
        'आय का स्वचालित 6-फंड विभाजन नियम',
        'उधार, लोन व मासिक किश्त ट्रैकर',
        'इनबिल्ट वित्तीय कैलकुलेटर व वेल्थ अकादमी'
      ]
    }
  }
];

/**
 * Get all external apps (excluding the current app)
 */
export const getExternalRozfiberApps = (): RozfiberAppItem[] => {
  return ROZFIBER_APPS.filter(app => !app.isCurrentApp);
};

/**
 * Get app by ID
 */
export const getRozfiberAppById = (id: string): RozfiberAppItem | undefined => {
  return ROZFIBER_APPS.find(app => app.id === id);
};
