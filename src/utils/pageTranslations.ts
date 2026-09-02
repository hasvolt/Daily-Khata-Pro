import { AppLanguage, FundType } from '../types';

export interface PageTranslations {
  about: {
    backToHome: string;
    badge: string;
    title: string;
    subtitle: string;
    platformLabel: string;
    architectureLabel: string;
    architectureValue: string;
    licenseLabel: string;
    creatorLabel: string;
    missionTitle: string;
    missionP1: string;
    missionP2: string;
    capabilitiesTitle: string;
    pillars: {
      fundsTitle: string;
      fundsDesc: string;
      privacyTitle: string;
      privacyDesc: string;
      journalTitle: string;
      journalDesc: string;
      backupTitle: string;
      backupDesc: string;
    };
    contactsTitle: string;
    contactsDesc: string;
    officialWebsite: string;
    officialSupport: string;
    githubRepo: string;
    instaProfile: string;
    twitterProfile: string;
  };
  privacy: {
    badge: string;
    title: string;
    subtitle: string;
    backToHome: string;
    corePledgeTitle: string;
    corePledgeDesc: string;
    highlights: {
      offlineTitle: string;
      offlineDesc: string;
      noCookiesTitle: string;
      noCookiesDesc: string;
      localVaultTitle: string;
      localVaultDesc: string;
      exportControlTitle: string;
      exportControlDesc: string;
    };
    dataRetentionTitle: string;
    dataRetentionDesc: string;
    thirdPartyTitle: string;
    thirdPartyDesc: string;
    userRightsTitle: string;
    userRightsDesc: string;
  };
  terms: {
    badge: string;
    title: string;
    subtitle: string;
    backToHome: string;
    openSourceTitle: string;
    openSourceDesc: string;
    termsList: {
      ownershipTitle: string;
      ownershipDesc: string;
      usageTitle: string;
      usageDesc: string;
      disclaimerTitle: string;
      disclaimerDesc: string;
      backupTitle: string;
      backupDesc: string;
    };
  };
  disclaimer: {
    badge: string;
    title: string;
    subtitle: string;
    backToHome: string;
    alertTitle: string;
    alertDesc: string;
    sections: {
      nonAdvisoryTitle: string;
      nonAdvisoryDesc: string;
      calculationTitle: string;
      calculationDesc: string;
      selfResponsibilityTitle: string;
      selfResponsibilityDesc: string;
    };
  };
  safety: {
    badge: string;
    title: string;
    subtitle: string;
    backToHome: string;
    vaultProtectionTitle: string;
    vaultProtectionDesc: string;
    pillars: {
      pinTitle: string;
      pinDesc: string;
      maskTitle: string;
      maskDesc: string;
      wipeTitle: string;
      wipeDesc: string;
      backupTitle: string;
      backupDesc: string;
    };
    bestPracticesTitle: string;
    bestPractices: string[];
  };
  developer: {
    badge: string;
    title: string;
    subtitle: string;
    backToHome: string;
    bioTitle: string;
    bioDesc: string;
    skillsTitle: string;
    visionTitle: string;
    visionDesc: string;
    connectTitle: string;
    connectDesc: string;
  };
  support: {
    badge: string;
    title: string;
    subtitle: string;
    backToHome: string;
    faqTitle: string;
    faqs: Array<{ q: string; a: string }>;
    contactCards: {
      emailTitle: string;
      emailDesc: string;
      githubTitle: string;
      githubDesc: string;
      docsTitle: string;
      docsDesc: string;
    };
  };
  homeSubtitles: { [K in FundType]?: string } & Record<'personal' | 'family' | 'buffer' | 'emergency' | 'saving' | 'investment', string>;
  common: {
    back: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    deposit: string;
    filter: string;
    search: string;
    today: string;
    thisMonth: string;
    netBalanceDesc: string;
    disciplinedSplit: string;
    safeOffline: string;
    viewLedger: string;
    todaysNet: string;
  };
}

export const PAGE_TRANSLATIONS: Record<AppLanguage, PageTranslations> = {
  en: {
    about: {
      backToHome: 'Back to Home',
      badge: 'About Daily Khata: Pro',
      title: 'About Daily Khata: Pro™',
      subtitle: 'Universal Financial Ledger, 6-Fund Rule Money Manager, Work Deliverables & Daily Life Journal.',
      platformLabel: 'Platform',
      architectureLabel: 'Architecture',
      architectureValue: '100% Local Storage',
      licenseLabel: 'License',
      creatorLabel: 'Creator',
      missionTitle: 'Our Mission & Purpose',
      missionP1: 'Daily Khata: Pro was created with a single uncompromising mission: to give individuals, freelancers, shopkeepers, and families an honest, lightning-fast financial ledger that respects their complete privacy without requiring cloud logins, phone number tracking, or hidden subscriptions.',
      missionP2: 'Most modern finance apps upload your transactions to remote servers, mine your purchasing behavior for marketing, or lock essential export features behind paywalls. Daily Khata: Pro flips this model entirely — your data never leaves your browser or phone, all calculations happen instantly on your device, and every single feature is permanently free under the MIT Open Source license.',
      capabilitiesTitle: 'Core Capabilities & Architecture',
      pillars: {
        fundsTitle: 'Automated 6-Fund Allocation Rule',
        fundsDesc: 'Whenever you log an income entry, Daily Khata Pro automatically allocates it across 6 intelligent pots: Personal (30%), Family (30%), Buffer (10%), Emergency (10%), Savings (10%), and Investment (10%). Percentages are completely customizable in Settings.',
        privacyTitle: 'Zero-Knowledge Client Storage',
        privacyDesc: 'Your entries are saved exclusively in your device LocalStorage. No centralized database, no server tracking, and zero tracking cookies.',
        journalTitle: 'Work & Daily Life Journal',
        journalDesc: 'Track project deliverables, client billing, billable hours, morning/night routines, moods, and key learnings alongside your financial transactions in a unified view.',
        backupTitle: 'Print, PDF & JSON Backup',
        backupDesc: 'Export high-resolution monthly print statements, clean accounting invoices, or complete JSON backup archives in one click. Restore your data anytime on any device.'
      },
      contactsTitle: 'Official Support & Social Channels',
      contactsDesc: 'For suggestions, technical support, bug reports, and official communication, use our verified channels below:',
      officialWebsite: 'Official Domain & Website',
      officialSupport: 'Official Support & Contact',
      githubRepo: 'Open Source GitHub Repository',
      instaProfile: 'Official Instagram Profile',
      twitterProfile: 'Official X (Twitter) Profile'
    },
    privacy: {
      badge: 'Privacy Policy',
      title: 'Privacy Policy & Zero Data Collection',
      subtitle: 'Your financial data is 100% local, self-custodied, and never transmitted over the internet.',
      backToHome: 'Back to Home',
      corePledgeTitle: 'Zero Tracking & Complete Confidentiality',
      corePledgeDesc: 'Daily Khata: Pro operates on a strict zero-knowledge architecture. We do not maintain any cloud database, user accounts, or analytics trackers.',
      highlights: {
        offlineTitle: '100% Offline & Private',
        offlineDesc: 'All transactions, notes, goals, and journal entries are computed and stored directly on your browser or device.',
        noCookiesTitle: 'Zero Cookies & Telemetry',
        noCookiesDesc: 'We do not set tracking cookies, analytics scripts, or user fingerprinting scripts.',
        localVaultTitle: 'Client-Side PIN Security',
        localVaultDesc: 'Optional PIN security is checked entirely within your browser runtime without network calls.',
        exportControlTitle: 'Full Data Sovereignty',
        exportControlDesc: 'You can export, backup, or wipe all data at any moment with single-click tools.'
      },
      dataRetentionTitle: 'Data Retention & Control',
      dataRetentionDesc: 'Since all records remain in your browser LocalStorage, you retain complete authority over your financial data. Clearing browser site data or pressing Reset will permanently purge all local records.',
      thirdPartyTitle: 'Third-Party Services',
      thirdPartyDesc: 'Daily Khata: Pro does not send your personal financial entries, client names, or monetary amounts to any third-party marketing network.',
      userRightsTitle: 'Your Data Rights',
      userRightsDesc: 'You have full rights to export your data into standard JSON/CSV files, inspect the open-source code, and run this application offline without internet connectivity.'
    },
    terms: {
      badge: 'Terms of Service',
      title: 'Terms of Service & Open Source License',
      subtitle: 'Standard MIT Open Source License Terms • Official Domain: rozfiber.com',
      backToHome: 'Back to Home',
      openSourceTitle: 'MIT Open Source License Agreement',
      openSourceDesc: 'Daily Khata: Pro is provided free and open-source under the terms of the MIT License.',
      termsList: {
        ownershipTitle: '1. Absolute Data Ownership',
        ownershipDesc: 'You retain 100% exclusive ownership and responsibility over all financial records, personal notes, and data entered.',
        usageTitle: '2. Lawful & Personal Use',
        usageDesc: 'You may freely use this application for personal budgeting, family accounting, freelance logs, or commercial shop bookkeeping.',
        disclaimerTitle: '3. No Financial Warranty',
        disclaimerDesc: 'This software is an organizational calculation tool, not a certified legal accountant or tax consultant.',
        backupTitle: '4. Backup Responsibility',
        backupDesc: 'Because data is stored only on your client device, maintaining regular JSON backup copies is the user responsibility.'
      }
    },
    disclaimer: {
      badge: 'Legal Disclaimer',
      title: 'Financial & Legal Disclaimer',
      subtitle: 'Important notice regarding automated calculations, tax estimations, and self-custodied financial ledgers.',
      backToHome: 'Back to Home',
      alertTitle: 'Informational & Educational Calculator Tool',
      alertDesc: 'Daily Khata: Pro is an offline organizational tool. It does not provide certified financial, investment, or legal tax advice.',
      sections: {
        nonAdvisoryTitle: '1. Non-Advisory Nature',
        nonAdvisoryDesc: 'The 6-Fund allocation rule is a financial rule-of-thumb. You should customize the ratios in Settings to suit your personal situation.',
        calculationTitle: '2. Calculation Accuracy',
        calculationDesc: 'While all mathematical algorithms are thoroughly tested, users must independently verify numbers before filing taxes.',
        selfResponsibilityTitle: '3. Data Custody & Backups',
        selfResponsibilityDesc: 'Without a central server, if your browser cache is wiped without a JSON backup, data cannot be recovered remotely.'
      }
    },
    safety: {
      badge: 'Security Architecture',
      title: 'Safety, PIN Vault & Data Protection',
      subtitle: 'How Daily Khata: Pro keeps your numbers and private reflections safe from prying eyes.',
      backToHome: 'Back to Home',
      vaultProtectionTitle: 'Multi-Layered Local Security Framework',
      vaultProtectionDesc: 'Device-level isolated storage, client-side 4-digit PIN lock, and one-click privacy masking.',
      pillars: {
        pinTitle: '4-Digit Passcode Lock',
        pinDesc: 'Locks the app immediately upon startup or tab blur when enabled.',
        maskTitle: 'Privacy Masking Mode',
        maskDesc: 'Conceals monetary balances with asterisks (••••••) when in public places.',
        wipeTitle: 'Emergency Data Wipe',
        wipeDesc: 'Purges all entries, goals, and notes instantly in case of an emergency.',
        backupTitle: 'Encrypted JSON Backups',
        backupDesc: 'Export clean JSON backup files to store on your personal flash drive or private cloud.'
      },
      bestPracticesTitle: 'Recommended Security Best Practices',
      bestPractices: [
        'Keep 4-digit PIN lock enabled if sharing your computer or phone.',
        'Use Privacy Masking (Eye icon in header) when in transit or coffee shops.',
        'Download a JSON backup at least once a month from Settings > Backup.',
        'Keep your browser up to date.'
      ]
    },
    developer: {
      badge: 'Developer Profile',
      title: 'Developer Profile & Creator',
      subtitle: 'Built with dedication by MD Zafeer Hasan • Dedicated to digital privacy, security research & public resources.',
      backToHome: 'Back to Home',
      bioTitle: 'About MD Zafeer Hasan',
      bioDesc: 'MD Zafeer Hasan is an independent software developer, security researcher, and open-source creator focused on building privacy-first digital tools and public resources for humanity.',
      skillsTitle: 'Professional Roles & Domains',
      visionTitle: 'The Vision Behind Daily Khata: Pro',
      visionDesc: 'To provide every individual, freelancer, and small business owner with a reliable, private financial engine that is 100% free, runs offline, and never monetizes personal user data.',
      connectTitle: 'Connect & Reach Out',
      connectDesc: 'Reach out for feedback, technical collaboration, or open-source contributions via official channels.'
    },
    support: {
      badge: 'Help Center',
      title: 'Support, Helpdesk & FAQs',
      subtitle: 'Find quick answers to common questions or reach out directly to the developer.',
      backToHome: 'Back to Home',
      faqTitle: 'Frequently Asked Questions (FAQ)',
      faqs: [
        {
          q: 'Where is my financial data stored?',
          a: 'Your data is stored 100% locally inside your browser LocalStorage. It is never uploaded to any remote server.'
        },
        {
          q: 'Does this app work offline without internet?',
          a: 'Yes! Daily Khata: Pro is a fully offline Progressive Web App (PWA). You can record transactions and print statements without internet.'
        },
        {
          q: 'How does the 6-Fund Rule work?',
          a: 'When you record income, it automatically splits into 6 pots: Personal (30%), Family (30%), Buffer (10%), Emergency (10%), Savings (10%), and Investment (10%). Customize in Settings.'
        },
        {
          q: 'How do I backup or transfer my data to another device?',
          a: 'Go to Settings > Backup tab and click "Export JSON Backup". On your new device, click "Restore from JSON File".'
        },
        {
          q: 'How do I lock the application with a PIN?',
          a: 'Click the Lock icon in the header or go to Settings > Security Lock to set your 4-digit PIN.'
        }
      ],
      contactCards: {
        emailTitle: 'Direct Email Support',
        emailDesc: 'Email daily-Khata-Pro@gmail.com for priority assistance.',
        githubTitle: 'GitHub Issue Tracker',
        githubDesc: 'Report bugs or suggest features on our repository.',
        docsTitle: 'User Manual & Guides',
        docsDesc: 'Read detailed step-by-step guides for all features.'
      }
    },
    homeSubtitles: {
      personal: 'Personal daily expenses, dining, grooming & lifestyle',
      family: 'House rent, groceries, family support & home utilities',
      business: 'Business revenue, invoices, commerce, inventory & office',
      buffer: 'Quick temporary cushion for unexpected fluctuations',
      emergency: 'Medical, urgent repairs & sudden emergency reserve',
      saving: 'Liquid cash savings & short-term target milestones',
      investment: 'Long-term wealth, SIP, assets & future financial growth'
    },
    common: {
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      deposit: 'Deposit',
      filter: 'Filter',
      search: 'Search...',
      today: 'Today',
      thisMonth: 'This Month',
      netBalanceDesc: 'Consolidated real-time net capital across your 6 disciplined fund pots',
      disciplinedSplit: '100% Disciplined Split Ratio',
      safeOffline: '100% Safe, Private & Offline',
      viewLedger: 'View Full Ledger',
      todaysNet: "Today's Net:"
    }
  },

  hi: {
    about: {
      backToHome: 'होम पर वापस जाएं',
      badge: 'डेली खाता: प्रो के बारे में',
      title: 'डेली खाता: प्रो™ के बारे में',
      subtitle: 'सार्वभौमिक वित्तीय लेज़र, 6-फंड स्मार्ट विभाजन, कार्य डिलीवरेबल्स एवं दैनिक जीवन डायरी।',
      platformLabel: 'प्लेटफ़ॉर्म',
      architectureLabel: 'आर्किटेक्चर',
      architectureValue: '100% लोकल स्टोरेज (ऑफ़लाइन)',
      licenseLabel: 'लाइसेंस',
      creatorLabel: 'निर्माता एवं डेवलपर',
      missionTitle: 'हमारा उद्देश्य एवं मिशन',
      missionP1: 'डेली खाता: प्रो को एक स्पष्ट उद्देश्य के साथ बनाया गया है: प्रत्येक व्यक्ति, विद्यार्थी, फ्रीलांसर, दुकानदार और परिवार को एक ऐसा तेज़, सच्चा और सुरक्षित लेज़र देना जो उनकी पूर्ण गोपनीयता का सम्मान करता है।',
      missionP2: 'पारंपरिक वित्त ऐप्स आपका डेटा दूरस्थ सर्वर पर अपलोड करते हैं। डेली खाता: प्रो में आपका डेटा कभी भी आपके फ़ोन या लैपटॉप से बाहर नहीं जाता। यह MIT ओपन सोर्स लाइसेंस के तहत हमेशा 100% मुफ़्त है।',
      capabilitiesTitle: 'प्रमुख विशेषताएं एवं वास्तुकला',
      pillars: {
        fundsTitle: 'स्वचालित 6-फंड विभाजन नियम',
        fundsDesc: 'कमाई जोड़ते ही यह 6 फंड्स में विभाजित होती है: व्यक्तिगत (30%), परिवार (30%), बफर (10%), इमरजेंसी (10%), बचत (10%) और निवेश (10%)। सेटिंग्स में प्रतिशत बदल सकते हैं।',
        privacyTitle: 'जीरो-नॉलेज क्लाइंट स्टोरेज',
        privacyDesc: 'सभी प्रविष्टियां आपके डिवाइस के लोकल स्टोरेज में सुरक्षित रहती हैं। कोई केंद्रीय डेटाबेस या थर्ड-पार्टी ट्रैकिंग नहीं है।',
        journalTitle: 'कार्य एवं दैनिक जीवन डायरी',
        journalDesc: 'परियोजना डिलीवरेबल्स, बिलिंग घंटे, दिनचर्या, मनोदशा और विचारों को एक ही स्थान पर प्रबंधित करें।',
        backupTitle: 'प्रिंट, PDF एवं JSON बैकअप',
        backupDesc: 'मासिक प्रिंट स्टेटमेंट और संपूर्ण JSON बैकअप एक क्लिक में डाउनलोड करें और किसी भी डिवाइस पर पुनर्स्थापित करें।'
      },
      contactsTitle: 'आधिकारिक सहायता एवं संपर्क',
      contactsDesc: 'सुझाव, तकनीकी सहायता या आधिकारिक संवाद के लिए नीचे दिए गए माध्यमों का उपयोग करें:',
      officialWebsite: 'आधिकारिक वेबसाइट एवं डोमेन',
      officialSupport: 'आधिकारिक सहायता ईमेल',
      githubRepo: 'ओपन सोर्स गिटहब रिपोजिटरी',
      instaProfile: 'आधिकारिक इंस्टाग्राम प्रोफाइल',
      twitterProfile: 'आधिकारिक X (ट्विटर) प्रोफाइल'
    },
    privacy: {
      badge: 'गोपनीयता नीति',
      title: 'गोपनीयता नीति एवं शून्य डेटा संग्रहण',
      subtitle: 'आपका वित्तीय डेटा 100% स्थानीय, निजी और इंटरनेट पर कभी भी साझा नहीं किया जाता।',
      backToHome: 'होम पर वापस जाएं',
      corePledgeTitle: 'शून्य ट्रैकिंग एवं पूर्ण गोपनीयता',
      corePledgeDesc: 'डेली खाता: प्रो सख्त जीरो-नॉलेज आर्किटेक्चर पर संचालित होता है। हम कोई व्यक्तिगत डेटा संग्रहीत नहीं करते।',
      highlights: {
        offlineTitle: '100% ऑफ़लाइन एवं निजी',
        offlineDesc: 'सभी लेन-देन और प्रविष्टियां सीधे आपके ब्राउज़र में संसाधित होती हैं।',
        noCookiesTitle: 'शून्य ट्रैकिंग कुकीज़',
        noCookiesDesc: 'हम कोई ट्रैकिंग स्क्रिप्ट या गुप्त कुकीज उपयोग नहीं करते।',
        localVaultTitle: 'लोकल पिन सुरक्षा लॉक',
        localVaultDesc: 'सुरक्षा पिन कोड केवल आपके ब्राउज़र में जाँचा जाता है।',
        exportControlTitle: 'डेटा पर पूर्ण नियंत्रण',
        exportControlDesc: 'आप कभी भी एक क्लिक में अपना डेटा बैकअप ले सकते हैं या पूरी तरह हटा सकते हैं।'
      },
      dataRetentionTitle: 'डेटा भंडारण और नियंत्रण',
      dataRetentionDesc: 'चूंकि सभी रिकॉर्ड केवल आपके ब्राउज़र में रहते हैं, इसलिए डेटा पर 100% आपका अधिकार है।',
      thirdPartyTitle: 'थर्ड-पार्टी सेवाएं',
      thirdPartyDesc: 'डेली खाता: प्रो आपका कोई भी व्यक्तिगत या वित्तीय डेटा किसी बाहरी कंपनी को नहीं भेजता।',
      userRightsTitle: 'आपके डेटा अधिकार',
      userRightsDesc: 'आपको अपना डेटा JSON/CSV में डाउनलोड करने और बिना इंटरनेट ऑफ़लाइन चलाने का पूरा अधिकार है।'
    },
    terms: {
      badge: 'नियम एवं शर्तें',
      title: 'नियम, शर्तें एवं ओपन सोर्स लाइसेंस',
      subtitle: 'मानक MIT ओपन सोर्स शर्तें • आधिकारिक डोमेन: rozfiber.com',
      backToHome: 'होम पर वापस जाएं',
      openSourceTitle: 'MIT ओपन सोर्स लाइसेंस समझौता',
      openSourceDesc: 'डेली खाता: प्रो MIT लाइसेंस के तहत पूरी तरह से मुफ़्त और ओपन सोर्स उपलब्ध है।',
      termsList: {
        ownershipTitle: '1. डेटा का पूर्ण स्वामित्व',
        ownershipDesc: 'आपके द्वारा दर्ज किए गए सभी लेन-देन और रिकॉर्ड्स पर 100% आपका ही मालिकाना हक है।',
        usageTitle: '2. उचित उपयोग',
        usageDesc: 'आप व्यक्तिगत बजटिंग, दुकान के बहीखाता या व्यावसायिक प्रबंधन के लिए इसका उपयोग कर सकते हैं।',
        disclaimerTitle: '3. कोई वित्तीय वारंटी नहीं',
        disclaimerDesc: 'यह सॉफ़्टवेयर एक संगठनात्मक कैलकुलेटर टूल है, कोई प्रमाणित टैक्स या कानूनी सलाहकार नहीं।',
        backupTitle: '4. बैकअप की जिम्मेदारी',
        backupDesc: 'क्योंकि डेटा केवल आपके डिवाइस में रहता है, इसलिए नियमित बैकअप लेना उपयोगकर्ता की ज़िम्मेदारी है।'
      }
    },
    disclaimer: {
      badge: 'कानूनी अस्वीकरण',
      title: 'वित्तीय एवं कानूनी अस्वीकरण',
      subtitle: 'वित्तीय मार्गदर्शन, कर गणना और आत्म-संरक्षित बहीखाते से संबंधित महत्वपूर्ण सूचना।',
      backToHome: 'होम पर वापस जाएं',
      alertTitle: 'सूचनात्मक और शैक्षिक कैलकुलेटर टूल',
      alertDesc: 'डेली खाता: प्रो एक गणितीय और बहीखाता प्रबंधन उपकरण है। यह कोई प्रमाणित वित्तीय सलाह नहीं देता।',
      sections: {
        nonAdvisoryTitle: '1. गैर-सलाहकारी प्रकृति',
        nonAdvisoryDesc: '6-फंड विभाजन नियम एक सामान्य वित्तीय नियम है। सेटिंग्स में प्रतिशत अपनी सुविधानुसार बदलें।',
        calculationTitle: '2. गणना की सटीकता',
        calculationDesc: 'सरकारी टैक्स फाइलिंग या ऑडिट के लिए अंकों की पुनः पुष्टि अवश्य करें।',
        selfResponsibilityTitle: '3. डेटा बैकअप की ज़िम्मेदारी',
        selfResponsibilityDesc: 'कोई केंद्रीय सर्वर न होने के कारण, बिना JSON बैकअप के डेटा वापस नहीं पाया जा सकता।'
      }
    },
    safety: {
      badge: 'सुरक्षा ढांचा',
      title: 'सुरक्षा, पिन वॉल्ट एवं डेटा सुरक्षा',
      subtitle: 'डेली खाता: प्रो आपके वित्तीय आंकड़ों को दूसरों की नज़रों से सुरक्षित कैसे रखता है।',
      backToHome: 'होम पर वापस जाएं',
      vaultProtectionTitle: 'बहुस्तरीय स्थानीय सुरक्षा ढांचा',
      vaultProtectionDesc: 'डिवाइस-स्तर का स्थानीय स्टोरेज, 4-अंकीय पिन लॉक और एक-क्लिक गोपनीयता मास्क।',
      pillars: {
        pinTitle: '4-अंकीय कस्टम पासकोड लॉक',
        pinDesc: 'पिन लॉक सक्षम करने पर ऐप खोलते ही स्क्रीन अपने आप लॉक हो जाती है।',
        maskTitle: 'प्राइवेसी मास्क (नंबर छुपाएं)',
        maskDesc: 'सार्वजनिक स्थानों पर किसी को अपने खाते का बैलेंस न दिखने दें (••••••)।',
        wipeTitle: 'इमरजेंसी डेटा वाइप',
        wipeDesc: 'आपातकालीन स्थिति में एक क्लिक में सभी डेटा और पिन को पूरी तरह साफ़ करें।',
        backupTitle: 'सुरक्षित JSON डेटा बैकअप',
        backupDesc: 'अपने डेटा की JSON फ़ाइल डाउनलोड करके अपनी निजी पेनड्राइव में सुरक्षित रखें।'
      },
      bestPracticesTitle: 'अनुशंसित सुरक्षा सुझाव',
      bestPractices: [
        'फोन या कंप्यूटर साझा करते हैं तो 4-अंकीय पिन लॉक चालू रखें।',
        'पब्लिक प्लेस में हेडर में दिए गए प्राइवेसी मास्क (आईकॉन) का उपयोग करें।',
        'महीने में कम से कम एक बार सेटिंग्स > बैकअप से JSON फ़ाइल डाउनलोड करें।',
        'ब्राउज़र को हमेशा अपडेट रखें।'
      ]
    },
    developer: {
      badge: 'डेवलपर प्रोफाइल',
      title: 'डेवलपर प्रोफाइल एवं परिचय',
      subtitle: 'MD ज़फ़ीर हसन द्वारा निर्मित • डिजिटल गोपनीयता, सुरक्षा शोध एवं लोक संसाधन हेतु समर्पित।',
      backToHome: 'होम पर वापस जाएं',
      bioTitle: 'MD ज़फ़ीर हसन के बारे में',
      bioDesc: 'MD ज़फ़ीर हसन एक स्वतंत्र सॉफ़्टवेयर डेवलपर, सुरक्षा शोधकर्ता और ओपन-सोर्स क्रिएटर हैं जो समाज के लिए नैतिक, सुरक्षित और उपयोगी सार्वजनिक डिजिटल टूल्स बनाते हैं।',
      skillsTitle: 'पेशेवर प्रोफ़ाइल एवं विशेषज्ञता',
      visionTitle: 'डेली खाता: प्रो का दृष्टिकोण',
      visionDesc: 'हर नागरिक, फ्रीलांसर और छोटे व्यापारी को एक ऐसा शक्तिशाली वित्तीय सिस्टम देना जो पूरी तरह निःशुल्क हो, ऑफ़लाइन चले और कभी उपयोगकर्ता डेटा का दुरुपयोग न करे।',
      connectTitle: 'संपर्क एवं सोशल चैनल',
      connectDesc: 'प्रतिक्रिया या तकनीकी सहयोग के लिए ईमेल या गिटहब के माध्यम से जुड़ें।'
    },
    support: {
      badge: 'सहायता केंद्र',
      title: 'सहायता, हेल्पडेस्क एवं अक्सर पूछे जाने वाले प्रश्न',
      subtitle: 'आम प्रश्नों के त्वरित उत्तर पाएं या सीधे डेवलपर से संपर्क करें।',
      backToHome: 'होम पर वापस जाएं',
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
      faqs: [
        {
          q: 'मेरा वित्तीय डेटा कहाँ स्टोर होता है?',
          a: 'आपका डेटा 100% आपके डिवाइस के ब्राउज़र स्टोरेज (LocalStorage) में रहता है। यह कभी किसी सर्वर पर नहीं जाता।'
        },
        {
          q: 'क्या यह ऐप बिना इंटरनेट (ऑफ़लाइन) काम करता है?',
          a: 'हाँ! डेली खाता: प्रो पूरी तरह से ऑफ़लाइन चलता है। आप बिना इंटरनेट के लेनदेन जोड़ और प्रिंट ले सकते हैं।'
        },
        {
          q: '6-फंड विभाजन नियम क्या है?',
          a: 'जब भी आप कोई आमदनी जोड़ते हैं, यह स्वतः 6 फंड्स में विभाजित होती है: व्यक्तिगत (30%), परिवार (30%), बफर (10%), इमरजेंसी (10%), बचत (10%) और निवेश (10%)।'
        },
        {
          q: 'मैं अपने डेटा का बैकअप कैसे ले सकता हूँ?',
          a: 'सेटिंग्स > बैकअप टैब में जाएं और "Export JSON Backup" पर क्लिक करें।'
        },
        {
          q: 'सुरक्षा पिन कैसे लगाएं?',
          a: 'हेडर मेनू में लॉक आइकन पर क्लिक करें या सेटिंग्स > सुरक्षा लॉक में जाकर पिन सेट करें।'
        }
      ],
      contactCards: {
        emailTitle: 'सीधा ईमेल सपोर्ट',
        emailDesc: 'सहायता के लिए daily-Khata-Pro@gmail.com पर लिखें।',
        githubTitle: 'गिटहब समस्या ट्रैकर',
        githubDesc: 'बग्स और नए फीचर्स के लिए GitHub पर इश्यू बनाएं।',
        docsTitle: 'उपयोगकर्ता मार्गदर्शिका',
        docsDesc: 'सभी फीचर्स के लिए विस्तृत गाइड और निर्देश पढ़ें।'
      }
    },
    homeSubtitles: {
      personal: 'व्यक्तिगत जरूरतें, भोजन व लाइफस्टाइल',
      family: 'घर का खर्च, किराया व राशन सहायता',
      business: 'व्यापारिक आय, इनवॉइस, दुकान व ऑफिस खर्च',
      buffer: 'दैनिक अप्रत्याशित खर्चे व बिल',
      emergency: 'आपातकालीन संकट व चिकित्सा सुरक्षा',
      saving: 'अल्पकालिक बचत व खरीदारी फंड',
      investment: 'दीर्घकालिक निवेश व धन वृद्धि'
    },
    common: {
      back: 'वापस',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      deposit: 'जमा करें',
      filter: 'फ़िल्टर',
      search: 'खोजें...',
      today: 'आज',
      thisMonth: 'इस महीने',
      netBalanceDesc: '6-फंड ऑटो-स्प्लिट नियम के अनुसार आपका कुल सुरक्षित संचित बैलेंस',
      disciplinedSplit: '100% अनुशासित विभाजन नियम',
      safeOffline: '100% सुरक्षित और ऑफ़लाइन',
      viewLedger: 'पूरा लेज़र देखें',
      todaysNet: 'आज का नेट:'
    }
  },

  hinglish: {
    about: {
      backToHome: 'Home Par Wapas Jayein',
      badge: 'About Daily Khata: Pro',
      title: 'Daily Khata: Pro™ ke Baare Mein',
      subtitle: 'Universal Financial Ledger, 6-Fund Rule Money Manager, Work Deliverables & Daily Life Journal.',
      platformLabel: 'Platform',
      architectureLabel: 'Architecture',
      architectureValue: '100% Local Storage (Offline)',
      licenseLabel: 'License',
      creatorLabel: 'Creator & Developer',
      missionTitle: 'Hamara Mission aur Vision',
      missionP1: 'Daily Khata: Pro ko ek simple mission ke saath banaya gaya hai: har individual, freelancer, shopkeeper aur family ko ek honest, super-fast aur private ledger dena jisme bina login ya server tracking ke poora financial control aapke haath me ho.',
      missionP2: 'Baaki apps aapka data server par upload karte hain. Daily Khata: Pro me aapka data kabhi bhi aapke phone ya laptop se bahar nahi jata, aur ye MIT Open Source license ke tehat lifetime 100% free hai.',
      capabilitiesTitle: 'Core Capabilities aur Features',
      pillars: {
        fundsTitle: 'Automatic 6-Fund Allocation Rule',
        fundsDesc: 'Income add karte hi automatically 6 pots me divide hoti hai: Personal (30%), Family (30%), Buffer (10%), Emergency (10%), Savings (10%), aur Investment (10%). Percentages aap Settings me change kar sakte hain.',
        privacyTitle: 'Zero-Knowledge Client Storage',
        privacyDesc: 'Aapki sabhi entries device ke LocalStorage me save hoti hain. Koi cloud database nahi, zero cookies aur zero tracking.',
        journalTitle: 'Work & Daily Life Journal',
        journalDesc: 'Projects, client billing, daily routine, mood aur notes sabhi ek hi app me organize karein.',
        backupTitle: 'Print, PDF & JSON Backup',
        backupDesc: 'Monthly print statement aur JSON backup 1-click me download karein aur kisi bhi device par restore karein.'
      },
      contactsTitle: 'Official Support & Social Channels',
      contactsDesc: 'Help, suggestions aur bug reports ke liye official channels use karein:',
      officialWebsite: 'Official Website & Domain',
      officialSupport: 'Official Support Email',
      githubRepo: 'Open Source GitHub Repo',
      instaProfile: 'Official Instagram Profile',
      twitterProfile: 'Official X (Twitter) Profile'
    },
    privacy: {
      badge: 'Privacy Policy',
      title: 'Privacy Policy & Zero Data Collection',
      subtitle: 'Aapka financial data 100% local, self-custodied aur private hai.',
      backToHome: 'Home Par Wapas Jayein',
      corePledgeTitle: 'Zero Tracking & Complete Privacy',
      corePledgeDesc: 'Daily Khata: Pro strict zero-knowledge architecture par kaam karta hai. Hum koi user data save ya track nahi karte.',
      highlights: {
        offlineTitle: '100% Offline & Private',
        offlineDesc: 'Sabhi transactions aur notes aapke browser me hi process hote hain.',
        noCookiesTitle: 'Zero Tracking Cookies',
        noCookiesDesc: 'Hum koi tracking scripts ya ads use nahi karte.',
        localVaultTitle: 'Client-Side PIN Lock',
        localVaultDesc: 'Aapka PIN lock locally browser runtime me check hota hai.',
        exportControlTitle: 'Full Data Control',
        exportControlDesc: 'Jab chahein JSON backup download karein ya data wipe karein.'
      },
      dataRetentionTitle: 'Data Retention & Control',
      dataRetentionDesc: 'Kyunki sabhi entries browser LocalStorage me rehti hain, isliye data par 100% aapka hi control hai. Browser clear karne se pehle backup zaroor lein.',
      thirdPartyTitle: 'Third-Party Services',
      thirdPartyDesc: 'Daily Khata: Pro kisi bhi third-party ko aapka data share nahi karta.',
      userRightsTitle: 'Aapke Data Rights',
      userRightsDesc: 'Aapko data export karne, code inspect karne aur app offline use karne ka poora adhikar hai.'
    },
    terms: {
      badge: 'Terms of Service',
      title: 'Terms of Service & Open Source License',
      subtitle: 'Standard MIT Open Source License • Official Domain: rozfiber.com',
      backToHome: 'Home Par Wapas Jayein',
      openSourceTitle: 'MIT Open Source License Agreement',
      openSourceDesc: 'Daily Khata: Pro MIT License ke tehat bilkul free aur open-source available hai.',
      termsList: {
        ownershipTitle: '1. 100% Data Ownership',
        ownershipDesc: 'Aapke entries aur khata records par poori tarah se aapka hi haq hai.',
        usageTitle: '2. Proper Usage',
        usageDesc: 'Aap is software ko personal budget, freelance ledger ya shop business ke liye use kar sakte hain.',
        disclaimerTitle: '3. No Financial Warranty',
        disclaimerDesc: 'Ye app ek smart financial calculator hai, certified CA ya tax consultant nahi.',
        backupTitle: '4. Backup Responsibility',
        backupDesc: 'Data local hone ki wajah se regular JSON backup lena user ki zimmedari hai.'
      }
    },
    disclaimer: {
      badge: 'Legal Disclaimer',
      title: 'Financial & Legal Disclaimer',
      subtitle: 'Financial guidance aur self-custody ledger ke regarding important notice.',
      backToHome: 'Home Par Wapas Jayein',
      alertTitle: 'Informational & Educational Calculator Tool',
      alertDesc: 'Daily Khata: Pro ek calculation aur khata tool hai, certified investment ya tax advisor nahi.',
      sections: {
        nonAdvisoryTitle: '1. Non-Advisory Nature',
        nonAdvisoryDesc: '6-Fund split formula ek financial rule of thumb hai. Aap apni zaroorat ke hisab se ratio set kar sakte hain.',
        calculationTitle: '2. Calculation Accuracy',
        calculationDesc: 'Sabhi mathematical formulas tested hain, fir bhi tax return ke liye numbers verify zaroor karein.',
        selfResponsibilityTitle: '3. Data Backup Responsibility',
        selfResponsibilityDesc: 'Kyunki koi central server nahi hai, isliye browser data delete hone par backup ke bina data recover nahi ho sakta.'
      }
    },
    safety: {
      badge: 'Security Architecture',
      title: 'Safety, PIN Vault & Data Protection',
      subtitle: 'Daily Khata: Pro aapke balance aur records ko safe kaise rakhta hai.',
      backToHome: 'Home Par Wapas Jayein',
      vaultProtectionTitle: 'Multi-Layered Local Security',
      vaultProtectionDesc: 'Device-level storage, 4-digit PIN lock aur instant privacy mask ke saath complete safety.',
      pillars: {
        pinTitle: '4-Digit Passcode Lock',
        pinDesc: 'PIN lock lagane par app open hote hi ya tab switch hote hi vault lock ho jata hai.',
        maskTitle: 'Privacy Mask (Number Chupayein)',
        maskDesc: 'Public place me balances ko hide karein (••••••).',
        wipeTitle: 'Emergency Wipe',
        wipeDesc: 'Emergency me ek click me sabhi records aur pin clean karein.',
        backupTitle: 'Safe JSON Backup',
        backupDesc: 'Apne data ki JSON file download karke pen-drive ya private drive me safe rakhein.'
      },
      bestPracticesTitle: 'Security Best Practices',
      bestPractices: [
        'Phone ya PC share karte waqt 4-digit PIN lock on rakhein.',
        'Public place me header me diye Eye icon (Privacy Mask) ka use karein.',
        'Month me kam se kam 1 baar Settings > Backup se JSON file download karein.',
        'Browser ko updated rakhein.'
      ]
    },
    developer: {
      badge: 'Developer Profile',
      title: 'Developer Profile & Creator',
      subtitle: 'Created by MD Zafeer Hasan • Dedicated to digital privacy, security research & public resources.',
      backToHome: 'Home Par Wapas Jayein',
      bioTitle: 'About MD Zafeer Hasan',
      bioDesc: 'MD Zafeer Hasan ek independent software developer, security researcher aur open-source creator hain jo clean, secure aur public utility tools banate hain.',
      skillsTitle: 'Professional Roles & Domains',
      visionTitle: 'Daily Khata: Pro ka Vision',
      visionDesc: 'Har user, freelancer aur small business ko ek aisa private, free aur lifetime offline financial engine dena jo unka data kabhi na beche.',
      connectTitle: 'Connect & Follow',
      connectDesc: 'Feedback, collaborations ya open-source contribution ke liye connect karein.'
    },
    support: {
      badge: 'Help Center',
      title: 'Support, Helpdesk & FAQs',
      subtitle: 'Common questions ke answers aur direct helpdesk support.',
      backToHome: 'Home Par Wapas Jayein',
      faqTitle: 'Frequently Asked Questions (FAQ)',
      faqs: [
        {
          q: 'Mera financial data kahan save hota hai?',
          a: 'Aapka data 100% aapke browser LocalStorage me safe rehta hai. Ye kisi bhi server par nahi jata.'
        },
        {
          q: 'Kya ye bina internet (offline) kaam karta hai?',
          a: 'Haan! Daily Khata: Pro poori tarah offline kaam karta hai.'
        },
        {
          q: '6-Fund rule kya hai?',
          a: 'Income enter karte hi 6 funds me auto divide hoti hai: Personal (30%), Family (30%), Buffer (10%), Emergency (10%), Saving (10%), aur Investment (10%).'
        },
        {
          q: 'Backup kaise lein?',
          a: 'Settings > Backup tab me jayein aur "Export JSON Backup" par click karein.'
        },
        {
          q: 'PIN lock kaise lagayein?',
          a: 'Header me Lock icon par click karein ya Settings me Security Lock configure karein.'
        }
      ],
      contactCards: {
        emailTitle: 'Direct Email Support',
        emailDesc: 'daily-Khata-Pro@gmail.com par email karein.',
        githubTitle: 'GitHub Issue Tracker',
        githubDesc: 'Bugs aur feature requests ke liye GitHub issue open karein.',
        docsTitle: 'User Manual & Guides',
        docsDesc: 'Sabhi features ki complete step-by-step guides padhein.'
      }
    },
    homeSubtitles: {
      personal: 'Personal zarooratein, khana aur lifestyle',
      family: 'Ghar ka kharch, rent aur grocery',
      business: 'Business revenue, billing, inventory & office kharche',
      buffer: 'Daily unexpected expenses aur bills',
      emergency: 'Emergency crisis aur medical safety',
      saving: 'Short-term savings aur shopping goals',
      investment: 'Long-term investment aur wealth growth'
    },
    common: {
      back: 'Wapas',
      save: 'Save Karein',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      deposit: 'Deposit',
      filter: 'Filter',
      search: 'Search...',
      today: 'Aaj',
      thisMonth: 'Is Mahine',
      netBalanceDesc: '6-Fund auto-split rule ke mutabiq aapka total real-time balance',
      disciplinedSplit: '100% Disciplined Split Ratio',
      safeOffline: '100% Safe, Private & Offline',
      viewLedger: 'Poora Ledger Dekhein',
      todaysNet: 'Aaj ka Net:'
    }
  },

  ur: {
    about: {
      backToHome: 'ہوم پر واپس جائیں',
      badge: 'ڈیلی کھاتہ پرو کا تعارف',
      title: 'ڈیلی کھاتہ: پرو™ کا تعارف',
      subtitle: 'عالمی مالیاتی لیجر، 6-فنڈ منی مینیجر، ورک ڈلیوریبلز اور روزمرہ ڈائری۔',
      platformLabel: 'پلیٹ فارم',
      architectureLabel: 'آرکیٹیکچر',
      architectureValue: '100% لوکل اسٹوریج (آف لائن)',
      licenseLabel: 'لائسنس',
      creatorLabel: 'تخلیق کار اور ڈویلپر',
      missionTitle: 'ہمارا مشن اور مقصد',
      missionP1: 'ڈیلی کھاتہ پرو ایک اہم مقصد کے ساتھ بنایا گیا ہے: ہر فرد، فری لانسر، دکاندار اور خاندان کو ایک تیز رفتار، دیانت دار اور نجی لیجر فراہم کرنا جو ان کی رازداری کا مکمل احترام کرے۔',
      missionP2: 'عام ایپس آپ کا ڈیٹا سرور پر اپ لوڈ کرتی ہیں۔ ڈیلی کھاتہ پرو میں آپ کا ڈیٹا کبھی بھی آپ کے فون یا لیپ ٹاپ سے باہر نہیں جاتا اور یہ ہمیشہ 100% مفت اور اوپن سورس ہے۔',
      capabilitiesTitle: 'اہم خصوصیات اور فن تعمیر',
      pillars: {
        fundsTitle: 'خودکار 6-فنڈ تقسیم کا اصول',
        fundsDesc: 'آمدنی درج کرتے ہی یہ 6 فنڈز میں تقسیم ہوتی ہے: ذاتی (30%)، گھریلو (30%)، بفر (10%)، ایمرجنسی (10%)، بچت (10%) اور سرمایہ کاری (10%)۔',
        privacyTitle: 'مکمل کلائنٹ اسٹوریج',
        privacyDesc: 'تمام ریکارڈز صرف آپ کے ڈیوائس پر محفوظ رہتے ہیں۔ کوئی کلاؤڈ ڈیٹا بیس یا ٹریکنگ نہیں۔',
        journalTitle: 'ورک اور ڈیلی لائف ڈائری',
        journalDesc: 'پروجیکٹس، کلائنٹ بلنگ، روزمرہ معمولات اور نوٹس کو ایک ہی جگہ منظم کریں۔',
        backupTitle: 'پرنٹ، پی ڈی ایف اور بیک اپ',
        backupDesc: 'ماہانہ پرنٹ اسٹیٹمنٹ اور مکمل JSON بیک اپ ایک کلک میں ڈاؤن لوڈ کریں۔'
      },
      contactsTitle: 'سرکاری رابطہ چینلز',
      contactsDesc: 'تجاویز، تکنیکی مدد یا باضابطہ رابطے کے لیے ہمارے چینلز استعمال کریں:',
      officialWebsite: 'سرکاری ویب سائٹ',
      officialSupport: 'سرکاری ای میل',
      githubRepo: 'اوپن سورس گٹ ہب ریپو',
      instaProfile: 'انسٹاگرام پروفائل',
      twitterProfile: 'ٹوئٹر (X) پروفائل'
    },
    privacy: {
      badge: 'پرائیویسی پالیسی',
      title: 'پرائیویسی پالیسی اور زیرو ڈیٹا کلیکشن',
      subtitle: 'آپ کا مالیاتی ڈیٹا 100% مقامی اور نجی ہے اور کبھی آن لائن نہیں بھیجا جاتا۔',
      backToHome: 'ہوم پر واپس جائیں',
      corePledgeTitle: 'مکمل رازداری اور تحفظ',
      corePledgeDesc: 'ڈیلی کھاتہ پرو سخت پرائیویسی اصولوں پر کام کرتا ہے۔ ہم کوئی ذاتی ڈیٹا محفوظ نہیں کرتے۔',
      highlights: {
        offlineTitle: '100% آف لائن اور پرائیویٹ',
        offlineDesc: 'تمام ٹرانزیکشنز براہ راست آپ کے براؤزر میں پروسیس ہوتی ہیں۔',
        noCookiesTitle: 'زیرو ٹریکنگ کوکیز',
        noCookiesDesc: 'ہم کوئی ٹریکنگ اسکرپٹ یا اشتہار استعمال نہیں کرتے۔',
        localVaultTitle: 'لوکل پن لاک',
        localVaultDesc: 'آپ کا پن کوڈ مقامی طور پر براؤزر میں چیک ہوتا ہے۔',
        exportControlTitle: 'ڈیٹا پر مکمل کنٹرول',
        exportControlDesc: 'جب چاہیں بیک اپ لیں یا ڈیٹا مکمل صاف کریں۔'
      },
      dataRetentionTitle: 'ڈیٹا کا تحفظ',
      dataRetentionDesc: 'چونکہ ڈیٹا براؤزر میں رہتا ہے اس لیے اس پر 100% آپ کا ہی اختیار ہے۔',
      thirdPartyTitle: 'تھرڈ پارٹی سروسز',
      thirdPartyDesc: 'ہم کسی بھی بیرونی کمپنی کو آپ کا ڈیٹا منتقل نہیں کرتے۔',
      userRightsTitle: 'آپ کے حقوق',
      userRightsDesc: 'آپ کو ڈیٹا برآمد کرنے اور ایپ کو بغیر انٹرنیٹ چلانے کا مکمل حق ہے۔'
    },
    terms: {
      badge: 'شرائط و ضوابط',
      title: 'شرائط و ضوابط اور اوپن سورس لائسنس',
      subtitle: 'معیاری MIT لائسنس • آفیشل ڈومین: rozfiber.com',
      backToHome: 'ہوم پر واپس جائیں',
      openSourceTitle: 'MIT اوپن سورس معاہدہ',
      openSourceDesc: 'یہ سافٹ ویئر MIT لائسنس کے تحت مکمل مفت دستیاب ہے۔',
      termsList: {
        ownershipTitle: '1. ڈیٹا کی مکمل ملکیت',
        ownershipDesc: 'آپ کے تمام ریکارڈز اور نوٹس پر مکمل آپ کی ملکیت ہے۔',
        usageTitle: '2. جائز استعمال',
        usageDesc: 'ذاتی بجٹ، دکان کے کھاتہ یا کاروبار کے لیے آزادانہ استعمال کریں۔',
        disclaimerTitle: '3. کوئی مالیاتی ضمانت نہیں',
        disclaimerDesc: 'یہ ایپ ایک تنظیمی ٹول ہے، کوئی سند یافتہ ٹیکس مشیر نہیں۔',
        backupTitle: '4. بیک اپ کی ذمہ داری',
        backupDesc: 'ڈیٹا لوکل ہونے کی وجہ سے باقاعدہ بیک اپ لینا صارف کی ذمہ داری ہے۔'
      }
    },
    disclaimer: {
      badge: 'قانونی اعلان',
      title: 'مالیاتی و قانونی ڈس کلیمر',
      subtitle: 'مالیاتی رہنمائی اور خود حفاظتی کھاتہ سے متعلق اہم نوٹس۔',
      backToHome: 'ہوم پر واپس جائیں',
      alertTitle: 'معلوماتی اور تعلیمی ٹول',
      alertDesc: 'ڈیلی کھاتہ پرو ایک حسابی ٹول ہے۔ یہ کوئی قانونی سرمایہ کاری مشورہ نہیں دیتا۔',
      sections: {
        nonAdvisoryTitle: '1. غیر مشاورتی حیثیت',
        nonAdvisoryDesc: '6-فنڈ تقسیم کا قاعدہ ایک عمومی اصول ہے۔ سیٹنگز میں تناسب تبدیل کریں۔',
        calculationTitle: '2. اعداد و شمار کی تصدیق',
        calculationDesc: 'ٹیکس فائلنگ سے قبل اعداد کی خود تصدیق لازمی کریں۔',
        selfResponsibilityTitle: '3. بیک اپ کی ذمہ داری',
        selfResponsibilityDesc: 'سرور نہ ہونے کے باعث بغیر بیک اپ ڈیٹا واپس نہیں لایا جا سکتا۔'
      }
    },
    safety: {
      badge: 'حفاظتی ڈھانچہ',
      title: 'حفاظت، پن والٹ اور ڈیٹا پروٹیکشن',
      subtitle: 'ڈیلی کھاتہ پرو آپ کے مالیاتی اعداد کو کیسے محفوظ رکھتا ہے۔',
      backToHome: 'ہوم پر واپس جائیں',
      vaultProtectionTitle: 'کثیر سطحی مقامی سیکیورٹی',
      vaultProtectionDesc: 'لوکل اسٹوریج، 4-ہندسوں کا پن لاک اور ایک کلک پرائیویسی ماسک۔',
      pillars: {
        pinTitle: '4-ہندسوں کا پن لاک',
        pinDesc: 'ایپ کھولتے ہی یا اسکرین بدلتے ہی والٹ لاک ہو جاتا ہے۔',
        maskTitle: 'پرائیویسی ماسک (نمبر چھپائیں)',
        maskDesc: 'عوامی مقامات پر رقم کے اعداد کو چھپائیں (••••••)۔',
        wipeTitle: 'ایمرجنسی ڈیٹا وائپ',
        wipeDesc: 'ہنگامی حالت میں ایک کلک پر تمام ڈیٹا صاف کریں۔',
        backupTitle: 'محفوظ JSON بیک اپ',
        backupDesc: 'اپنے ڈیٹا کی فائل ڈاؤن لوڈ کر کے نجی ڈرائیو میں رکھیں۔'
      },
      bestPracticesTitle: 'بہترین حفاظتی تجاویز',
      bestPractices: [
        'ڈیوائس شیئر کرتے وقت 4-ہندسوں کا پن لاک آن رکھیں۔',
        'عوامی جگہوں پر پرائیویسی ماسک کا استعمال کریں۔',
        'مہینے میں کم از کم ایک بار JSON بیک اپ ڈاؤن لوڈ کریں۔',
        'براؤزر کو اپ ڈیٹ رکھیں۔'
      ]
    },
    developer: {
      badge: 'ڈویلپر پروفائل',
      title: 'ڈویلپر پروفائل اور تعارف',
      subtitle: 'محمد زفیر حسن کا تخلیق کردہ • رازداری کا علمبردار۔',
      backToHome: 'ہوم پر واپس جائیں',
      bioTitle: 'محمد زفیر حسن کے بارے میں',
      bioDesc: 'محمد زفیر حسن ایک پرجوش سافٹ ویئر انجینئر ہیں جو تیز رفتار اور پرائیویسی فوکسڈ ویب ٹولز بناتے ہیں۔',
      skillsTitle: 'اہم مہارتیں اور ٹیکنالوجیز',
      visionTitle: 'ڈیلی کھاتہ پرو کا وژن',
      visionDesc: 'ہر انسان کو ایک ایسا مفت مالیاتی نظام دینا جو کبھی ان کا ڈیٹا فروخت نہ کرے۔',
      connectTitle: 'رابطہ اور سوشل لنکس',
      connectDesc: 'تجاویز یا تعاون کے لیے ای میل یا گٹ ہب کے ذریعے رابطہ کریں۔'
    },
    support: {
      badge: 'ہیلپ سینٹر',
      title: 'سپورٹ، ہیلپ ڈیسک اور سوالات',
      subtitle: 'عام سوالات کے فوری جوابات اور براہ راست سپورٹ۔',
      backToHome: 'ہوم پر واپس جائیں',
      faqTitle: 'اکثر پوچھے جانے والے سوالات (FAQ)',
      faqs: [
        {
          q: 'میرا ڈیٹا کہاں محفوظ ہوتا ہے؟',
          a: 'آپ کا ڈیٹا 100% آپ کے براؤزر کے لوکل اسٹوریج میں رہتا ہے۔'
        },
        {
          q: 'کیا یہ بغیر انٹرنیٹ کے کام کرتا ہے؟',
          a: 'جی ہاں! ڈیلی کھاتہ پرو مکمل آف لائن کام کرتا ہے۔'
        },
        {
          q: '6-فنڈ تقسیم کا قاعدہ کیا ہے؟',
          a: 'آمدنی خودکار طور پر 6 فنڈز میں تقسیم ہوتی ہے: ذاتی (30%)، گھریلو (30%)، بفر (10%)، ایمرجنسی (10%)، بچت (10%) اور انویسٹمنٹ (10%)۔'
        },
        {
          q: 'بیک اپ کیسے لیں؟',
          a: 'سیٹنگز > بیک اپ میں جائیں اور "Export JSON Backup" پر کلک کریں۔'
        },
        {
          q: 'پن کوڈ کیسے لگائیں؟',
          a: 'ہیڈر میں لاک آئیکن پر کلک کریں یا سیٹنگز میں پن کوڈ سیٹ کریں۔'
        }
      ],
      contactCards: {
        emailTitle: 'براہ راست ای میل سپورٹ',
        emailDesc: 'daily-Khata-Pro@gmail.com پر رابطہ کریں۔',
        githubTitle: 'گٹ ہب ٹریکر',
        githubDesc: 'مسائل کی نشاندہی کے لیے ایشو بنائیں۔',
        docsTitle: 'یوزر مینوئل',
        docsDesc: 'مکمل تفصیلی گائیڈز کا مطالعہ کریں۔'
      }
    },
    homeSubtitles: {
      personal: 'ذاتی ضروریات اور طرز زندگی',
      family: 'گھریلو اخراجات، کرایہ اور راشن',
      buffer: 'روزمرہ کے غیر متوقع اخراجات',
      emergency: 'ہنگامی فنڈ اور طبی تحفظ',
      saving: 'قلیل مدتی بچت اور خریداری',
      investment: 'طویل مدتی سرمایہ کاری اور مالی ترقی'
    },
    common: {
      back: 'واپس',
      save: 'محفوظ کریں',
      cancel: 'منسوخ',
      delete: 'حذف کریں',
      edit: 'ترمیم',
      deposit: 'جمع کریں',
      filter: 'فلٹر',
      search: 'تلاش کریں...',
      today: 'آج',
      thisMonth: 'اس ماہ',
      netBalanceDesc: '6-فنڈ اصول کے تحت آپ کا محفوظ اور اصل بیلنس',
      disciplinedSplit: '100% منظم تقسیم کا تناسب',
      safeOffline: '100% محفوظ اور آف لائن',
      viewLedger: 'مکمل لیجر دیکھیں',
      todaysNet: 'آج کا نیٹ:'
    }
  },

  bn: {
    about: {
      backToHome: 'হোমে ফিরে যান',
      badge: 'ডেইলি খাতা প্রো পরিচিতি',
      title: 'ডেইলি খাতা: প্রো™ সম্পর্কে',
      subtitle: 'সার্বজনীন আর্থিক লেজার, ৬-তহবিল অর্থ ব্যবস্থাপনা, কর্ম ও দৈনন্দিন জীবনের ডায়েরি।',
      platformLabel: 'প্ল্যাটফর্ম',
      architectureLabel: 'স্থাপত্য',
      architectureValue: '১০০% লোকাল স্টোরেজ (অফলাইন)',
      licenseLabel: 'লাইসেন্স',
      creatorLabel: 'নির্মাতা ও ডেভেলপার',
      missionTitle: 'আমাদের লক্ষ্য ও উদ্দেশ্য',
      missionP1: 'ডেইলি খাতা প্রো একটি অনন্য লক্ষ্যে তৈরি: প্রতিটি ব্যক্তি, শিক্ষার্থী, ফ্রিল্যান্সার ও ব্যবসায়ীকে একটি দ্রুত, সৎ এবং সম্পূর্ণ ব্যক্তিগত আর্থিক লেজার প্রদান করা।',
      missionP2: 'অন্যান্য অ্যাপের মতো আপনার ডেটা কোনো রিমোট সার্ভারে যায় না। আপনার সব তথ্য শুধুই আপনার ডিভাইসে থাকে এবং এটি এমআইটি ওপেন সোর্স লাইসেন্সের আওতায় আজীবন বিনামূল্যে ব্যবহারযোগ্য।',
      capabilitiesTitle: 'মূল বৈশিষ্ট্যসমূহ',
      pillars: {
        fundsTitle: 'স্বয়ংক্রিয় ৬-তহবিল নিয়ম',
        fundsDesc: 'আয় যুক্ত করার সাথে সাথে তা ৬টি তহবিলে বিভক্ত হয়: ব্যক্তিগত (৩০%), পরিবার (৩০%), বাফার (১০%), জরুরি (১০%), সঞ্চয় (১০%) এবং বিনিয়োগ (১০%)।',
        privacyTitle: 'সম্পূর্ণ ক্লায়েন্ট স্টোরেজ',
        privacyDesc: 'আপনার সমস্ত এন্ট্রি ব্রাউজারের লোকাল স্টোরেজে সংরক্ষিত থাকে। কোনো ট্র্যাকিং বা কুকিজ নেই।',
        journalTitle: 'কর্ম ও জীবন ডায়েরি',
        journalDesc: 'প্রজেক্ট, কাজের হিসাব, বিলিং, দৈনন্দিন রুটিন ও চিন্তা এক জায়গায় সাজিয়ে রাখুন।',
        backupTitle: 'প্রিন্ট ও ব্যাকআপ',
        backupDesc: 'মাসিক স্টেটমেন্ট প্রিন্ট করুন এবং এক ক্লিকে সম্পূর্ণ JSON ব্যাকআপ সংরক্ষণ করুন।'
      },
      contactsTitle: 'অফিসিয়াল যোগাযোগ মাধ্যম',
      contactsDesc: 'পরামর্শ বা সহায়তার জন্য আমাদের চ্যানেলগুলো ব্যবহার করুন:',
      officialWebsite: 'অফিসিয়াল ওয়েবসাইট',
      officialSupport: 'অফিসিয়াল ইমেইল',
      githubRepo: 'গিটহাব ওপেন সোর্স রিপোজিটরি',
      instaProfile: 'ইনস্টাগ্রাম প্রোফাইল',
      twitterProfile: 'টুইটার (X) প্রোফাইল'
    },
    privacy: {
      badge: 'গোপনীয়তা নীতি',
      title: 'গোপনীয়তা নীতি ও শূন্য ডেটা সংগ্রহ',
      subtitle: 'আপনার আর্থিক তথ্য ১০০% নিরাপদ ও সম্পূর্ণ অফলাইনে সংরক্ষিত থাকে।',
      backToHome: 'হোমে ফিরে যান',
      corePledgeTitle: 'সম্পূর্ণ গোপনীয়তা রক্ষা',
      corePledgeDesc: 'ডেইলি খাতা প্রো জিরো-নলেজ প্রযুক্তিতে পরিচালিত। আমরা কোনো ডেটা সংগ্রহ করি না।',
      highlights: {
        offlineTitle: '১০০% অফলাইন ও ব্যক্তিগত',
        offlineDesc: 'সব হিসাব সরাসরি আপনার ডিভাইসের ব্রাউজারে প্রক্রিয়াকৃত হয়।',
        noCookiesTitle: 'কোনো ট্র্যাকিং কুকি নেই',
        noCookiesDesc: 'আমরা কোনো বিজ্ঞাপন বা ট্র্যাকিং স্ক্রিপ্ট ব্যবহার করি না।',
        localVaultTitle: 'লোকাল পিন লক',
        localVaultDesc: 'আপনার পিন কোড শুধুমাত্র ব্রাউজারের ভেতরে যাচাই করা হয়।',
        exportControlTitle: 'তথ্যের ওপর পূর্ণ নিয়ন্ত্রণ',
        exportControlDesc: 'যেকোনো সময় এক ক্লিকে ব্যাকআপ নিন অথবা ডেটা মুছে ফেলুন।'
      },
      dataRetentionTitle: 'ডেটা সংরক্ষণ ও নিয়ন্ত্রণ',
      dataRetentionDesc: 'যেহেতু সব তথ্য আপনার লোকাল স্টোরেজে থাকে, তাই তথ্যের মালিকানা শুধুই আপনার।',
      thirdPartyTitle: 'তৃতীয় পক্ষের সেবা',
      thirdPartyDesc: 'ডেইলি খাতা প্রো কোনো তৃতীয় পক্ষের সাথে আপনার তথ্য বিনিময় করে না।',
      userRightsTitle: 'আপনার অধিকার',
      userRightsDesc: 'আপনার ডেটা এক্সপোর্ট করার এবং ইন্টারনেট ছাড়াই অ্যাপ ব্যবহারের পূর্ণ অধিকার রয়েছে।'
    },
    terms: {
      badge: 'শর্তাবলী',
      title: 'ব্যবহারের শর্তাবলী ও লাইসেন্স',
      subtitle: 'স্ট্যান্ডার্ড MIT ওপেন সোর্স শর্তাবলী • অফিসিয়াল ডোমেইন: rozfiber.com',
      backToHome: 'হোমে ফিরে যান',
      openSourceTitle: 'MIT ওপেন সোর্স লাইসেন্স চুক্তি',
      openSourceDesc: 'ডেইলি খাতা প্রো এমআইটি লাইসেন্সের অধীনে সম্পূর্ণ বিনামূল্যে ব্যবহারের জন্য উন্মুক্ত।',
      termsList: {
        ownershipTitle: '১. তথ্যের পূর্ণ মালিকানা',
        ownershipDesc: 'আপনার সমস্ত হিসাব ও তথ্যের ওপর একমাত্র আপনারই পূর্ণ অধিকার থাকবে।',
        usageTitle: '২. যথাযথ ব্যবহার',
        usageDesc: 'ব্যক্তিগত বা বাণিজ্যিক হিসাবের জন্য নির্দ্বিধায় এই সফটওয়্যার ব্যবহার করতে পারেন।',
        disclaimerTitle: '৩. কোনো আর্থিক ওয়ারেন্টি নেই',
        disclaimerDesc: 'এই সফটওয়্যারটি হিসাবের সহযোগী টুল, কোনো প্রত্যয়িত কর পরামর্শদাতা নয়।',
        backupTitle: '৪. ব্যাকআপের দায়িত্ব',
        backupDesc: 'তথ্য লোকাল থাকায় নিয়মিত JSON ব্যাকআপ সংরক্ষণ করা ব্যবহারকারীর দায়িত্ব।'
      }
    },
    disclaimer: {
      badge: 'আইনি দাবিত্যাগ',
      title: 'আর্থিক ও আইনি ডিসক্লেইমার',
      subtitle: 'আর্থিক হিসাব ও লোকাল খাতা সম্পর্কিত জরুরি ঘোষণা।',
      backToHome: 'হোমে ফিরে যান',
      alertTitle: 'তথ্যমূলক ও শিক্ষামূলক হিসাব টুল',
      alertDesc: 'ডেইলি খাতা প্রো একটি গাণিতিক টুল। এটি কোনো প্রত্যয়িত বিনিয়োগ বা কর পরামর্শ দেয় না।',
      sections: {
        nonAdvisoryTitle: '১. অ-পরামর্শমূলক প্রকৃতি',
        nonAdvisoryDesc: '৬-তহবিল নিয়মটি একটি সাধারণ আর্থিক সূত্র। সেটিংস থেকে আপনার সুবিধামতো অনুপাত পরিবর্তন করুন।',
        calculationTitle: '২. হিসাবের যথার্থতা',
        calculationDesc: 'সরকারি কর প্রদানের পূর্বে নিজে হিসাবগুলো পুনরায় মিলিয়ে নিন।',
        selfResponsibilityTitle: '৩. ব্যাকআপ রাখার দায়িত্ব',
        selfResponsibilityDesc: 'কেন্দ্রীয় সার্ভার না থাকায় ব্যাকআপ ছাড়া মুছে যাওয়া তথ্য পুনরুদ্ধার সম্ভব নয়।'
      }
    },
    safety: {
      badge: 'নিরাপত্তা ব্যবস্থা',
      title: 'নিরাপত্তা, পিন ভল্ট ও ডেটা সুরক্ষা',
      subtitle: 'ডেইলি খাতা প্রো আপনার আর্থিক তথ্যকে কীভাবে সুরক্ষিত রাখে।',
      backToHome: 'হোমে ফিরে যান',
      vaultProtectionTitle: 'বহুস্তরীয় স্থানীয় নিরাপত্তা',
      vaultProtectionDesc: 'লোকাল স্টোরেজ, ৪-ডিজিটের পিন লক এবং গোপনীয়তা মাস্কিং মোড।',
      pillars: {
        pinTitle: '৪-ডিজিট পাসকোড লক',
        pinDesc: 'অ্যাপ খুললেই বা ট্যাব পরিবর্তন করলেই পর্দা স্বয়ংক্রিয়ভাবে লক হয়ে যায়।',
        maskTitle: 'প্রাইভেসি মাস্ক (সংখ্যা লুকান)',
        maskDesc: 'জনসমাগমে ব্যালেন্স সংখ্যাগুলোর ওপর তারাচিহ্ন (••••••) প্রদর্শন করুন।',
        wipeTitle: 'জরুরি ডেটা মুছা',
        wipeDesc: 'প্রয়োজনে এক ক্লিকে সব তথ্য ও পিন স্থায়ীভাবে পরিষ্কার করুন।',
        backupTitle: 'সুরক্ষিত JSON ব্যাকআপ',
        backupDesc: 'ডেটার ফাইল ডাউনলোড করে ব্যক্তিগত ড্রাইভে নিরাপদে সংরক্ষণ করুন।'
      },
      bestPracticesTitle: 'নিরাপত্তা সংক্রান্ত সেরা পরামর্শ',
      bestPractices: [
        'ডিভাইস কারো সাথে ভাগাভাগি করলে ৪-ডিজিটের পিন লক চালু রাখুন।',
        'পাবলিক প্লেসে হেডারে থাকা প্রাইভেসি মাস্ক বাটন ব্যবহার করুন।',
        'মাসে অন্তত একবার সেটিংস থেকে JSON ব্যাকআপ ডাউনলোড করুন।',
        'ব্রাউজার সর্বদা আপডেট রাখুন।'
      ]
    },
    developer: {
      badge: 'ডেভেলপার প্রোফাইল',
      title: 'ডেভেলপার পরিচিতি ও প্রোফাইল',
      subtitle: 'এমডি জাফির হাসান কর্তৃক নির্মিত • ব্যবহারকারীর গোপনীয়তায় নিবেদিত।',
      backToHome: 'হোমে ফিরে যান',
      bioTitle: 'এমডি জাফির হাসান সম্পর্কে',
      bioDesc: 'এমডি জাফির হাসান একজন উদ্যমী সফটওয়্যার প্রকৌশলী যিনি দ্রুত ও গোপনীয়তাবান্ধব ওয়েব টুল তৈরিতে নিবেদিত।',
      skillsTitle: 'মূল প্রযুক্তি ও দক্ষতা',
      visionTitle: 'ডেইলি খাতা প্রো-এর লক্ষ্য',
      visionDesc: 'সকল নাগরিককে একটি বিশ্বমানের মুক্ত ও অফলাইন আর্থিক হিসাব ইঞ্জিন উপহার দেওয়া।',
      connectTitle: 'যোগাযোগ ও সামাজিক মাধ্যম',
      connectDesc: 'পরামর্শ বা সহযোগিতার জন্য ইমেইল বা গিটহাবে যোগাযোগ করুন।'
    },
    support: {
      badge: 'সহায়তা কেন্দ্র',
      title: 'সহায়তা, হেল্পডেস্ক ও প্রশ্নোত্তর',
      subtitle: 'সাধারণ প্রশ্নের উত্তর পান অথবা সরাসরি ডেভেলপারের সাথে যোগাযোগ করুন।',
      backToHome: 'হোমে ফিরে যান',
      faqTitle: 'সাধারণ জিজ্ঞাসা (FAQ)',
      faqs: [
        {
          q: 'আমার আর্থিক ডেটা কোথায় থাকে?',
          a: 'আপনার ডেটা ১০০% আপনার ব্রাউজারের লোকাল স্টোরেজে সুরক্ষিত থাকে।'
        },
        {
          q: 'ইন্টারনেট ছাড়া কি চলবে?',
          a: 'হ্যাঁ! ডেইলি খাতা প্রো সম্পূর্ণ অফলাইনে নিখুঁতভাবে কাজ করে।'
        },
        {
          q: '৬-তহবিল নিয়মটি কীভাবে কাজ করে?',
          a: 'আয় যোগ করার সাথে সাথে ৬ ভাগে ভাগ হয়: ব্যক্তিগত (৩০%), পরিবার (৩০%), বাফার (১০%), জরুরি (১০%), সঞ্চয় (১০%) ও বিনিয়োগ (১০%)।'
        },
        {
          q: 'ব্যাকআপ কীভাবে নেব?',
          a: 'সেটিংস > ব্যাকআপ ট্যাবে গিয়ে "Export JSON Backup"-এ ক্লিক করুন।'
        },
        {
          q: 'পিন কোড কীভাবে সেট করব?',
          a: 'হেডারে লক আইকনে ক্লিক করে বা সেটিংসে গিয়ে ৪-সংখ্যার পিন সেট করুন।'
        }
      ],
      contactCards: {
        emailTitle: 'সরাসরি ইমেইল সহায়তা',
        emailDesc: 'daily-Khata-Pro@gmail.com-এ মেইল করুন।',
        githubTitle: 'গিটহাব ইস্যু ট্র্যাকার',
        githubDesc: 'কোনো সমস্যা পেলে গিটহাবে ইস্যু তৈরি করুন।',
        docsTitle: 'ইউজার ম্যানুয়াল',
        docsDesc: 'সকল ফিচারের বিস্তারিত গাইড পড়ুন।'
      }
    },
    homeSubtitles: {
      personal: 'ব্যক্তিগত প্রয়োজন ও জীবনযাত্রা',
      family: 'পরিবারের খরচ, বাড়ি ভাড়া ও রেশন',
      buffer: 'দৈনন্দিন অপ্রত্যাশিত খরচ',
      emergency: 'জরুরি তহবিল ও চিকিৎসা সুরক্ষা',
      saving: 'স্বল্পমেয়াদী সঞ্চয় ও কেনাকাটা',
      investment: 'দীর্ঘমেয়াদী বিনিয়োগ ও সম্পদ বৃদ্ধি'
    },
    common: {
      back: 'ফিরে যান',
      save: 'সংরক্ষণ করুন',
      cancel: 'বাতিল',
      delete: 'মুছুন',
      edit: 'সম্পাদনা',
      deposit: 'জমা দিন',
      filter: 'ফিল্টার',
      search: 'অনুসন্ধান...',
      today: 'আজ',
      thisMonth: 'এই মাস',
      netBalanceDesc: '৬-তহবিল নিয়মে আপনার মোট প্রকৃত সুরক্ষিত ব্যালেন্স',
      disciplinedSplit: '১০০% সুশৃঙ্খল বিভাজন নিয়ম',
      safeOffline: '১০০% নিরাপদ, ব্যক্তিগত ও অফলাইন',
      viewLedger: 'সম্পূর্ণ লেজার দেখুন',
      todaysNet: 'আজকের মোট লাভ:'
    }
  },

  es: {
    about: {
      backToHome: 'Volver al Inicio',
      badge: 'Acerca de Daily Khata: Pro',
      title: 'Acerca de Daily Khata: Pro™',
      subtitle: 'Libro contable financiero universal, gestor de dinero de 6 fondos y diario personal.',
      platformLabel: 'Plataforma',
      architectureLabel: 'Arquitectura',
      architectureValue: '100% Almacenamiento Local (Sin Servidor)',
      licenseLabel: 'Licencia',
      creatorLabel: 'Creador',
      missionTitle: 'Nuestra Misión y Propósito',
      missionP1: 'Daily Khata: Pro se creó para ofrecer a personas, autónomos y familias un libro contable rápido, honesto y 100% privado sin registros en la nube ni cargos ocultos.',
      missionP2: 'A diferencia de las aplicaciones bancarias tradicionales, sus datos nunca salen de su navegador ni dispositivo. Todo el código es de código abierto bajo licencia MIT.',
      capabilitiesTitle: 'Capacidades y Arquitectura',
      pillars: {
        fundsTitle: 'Regla de Asignación Automática de 6 Fondos',
        fundsDesc: 'Divide automáticamente los ingresos en 6 fondos: Personal (30%), Familia (30%), Reserva (10%), Emergencia (10%), Ahorro (10%) e Inversión (10%). Personalizable en Ajustes.',
        privacyTitle: 'Almacenamiento Local de Conocimiento Cero',
        privacyDesc: 'Los datos se guardan exclusivamente en el almacenamiento local de su dispositivo sin bases de datos remotas ni cookies de rastreo.',
        journalTitle: 'Registro de Trabajo y Vida Diaria',
        journalDesc: 'Gestione entregas de proyectos, horas facturables, rutinas y notas junto con sus finanzas.',
        backupTitle: 'Impresión, PDF y Copias JSON',
        backupDesc: 'Exporte extractos mensuales en alta resolución y descargue copias de seguridad completas en JSON con un clic.'
      },
      contactsTitle: 'Canales Oficiales de Soporte',
      contactsDesc: 'Para sugerencias, soporte o preguntas oficiales, utilice nuestros canales verificados:',
      officialWebsite: 'Sitio Web Oficial',
      officialSupport: 'Correo de Soporte Oficial',
      githubRepo: 'Repositorio Abierto en GitHub',
      instaProfile: 'Perfil Oficial de Instagram',
      twitterProfile: 'Perfil Oficial de X (Twitter)'
    },
    privacy: {
      badge: 'Política de Privacidad',
      title: 'Política de Privacidad y Cero Recopilación',
      subtitle: 'Sus datos financieros son 100% locales, privados y nunca se transmiten por internet.',
      backToHome: 'Volver al Inicio',
      corePledgeTitle: 'Cero Rastreo y Confidencialidad Absoluta',
      corePledgeDesc: 'Daily Khata: Pro opera bajo una estricta arquitectura de conocimiento cero. No recopilamos datos personales.',
      highlights: {
        offlineTitle: '100% Fuera de Línea',
        offlineDesc: 'Todas las transacciones se calculan directamente en su navegador.',
        noCookiesTitle: 'Sin Cookies de Rastreo',
        noCookiesDesc: 'No utilizamos herramientas de telemetría ni publicidad.',
        localVaultTitle: 'Bloqueo PIN Local',
        localVaultDesc: 'Su código PIN se verifica localmente sin llamadas a servidores.',
        exportControlTitle: 'Control Total de sus Datos',
        exportControlDesc: 'Exporte o borre todos sus registros cuando lo desee con un solo clic.'
      },
      dataRetentionTitle: 'Retención y Control',
      dataRetentionDesc: 'Usted tiene control absoluto sobre sus datos almacenados localmente en su navegador.',
      thirdPartyTitle: 'Servicios de Terceros',
      thirdPartyDesc: 'No compartimos información con ninguna red publicitaria o financiera externa.',
      userRightsTitle: 'Sus Derechos de Datos',
      userRightsDesc: 'Tiene derecho a exportar sus datos en JSON/CSV y utilizar la aplicación sin conexión a internet.'
    },
    terms: {
      badge: 'Términos de Servicio',
      title: 'Términos de Servicio y Licencia Abierta',
      subtitle: 'Términos estándar MIT de Código Abierto • Dominio oficial: rozfiber.com',
      backToHome: 'Volver al Inicio',
      openSourceTitle: 'Acuerdo de Licencia de Código Abierto MIT',
      openSourceDesc: 'Daily Khata: Pro se distribuye de forma gratuita y abierta bajo la licencia MIT.',
      termsList: {
        ownershipTitle: '1. Propiedad de los Datos',
        ownershipDesc: 'Usted es el único propietario de todas las transacciones y notas registradas.',
        usageTitle: '2. Uso Adecuado',
        usageDesc: 'Puede utilizar esta herramienta para contabilidad personal, familiar o de pequeños negocios.',
        disclaimerTitle: '3. Sin Garantía Financiera',
        disclaimerDesc: 'El software es una calculadora organizativa, no un asesor legal o fiscal certificado.',
        backupTitle: '4. Responsabilidad de Copias',
        backupDesc: 'Dado que los datos son locales, recomendamos exportar copias de seguridad en JSON periódicamente.'
      }
    },
    disclaimer: {
      badge: 'Aviso Legal',
      title: 'Aviso Legal y Financiero',
      subtitle: 'Información importante sobre cálculos financieros y autocustodia de registros.',
      backToHome: 'Volver al Inicio',
      alertTitle: 'Herramienta de Cálculo Educativa e Informativa',
      alertDesc: 'Daily Khata: Pro es un organizador matemático. No proporciona asesoramiento fiscal o de inversión certificado.',
      sections: {
        nonAdvisoryTitle: '1. Carácter No Asesor',
        nonAdvisoryDesc: 'La regla de los 6 fondos es una guía general. Personalice los porcentajes en Configuración según sus necesidades.',
        calculationTitle: '2. Integridad de Cálculos',
        calculationDesc: 'Verifique los números antes de presentaciones fiscales oficiales o auditorías formales.',
        selfResponsibilityTitle: '3. Responsabilidad de Copias de Seguridad',
        selfResponsibilityDesc: 'Sin un servidor central, la pérdida de su dispositivo sin una copia previa en JSON puede implicar pérdida de datos.'
      }
    },
    safety: {
      badge: 'Seguridad',
      title: 'Seguridad, Bóveda PIN y Protección de Datos',
      subtitle: 'Cómo Daily Khata: Pro mantiene sus números a salvo de miradas ajenas.',
      backToHome: 'Volver al Inicio',
      vaultProtectionTitle: 'Defensa Local Multinivel',
      vaultProtectionDesc: 'Almacenamiento local aislado, bloqueo por código PIN y enmascaramiento instantáneo de números.',
      pillars: {
        pinTitle: 'Bloqueo PIN de 4 Dígitos',
        pinDesc: 'Bloquea la pantalla automáticamente al salir de la pestaña o abrir la aplicación.',
        maskTitle: 'Modo Privacidad (Ocultar Números)',
        maskDesc: 'Oculte sus saldos con asteriscos (••••••) en lugares públicos.',
        wipeTitle: 'Borrado de Emergencia',
        wipeDesc: 'Elimine todos los datos y códigos al instante en caso de emergencia.',
        backupTitle: 'Archivo de Respaldo JSON',
        backupDesc: 'Guarde copias descargables en un dispositivo seguro para recuperación ante desastres.'
      },
      bestPracticesTitle: 'Buenas Prácticas de Seguridad',
      bestPractices: [
        'Active el código PIN de 4 dígitos si comparte su dispositivo.',
        'Active el Modo Privacidad (icono de ojo) en transporte público o cafeterías.',
        'Descargue una copia de seguridad JSON al menos una vez al mes.',
        'Mantenga su navegador actualizado.'
      ]
    },
    developer: {
      badge: 'Perfil del Desarrollador',
      title: 'Perfil del Creador',
      subtitle: 'Creado por MD Zafeer Hasan • Enfocado en privacidad y software ético.',
      backToHome: 'Volver al Inicio',
      bioTitle: 'Sobre MD Zafeer Hasan',
      bioDesc: 'MD Zafeer Hasan es un ingeniero de software y creador de código abierto enfocado en herramientas rápidas y éticas.',
      skillsTitle: 'Tecnologías Principales',
      visionTitle: 'La Visión de Daily Khata: Pro',
      visionDesc: 'Proporcionar un sistema contable de nivel mundial que sea gratuito, funcione sin conexión y nunca monetice sus datos.',
      connectTitle: 'Conectar y Seguir',
      connectDesc: 'Póngase en contacto a través de correo electrónico o GitHub para colaboraciones y sugerencias.'
    },
    support: {
      badge: 'Centro de Ayuda',
      title: 'Soporte, Preguntas Frecuentes y Ayuda',
      subtitle: 'Respuestas rápidas a preguntas comunes y canales de soporte directo.',
      backToHome: 'Volver al Inicio',
      faqTitle: 'Preguntas Frecuentes (FAQ)',
      faqs: [
        {
          q: '¿Dónde se guardan mis datos financieros?',
          a: 'Se guardan 100% dentro del almacenamiento local de su navegador. Nunca se transmiten a ningún servidor.'
        },
        {
          q: '¿Funciona sin conexión a internet?',
          a: '¡Sí! Funciona completamente sin conexión para añadir transacciones, ver gráficos e imprimir extractos.'
        },
        {
          q: '¿Cómo funciona la regla de los 6 fondos?',
          a: 'Distribuye automáticamente los ingresos en 6 categorías: Personal (30%), Familia (30%), Reserva (10%), Emergencia (10%), Ahorro (10%) e Inversión (10%).'
        },
        {
          q: '¿Cómo hacer una copia de seguridad?',
          a: 'Vaya a Configuración > Copia de Seguridad y haga clic en "Exportar Copia JSON".'
        },
        {
          q: '¿Cómo configurar el código PIN?',
          a: 'Haga clic en el icono de candado en el menú superior o vaya a Configuración > Bloqueo de Seguridad.'
        }
      ],
      contactCards: {
        emailTitle: 'Soporte Directo por Correo',
        emailDesc: 'Escriba a daily-Khata-Pro@gmail.com para asistencia prioritaria.',
        githubTitle: 'Rastreador de GitHub',
        githubDesc: 'Reporte errores o solicite nuevas funciones en nuestro repositorio.',
        docsTitle: 'Manual de Usuario Oficial',
        docsDesc: 'Lea guías paso a paso completas sobre todas las herramientas.'
      }
    },
    homeSubtitles: {
      personal: 'Gastos personales, comida y estilo de vida',
      family: 'Hogar, alquiler y compras familiares',
      buffer: 'Gastos diarios imprevistos y facturas',
      emergency: 'Seguridad ante emergencias y salud',
      saving: 'Ahorros a corto plazo y objetivos de compra',
      investment: 'Inversión a largo plazo y patrimonio'
    },
    common: {
      back: 'Atrás',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      deposit: 'Depositar',
      filter: 'Filtrar',
      search: 'Buscar...',
      today: 'Hoy',
      thisMonth: 'Este Mes',
      netBalanceDesc: 'Saldo neto consolidado en tiempo real distribuido en los 6 fondos',
      disciplinedSplit: 'Ratio de División 100% Disciplinado',
      safeOffline: '100% Seguro, Privado y Fuera de Línea',
      viewLedger: 'Ver Libro Completo',
      todaysNet: 'Neto de Hoy:'
    }
  },

  ar: {
    about: {
      backToHome: 'العودة إلى الصفحة الرئيسية',
      badge: 'حول تطبيق ديلي خاتا برو',
      title: 'حول Daily Khata: Pro™',
      subtitle: 'دفتر الأستاذ المالي الشامل، ونظام تقسيم الأموال وفق قاعدة الصناديق الستة، وسجل العمل والحياة اليومية.',
      platformLabel: 'المنصة',
      architectureLabel: 'البنية البرمجية',
      architectureValue: 'تخزين محلي 100% (بدون اتصال)',
      licenseLabel: 'الترخيص',
      creatorLabel: 'المطور والمنشئ',
      missionTitle: 'مهمتنا وغايتنا',
      missionP1: 'تم إنشاء Daily Khata: Pro بهدف تقديم دفتر حسابات صادق وسريع وفائق الخصوصية للأفراد والعائلات وأصحاب المشاريع الحرة دون الحاجة إلى تسجيل دخول سحابي أو تتبع.',
      missionP2: 'جميع بياناتك تظل مشفرة ومخزنة حصرياً داخل متصفحك أو هاتفك المحمول ولا تغادره أبداً. هذا التطبيق مجاني بالكامل ومفتوح المصدر بموجب ترخيص MIT.',
      capabilitiesTitle: 'القدرات الأساسية',
      pillars: {
        fundsTitle: 'قاعدة التوزيع الآلي للصناديق الستة',
        fundsDesc: 'عند تسجيل أي دخل، يتم تقسيمه تلقائياً إلى 6 صناديق: الشخصي (30%)، الأسرة (30%)، الطوارئ (10%)، الاحتياطي (10%)، المدخرات (10%)، والاستثمار (10%).',
        privacyTitle: 'تخزين آمن بدون معرفة مسبقة',
        privacyDesc: 'يتم حفظ جميع القيود في التخزين المحلي لجهازك دون خوادم خارجية أو ملفات تعريف ارتباط للإعلانات.',
        journalTitle: 'سجل العمل واليوميات',
        journalDesc: 'تتبع ساعات العمل المفوترة والمشاريع وعادات الصباح والمساء جنباً إلى جنب مع معاملاتك المالية.',
        backupTitle: 'الطباعة والنسخ الاحتياطي',
        backupDesc: 'استخرج كشوفات حساب شهرية بضغطة زر واحفظ نسخك الاحتياطية بصيغة JSON بأمان.'
      },
      contactsTitle: 'قنوات الدعم والتواصل الرسمية',
      contactsDesc: 'للاقتراحات أو الدعم الفني، يرجى التواصل عبر قنواتنا الرسمية:',
      officialWebsite: 'الموقع الرسمي والنطاق',
      officialSupport: 'البريد الإلكتروني للدعم',
      githubRepo: 'مستودع GitHub المفتوح',
      instaProfile: 'حساب Instagram الرسمي',
      twitterProfile: 'حساب X (تويتر) الرسمي'
    },
    privacy: {
      badge: 'سياسة الخصوصية',
      title: 'سياسة الخصوصية وعدم جمع البيانات',
      subtitle: 'بياناتك المالية محلية بنسبة 100% ومحمية تماماً ولا يتم نقلها عبر الإنترنت.',
      backToHome: 'العودة إلى الصفحة الرئيسية',
      corePledgeTitle: 'خصوصية تامة وانعدام التتبع',
      corePledgeDesc: 'يعمل التطبيق وفق معايير صارمة تضمن عدم جمع أو تخزين أي بيانات للمستخدمين.',
      highlights: {
        offlineTitle: '100% بدون إنترنت وبخصوصية تامة',
        offlineDesc: 'تتم جميع العمليات الحسابية داخل متصفحك مباشرة.',
        noCookiesTitle: 'بدون كوكيز تتبعية',
        noCookiesDesc: 'لا نستخدم أي نصوص برمجية للإعلانات أو التتبع.',
        localVaultTitle: 'قفل برمز سري محلي',
        localVaultDesc: 'يتم التحقق من الرمز السري على جهازك دون اتصال بالشبكة.',
        exportControlTitle: 'سيادة كاملة على بياناتك',
        exportControlDesc: 'يمكنك تنزيل بياناتك أو مسحها نهائياً بضغطة واحدة.'
      },
      dataRetentionTitle: 'الاحتفاظ بالبيانات والتحكم فيها',
      dataRetentionDesc: 'نظراً لأن السجلات تبقى في جهازك، فأنت المالك الوحيد لها.',
      thirdPartyTitle: 'أطراف ثالثة',
      thirdPartyDesc: 'لا نشارك أي معلومات شخصية أو مالية مع أي جهة خارجية.',
      userRightsTitle: 'حقوقك في البيانات',
      userRightsDesc: 'لك كامل الحق في تصدير بياناتك واستخدام التطبيق دون اتصال بالإنترنت.'
    },
    terms: {
      badge: 'شروط الخدمة',
      title: 'شروط الاستخدام والترخيص المفتوح',
      subtitle: 'شروط ترخيص MIT القياسية • النطاق الرسمي: rozfiber.com',
      backToHome: 'العودة إلى الصفحة الرئيسية',
      openSourceTitle: 'اتفاقية ترخيص MIT مفتوح المصدر',
      openSourceDesc: 'البرنامج متاح مجاناً للجميع بموجب ترخيص MIT.',
      termsList: {
        ownershipTitle: '1. الملكية الكاملة للبيانات',
        ownershipDesc: 'أنت المالك الحصري لجميع السجلات والمدخلات المالية.',
        usageTitle: '2. الاستخدام المشروع',
        usageDesc: 'يمكنك استخدام التطبيق لإدارة الميزانية الشخصية أو المحلات التجارية بحرية.',
        disclaimerTitle: '3. إخلاء المسؤولية المالية',
        disclaimerDesc: 'هذا التطبيق أداة حسابية تنظيمية وليس مستشاراً ضريبياً أو قانونياً معتمداً.',
        backupTitle: '4. مسؤولية النسخ الاحتياطي',
        backupDesc: 'تقع مسؤولية الاحتفاظ بنسخ احتياطية دورية على عاتق المستخدم نظراً لتخزين البيانات محلياً.'
      }
    },
    disclaimer: {
      badge: 'إخلاء المسؤولية القانونية',
      title: 'إخلاء المسؤولية المالية والقانونية',
      subtitle: 'إشعار هام بخصوص العمليات الحسابية والوصاية الذاتية على السجلات المالية.',
      backToHome: 'العودة إلى الصفحة الرئيسية',
      alertTitle: 'أداة حسابية وتثقيفية',
      alertDesc: 'التطبيق أداة مساعدة ولا يقدم استشارات استثمارية أو ضريبية معتمدة.',
      sections: {
        nonAdvisoryTitle: '1. طبيعة غير استشارية',
        nonAdvisoryDesc: 'قاعدة الصناديق الستة هي قاعدة عامة، ويمكنك تخصيص النسب من الإعدادات.',
        calculationTitle: '2. دقة الحسابات',
        calculationDesc: 'يجب على المستخدم التأكد من الأرقام بنفسه قبل التقديم للجهات الضريبية الرسمية.',
        selfResponsibilityTitle: '3. مسؤولية النسخ الاحتياطي',
        selfResponsibilityDesc: 'في حال مسح بيانات المتصفح دون وجود نسخة احتياطية JSON، لا يمكن استرجاع البيانات عن بعد.'
      }
    },
    safety: {
      badge: 'هندسة الأمان',
      title: 'الأمان، وخزنة الرمز السري وحماية البيانات',
      subtitle: 'كيف يحافظ التطبيق على أرقامك وسجلاتك بعيداً عن المتطفلين.',
      backToHome: 'العودة إلى الصفحة الرئيسية',
      vaultProtectionTitle: 'منظومة أمان محلية متعددة المستويات',
      vaultProtectionDesc: 'تخزين معزول، وقفل برمز سري مكون من 4 أرقام، وقناع فوري للخصوصية.',
      pillars: {
        pinTitle: 'رمز سري مكون من 4 أرقام',
        pinDesc: 'يقفل التطبيق تلقائياً عند فتح الشاشة أو الانتقال لتبويب آخر.',
        maskTitle: 'قناع الخصوصية (إخفاء الأرقام)',
        maskDesc: 'إخفاء الأرقام بنجوم (••••••) في الأماكن العامة لحماية الخصوصية.',
        wipeTitle: 'مسح البيانات في حالات الطوارئ',
        wipeDesc: 'حذف جميع السجلات والأكواد فوراً عند الحاجة.',
        backupTitle: 'نسخ احتياطي بصيغة JSON',
        backupDesc: 'حفظ ملفات النسخ الاحتياطي في محرك أقراص شخصي بأمان.'
      },
      bestPracticesTitle: 'أفضل الممارسات الأمنية الموصى بها',
      bestPractices: [
        'فعّل الرمز السري إذا كنت تشارك جهازك مع آخرين.',
        'استخدم قناع الخصوصية (رمز العين) في الأماكن العامة.',
        'قم بتنزيل نسخة احتياطية JSON مرة واحدة شهرياً على الأقل.',
        'حافظ على تحديث متصفحك باستمرار.'
      ]
    },
    developer: {
      badge: 'الملف الشخصي للمطور',
      title: 'المطور والمنشئ',
      subtitle: 'تم التطوير بشغف بواسطة محمد زفير حسن • مكرس للخصوصية البرمجية.',
      backToHome: 'العودة إلى الصفحة الرئيسية',
      bioTitle: 'عن محمد زفير حسن',
      bioDesc: 'مهندس برمجيات ومبتكر مفتوح المصدر يركز على بناء أدوات ويب فائقة السرعة تحترم خصوصية المستخدمين.',
      skillsTitle: 'التقنيات والمهارات الأساسية',
      visionTitle: 'رؤية التطبيق',
      visionDesc: 'تزويد كل فرد بنظام مالي مجاني تماماً يعمل بدون إنترنت ولا يتاجر ببيانات المستخدمين.',
      connectTitle: 'التواصل والمتابعة',
      connectDesc: 'تواصل معنا لتقديم الملاحظات أو المساهمة عبر البريد أو GitHub.'
    },
    support: {
      badge: 'مركز المساعدة',
      title: 'الدعم الفني والأسئلة الشائعة',
      subtitle: 'إجابات سريعة للأسئلة المتكررة وقنوات الدعم المباشر.',
      backToHome: 'العودة إلى الصفحة الرئيسية',
      faqTitle: 'الأسئلة الأكثر شيوعاً (FAQ)',
      faqs: [
        {
          q: 'أين يتم تخزين بياناتي المالية؟',
          a: 'يتم تخزينها بنسبة 100% محلياً داخل متصفحك ولا تُرسل لأي خادم أبداً.'
        },
        {
          q: 'هل يعمل التطبيق بدون إنترنت؟',
          a: 'نعم! التطبيق يعمل بشكل كامل بدون اتصال بالإنترنت.'
        },
        {
          q: 'ما هي قاعدة الصناديق الستة؟',
          a: 'يتم توزيع الدخل تلقائياً إلى 6 صناديق: شخصي (30%)، عائلة (30%)، احتياطي (10%)، طوارئ (10%)، ادخار (10%)، واستثمار (10%).'
        },
        {
          q: 'كيف آخذ نسخة احتياطية؟',
          a: 'انتقل إلى الإعدادات > النسخ الاحتياطي واضغط "Export JSON Backup".'
        },
        {
          q: 'كيف أقفل التطبيق برمز سري؟',
          a: 'اضغط على رمز القفل في الأعلى أو انتقل إلى الإعدادات > قفل الأمان.'
        }
      ],
      contactCards: {
        emailTitle: 'الدعم المباشر عبر البريد',
        emailDesc: 'راسلنا على daily-Khata-Pro@gmail.com للحصول على المساعدة.',
        githubTitle: 'متتبع مشاكل GitHub',
        githubDesc: 'أبلغ عن المشاكل أو اطلب ميزات جديدة.',
        docsTitle: 'دليل المستخدم',
        docsDesc: 'اقرأ الإرشادات التفصيلية لجميع الميزات.'
      }
    },
    homeSubtitles: {
      personal: 'الاحتياجات الشخصية ونمط الحياة',
      family: 'مصاريف المنزل والإيجار والأسرة',
      buffer: 'المصاريف اليومية غير المتوقعة',
      emergency: 'حالات الطوارئ والسلامة الطبية',
      saving: 'المدخرات قصيرة الأجل والمشتريات',
      investment: 'الاستثمار طويل الأجل وتنمية الثروة'
    },
    common: {
      back: 'رجوع',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      deposit: 'إيداع',
      filter: 'تصفية',
      search: 'بحث...',
      today: 'اليوم',
      thisMonth: 'هذا الشهر',
      netBalanceDesc: 'الرصيد الصافي الفعلي الموزع بانتظام على الصناديق الستة',
      disciplinedSplit: 'نسبة تقسيم منضبطة 100%',
      safeOffline: '100% آمن، خاص وبدون إنترنت',
      viewLedger: 'عرض دفتر الأستاذ كاملاً',
      todaysNet: 'صافي اليوم:'
    }
  },

  // Remaining languages with complete fluent localization
  fr: {
    about: {
      backToHome: 'Retour à l’accueil',
      badge: 'À propos de Daily Khata: Pro',
      title: 'À propos de Daily Khata: Pro™',
      subtitle: 'Livre de comptes financier universel, gestionnaire 6 fonds et journal personnel.',
      platformLabel: 'Plateforme',
      architectureLabel: 'Architecture',
      architectureValue: '100% Stockage Local (Hors Ligne)',
      licenseLabel: 'Licence',
      creatorLabel: 'Créateur',
      missionTitle: 'Notre Mission & Vision',
      missionP1: 'Daily Khata: Pro a été conçu avec une mission claire : offrir un livre de comptes honnête, ultra-rapide et totalement confidentiel sans aucun suivi dans le cloud.',
      missionP2: 'Vos données financières ne quittent jamais votre appareil. Tout est calculé localement sous licence libre MIT.',
      capabilitiesTitle: 'Fonctionnalités Clés',
      pillars: {
        fundsTitle: 'Règle des 6 Fonds Automatisée',
        fundsDesc: 'Chaque revenu est divisé en 6 poches intelligentes : Personnel (30%), Famille (30%), Réserve (10%), Urgence (10%), Épargne (10%) et Investissement (10%).',
        privacyTitle: 'Zéro Donnée Distante',
        privacyDesc: 'Stockage exclusif dans votre navigateur. Aucun cookie traceur ni base de données distante.',
        journalTitle: 'Journal & Livrables de Travail',
        journalDesc: 'Gérez vos projets, heures facturables et habitudes en un seul endroit.',
        backupTitle: 'Impression & Sauvegarde JSON',
        backupDesc: 'Exportez vos bilans mensuels et sauvegardez l’intégralité de vos comptes en un clic.'
      },
      contactsTitle: 'Canaux Officiels',
      contactsDesc: 'Pour toute assistance ou suggestion, utilisez nos canaux vérifiés :',
      officialWebsite: 'Site Officiel',
      officialSupport: 'Email Officiel',
      githubRepo: 'Dépôt GitHub Open Source',
      instaProfile: 'Instagram Officiel',
      twitterProfile: 'X (Twitter) Officiel'
    },
    privacy: {
      badge: 'Politique de Confidentialité',
      title: 'Confidentialité & Zéro Collecte',
      subtitle: 'Vos données sont 100% locales et privées.',
      backToHome: 'Retour à l’accueil',
      corePledgeTitle: 'Confidentialité Absolue',
      corePledgeDesc: 'Nous n’avons aucun serveur distant ni système de pistage.',
      highlights: {
        offlineTitle: '100% Hors Ligne',
        offlineDesc: 'Tous les calculs restent dans votre navigateur.',
        noCookiesTitle: 'Zéro Cookie Tiers',
        noCookiesDesc: 'Aucune publicité ni script d’analyse.',
        localVaultTitle: 'Verrouillage par Code PIN',
        localVaultDesc: 'Vérification locale sans appel réseau.',
        exportControlTitle: 'Contrôle Total',
        exportControlDesc: 'Exportez ou effacez vos données à tout moment.'
      },
      dataRetentionTitle: 'Rétention des Données',
      dataRetentionDesc: 'Vous avez la souveraineté totale sur vos données locales.',
      thirdPartyTitle: 'Services Tiers',
      thirdPartyDesc: 'Aucune donnée financière n’est transmise à des tiers.',
      userRightsTitle: 'Vos Droits',
      userRightsDesc: 'Droit d’exportation libre en JSON/CSV et utilisation hors-ligne.'
    },
    terms: {
      badge: 'Conditions d’Utilisation',
      title: 'Conditions & Licence Open Source',
      subtitle: 'Licence standard MIT • Domaine officiel : rozfiber.com',
      backToHome: 'Retour à l’accueil',
      openSourceTitle: 'Accord de Licence MIT',
      openSourceDesc: 'Logiciel gratuit et open source distribué sous licence MIT.',
      termsList: {
        ownershipTitle: '1. Propriété Complète',
        ownershipDesc: 'Vous possédez l’intégralité de vos enregistrements et notes.',
        usageTitle: '2. Utilisation Légitime',
        usageDesc: 'Utilisation libre pour vos comptes personnels ou professionnels.',
        disclaimerTitle: '3. Pas de Conseil Fiscal',
        disclaimerDesc: 'Outil organisationnel, non assimilable à un expert-comptable agréé.',
        backupTitle: '4. Responsabilité des Sauvegardes',
        backupDesc: 'La sauvegarde régulière incombe à l’utilisateur.'
      }
    },
    disclaimer: {
      badge: 'Avertissement Légal',
      title: 'Avertissement Financier & Légal',
      subtitle: 'Note importante sur les calculs automatiques.',
      backToHome: 'Retour à l’accueil',
      alertTitle: 'Outil Pédagogique et Informatif',
      alertDesc: 'Daily Khata: Pro est un calculateur financier, pas un conseiller en investissement.',
      sections: {
        nonAdvisoryTitle: '1. Absence de Conseil',
        nonAdvisoryDesc: 'La règle des 6 fonds est indicative et personnalisable dans les paramètres.',
        calculationTitle: '2. Exactitude des Calculs',
        calculationDesc: 'Vérifiez toujours vos chiffres avant déclaration officielle.',
        selfResponsibilityTitle: '3. Sauvegarde Locale',
        selfResponsibilityDesc: 'Sans serveur, les données effacées sans fichier JSON sont irrécupérables.'
      }
    },
    safety: {
      badge: 'Sécurité Locale',
      title: 'Sécurité, Code PIN & Protection',
      subtitle: 'Protégez vos comptes des regards indiscrets.',
      backToHome: 'Retour à l’accueil',
      vaultProtectionTitle: 'Cadre de Sécurité Multiniveau',
      vaultProtectionDesc: 'Stockage isolé, code PIN à 4 chiffres et masque de confidentialité.',
      pillars: {
        pinTitle: 'Code PIN à 4 Chiffres',
        pinDesc: 'Verrouille l’écran automatiquement à l’ouverture.',
        maskTitle: 'Masque de Confidentialité',
        maskDesc: 'Cache les montants (••••••) dans les lieux publics.',
        wipeTitle: 'Effacement d’Urgence',
        wipeDesc: 'Supprimez toutes les données instantanément en cas d’urgence.',
        backupTitle: 'Sauvegarde JSON Sécurisée',
        backupDesc: 'Conservez vos archives sur un support externe sécurisé.'
      },
      bestPracticesTitle: 'Recommandations de Sécurité',
      bestPractices: [
        'Activez le code PIN si vous partagez votre appareil.',
        'Utilisez le masque de confidentialité dans les lieux publics.',
        'Téléchargez une sauvegarde JSON une fois par mois.',
        'Gardez votre navigateur à jour.'
      ]
    },
    developer: {
      badge: 'Profil Développeur',
      title: 'Créateur & Développeur',
      subtitle: 'Conçu avec passion par MD Zafeer Hasan.',
      backToHome: 'Retour à l’accueil',
      bioTitle: 'À propos de MD Zafeer Hasan',
      bioDesc: 'Ingénieur logiciel dédié aux solutions web rapides, éthiques et privées.',
      skillsTitle: 'Technologies Clés',
      visionTitle: 'Vision du Projet',
      visionDesc: 'Offrir à chacun un moteur financier libre et confidentiel.',
      connectTitle: 'Nous Suivre',
      connectDesc: 'Contactez-nous pour toute collaboration ou suggestion.'
    },
    support: {
      badge: 'Centre d’Aide',
      title: 'Assistance & Questions Fréquentes',
      subtitle: 'Réponses rapides et support technique.',
      backToHome: 'Retour à l’accueil',
      faqTitle: 'Questions Fréquentes (FAQ)',
      faqs: [
        {
          q: 'Où sont stockées mes données ?',
          a: 'À 100% dans le stockage local de votre navigateur.'
        },
        {
          q: 'L’application fonctionne-t-elle hors ligne ?',
          a: 'Oui, Daily Khata: Pro fonctionne parfaitement sans connexion internet.'
        },
        {
          q: 'Comment fonctionne la règle des 6 fonds ?',
          a: 'Chaque revenu est divisé en 6 catégories : Personnel (30%), Famille (30%), Réserve (10%), Urgence (10%), Épargne (10%) et Investissement (10%).'
        },
        {
          q: 'Comment faire une sauvegarde ?',
          a: 'Allez dans Paramètres > Sauvegarde et cliquez sur "Export JSON Backup".'
        },
        {
          q: 'Comment activer le code PIN ?',
          a: 'Cliquez sur l’icône de cadenas ou allez dans Paramètres > Sécurité.'
        }
      ],
      contactCards: {
        emailTitle: 'Support Email Direct',
        emailDesc: 'Écrivez à daily-Khata-Pro@gmail.com pour toute question.',
        githubTitle: 'Dépôt GitHub',
        githubDesc: 'Signalez des bugs ou suggérez des fonctionnalités.',
        docsTitle: 'Manuel d’Utilisation',
        docsDesc: 'Consultez les guides détaillés.'
      }
    },
    homeSubtitles: {
      personal: 'Besoins personnels, repas et style de vie',
      family: 'Ménage, loyer et dépenses familiales',
      buffer: 'Dépenses imprévues du quotidien',
      emergency: 'Fonds d’urgence et santé médicale',
      saving: 'Épargne à court terme et projets d’achat',
      investment: 'Investissement à long terme et patrimoine'
    },
    common: {
      back: 'Retour',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      deposit: 'Déposer',
      filter: 'Filtrer',
      search: 'Rechercher...',
      today: 'Aujourd’hui',
      thisMonth: 'Ce mois',
      netBalanceDesc: 'Solde net consolidé réparti sur les 6 fonds disciplinés',
      disciplinedSplit: 'Répartition Disciplinée à 100%',
      safeOffline: '100% Sécurisé, Privé et Hors Ligne',
      viewLedger: 'Voir le Registre Complet',
      todaysNet: 'Net du jour :'
    }
  },

  // Fallbacks for remaining supported languages (de, ru, pt, id, ja, zh)
  de: {} as any,
  ru: {} as any,
  pt: {} as any,
  id: {} as any,
  ja: {} as any,
  zh: {} as any
};

// Populate clean fallbacks for de, ru, pt, id, ja, zh
const otherLangs: AppLanguage[] = ['de', 'ru', 'pt', 'id', 'ja', 'zh'];
otherLangs.forEach((lang) => {
  if (!PAGE_TRANSLATIONS[lang] || Object.keys(PAGE_TRANSLATIONS[lang]).length === 0) {
    PAGE_TRANSLATIONS[lang] = {
      ...PAGE_TRANSLATIONS.en,
      homeSubtitles: {
        de: {
          personal: 'Persönliche Bedürfnisse & Lebensstil',
          family: 'Haushalt, Miete & Lebensmittel',
          buffer: 'Tägliche unerwartete Ausgaben',
          emergency: 'Notfall- und Gesundheitsreserve',
          saving: 'Kurzfristige Ersparnisse & Anschaffungen',
          investment: 'Langfristige Investitionen & Vermögensaufbau'
        },
        ru: {
          personal: 'Личные нужды, питание и образ жизни',
          family: 'Дом, аренда и семейные расходы',
          buffer: 'Ежедневные непредвиденные траты',
          emergency: 'Резерв на экстренные случаи и здоровье',
          saving: 'Краткосрочные сбережения и покупки',
          investment: 'Долгосрочные инвестиции и капитал'
        },
        pt: {
          personal: 'Necessidades pessoais e estilo de vida',
          family: 'Despesas domésticas, aluguel e mercado',
          buffer: 'Despesas diárias imprevistas',
          emergency: 'Reserva de emergência e saúde',
          saving: 'Poupança de curto prazo e metas',
          investment: 'Investimentos de longo prazo e patrimônio'
        },
        id: {
          personal: 'Kebutuhan pribadi dan gaya hidup',
          family: 'Kebutuhan rumah tangga, sewa & belanja',
          buffer: 'Pengeluaran tak terduga harian',
          emergency: 'Dana darurat dan kesehatan',
          saving: 'Tabungan jangka pendek & belanja impian',
          investment: 'Investasi jangka panjang & aset'
        },
        ja: {
          personal: '個人の生活費・日用品',
          family: '家賃・食費・家庭の諸経費',
          buffer: '日常の予期せぬ出費・予備費',
          emergency: '緊急時・医療安全基金',
          saving: '短期貯蓄・目標の買い物',
          investment: '長期投資・資産形成'
        },
        zh: {
          personal: '个人需求、日常开销与生活方式',
          family: '家庭支出、房租与日常食品',
          buffer: '日常备用金与意外开销',
          emergency: '应急基金与医疗安全保障',
          saving: '短期储蓄与目标购物',
          investment: '长期投资与财富增值'
        }
      }[lang] || PAGE_TRANSLATIONS.en.homeSubtitles,
      common: {
        de: {
          back: 'Zurück', save: 'Speichern', cancel: 'Abbrechen', delete: 'Löschen', edit: 'Bearbeiten',
          deposit: 'Einzahlen', filter: 'Filtern', search: 'Suchen...', today: 'Heute', thisMonth: 'Diesen Monat',
          netBalanceDesc: 'Konsolidierter Saldo auf die 6 Töpfe verteilt', disciplinedSplit: '100% Disziplinierte Aufteilung',
          safeOffline: '100% Sicher, Privat & Offline', viewLedger: 'Gesamtes Buch anzeigen', todaysNet: 'Tages-Netto:'
        },
        ru: {
          back: 'Назад', save: 'Сохранить', cancel: 'Отмена', delete: 'Удалить', edit: 'Изменить',
          deposit: 'Внести', filter: 'Фильтр', search: 'Поиск...', today: 'Сегодня', thisMonth: 'В этом месяце',
          netBalanceDesc: 'Общий чистый баланс по 6 фондам', disciplinedSplit: '100% Дисциплинированное распределение',
          safeOffline: '100% Безопасно, Приватно и Офлайн', viewLedger: 'Открыть всю книгу', todaysNet: 'Итог за день:'
        },
        pt: {
          back: 'Voltar', save: 'Salvar', cancel: 'Cancelar', delete: 'Excluir', edit: 'Editar',
          deposit: 'Depositar', filter: 'Filtrar', search: 'Buscar...', today: 'Hoje', thisMonth: 'Este Mês',
          netBalanceDesc: 'Saldo líquido consolidado distribuído nos 6 fundos', disciplinedSplit: 'Divisão 100% Disciplinada',
          safeOffline: '100% Seguro, Privado e Offline', viewLedger: 'Ver Livro Completo', todaysNet: 'Líquido de Hoje:'
        },
        id: {
          back: 'Kembali', save: 'Simpan', cancel: 'Batal', delete: 'Hapus', edit: 'Edit',
          deposit: 'Setor', filter: 'Filter', search: 'Cari...', today: 'Hari Ini', thisMonth: 'Bulan Ini',
          netBalanceDesc: 'Total saldo bersih terbagi dalam 6 pos keuangan', disciplinedSplit: '100% Rasio Pembagian Disiplin',
          safeOffline: '100% Aman, Privat & Offline', viewLedger: 'Lihat Semua Catatan', todaysNet: 'Net Hari Ini:'
        },
        ja: {
          back: '戻る', save: '保存', cancel: 'キャンセル', delete: '削除', edit: '編集',
          deposit: '入金', filter: '絞り込み', search: '検索...', today: '今日', thisMonth: '今月',
          netBalanceDesc: '6つの資金ポットに分散された実質純残高', disciplinedSplit: '100% 規律ある分配比率',
          safeOffline: '100% 安全・プライベート・オフライン', viewLedger: '全台帳を表示', todaysNet: '本日の純増減:'
        },
        zh: {
          back: '返回', save: '保存', cancel: '取消', delete: '删除', edit: '编辑',
          deposit: '存入', filter: '筛选', search: '搜索...', today: '今日', thisMonth: '本月',
          netBalanceDesc: '按6个资金账户自动分配的净资产总额', disciplinedSplit: '100% 纪律性分配规则',
          safeOffline: '100% 安全、隐私与离线运行', viewLedger: '查看完整账本', todaysNet: '今日净结余:'
        }
      }[lang] || PAGE_TRANSLATIONS.en.common
    };
  }
});

export const getPageTranslation = (lang?: string | AppLanguage): PageTranslations => {
  if (!lang) return PAGE_TRANSLATIONS.en;
  return (PAGE_TRANSLATIONS as any)[lang] || PAGE_TRANSLATIONS.en;
};
