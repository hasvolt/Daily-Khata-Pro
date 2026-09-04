import { getCurrencyConfig, getCurrentLanguage } from './currencyConfig';
import { AppLanguage, FundType } from '../types';

export interface AppTranslationBundle {
  menu: {
    mainMenu: string;
    menuAndTools: string;
    featuresAndTools: string;
    themeColor: string;
    language: string;
    supportAndSafety: string;
    appSettings: string;
    calculator: string;
    personalNotes: string;
    securityPinLock: string;
    active: string;
    userManualGuide: string;
    helpCenterFaq: string;
    reportIssue: string;
    feedbackSuggestions: string;
    safetySourceCode: string;
    shareApp: string;
    installApp: string;
    developerProfile: string;
    githubProfile: string;
    searchPlaceholder: string;
    dailyIncomeExpense: string;
    sixFundLedger: string;
    official: string;
    mask: string;
    hidden: string;
    lock: string;
    day: string;
    night: string;
    khata: string;
    ledger: string;
    goals: string;
    workAndLife: string;
    notes: string;
    analytics: string;
  };
  manual: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    officialGuide: string;
    poweredBy: string;
    backToHome: string;
    sectionsHeading: string;
    tableOfContents: string;
    keyHighlights: string;
    stepByStep: string;
    proTip: string;
    quickAction: string;
    sections: Array<{
      id: string;
      title: string;
      subtitle: string;
    }>;
  };
  settings: {
    title: string;
    subtitle: string;
    tabPreferences: string;
    tabCustomOptions: string;
    tabRules: string;
    tabBackup: string;
    tabPrivacy: string;
    tabDeveloper: string;
    tabLegal: string;
    languageHeading: string;
    themeHeading: string;
    viewModeHeading: string;
    viewModeAuto: string;
    viewModeMobile: string;
    viewModeDesktop: string;
    privacyMaskHeading: string;
    privacyMaskDesc: string;
    securityPinHeading: string;
    securityPinDesc: string;
    securityPinConfigure: string;
    lockNowBtn: string;
    customCategoriesHeading: string;
    customCategoriesDesc: string;
    addCategoryPlaceholder: string;
    addCategoryBtn: string;
    customSourcesHeading: string;
    customSourcesDesc: string;
    addSourcePlaceholder: string;
    addSourceBtn: string;
    customWorkCategoriesHeading: string;
    addWorkCategoryPlaceholder: string;
    customLifeTagsHeading: string;
    addLifeTagPlaceholder: string;
    customPercentagesHeading: string;
    customPercentagesDesc: string;
    totalMustBe100: string;
    saveRuleBtn: string;
    resetRuleBtn: string;
    backupHeading: string;
    backupDesc: string;
    exportJsonBtn: string;
    importJsonBtn: string;
    exportCsvBtn: string;
    sampleDataHeading: string;
    sampleDataDesc: string;
    loadSampleDataBtn: string;
    dangerZone: string;
    resetAllDataBtn: string;
    ruleSavedSuccess: string;
    ruleResetSuccess: string;
    backupDownloadedSuccess: string;
    dataRestoredSuccess: string;
    resetConfirmTitle: string;
    resetConfirmDesc: string;
  };
  safety: {
    title: string;
    subtitle: string;
    openSourceBadge: string;
    backToHome: string;
    tabGithub: string;
    tabInspector: string;
    tabAudit: string;
    tabVerify: string;
    repoTitle: string;
    repoDesc: string;
    viewOnGithub: string;
    cloneRepo: string;
    cloneHint: string;
    mitLicenseTitle: string;
    mitLicenseDesc: string;
    modernStackTitle: string;
    modernStackDesc: string;
    auditReadyTitle: string;
    auditReadyDesc: string;
    copyCode: string;
    copied: string;
    auditTitle: string;
    auditSubtitle: string;
    verifyTitle: string;
    verifySubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  calc: {
    title: string;
    subtitle: string;
    tabStandard: string;
    tabFunds: string;
    tabSip: string;
    tabEmi: string;
    tabGst: string;
    tabDiscount: string;
    tabInflation: string;
    backToHome: string;
    enterIncome: string;
    presets: string;
    calculatedBreakdown: string;
    applyToIncome: string;
    applyToExpense: string;
    createGoal: string;
    monthlyInvestment: string;
    expectedReturnRate: string;
    timePeriodYears: string;
    totalInvested: string;
    estimatedReturns: string;
    totalFutureValue: string;
    loanAmount: string;
    interestRatePerAnnum: string;
    tenureYears: string;
    monthlyEmi: string;
    totalInterestPayable: string;
    totalPayment: string;
    netAmount: string;
    gstRate: string;
    cgstAmount: string;
    sgstAmount: string;
    totalWithGst: string;
    originalPrice: string;
    discountPercent: string;
    discountAmount: string;
    finalDiscountedPrice: string;
    currentExpense: string;
    inflationRate: string;
    futureCost: string;
    copyResult: string;
    resultCopied: string;
    history: string;
    clearHistory: string;
    noHistory: string;
  };
  developer: {
    title: string;
    subtitle: string;
    badge: string;
    backToHome: string;
    name: string;
    alias: string;
    role: string;
    creatorTag: string;
    verifiedCreator: string;
    skillsTitle: string;
    bioTitle: string;
    bioDesc: string;
    visionTitle: string;
    visionDesc: string;
    connectTitle: string;
    copyEmail: string;
    emailCopied: string;
    specificationsTitle: string;
    projectLabel: string;
    licenseLabel: string;
    privacyLabel: string;
    domainLabel: string;
    supportLabel: string;
  };
  brand: {
    appName: string;
    appSubtitle: string;
    tagline: string;
    offlineBadge: string;
  };
}

export const APP_TRANSLATIONS: Record<AppLanguage, AppTranslationBundle> = {
  en: {
    menu: {
      mainMenu: 'Main Menu',
      menuAndTools: 'Main Menu & Tools',
      featuresAndTools: 'Features & Tools',
      themeColor: 'Theme Color',
      language: 'Language',
      supportAndSafety: 'Support & Safety',
      appSettings: 'App Settings',
      calculator: 'Calculator',
      personalNotes: 'Personal Notes',
      securityPinLock: 'Security PIN Lock',
      active: 'Active',
      userManualGuide: 'User Manual Guide',
      helpCenterFaq: 'Help Centre & FAQ',
      reportIssue: 'Report an Issue',
      feedbackSuggestions: 'Feedback & Suggestions',
      safetySourceCode: 'Safety & Source Code',
      shareApp: 'Share App',
      installApp: 'Install App',
      developerProfile: 'Developer Profile',
      githubProfile: 'GitHub Profile',
      searchPlaceholder: 'Search transactions, notes, categories, amounts...',
      dailyIncomeExpense: 'Daily Income & Expense',
      sixFundLedger: 'Smart Fund Ledger',
      official: 'OFFICIAL',
      mask: 'Mask',
      hidden: 'Hidden',
      lock: 'Lock',
      day: 'Day',
      night: 'Night',
      khata: 'Khata',
      ledger: 'Ledger',
      goals: 'Goals',
      workAndLife: 'Work & Life',
      notes: 'Notes',
      analytics: 'Analytics'
    },
    manual: {
      title: 'User Manual & Comprehensive Guide',
      subtitle: 'Professional guidelines for systematic financial discipline & wealth tracking',
      searchPlaceholder: 'Search user guide (e.g. 6 funds, backup, goals, pdf)...',
      officialGuide: 'Official Guide',
      poweredBy: 'Powered by',
      backToHome: 'Back to Khata',
      sectionsHeading: 'Manual Sections',
      tableOfContents: 'Table of Contents',
      keyHighlights: 'Key Principles & Rules',
      stepByStep: 'Step-by-Step Instructions',
      proTip: 'Pro Tip for Financial Discipline',
      quickAction: 'Open Related Feature',
      sections: [
        { id: 'intro', title: '1. Introduction & Overview', subtitle: 'Zero-telemetry client-first financial engine' },
        { id: 'app_lock', title: '2. App Passcode Lock & Vault', subtitle: 'Instant 4-digit biometric and PIN shielding' },
        { id: 'personal_notes', title: '3. Personal Notes & Private Vault', subtitle: 'Confidential encrypted scratchpad & journals' },
        { id: 'six_funds', title: '4. Smart Fund Formula Allocation', subtitle: 'Automated 30/35/5/11.25/7.5/11.25 capital splits' },
        { id: 'add_income', title: '5. Recording Income', subtitle: 'Multi-source income logging & auto-partitioning' },
        { id: 'add_expense', title: '6. Logging Expenses', subtitle: 'Fund pot deduction, categories & payment modes' },
        { id: 'work_life', title: '7. Work Logs & Daily Timeline', subtitle: 'Track projects, earnings, hours & daily mood' },
        { id: 'goals', title: '8. Financial Goal Targets', subtitle: 'Linked pot milestone savings & target runway' },
        { id: 'reports', title: '9. Reports & PDF Statements', subtitle: 'Visual charts, analytics, CSV & print statements' },
        { id: 'settings', title: '10. Custom Settings & Rules', subtitle: 'Theme colors, custom categories & custom % rules' },
        { id: 'backup', title: '11. Backup & Privacy Security', subtitle: 'Export JSON snapshots, local restore & offline safety' },
        { id: 'source_code', title: '12. Source Code & Verification', subtitle: 'Open source GitHub repo, MIT license & code inspection' },
        { id: 'faq', title: '13. Frequently Asked Questions', subtitle: 'Answers to common questions and edge cases' },
        { id: 'developer', title: '14. Developer & Founder Info', subtitle: 'MD Zafeer Hasan (YAZDAAN) & HasVolt project' }
      ]
    },
    settings: {
      title: 'Settings & Customization',
      subtitle: 'Theme, Language, Custom Options, Smart Fund Rule Customizer, Backups & Privacy',
      tabPreferences: 'Preferences',
      tabCustomOptions: 'Custom Categories & Options',
      tabRules: 'Smart Fund Rules',
      tabBackup: 'Data Backup & Export',
      tabPrivacy: 'Privacy & Security',
      tabDeveloper: 'Developer & Entity',
      tabLegal: 'Terms & Legal',
      languageHeading: 'Application Language',
      themeHeading: 'Color Accent Theme',
      viewModeHeading: 'Interface View Mode',
      viewModeAuto: 'Auto Adaptive',
      viewModeMobile: 'Compact Mobile',
      viewModeDesktop: 'Expanded Desktop',
      privacyMaskHeading: 'Privacy Masking Mode',
      privacyMaskDesc: 'Hide numerical rupee values on screen when in public or shared spaces.',
      securityPinHeading: 'App Passcode Lock',
      securityPinDesc: 'Protect your ledger and notes with a secure 4-digit PIN lock.',
      securityPinConfigure: 'Configure PIN Lock',
      lockNowBtn: 'Lock App Now',
      customCategoriesHeading: 'Custom Expense Categories',
      customCategoriesDesc: 'Add or remove custom categories for your outgoing expenses.',
      addCategoryPlaceholder: 'Enter new category name...',
      addCategoryBtn: 'Add Category',
      customSourcesHeading: 'Custom Income Sources',
      customSourcesDesc: 'Add or remove custom income streams and revenue sources.',
      addSourcePlaceholder: 'Enter new income source...',
      addSourceBtn: 'Add Source',
      customWorkCategoriesHeading: 'Custom Work Project Types',
      addWorkCategoryPlaceholder: 'Enter work category name...',
      customLifeTagsHeading: 'Custom Life & Habit Tags',
      addLifeTagPlaceholder: 'Enter daily tag name...',
      customPercentagesHeading: 'Smart Fund Allocation Percentage Customizer',
      customPercentagesDesc: 'Adjust the automated percentage rule for incoming revenue. Total must equal 100%.',
      totalMustBe100: 'Total allocation must be exactly 100%',
      saveRuleBtn: 'Save New Allocation Rule',
      resetRuleBtn: 'Reset to Recommended Smart Fund Rules',
      backupHeading: 'Local Storage Backup & Restore',
      backupDesc: 'Your ledger is stored 100% locally. Export regular backups to prevent accidental loss.',
      exportJsonBtn: 'Export JSON Backup',
      importJsonBtn: 'Restore from JSON File',
      exportCsvBtn: 'Export Ledger (CSV / Excel)',
      sampleDataHeading: 'Demo Sample Ledger',
      sampleDataDesc: 'Populate sample data to explore features, analytics, goals, and fund charts.',
      loadSampleDataBtn: 'Load Demo Sample Data',
      dangerZone: 'Ledger Reset Zone',
      resetAllDataBtn: 'Wipe & Reset All Khata Data',
      ruleSavedSuccess: 'Smart Fund allocation rule updated successfully!',
      ruleResetSuccess: 'Reset to default recommended 6-fund rules.',
      backupDownloadedSuccess: 'JSON Backup downloaded successfully!',
      dataRestoredSuccess: 'Ledger data restored successfully!',
      resetConfirmTitle: 'Wipe All Data?',
      resetConfirmDesc: 'This will permanently erase all entries, notes, goals, and settings.'
    },
    safety: {
      title: 'Safety & Transparency Center',
      subtitle: 'Source code verification, offline privacy audits & GitHub repository',
      openSourceBadge: '100% Open Source',
      backToHome: 'Back to Khata',
      tabGithub: 'GitHub Repository',
      tabInspector: 'Code Inspector',
      tabAudit: 'Privacy Audit',
      tabVerify: 'DIY Verification',
      repoTitle: 'hasvolt/Daily-Khata-Pro',
      repoDesc: 'Official repository containing 100% of the application source code.',
      viewOnGithub: 'View on GitHub',
      cloneRepo: 'Clone Repository',
      cloneHint: 'Verify that the code you see here matches the code on GitHub exactly.',
      mitLicenseTitle: 'MIT Open Source License',
      mitLicenseDesc: 'Completely free for use, study, modifications, and personal auditing.',
      modernStackTitle: 'Zero-Backend Architecture',
      modernStackDesc: 'Pure TypeScript client app running entirely inside your web browser.',
      auditReadyTitle: 'Full Audit Trail Ready',
      auditReadyDesc: 'Inspect storage routines, calculations, and network isolation.',
      copyCode: 'Copy Source Code',
      copied: 'Code Copied!',
      auditTitle: 'Security & Zero-Telemetry Audit',
      auditSubtitle: 'Detailed verification proof that zero financial data leaves your browser.',
      verifyTitle: 'DIY Verification Guide',
      verifySubtitle: 'Step-by-step instructions to verify offline privacy using browser DevTools.',
      step1Title: 'Step 1: Open Developer Tools',
      step1Desc: 'Press F12 or Right Click -> Inspect on your browser.',
      step2Title: 'Step 2: Check Network Activity',
      step2Desc: 'Go to the Network tab and record an entry; confirm zero outgoing API calls.',
      step3Title: 'Step 3: Inspect LocalStorage',
      step3Desc: 'Go to Application -> Local Storage to view your secure offline records.'
    },
    calc: {
      title: 'Multi-Purpose Financial Calculator',
      subtitle: '7-in-1 tool for split simulation, SIP investments, EMI loans, GST tax, discounts & inflation',
      tabStandard: 'Standard Calc',
      tabFunds: 'Smart Fund Split',
      tabSip: 'SIP Wealth',
      tabEmi: 'EMI Loan',
      tabGst: 'GST Tax',
      tabDiscount: 'Discount & Sale',
      tabInflation: 'Inflation Cost',
      backToHome: 'Back to Khata',
      get enterIncome() { return `Enter Income Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      presets: 'Quick Presets',
      calculatedBreakdown: 'Calculated Smart Fund Distribution',
      applyToIncome: 'Apply Amount to Income Entry',
      applyToExpense: 'Apply Amount to Expense Entry',
      createGoal: 'Create Goal from Value',
      get monthlyInvestment() { return `Monthly Investment Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      expectedReturnRate: 'Expected Annual Return Rate (%)',
      timePeriodYears: 'Time Period (Years)',
      totalInvested: 'Total Amount Invested',
      estimatedReturns: 'Estimated Wealth Gain',
      totalFutureValue: 'Total Maturity Value',
      get loanAmount() { return `Principal Loan Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      interestRatePerAnnum: 'Annual Interest Rate (%)',
      tenureYears: 'Loan Tenure (Years)',
      monthlyEmi: 'Monthly EMI Payment',
      totalInterestPayable: 'Total Interest Payable',
      totalPayment: 'Total Repayment Amount',
      get netAmount() { return `Net Base Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      gstRate: 'GST Tax Rate (%)',
      cgstAmount: 'CGST Amount',
      sgstAmount: 'SGST Amount',
      totalWithGst: 'Total Amount with GST',
      get originalPrice() { return `Original Sticker Price (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      discountPercent: 'Discount Percentage (%)',
      discountAmount: 'Total Discount Saved',
      finalDiscountedPrice: 'Final Discounted Price',
      get currentExpense() { return `Current Expense / Cost (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      inflationRate: 'Expected Inflation Rate (%)',
      futureCost: 'Estimated Future Cost',
      copyResult: 'Copy Result',
      resultCopied: 'Result Copied!',
      history: 'Calculation History',
      clearHistory: 'Clear History',
      noHistory: 'No calculations yet in this session.'
    },
    developer: {
      title: 'Developer Information',
      subtitle: 'Developer, Founder & Project Overview',
      badge: 'Independent Creator',
      backToHome: 'Back to Khata',
      name: 'MD Zafeer Hasan (YAZDAAN)',
      alias: '(YAZDAAN)',
      role: 'Independent Developer • Open Source Creator • Security Researcher',
      creatorTag: 'Open-Source Creator',
      verifiedCreator: 'Verified Creator',
      skillsTitle: 'Core Focus Areas',
      bioTitle: 'Founder Mission & Philosophy',
      bioDesc: 'Crafting elegant, private, and high-performance offline-first utility tools that empower individuals and small businesses to master their finances without giving up their data.',
      visionTitle: 'Open Source Commitment',
      visionDesc: 'Daily Khata Pro is built under the MIT license, completely free, with no trackers, no external cloud dependencies, and zero corporate telemetry.',
      connectTitle: 'Contact via Email',
      copyEmail: 'Copy Email Address',
      emailCopied: 'Email Copied!',
      specificationsTitle: 'Project & License Specifications',
      projectLabel: 'Project',
      licenseLabel: 'License',
      privacyLabel: 'Data Privacy',
      domainLabel: 'Official Domain',
      supportLabel: 'Support'
    },
    brand: {
      appName: 'Daily Khata Pro',
      appSubtitle: 'Universal Daily Financial Ledger & Smart Fund Capital Engine',
      tagline: '100% Offline • Private • Open Source',
      offlineBadge: '100% Offline & Private'
    }
  },
  hi: {
    menu: {
      mainMenu: 'मुख्य मेनू',
      menuAndTools: 'मुख्य मेनू व सेटिंग्स',
      featuresAndTools: 'सुविधाएं व उपकरण',
      themeColor: 'रंग थीम (Theme)',
      language: 'भाषा (Language)',
      supportAndSafety: 'सहायता व सुरक्षा',
      appSettings: 'ऐप सेटिंग्स',
      calculator: 'कैलकुलेटर',
      personalNotes: 'पर्सनल नोट्स',
      securityPinLock: 'सुरक्षा पिन लॉक',
      active: 'सक्रिय',
      userManualGuide: 'उपयोग निर्देशिका',
      helpCenterFaq: 'सहायता केंद्र एवं FAQ',
      reportIssue: 'समस्या रिपोर्ट करें',
      feedbackSuggestions: 'सुझाव एवं फीडबैक',
      safetySourceCode: 'सुरक्षा एवं सोर्स कोड',
      shareApp: 'ऐप शेयर करें',
      installApp: 'ऐप इंस्टॉल करें',
      developerProfile: 'डेवलपर प्रोफाइल',
      githubProfile: 'गिटहब प्रोफाइल',
      searchPlaceholder: 'लेनदेन, विवरण, श्रेणी या राशि खोजें...',
      dailyIncomeExpense: 'दैनिक आय-व्यय ट्रैकर',
      sixFundLedger: 'स्मार्ट फंड लेजर',
      official: 'आधिकारिक',
      mask: 'छुपाएं',
      hidden: 'छिपा हुआ',
      lock: 'लॉक',
      day: 'डे',
      night: 'नाइट',
      khata: 'खाता',
      ledger: 'लेजर',
      goals: 'लक्ष्य',
      workAndLife: 'काम व जीवन',
      notes: 'वॉल्ट',
      analytics: 'रिपोर्ट्स'
    },
    manual: {
      title: 'उपयोग निर्देशिका एवं संपूर्ण गाइड',
      subtitle: 'वित्तीय अनुशासन, स्मार्ट फंड फॉर्मूला व धन प्रबंधन की आधिकारिक मार्गदर्शिका',
      searchPlaceholder: 'यूजर गाइड में खोजें (उदा. 6 फंड, बैकअप, लक्ष्य, PDF)...',
      officialGuide: 'आधिकारिक गाइड',
      poweredBy: 'संचालित',
      backToHome: 'वापस खाता पर जाएं',
      sectionsHeading: 'निर्देशिका अनुभाग',
      tableOfContents: 'विषय-सूची',
      keyHighlights: 'मुख्य वित्तीय नियम',
      stepByStep: 'चरण-दर-चरण निर्देश',
      proTip: 'वित्तीय अनुशासन टिप',
      quickAction: 'संबंधित सुविधा खोलें',
      sections: [
        { id: 'intro', title: '1. परिचय एवं अवलोकन', subtitle: 'शून्य टेलीमेट्री, 100% निजी व ऑफलाइन वित्तीय इंजन' },
        { id: 'app_lock', title: '2. ऐप पासकोड लॉक एवं सुरक्षा वॉल्ट', subtitle: '4-अंकीय सुरक्षित पिन लॉक व प्राइवेसी सुरक्षा' },
        { id: 'personal_notes', title: '3. पर्सनल नोट्स एवं प्राइवेट वॉल्ट', subtitle: 'गोपनीय स्क्रैचपैड, पासवर्ड हिंट्स व व्यक्तिगत डायरी' },
        { id: 'six_funds', title: '4. स्मार्ट फंड फॉर्मूला एलोकेशन', subtitle: '30/35/5/11.25/7.5/11.25 स्वचालित पूंजी विभाजन नियम' },
        { id: 'add_income', title: '5. आमदनी (Income) जोड़ना', subtitle: 'कमाई दर्ज करना व 6 फंडों में स्वचालित विभाजन' },
        { id: 'add_expense', title: '6. खर्च (Expense) दर्ज करना', subtitle: 'फंड पॉट से खर्च घटाना, श्रेणियां व भुगतान माध्यम' },
        { id: 'work_life', title: '7. वर्क प्रोजेक्ट्स एवं डेली टाइमलाइन', subtitle: 'ड्यूटी लॉग, घंटे, कमाई व दैनिक मूड ट्रैकिंग' },
        { id: 'goals', title: '8. वित्तीय लक्ष्य (Goals)', subtitle: 'फंड से जुड़े बचत लक्ष्य, माइलस्टोन व प्रगति' },
        { id: 'reports', title: '9. रिपोर्ट एवं PDF स्टेटमेंट', subtitle: 'ग्राफ़, एनालिटिक्स, CSV एक्सपोर्ट व प्रिंट स्टेटमेंट' },
        { id: 'settings', title: '10. कस्टम सेटिंग्स व रूल्स', subtitle: 'थीम, कस्टम श्रेणियां व प्रतिशत विभाजन अनुकूलक' },
        { id: 'backup', title: '11. बैकअप एवं डेटा सुरक्षा', subtitle: 'JSON बैकअप, ऑफलाइन रिस्टोर व पूर्ण डेटा नियंत्रण' },
        { id: 'source_code', title: '12. सोर्स कोड व सत्यापन', subtitle: 'MIT ओपन सोर्स कोड, गिटहब व पारदर्शिता ऑडिट' },
        { id: 'faq', title: '13. अक्सर पूछे जाने वाले प्रश्न (FAQ)', subtitle: 'सामान्य प्रश्नों और समाधानों की विस्तृत सूची' },
        { id: 'developer', title: '14. डेवलपर एवं फाउंडर प्रोफाइल', subtitle: 'एमडी जफीर हसन व HasVolt मिशन' }
      ]
    },
    settings: {
      title: 'सेटिंग्स और कस्टम विकल्प',
      subtitle: 'थीम, भाषा, कस्टम श्रेणियां, स्मार्ट फंड प्रतिशत नियम, बैकअप और प्राइवेसी',
      tabPreferences: 'पसंद (Preferences)',
      tabCustomOptions: 'कस्टम श्रेणियां व विकल्प',
      tabRules: 'स्मार्ट फंड नियम',
      tabBackup: 'डेटा बैकअप व एक्सपोर्ट',
      tabPrivacy: 'गोपनीयता नीति (Privacy)',
      tabDeveloper: 'डेवलपर व कानूनी इकाई',
      tabLegal: 'शर्तें व स्वामित्व',
      languageHeading: 'ऐप की भाषा (Language)',
      themeHeading: 'रंग थीम (Theme)',
      viewModeHeading: 'इंटरफ़ेस व्यू मोड',
      viewModeAuto: 'ऑटो अनुकूलनीय (Adaptive)',
      viewModeMobile: 'कॉम्पैक्ट मोबाइल',
      viewModeDesktop: 'विस्तृत डेस्कटॉप',
      privacyMaskHeading: 'गोपनीयता मोड (संख्या छुपाएं)',
      privacyMaskDesc: 'सार्वजनिक स्थानों पर स्क्रीन पर दिखने वाली रुपये की राशि को छुपाएं।',
      securityPinHeading: 'ऐप पासकोड सुरक्षा लॉक',
      securityPinDesc: 'अपने वित्तीय डेटा और नोट्स को 4-अंकीय सुरक्षित पिन से लॉक करें।',
      securityPinConfigure: 'पिन लॉक सेट करें',
      lockNowBtn: 'अभी ऐप लॉक करें',
      customCategoriesHeading: 'कस्टम खर्च श्रेणियां',
      customCategoriesDesc: 'अपने दैनिक खर्चों के लिए नई श्रेणियां जोड़ें या हटाएं।',
      addCategoryPlaceholder: 'नई श्रेणी का नाम लिखें...',
      addCategoryBtn: 'श्रेणी जोड़ें',
      customSourcesHeading: 'कस्टम कमाई के स्रोत',
      customSourcesDesc: 'अपनी आय के नए स्रोत और व्यवसाय जोड़ें या हटाएं।',
      addSourcePlaceholder: 'नया आय स्रोत लिखें...',
      addSourceBtn: 'स्रोत जोड़ें',
      customWorkCategoriesHeading: 'कस्टम वर्क प्रोजेक्ट प्रकार',
      addWorkCategoryPlaceholder: 'काम का प्रकार लिखें...',
      customLifeTagsHeading: 'कस्टम जीवन व आदत टैग्स',
      addLifeTagPlaceholder: 'दैनिक टैग नाम लिखें...',
      customPercentagesHeading: 'स्मार्ट फंड प्रतिशत विभाजन अनुकूलक',
      customPercentagesDesc: 'आने वाली कमाई का स्वचालित प्रतिशत नियम बदलें। कुल योग 100% होना अनिवार्य है।',
      totalMustBe100: 'कुल योग ठीक 100% होना चाहिए',
      saveRuleBtn: 'नया नियम सहेजें',
      resetRuleBtn: 'अनुशंसित स्मार्ट फंड नियमों पर रीसेट करें',
      backupHeading: 'लोकल स्टोरेज बैकअप और रिस्टोर',
      backupDesc: 'आपका डेटा आपके डिवाइस में 100% सुरक्षित है। नियमित बैकअप JSON फ़ाइल डाउनलोड करें।',
      exportJsonBtn: 'JSON बैकअप डाउनलोड करें',
      importJsonBtn: 'JSON फ़ाइल से रिस्टोर करें',
      exportCsvBtn: 'लेजर CSV / Excel डाउनलोड करें',
      sampleDataHeading: 'डेमो खाता डेटा',
      sampleDataDesc: 'सभी सुविधाओं, चार्ट्स और लक्ष्यों को देखने के लिए डेमो डेटा लोड करें।',
      loadSampleDataBtn: 'डेमो डेटा लोड करें',
      dangerZone: 'डेटा रीसेट क्षेत्र',
      resetAllDataBtn: 'सभी खाता डेटा मिटाएं और रीसेट करें',
      ruleSavedSuccess: 'स्मार्ट फंड आवंटन नियम सफलतापूर्वक सहेजे गए!',
      ruleResetSuccess: 'डिफ़ॉल्ट स्मार्ट फंड नियमों पर रीसेट कर दिया गया।',
      backupDownloadedSuccess: 'JSON बैकअप सफलतापूर्वक डाउनलोड हो गया!',
      dataRestoredSuccess: 'खाता डेटा सफलतापूर्वक रिस्टोर हो गया!',
      resetConfirmTitle: 'क्या आप सारा डेटा मिटाना चाहते हैं?',
      resetConfirmDesc: 'यह सभी लेनदेन, नोट्स, लक्ष्य और सेटिंग्स को हमेशा के लिए मिटा देगा।'
    },
    safety: {
      title: 'सुरक्षा एवं पारदर्शिता केंद्र',
      subtitle: 'सोर्स कोड सत्यापन, 100% ऑफलाइन प्राइवेसी ऑडिट व गिटहब रिपॉजिटरी',
      openSourceBadge: '100% ओपन सोर्स',
      backToHome: 'वापस खाता पर जाएं',
      tabGithub: 'गिटहब रिपॉजिटरी',
      tabInspector: 'सोर्स कोड इंस्पेक्टर',
      tabAudit: 'प्राइवेसी व सुरक्षा ऑडिट',
      tabVerify: 'स्वयं सत्यापन (DIY Guide)',
      repoTitle: 'hasvolt/Daily-Khata-Pro',
      repoDesc: 'आधिकारिक रिपॉजिटरी जिसमें ऐप का 100% सोर्स कोड उपलब्ध है।',
      viewOnGithub: 'गिटहब पर देखें',
      cloneRepo: 'रिपॉजिटरी क्लोन करें',
      cloneHint: 'सत्यापित करें कि यहाँ का कोड गिटहब के आधिकारिक कोड से 100% मेल खाता है।',
      mitLicenseTitle: 'MIT ओपन सोर्स लाइसेंस',
      mitLicenseDesc: 'उपयोग, अध्ययन, संशोधन और व्यक्तिगत ऑडिटिंग के लिए पूर्णतः निःशुल्क।',
      modernStackTitle: 'ज़ीरो-बैकएंड आर्किटेक्चर',
      modernStackDesc: 'प्योर टाइपस्क्रिप्ट क्लाइंट ऐप जो पूरी तरह आपके ब्राउज़र में चलता है।',
      auditReadyTitle: 'पूर्ण ऑडिट योग्य',
      auditReadyDesc: 'स्टोरेज रूटीन, गणितीय फॉर्मूले और नेटवर्क आइसोलेशन की जांच करें।',
      copyCode: 'सोर्स कोड कॉपी करें',
      copied: 'कोड कॉपी हो गया!',
      auditTitle: 'सुरक्षा एवं शून्य टेलीमेट्री ऑडिट',
      auditSubtitle: 'सत्यापित प्रमाण कि आपका कोई भी वित्तीय डेटा आपके डिवाइस से बाहर नहीं जाता।',
      verifyTitle: 'स्वयं सत्यापन मार्गदर्शिका',
      verifySubtitle: 'ब्राउज़र DevTools से ऑफलाइन सुरक्षा और नेटवर्क अलगाव जांचने के चरण।',
      step1Title: 'चरण 1: डेवलपर टूल्स खोलें',
      step1Desc: 'ब्राउज़र में F12 दबाएं या राइट क्लिक करके Inspect चुनें।',
      step2Title: 'चरण 2: नेटवर्क गतिविधि जांचें',
      step2Desc: 'Network टैब में जाएं और कोई एंट्री दर्ज करें; शून्य आउटगोइंग कॉल देखें।',
      step3Title: 'चरण 3: लोकल स्टोरेज देखें',
      step3Desc: 'Application -> Local Storage में जाकर अपने सभी सुरक्षित ऑफलाइन रिकॉर्ड्स देखें।'
    },
    calc: {
      title: 'मल्टीपर्पस वित्तीय कैलकुलेटर',
      subtitle: '7-इन-1 स्मार्ट वित्तीय कैलकुलेटर (स्मार्ट फंड, SIP, EMI, GST, डिस्काउंट, महंगाई व स्टैंडर्ड)',
      tabStandard: 'साधारण कैलकुलेटर',
      tabFunds: 'स्मार्ट फंड विभाजन',
      tabSip: 'SIP निवेश वेल्थ',
      tabEmi: 'EMI लोन कैलकुलेटर',
      tabGst: 'GST टैक्स कैलकुलेटर',
      tabDiscount: 'डिस्काउंट व छूट',
      tabInflation: 'महंगाई दर व भविष्य मूल्य',
      backToHome: 'वापस खाता पर जाएं',
      get enterIncome() { return `कमाई की राशि दर्ज करें (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      presets: 'त्वरित प्रीसेट',
      calculatedBreakdown: 'गणना किया गया स्मार्ट फंड विभाजन',
      applyToIncome: 'इस राशि को कमाई में लागू करें',
      applyToExpense: 'इस राशि को खर्च में लागू करें',
      createGoal: 'इस राशि का नया लक्ष्य बनाएं',
      get monthlyInvestment() { return `मासिक SIP निवेश राशि (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      expectedReturnRate: 'अपेक्षित वार्षिक रिटर्न दर (%)',
      timePeriodYears: 'समय अवधि (वर्ष)',
      totalInvested: 'कुल निवेश की गई राशि',
      estimatedReturns: 'अनुमानित वेल्थ गेन (मुनाफा)',
      totalFutureValue: 'कुल मैच्योरिटी वेल्थ मूल्य',
      get loanAmount() { return `कुल लोन मूलधन राशि (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      interestRatePerAnnum: 'वार्षिक ब्याज दर (%)',
      tenureYears: 'लोन अवधि (वर्ष)',
      monthlyEmi: 'मासिक किस्त (EMI)',
      totalInterestPayable: 'कुल देय ब्याज',
      totalPayment: 'कुल भुगतान राशि (मूल + ब्याज)',
      get netAmount() { return `मूल राशि (बिना टैक्स) (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      gstRate: 'GST टैक्स दर (%)',
      cgstAmount: 'CGST राशि',
      sgstAmount: 'SGST राशि',
      totalWithGst: 'GST सहित कुल राशि',
      get originalPrice() { return `मूल एमआरपी / शुरुआती कीमत (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      discountPercent: 'छूट / डिस्काउंट प्रतिशत (%)',
      discountAmount: 'कुल बचाई गई राशि',
      finalDiscountedPrice: 'छूट के बाद अंतिम कीमत',
      get currentExpense() { return `वर्तमान खर्च / लागत (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      inflationRate: 'अपेक्षित वार्षिक महंगाई दर (%)',
      futureCost: 'भविष्य में अनुमानित लागत',
      copyResult: 'परिणाम कॉपी करें',
      resultCopied: 'परिणाम कॉपी हो गया!',
      history: 'गणना इतिहास',
      clearHistory: 'इतिहास साफ़ करें',
      noHistory: 'इस सत्र में अभी कोई गणना नहीं हुई है।'
    },
    developer: {
      title: 'डेवलपर जानकारी',
      subtitle: 'डेवलपर, फाउंडर व प्रोजेक्ट प्रोफाइल',
      badge: 'स्वतंत्र क्रिएटर',
      backToHome: 'वापस खाता पर जाएं',
      name: 'MD Zafeer Hasan (YAZDAAN)',
      alias: '(YAZDAAN)',
      role: 'स्वतंत्र डेवलपर • ओपन-सोर्स क्रिएटर • सुरक्षा शोधकर्ता',
      creatorTag: 'ओपन-सोर्स क्रिएटर',
      verifiedCreator: 'सत्यापित निर्माता',
      skillsTitle: 'मुख्य विशेषज्ञता क्षेत्र',
      bioTitle: 'संस्थापक मिशन एवं दृष्टिकोण',
      bioDesc: 'सुरुचिपूर्ण, निजी और उच्च-प्रदर्शन वाले ऑफलाइन-फर्स्ट टूल्स बनाना जो उपयोगकर्ताओं को उनके डेटा की निजता खोए बिना वित्तीय नियंत्रण देते हैं।',
      visionTitle: 'ओपन-सोर्स प्रतिबद्धता',
      visionDesc: 'डेली खाता: प्रो MIT लाइसेंस के तहत 100% मुफ्त, बिना किसी बाहरी ट्रैकर या कॉर्पोरेट टेलीमेट्री के बनाया गया है।',
      connectTitle: 'ईमेल द्वारा संपर्क करें',
      copyEmail: 'ईमेल कॉपी करें',
      emailCopied: 'ईमेल कॉपी हो गया!',
      specificationsTitle: 'प्रोजेक्ट एवं लाइसेंस विनिर्देश',
      projectLabel: 'प्रोजेक्ट',
      licenseLabel: 'लाइसेंस',
      privacyLabel: 'डेटा गोपनीयता',
      domainLabel: 'आधिकारिक डोमेन',
      supportLabel: 'सपोर्ट'
    },
    brand: {
      appName: 'डेली खाता: प्रो',
      appSubtitle: 'सार्वभौमिक वित्तीय लेजर व स्मार्ट फंड स्मार्ट विभाजन इंजन',
      tagline: '100% ऑफलाइन • सुरक्षित • ओपन सोर्स',
      offlineBadge: '100% सुरक्षित और ऑफलाइन'
    }
  },
  hinglish: {
    menu: {
      mainMenu: 'Main Menu',
      menuAndTools: 'Main Menu & Settings',
      featuresAndTools: 'Features & Tools',
      themeColor: 'Theme Color',
      language: 'Language',
      supportAndSafety: 'Support & Safety',
      appSettings: 'App Settings',
      calculator: 'Calculator',
      personalNotes: 'Personal Notes',
      securityPinLock: 'Security PIN Lock',
      active: 'Active',
      userManualGuide: 'User Manual Guide',
      helpCenterFaq: 'Help Centre & FAQ',
      reportIssue: 'Report an Issue',
      feedbackSuggestions: 'Feedback & Suggestions',
      safetySourceCode: 'Safety & Source Code',
      shareApp: 'Share App',
      installApp: 'Install App',
      developerProfile: 'Developer Profile',
      githubProfile: 'GitHub Profile',
      searchPlaceholder: 'Search transactions, notes, categories, amounts...',
      dailyIncomeExpense: 'Daily Income & Expense',
      sixFundLedger: 'Smart Fund Ledger',
      official: 'OFFICIAL',
      mask: 'Mask',
      hidden: 'Hidden',
      lock: 'Lock',
      day: 'Day',
      night: 'Night',
      khata: 'Khata',
      ledger: 'Ledger',
      goals: 'Goals',
      workAndLife: 'Work & Life',
      notes: 'Notes',
      analytics: 'Reports'
    },
    manual: {
      title: 'User Manual & Comprehensive Guide',
      subtitle: 'Systematic financial discipline aur 6-fund formula ki official guide',
      searchPlaceholder: 'User guide mein search karein (e.g. 6 funds, backup, goals)...',
      officialGuide: 'Official Guide',
      poweredBy: 'Powered by',
      backToHome: 'Back to Khata',
      sectionsHeading: 'Manual Sections',
      tableOfContents: 'Table of Contents',
      keyHighlights: 'Key Principles & Rules',
      stepByStep: 'Step-by-Step Instructions',
      proTip: 'Pro Tip for Financial Discipline',
      quickAction: 'Open Related Feature',
      sections: [
        { id: 'intro', title: '1. Introduction & Overview', subtitle: 'Zero-telemetry client-first financial engine' },
        { id: 'app_lock', title: '2. App Passcode Lock & Vault', subtitle: '4-digit PIN security aur biometric privacy lock' },
        { id: 'personal_notes', title: '3. Personal Notes & Private Vault', subtitle: 'Private scratchpad, password hints aur notes' },
        { id: 'six_funds', title: '4. Smart Fund Formula Allocation', subtitle: 'Automated 30/35/5/11.25/7.5/11.25 split rules' },
        { id: 'add_income', title: '5. Recording Income', subtitle: 'Income logging aur automated 6-fund division' },
        { id: 'add_expense', title: '6. Logging Expenses', subtitle: 'Fund deduction, categories aur payment mode' },
        { id: 'work_life', title: '7. Work Logs & Daily Timeline', subtitle: 'Track work hours, earnings aur daily habits' },
        { id: 'goals', title: '8. Financial Goal Targets', subtitle: 'Target amounts aur savings milestone tracking' },
        { id: 'reports', title: '9. Reports & PDF Statements', subtitle: 'Monthly graphs, analytics aur CSV exports' },
        { id: 'settings', title: '10. Custom Settings & Rules', subtitle: 'Themes, custom categories aur percentage rules' },
        { id: 'backup', title: '11. Backup & Privacy Security', subtitle: 'JSON export snapshots aur offline safety' },
        { id: 'source_code', title: '12. Source Code & Verification', subtitle: 'Open source GitHub repo aur code audit' },
        { id: 'faq', title: '13. Frequently Asked Questions', subtitle: 'Common questions aur quick solutions' },
        { id: 'developer', title: '14. Developer & Founder Info', subtitle: 'MD Zafeer Hasan (YAZDAAN) & HasVolt project' }
      ]
    },
    settings: {
      title: 'Settings & Custom Options',
      subtitle: 'Theme, Language, Custom Categories, Smart Fund Rules, Backups & Privacy',
      tabPreferences: 'Preferences',
      tabCustomOptions: 'Custom Categories & Options',
      tabRules: 'Smart Fund Rules',
      tabBackup: 'Data Backup & Export',
      tabPrivacy: 'Privacy Policy',
      tabDeveloper: 'Developer & Entity',
      tabLegal: 'Terms & Ownership',
      languageHeading: 'App Language',
      themeHeading: 'Theme Color',
      viewModeHeading: 'Interface View Mode',
      viewModeAuto: 'Auto Adaptive',
      viewModeMobile: 'Compact Mobile',
      viewModeDesktop: 'Expanded Desktop',
      privacyMaskHeading: 'Privacy Masking Mode',
      privacyMaskDesc: 'Public places mein screen par rupee amount chupayein.',
      securityPinHeading: 'App Passcode Lock',
      securityPinDesc: 'Apne ledger aur notes ko 4-digit secure PIN se lock karein.',
      securityPinConfigure: 'PIN Lock Set Karein',
      lockNowBtn: 'Lock App Now',
      customCategoriesHeading: 'Custom Expense Categories',
      customCategoriesDesc: 'Apne expenses ke liye nayi categories add ya remove karein.',
      addCategoryPlaceholder: 'Nayi category ka naam likhein...',
      addCategoryBtn: 'Category Add Karein',
      customSourcesHeading: 'Custom Income Sources',
      customSourcesDesc: 'Apne income streams aur clients add karein.',
      addSourcePlaceholder: 'Naya income source likhein...',
      addSourceBtn: 'Source Add Karein',
      customWorkCategoriesHeading: 'Custom Work Types',
      addWorkCategoryPlaceholder: 'Work category ka naam...',
      customLifeTagsHeading: 'Custom Habit Tags',
      addLifeTagPlaceholder: 'Daily tag ka naam...',
      customPercentagesHeading: 'Smart Fund Percentage Customizer',
      customPercentagesDesc: 'Income ka automatic split rule customize karein. Total 100% hona chahiye.',
      totalMustBe100: 'Total allocation exactly 100% hona chahiye',
      saveRuleBtn: 'Naya Rule Save Karein',
      resetRuleBtn: 'Default Smart Fund Rules Par Reset Karein',
      backupHeading: 'Local Storage Backup & Restore',
      backupDesc: 'Aapka data aapke device mein 100% private hai. Regular JSON backup download karein.',
      exportJsonBtn: 'JSON Backup Download Karein',
      importJsonBtn: 'JSON File Se Restore Karein',
      exportCsvBtn: 'Ledger CSV / Excel Download Karein',
      sampleDataHeading: 'Demo Sample Ledger',
      sampleDataDesc: 'Saare features explore karne ke liye sample data load karein.',
      loadSampleDataBtn: 'Sample Data Load Karein',
      dangerZone: 'Data Reset Zone',
      resetAllDataBtn: 'Wipe & Reset All Khata Data',
      ruleSavedSuccess: 'Smart Fund allocation rule successfully save ho gaya!',
      ruleResetSuccess: 'Default 6-fund rules par reset ho gaya.',
      backupDownloadedSuccess: 'JSON backup successfully download ho gaya!',
      dataRestoredSuccess: 'Ledger data successfully restore ho gaya!',
      resetConfirmTitle: 'Wipe All Data?',
      resetConfirmDesc: 'Yeh saare transactions, notes, goals aur settings delete kar dega.'
    },
    safety: {
      title: 'Safety & Transparency Center',
      subtitle: 'Source code verification, offline privacy audits & GitHub repository',
      openSourceBadge: '100% Open Source',
      backToHome: 'Back to Khata',
      tabGithub: 'GitHub Repository',
      tabInspector: 'Code Inspector',
      tabAudit: 'Privacy Audit',
      tabVerify: 'DIY Verification',
      repoTitle: 'hasvolt/Daily-Khata-Pro',
      repoDesc: 'Official repository containing 100% of the application source code.',
      viewOnGithub: 'View on GitHub',
      cloneRepo: 'Clone Repository',
      cloneHint: 'Verify karein ki yahan ka code GitHub ke code se exact match karta hai.',
      mitLicenseTitle: 'MIT Open Source License',
      mitLicenseDesc: 'Use, study aur modifications ke liye 100% free.',
      modernStackTitle: 'Zero-Backend Architecture',
      modernStackDesc: 'Pure TypeScript client app jo completely aapke browser mein chalti hai.',
      auditReadyTitle: 'Full Audit Trail Ready',
      auditReadyDesc: 'Storage routines, formulas aur zero network calls verify karein.',
      copyCode: 'Copy Source Code',
      copied: 'Code Copied!',
      auditTitle: 'Security & Zero-Telemetry Audit',
      auditSubtitle: 'Proof that zero financial data leaves your browser.',
      verifyTitle: 'DIY Verification Guide',
      verifySubtitle: 'Browser DevTools se offline safety verify karne ke steps.',
      step1Title: 'Step 1: Open Developer Tools',
      step1Desc: 'Browser mein F12 press karein ya Inspect select karein.',
      step2Title: 'Step 2: Check Network Tab',
      step2Desc: 'Network tab open karein aur koi transaction add karke zero network calls verify karein.',
      step3Title: 'Step 3: Inspect LocalStorage',
      step3Desc: 'Application -> Local Storage mein jaakar offline stored data dekhein.'
    },
    calc: {
      title: 'Multi-Purpose Financial Calculator',
      subtitle: '7-in-1 tool for split simulation, SIP investments, EMI loans, GST tax, discounts & inflation',
      tabStandard: 'Standard Calc',
      tabFunds: 'Smart Fund Split',
      tabSip: 'SIP Wealth',
      tabEmi: 'EMI Loan',
      tabGst: 'GST Tax',
      tabDiscount: 'Discount & Sale',
      tabInflation: 'Inflation Cost',
      backToHome: 'Back to Khata',
      get enterIncome() { return `Income Amount Enter Karein (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      presets: 'Quick Presets',
      calculatedBreakdown: 'Calculated Smart Fund Distribution',
      applyToIncome: 'Apply Amount to Income Entry',
      applyToExpense: 'Apply Amount to Expense Entry',
      createGoal: 'Create Goal from Value',
      get monthlyInvestment() { return `Monthly SIP Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      expectedReturnRate: 'Expected Return Rate (%)',
      timePeriodYears: 'Time Period (Years)',
      totalInvested: 'Total Invested Amount',
      estimatedReturns: 'Estimated Wealth Gain',
      totalFutureValue: 'Total Maturity Value',
      get loanAmount() { return `Loan Principal Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      interestRatePerAnnum: 'Annual Interest Rate (%)',
      tenureYears: 'Tenure (Years)',
      monthlyEmi: 'Monthly EMI Payment',
      totalInterestPayable: 'Total Interest Payable',
      totalPayment: 'Total Repayment Amount',
      get netAmount() { return `Net Base Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      gstRate: 'GST Tax Rate (%)',
      cgstAmount: 'CGST Amount',
      sgstAmount: 'SGST Amount',
      totalWithGst: 'Total Amount with GST',
      get originalPrice() { return `Original Price (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      discountPercent: 'Discount Percentage (%)',
      discountAmount: 'Discount Saved',
      finalDiscountedPrice: 'Final Discounted Price',
      get currentExpense() { return `Current Expense (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      inflationRate: 'Expected Inflation Rate (%)',
      futureCost: 'Estimated Future Cost',
      copyResult: 'Copy Result',
      resultCopied: 'Result Copied!',
      history: 'Calculation History',
      clearHistory: 'Clear History',
      noHistory: 'Is session mein abhi koi calculation nahi hui hai.'
    },
    developer: {
      title: 'Developer Information',
      subtitle: 'Developer, Founder & Project Overview',
      badge: 'Independent Creator',
      backToHome: 'Back to Khata',
      name: 'MD Zafeer Hasan (YAZDAAN)',
      alias: '(YAZDAAN)',
      role: 'Independent Developer • Open Source Creator • Security Researcher',
      creatorTag: 'Open-Source Creator',
      verifiedCreator: 'Verified Creator',
      skillsTitle: 'Core Focus Areas',
      bioTitle: 'Founder Mission & Philosophy',
      bioDesc: 'Crafting elegant, private, and high-performance offline-first utility tools that empower individuals and small businesses to master their finances without giving up their data.',
      visionTitle: 'Open Source Commitment',
      visionDesc: 'Daily Khata Pro is built under the MIT license, completely free, with no trackers, no external cloud dependencies, and zero corporate telemetry.',
      connectTitle: 'Contact via Email',
      copyEmail: 'Copy Email Address',
      emailCopied: 'Email Copied!',
      specificationsTitle: 'Project & License Specifications',
      projectLabel: 'Project',
      licenseLabel: 'License',
      privacyLabel: 'Data Privacy',
      domainLabel: 'Official Domain',
      supportLabel: 'Support'
    },
    brand: {
      appName: 'Daily Khata Pro',
      appSubtitle: 'Universal Daily Financial Ledger & Smart Fund Capital Engine',
      tagline: '100% Offline • Private • Open Source',
      offlineBadge: '100% Offline & Private'
    }
  },
  // Fallbacks for other languages automatically populated below:
  es: {} as any,
  ar: {} as any,
  fr: {} as any,
  de: {} as any,
  ru: {} as any,
  pt: {} as any,
  bn: {} as any,
  ur: {} as any,
  id: {} as any,
  ja: {} as any,
  zh: {} as any
};

// Polyfill languages with tailored translations
const supportedLangs: AppLanguage[] = ['es', 'ar', 'fr', 'de', 'ru', 'pt', 'bn', 'ur', 'id', 'ja', 'zh'];

supportedLangs.forEach((lang) => {
  if (!APP_TRANSLATIONS[lang] || Object.keys(APP_TRANSLATIONS[lang]).length === 0) {
    // Clone English as reliable base then localize core titles
    const base = JSON.parse(JSON.stringify(APP_TRANSLATIONS.en));
    
    if (lang === 'ur') {
      base.menu.mainMenu = 'مین مینو';
      base.menu.menuAndTools = 'مین مینو اور ترتیبات';
      base.menu.appSettings = 'ایپ کی ترتیبات';
      base.menu.calculator = 'کیلکولیٹر';
      base.menu.personalNotes = 'ذاتی نوٹس';
      base.menu.securityPinLock = 'سیکیورٹی پن لاک';
      base.menu.userManualGuide = 'صارف کی رہنمائی';
      base.menu.safetySourceCode = 'حفاظت اور سورس کوڈ';
      base.menu.developerProfile = 'ڈویلپر پروفائل';
      base.menu.khata = 'کھاتہ';
      base.menu.ledger = 'لیجر';
      base.menu.goals = 'اہداف';
      base.menu.workAndLife = 'کام اور زندگی';
      base.menu.notes = 'نوٹس';
      base.menu.analytics = 'رپورٹس';
      base.brand.appName = 'ڈیلی کھاتہ: پرو';
      base.developer.title = 'ڈویلپر کی معلومات';
      base.developer.role = 'خود مختار ڈویلپر اور بانی';
      base.calc.title = 'کثیر المقاصد مالیاتی کیلکولیٹر';
    } else if (lang === 'bn') {
      base.menu.mainMenu = 'প্রধান মেনু';
      base.menu.menuAndTools = 'প্রধান মেনু ও সেটিংস';
      base.menu.appSettings = 'অ্যাপ সেটিংস';
      base.menu.calculator = 'ক্যালকুলেটর';
      base.menu.personalNotes = 'ব্যক্তিগত নোট';
      base.menu.securityPinLock = 'নিরাপত্তা পিন লক';
      base.menu.userManualGuide = 'ব্যবহার নির্দেশিকা';
      base.menu.safetySourceCode = 'নিরাপত্তা ও সোর্স কোড';
      base.menu.developerProfile = 'ডেভেলপার প্রোফাইল';
      base.menu.khata = 'খাতা';
      base.menu.ledger = 'লেজার';
      base.menu.goals = 'লক্ষ্য';
      base.menu.workAndLife = 'কাজ ও জীবন';
      base.menu.notes = 'নোট';
      base.menu.analytics = 'রিপোর্ট';
      base.brand.appName = 'ডেইলি খাতা: প্রো';
      base.developer.title = 'ডেভেলপার পরিচিতি';
      base.developer.role = 'স্বাধীন ডেভেলপার ও প্রতিষ্ঠাতা';
      base.calc.title = 'বহুমুখী আর্থিক ক্যালকুলেটর';
    } else if (lang === 'ar') {
      base.menu.mainMenu = 'القائمة الرئيسية';
      base.menu.menuAndTools = 'القائمة الرئيسية والأدوات';
      base.menu.appSettings = 'إعدادات التطبيق';
      base.menu.calculator = 'الحاسبة المالية';
      base.menu.personalNotes = 'الملاحظات الشخصية';
      base.menu.securityPinLock = 'قفل الرمز السري';
      base.menu.userManualGuide = 'دليل الاستخدام الشامل';
      base.menu.safetySourceCode = 'الأمان والشفرة المصدرية';
      base.menu.developerProfile = 'ملف المطور';
      base.menu.khata = 'الدفتر';
      base.menu.ledger = 'السجل';
      base.menu.goals = 'الأهداف';
      base.menu.workAndLife = 'العمل والحياة';
      base.menu.notes = 'الملاحظات';
      base.menu.analytics = 'التقارير';
      base.brand.appName = 'ديلي خاتا: برو';
      base.developer.title = 'معلومات المطور';
      base.developer.role = 'مطور ومؤسس مستقل';
      base.calc.title = 'الحاسبة المالية متعددة الاستخدامات';
    } else if (lang === 'es') {
      base.menu.mainMenu = 'Menú Principal';
      base.menu.menuAndTools = 'Menú Principal y Herramientas';
      base.menu.appSettings = 'Configuración de App';
      base.menu.calculator = 'Calculadora';
      base.menu.personalNotes = 'Notas Personales';
      base.menu.securityPinLock = 'Bloqueo PIN de Seguridad';
      base.menu.userManualGuide = 'Manual de Usuario';
      base.menu.safetySourceCode = 'Seguridad y Código Fuente';
      base.menu.developerProfile = 'Perfil del Desarrollador';
      base.menu.khata = 'Libro';
      base.menu.ledger = 'Historial';
      base.menu.goals = 'Metas';
      base.menu.workAndLife = 'Trabajo y Vida';
      base.menu.notes = 'Bóveda';
      base.menu.analytics = 'Analítica';
      base.brand.appName = 'Daily Khata Pro';
      base.developer.title = 'Información del Desarrollador';
      base.developer.role = 'Desarrollador y Fundador Independiente';
      base.calc.title = 'Calculadora Financiera Multipropósito';
    } else if (lang === 'fr') {
      base.menu.mainMenu = 'Menu Principal';
      base.menu.menuAndTools = 'Menu Principal & Outils';
      base.menu.appSettings = 'Paramètres de l\'App';
      base.menu.calculator = 'Calculatrice';
      base.menu.personalNotes = 'Notes Privées';
      base.menu.securityPinLock = 'Verrouillage par Code PIN';
      base.menu.userManualGuide = 'Guide de l\'Utilisateur';
      base.menu.safetySourceCode = 'Sécurité & Code Source';
      base.menu.developerProfile = 'Profil du Développeur';
      base.menu.khata = 'Grand Livre';
      base.menu.ledger = 'Historique';
      base.menu.goals = 'Objectifs';
      base.menu.workAndLife = 'Travail & Vie';
      base.menu.notes = 'Coffre';
      base.menu.analytics = 'Analytique';
      base.brand.appName = 'Daily Khata Pro';
      base.developer.title = 'Informations sur le Développeur';
      base.developer.role = 'Développeur & Fondateur Indépendant';
      base.calc.title = 'Calculatrice Financière Polyvalente';
    } else if (lang === 'de') {
      base.menu.mainMenu = 'Hauptmenü';
      base.menu.menuAndTools = 'Hauptmenü & Werkzeuge';
      base.menu.appSettings = 'App-Einstellungen';
      base.menu.calculator = 'Rechner';
      base.menu.personalNotes = 'Persönliche Notizen';
      base.menu.securityPinLock = 'Sicherheits-PIN-Sperre';
      base.menu.userManualGuide = 'Benutzerhandbuch';
      base.menu.safetySourceCode = 'Sicherheit & Quellcode';
      base.menu.developerProfile = 'Entwicklerprofil';
      base.menu.khata = 'Buchhaltung';
      base.menu.ledger = 'Kassenbuch';
      base.menu.goals = 'Ziele';
      base.menu.workAndLife = 'Arbeit & Leben';
      base.menu.notes = 'Notizen';
      base.menu.analytics = 'Berichte';
      base.brand.appName = 'Daily Khata Pro';
      base.developer.title = 'Entwickler-Informationen';
      base.developer.role = 'Unabhängiger Entwickler & Gründer';
      base.calc.title = 'Mehrzweck-Finanzrechner';
    } else if (lang === 'ru') {
      base.menu.mainMenu = 'Главное меню';
      base.menu.menuAndTools = 'Главное меню и инструменты';
      base.menu.appSettings = 'Настройки приложения';
      base.menu.calculator = 'Калькулятор';
      base.menu.personalNotes = 'Личные заметки';
      base.menu.securityPinLock = 'Блокировка PIN-кодом';
      base.menu.userManualGuide = 'Руководство пользователя';
      base.menu.safetySourceCode = 'Безопасность и исходный код';
      base.menu.developerProfile = 'Профиль разработчика';
      base.menu.khata = 'Книга';
      base.menu.ledger = 'Журнал';
      base.menu.goals = 'Цели';
      base.menu.workAndLife = 'Работа и жизнь';
      base.menu.notes = 'Сейф';
      base.menu.analytics = 'Отчеты';
      base.brand.appName = 'Daily Khata Pro';
      base.developer.title = 'Информация о разработчике';
      base.developer.role = 'Независимый разработчик и основатель';
      base.calc.title = 'Универсальный финансовый калькулятор';
    } else if (lang === 'pt') {
      base.menu.mainMenu = 'Menu Principal';
      base.menu.menuAndTools = 'Menu Principal e Ferramentas';
      base.menu.appSettings = 'Configurações do App';
      base.menu.calculator = 'Calculadora';
      base.menu.personalNotes = 'Notas Pessoais';
      base.menu.securityPinLock = 'Bloqueio por PIN de Segurança';
      base.menu.userManualGuide = 'Manual do Usuário';
      base.menu.safetySourceCode = 'Segurança e Código-Fonte';
      base.menu.developerProfile = 'Perfil do Desenvolvedor';
      base.menu.khata = 'Livro-Razão';
      base.menu.ledger = 'Histórico';
      base.menu.goals = 'Metas';
      base.menu.workAndLife = 'Trabalho e Vida';
      base.menu.notes = 'Cofre';
      base.menu.analytics = 'Relatórios';
      base.brand.appName = 'Daily Khata Pro';
      base.developer.title = 'Informações do Desenvolvedor';
      base.developer.role = 'Desenvolvedor e Fundador Independente';
      base.calc.title = 'Calculadora Financeira Multiuso';
    } else if (lang === 'id') {
      base.menu.mainMenu = 'Menu Utama';
      base.menu.menuAndTools = 'Menu Utama & Alat';
      base.menu.appSettings = 'Pengaturan Aplikasi';
      base.menu.calculator = 'Kalkulator';
      base.menu.personalNotes = 'Catatan Pribadi';
      base.menu.securityPinLock = 'Kunci PIN Keamanan';
      base.menu.userManualGuide = 'Panduan Pengguna';
      base.menu.safetySourceCode = 'Keamanan & Kode Sumber';
      base.menu.developerProfile = 'Profil Pengembang';
      base.menu.khata = 'Buku Kas';
      base.menu.ledger = 'Jurnal';
      base.menu.goals = 'Target';
      base.menu.workAndLife = 'Kerja & Hidup';
      base.menu.notes = 'Brankas';
      base.menu.analytics = 'Laporan';
      base.brand.appName = 'Daily Khata Pro';
      base.developer.title = 'Informasi Pengembang';
      base.developer.role = 'Pengembang & Pendiri Independen';
      base.calc.title = 'Kalkulator Keuangan Serbaguna';
    } else if (lang === 'ja') {
      base.menu.mainMenu = 'メインメニュー';
      base.menu.menuAndTools = 'メインメニューとツール';
      base.menu.appSettings = 'アプリ設定';
      base.menu.calculator = '計算機';
      base.menu.personalNotes = '個人メモ';
      base.menu.securityPinLock = 'セキュリティPINロック';
      base.menu.userManualGuide = 'ユーザーガイド';
      base.menu.safetySourceCode = '安全性とソースコード';
      base.menu.developerProfile = '開発者プロフィール';
      base.menu.khata = '家計簿';
      base.menu.ledger = '元帳';
      base.menu.goals = '目標';
      base.menu.workAndLife = '仕事と生活';
      base.menu.notes = '金庫';
      base.menu.analytics = 'レポート';
      base.brand.appName = 'Daily Khata Pro';
      base.developer.title = '開発者情報';
      base.developer.role = '個人開発者・創設者';
      base.calc.title = '多目的財務計算ツール';
    } else if (lang === 'zh') {
      base.menu.mainMenu = '主菜单';
      base.menu.menuAndTools = '主菜单与工具';
      base.menu.appSettings = '应用设置';
      base.menu.calculator = '财务计算器';
      base.menu.personalNotes = '个人私密便签';
      base.menu.securityPinLock = '安全密码锁';
      base.menu.userManualGuide = '用户指南';
      base.menu.safetySourceCode = '安全与源码';
      base.menu.developerProfile = '开发者信息';
      base.menu.khata = '账本';
      base.menu.ledger = '明细';
      base.menu.goals = '目标';
      base.menu.workAndLife = '工作生活';
      base.menu.notes = '保密库';
      base.menu.analytics = '分析';
      base.brand.appName = 'Daily Khata Pro';
      base.developer.title = '开发者资料';
      base.developer.role = '独立开发者兼创始人';
      base.calc.title = '多功能财务计算器';
    }

    APP_TRANSLATIONS[lang] = base;
  }
});

export function getAppTranslation(lang: AppLanguage = 'en'): AppTranslationBundle {
  return APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;
}
