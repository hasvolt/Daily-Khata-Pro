import { getCurrencyConfig, getCurrentLanguage } from './currencyConfig';
import { AppLanguage, FundType } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  nav: {
    home: string;
    add: string;
    tracker: string;
    goals: string;
    history: string;
    reports: string;
  };
  header: {
    searchPlaceholder: string;
    manual: string;
    settings: string;
    theme: string;
    language: string;
    privacyMask: string;
    simulator: string;
    offlineBadge: string;
  };
  home: {
    netBalance: string;
    date: string;
    addIncome: string;
    addExpense: string;
    newTransaction: string;
    thisMonthIncome: string;
    thisMonthExpense: string;
    thisMonthNet: string;
    todayIncome: string;
    todayExpense: string;
    todayNet: string;
    dailySummaryHeading: string;
    monthlySummaryHeading: string;
    netSavings: string;
    todayCashFlow: string;
    sixFundsHeading: string;
    sixFundsSub: string;
    allocationRule: string;
    recentTransactions: string;
    viewAllLedger: string;
    noEntriesYet: string;
    noEntriesSub: string;
    startByAdding: string;
    goalsSummary: string;
    goalsProgress: string;
    viewGoals: string;
    healthScore: string;
    calculator: string;
    calculatorSub: string;
    openSimulator: string;
  };
  add: {
    titleIncome: string;
    titleExpense: string;
    amountLabel: string;
    amountPlaceholder: string;
    sourceLabel: string;
    categoryLabel: string;
    dateLabel: string;
    paymentModeLabel: string;
    paymentCash: string;
    paymentUpi: string;
    paymentBank: string;
    paymentCard: string;
    paymentCheque: string;
    paymentWallet: string;
    paymentOther: string;
    fundDeductLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    clientLabel: string;
    clientPlaceholder: string;
    incomeSplitsPreview: string;
    saveIncome: string;
    saveExpense: string;
    updateEntry: string;
    cancel: string;
    addCustomCategory: string;
    addCustomSource: string;
  };
  goals: {
    heading: string;
    sub: string;
    newGoalBtn: string;
    activeGoals: string;
    completedGoals: string;
    target: string;
    saved: string;
    remaining: string;
    depositBtn: string;
    editBtn: string;
    deleteBtn: string;
    markDone: string;
    completedBadge: string;
    noGoalsTitle: string;
    noGoalsSub: string;
    createFirstGoal: string;
  };
  history: {
    heading: string;
    sub: string;
    searchPlaceholder: string;
    all: string;
    incomeOnly: string;
    expenseOnly: string;
    filterAll: string;
    filterIncome: string;
    filterExpense: string;
    filterFund: string;
    filterMode: string;
    exportCsv: string;
    printPdf: string;
    totalRecords: string;
    noTransactions: string;
    noTransactionsFound: string;
    noTransactionsSub: string;
    clearFilters: string;
    deleteConfirmTitle: string;
    deleteConfirmDesc: string;
  };
  reports: {
    heading: string;
    sub: string;
    exportCsv: string;
    printStatement: string;
    monthSelector: string;
    incomeVsExpense: string;
    savingsRate: string;
    fundDistribution: string;
    topExpenseCategories: string;
    financialHealthAnalysis: string;
    emergencyRunway: string;
    runwayMonths: string;
    healthRecommendations: string;
  };
  simulator: {
    title: string;
    subtitle: string;
    enterIncome: string;
    sliderLabel: string;
    resetDefaults: string;
    recordEntryBtn: string;
    breakdownHeading: string;
  };
  calculator: {
    title: string;
    subtitle: string;
    enterAmount: string;
    presets: string;
    calculatedBreakdown: string;
    applyToIncome: string;
  };
  settings: {
    title: string;
    subtitle: string;
    tabPreferences: string;
    tabCustomOptions: string;
    tabRules: string;
    tabBackup: string;
    tabPrivacy: string;
    tabLegal: string;
    languageHeading: string;
    themeHeading: string;
    privacyMaskHeading: string;
    privacyMaskDesc: string;
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
    dangerZone: string;
    resetAllDataBtn: string;
  };
  funds: {
    personal: { name: string; desc: string };
    family: { name: string; desc: string };
    business?: { name: string; desc: string };
    buffer: { name: string; desc: string };
    emergency: { name: string; desc: string };
    saving: { name: string; desc: string };
    investment: { name: string; desc: string };
  } & { [K in FundType]?: { name: string; desc: string } };
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    appName: 'Daily Khata: Pro',
    appSubtitle: 'Universal Daily Financial Ledger & 6-Fund Capital Engine',
    nav: {
      home: 'Khata',
      add: 'Add +',
      tracker: 'Work & Life',
      goals: 'Goals',
      history: 'Ledger',
      reports: 'Analytics'
    },
    header: {
      searchPlaceholder: 'Search transactions, notes, categories, amounts...',
      manual: 'Manual',
      settings: 'Settings',
      theme: 'Theme',
      language: 'Language',
      privacyMask: 'Mask Numbers',
      simulator: 'Split Calculator',
      offlineBadge: '100% Offline & Private'
    },
    home: {
      netBalance: 'Total Net Balance',
      date: 'Today',
      addIncome: 'Add Income',
      addExpense: 'Add Expense',
      newTransaction: 'New Entry',
      thisMonthIncome: 'Month Income',
      thisMonthExpense: 'Month Expense',
      thisMonthNet: 'Month Net',
      todayIncome: 'Today Income',
      todayExpense: 'Today Expense',
      todayNet: 'Today Net',
      dailySummaryHeading: 'Today (Daily)',
      monthlySummaryHeading: 'This Month (Monthly)',
      netSavings: 'Net Surplus',
      todayCashFlow: "Today's Activity",
      sixFundsHeading: '6-Fund Money Pots',
      sixFundsSub: 'Systematic auto-partitioned balances based on discipline rules',
      allocationRule: 'Split Rule',
      recentTransactions: 'Recent Ledger Entries',
      viewAllLedger: 'View Full Ledger →',
      noEntriesYet: 'No Transactions Yet',
      noEntriesSub: 'Start logging your daily income or expense to activate automatic fund splits.',
      startByAdding: 'Record First Entry',
      goalsSummary: 'Active Financial Goals',
      goalsProgress: 'Overall Goal Target',
      viewGoals: 'Manage Goals →',
      healthScore: 'Financial Health Score',
      calculator: '6-Fund Split Simulator',
      calculatorSub: 'Test any income amount and see live pot breakdown before recording.',
      openSimulator: 'Open Calculator'
    },
    add: {
      titleIncome: 'Record Income Entry',
      titleExpense: 'Record Expense Entry',
      get amountLabel() { return `Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      amountPlaceholder: '0.00',
      sourceLabel: 'Income Source',
      categoryLabel: 'Expense Category',
      dateLabel: 'Transaction Date',
      paymentModeLabel: 'Payment Mode',
      paymentCash: 'Cash',
      paymentUpi: 'UPI / Online',
      paymentBank: 'Bank Transfer',
      paymentCard: 'Debit/Credit Card',
      paymentCheque: 'Cheque / Draft',
      paymentWallet: 'Digital Wallet',
      paymentOther: 'Other Mode',
      fundDeductLabel: 'Deduct From Fund Pot',
      notesLabel: 'Notes / Description (Optional)',
      notesPlaceholder: 'Add reference, invoice ID, or memo...',
      clientLabel: 'Client / Reference Name (Optional)',
      clientPlaceholder: 'e.g. Acme Corp, Client Name, Vendor',
      incomeSplitsPreview: 'Automatic 6-Fund Allocation Breakdown:',
      saveIncome: 'Save Income & Split',
      saveExpense: 'Save Expense',
      updateEntry: 'Update Entry',
      cancel: 'Cancel',
      addCustomCategory: '+ Add Custom Category',
      addCustomSource: '+ Add Custom Source'
    },
    goals: {
      heading: 'Financial Goals & Milestones',
      sub: 'Set target amounts, link with saving pots, and track milestone progress.',
      newGoalBtn: 'Create New Goal',
      activeGoals: 'In Progress',
      completedGoals: 'Achieved & Completed',
      target: 'Target Amount',
      saved: 'Saved Amount',
      remaining: 'Remaining Needed',
      depositBtn: 'Deposit Funds',
      editBtn: 'Edit',
      deleteBtn: 'Delete',
      markDone: 'Mark Complete',
      completedBadge: 'Goal Achieved',
      noGoalsTitle: 'No Goals Created Yet',
      noGoalsSub: 'Define milestones like Emergency Runway, Equipment, or Real Estate Reserve.',
      createFirstGoal: 'Create First Goal'
    },
    history: {
      heading: 'Transaction Ledger & Statement',
      sub: 'Complete searchable audit trail of all historical income and expense transactions.',
      searchPlaceholder: 'Filter by keyword, note, client, category...',
      all: 'All Records',
      incomeOnly: 'Income Only',
      expenseOnly: 'Expense Only',
      filterAll: 'All Records',
      filterIncome: 'Incomes Only',
      filterExpense: 'Expenses Only',
      filterFund: 'All Funds',
      filterMode: 'All Payment Modes',
      exportCsv: 'Export CSV / Excel',
      printPdf: 'Print Statement',
      totalRecords: 'Records Listed',
      noTransactions: 'No Transactions Found',
      noTransactionsFound: 'No Matching Records Found',
      noTransactionsSub: 'Try changing your search keywords or resetting your active filters.',
      clearFilters: 'Clear All Filters',
      deleteConfirmTitle: 'Delete Transaction?',
      deleteConfirmDesc: 'This will permanently remove this record and recalibrate fund balances.'
    },
    reports: {
      heading: 'Financial Reports & Analytics',
      sub: 'Visual insights, income vs expense ratios, and fund growth metrics.',
      exportCsv: 'Export CSV / Excel',
      printStatement: 'Print Statement',
      monthSelector: 'Select Period Month',
      incomeVsExpense: 'Monthly Cash Flow Comparison',
      savingsRate: 'Discipline & Savings Rate',
      fundDistribution: 'Fund Distribution Balance',
      topExpenseCategories: 'Highest Expense Outflows',
      financialHealthAnalysis: 'Financial Health Diagnostics',
      emergencyRunway: 'Emergency Runway Buffer',
      runwayMonths: 'Months of expense coverage available',
      healthRecommendations: 'Smart Recommendations'
    },
    simulator: {
      title: '6-Fund Split Simulator & Calculator',
      subtitle: 'Simulate any salary, business payout, or client receipt with instant mathematical partitioning.',
      get enterIncome() { return `Enter Hypothetical Income Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      sliderLabel: 'Quick Presets',
      resetDefaults: 'Reset to Default %',
      recordEntryBtn: 'Save & Record As Real Income Entry',
      breakdownHeading: 'Calculated 6-Fund Distribution'
    },
    calculator: {
      title: '6-Fund Income Split Calculator',
      subtitle: 'Simulate any income and view automated pot partitioning.',
      get enterAmount() { return `Enter Income Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      presets: 'Quick Amounts',
      calculatedBreakdown: 'Calculated 6-Fund Distribution',
      applyToIncome: 'Apply Amount to Income Entry'
    },
    settings: {
      title: 'Settings & Customization',
      subtitle: 'Theme, Language, Custom Options, 6-Fund Rule Customizer, Backups & Privacy',
      tabPreferences: 'Preferences',
      tabCustomOptions: 'Custom Categories & Options',
      tabRules: '6-Fund Rules',
      tabBackup: 'Data Backup & Export',
      tabPrivacy: 'Privacy & Security',
      tabLegal: 'Entity & Terms',
      languageHeading: 'Application Language',
      themeHeading: 'Color Accent Theme',
      privacyMaskHeading: 'Privacy Masking Mode',
      privacyMaskDesc: 'Hide numerical rupee values on screen when in public or shared spaces.',
      customPercentagesHeading: '6-Fund Allocation Percentage Customizer',
      customPercentagesDesc: 'Adjust the automated percentage rule for incoming revenue. Total must equal 100%.',
      totalMustBe100: 'Total allocation must be exactly 100%',
      saveRuleBtn: 'Save New Allocation Rule',
      resetRuleBtn: 'Reset to Recommended 6-Fund Rules',
      backupHeading: 'Local Storage Backup & Restore',
      backupDesc: 'Your ledger is stored 100% locally. Export regular backups to prevent accidental loss.',
      exportJsonBtn: 'Export JSON Backup',
      importJsonBtn: 'Restore from JSON File',
      exportCsvBtn: 'Export Ledger (CSV / Excel)',
      dangerZone: 'Ledger Reset Zone',
      resetAllDataBtn: 'Wipe & Reset All Khata Data'
    },
    funds: {
      personal: {
        name: 'Personal (30%)',
        desc: 'Personal daily expenses, dining, grooming & lifestyle'
      },
      family: {
        name: 'Family & Home (30%)',
        desc: 'House rent, groceries, family support & home utilities'
      },
      business: {
        name: 'Business & More (15%)',
        desc: 'Business income, invoices, commerce, inventory & office'
      },
      buffer: {
        name: 'Buffer Reserve (5%)',
        desc: 'Quick temporary cushion for unexpected fluctuations'
      },
      emergency: {
        name: 'Emergency Fund (11.25%)',
        desc: 'Medical, urgent repairs & sudden emergency reserve'
      },
      saving: {
        name: 'Liquid Savings (7.5%)',
        desc: 'Liquid cash savings & short-term target milestones'
      },
      investment: {
        name: 'Growth & Investment (11.25%)',
        desc: 'Long-term wealth, SIP, assets & future financial growth'
      }
    }
  },
  hi: {
    appName: 'डेली खाता: प्रो',
    appSubtitle: 'सार्वभौमिक वित्तीय लेजर व 6-फंड स्मार्ट विभाजन इंजन',
    nav: {
      home: 'खाता',
      add: 'जोड़ें +',
      tracker: 'काम व जीवन',
      goals: 'लक्ष्य',
      history: 'लेजर रिकॉर्ड',
      reports: 'रिपोर्ट्स'
    },
    header: {
      searchPlaceholder: 'लेनदेन, विवरण, श्रेणी या राशि खोजें...',
      manual: 'मैनुअल',
      settings: 'सेटिंग्स',
      theme: 'थीम',
      language: 'भाषा',
      privacyMask: 'राशि छुपाएं',
      simulator: '6-फंड कैलकुलेटर',
      offlineBadge: '100% सुरक्षित और ऑफलाइन'
    },
    home: {
      netBalance: 'कुल शुद्ध बैलेंस',
      date: 'आज की तारीख',
      addIncome: '+ कमाई जोड़ें',
      addExpense: '+ खर्च दर्ज करें',
      newTransaction: 'नया लेन-देन',
      thisMonthIncome: 'इस महीने की कमाई',
      thisMonthExpense: 'इस महीने का खर्च',
      thisMonthNet: 'मासिक शुद्ध बचत',
      todayIncome: 'आज की कमाई',
      todayExpense: 'आज का खर्च',
      todayNet: 'आज की शुद्ध बचत',
      dailySummaryHeading: 'आज का हिसाब (Daily)',
      monthlySummaryHeading: 'इस माह का हिसाब (Monthly)',
      netSavings: 'शुद्ध बचत (Surplus)',
      todayCashFlow: 'आज का लेन-देन',
      sixFundsHeading: '6-फंड बैलेंस पॉट्स',
      sixFundsSub: 'अनुशासित वित्तीय नियमों के तहत स्वचालित रूप से विभाजित बैलेंस',
      allocationRule: 'विभाजन नियम',
      recentTransactions: 'हाल के लेन-देन',
      viewAllLedger: 'पूरा खाता देखें →',
      noEntriesYet: 'अभी कोई लेन-देन नहीं है',
      noEntriesSub: 'अपनी दैनिक कमाई या खर्च दर्ज करके 6-फंड विभाजन सक्रिय करें।',
      startByAdding: 'पहला लेन-देन जोड़ें',
      goalsSummary: 'सक्रिय वित्तीय लक्ष्य',
      goalsProgress: 'कुल लक्ष्य प्रगति',
      viewGoals: 'लक्ष्य देखें →',
      healthScore: 'वित्तीय स्वास्थ्य स्कोर',
      calculator: '6-फंड विभाजन सिम्युलेटर',
      calculatorSub: 'किसी भी आय राशि को दर्ज करके देखें कि प्रत्येक फंड में कितने रुपये जाएंगे।',
      openSimulator: 'कैलकुलेटर खोलें'
    },
    add: {
      titleIncome: 'नई कमाई (Income) जोड़ें',
      titleExpense: 'नया खर्च (Expense) दर्ज करें',
      get amountLabel() { return `राशि (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      amountPlaceholder: '0.00',
      sourceLabel: 'कमाई का स्रोत (Source)',
      categoryLabel: 'खर्च की श्रेणी (Category)',
      dateLabel: 'लेन-देन की तारीख',
      paymentModeLabel: 'भुगतान का तरीका',
      paymentCash: 'नकद (Cash)',
      paymentUpi: 'UPI / ऑनलाइन',
      paymentBank: 'बैंक खाता',
      paymentCard: 'डेबिट/क्रेडिट कार्ड',
      paymentCheque: 'चेक',
      paymentWallet: 'डिजिटल वॉलेट',
      paymentOther: 'अन्य माध्यम',
      fundDeductLabel: 'किस फंड से खर्च घटाएं?',
      notesLabel: 'विवरण / नोट (वैकल्पिक)',
      notesPlaceholder: 'बिल, इनवॉइस या खर्च का विवरण लिखें...',
      clientLabel: 'ग्राहक / संदर्भ नाम (वैकल्पिक)',
      clientPlaceholder: 'उदा. ग्राहक का नाम, कंपनी या संदर्भ',
      incomeSplitsPreview: '6-फंड में स्वचालित विभाजन पूर्वावलोकन:',
      saveIncome: 'कमाई सहेजें और बांटें',
      saveExpense: 'खर्च सहेजें',
      updateEntry: 'अपडेट करें',
      cancel: 'रद्द करें',
      addCustomCategory: '+ नई श्रेणी जोड़ें',
      addCustomSource: '+ नया स्रोत जोड़ें'
    },
    goals: {
      heading: 'वित्तीय लक्ष्य और बचत मील के पत्थर',
      sub: 'बचत लक्ष्य निर्धारित करें, फंड जोड़ें और अपनी प्रगति को ट्रैक करें।',
      newGoalBtn: 'नया लक्ष्य बनाएं',
      activeGoals: 'प्रगति में लक्ष्य',
      completedGoals: 'पूरे किए गए लक्ष्य',
      target: 'लक्ष्य राशि',
      saved: 'अब तक जमा',
      remaining: 'बची हुई राशि',
      depositBtn: 'पैसे जमा करें',
      editBtn: 'संपादित करें',
      deleteBtn: 'हटाएं',
      markDone: 'पूरा घोषित करें',
      completedBadge: 'लक्ष्य पूरा हुआ',
      noGoalsTitle: 'कोई लक्ष्य नहीं बना है',
      noGoalsSub: 'इमरजेंसी फंड, वाहन या उपकरण जैसे लक्ष्य जोड़ें।',
      createFirstGoal: 'पहला लक्ष्य बनाएं'
    },
    history: {
      heading: 'खाता लेजर और लेन-देन विवरण',
      sub: 'आपकी पिछली सभी कमाई और खर्चों का संपूर्ण और सुरक्षित लेखा-जोखा।',
      searchPlaceholder: 'कीवर्ड, नोट, ग्राहक या श्रेणी खोजें...',
      all: 'सभी रिकॉर्ड',
      incomeOnly: 'केवल कमाई (Income)',
      expenseOnly: 'केवल खर्च (Expense)',
      filterAll: 'सभी रिकॉर्ड',
      filterIncome: 'केवल कमाई (Income)',
      filterExpense: 'केवल खर्च (Expense)',
      filterFund: 'सभी फंड',
      filterMode: 'सभी भुगतान माध्यम',
      exportCsv: 'CSV / Excel में डाउनलोड करें',
      printPdf: 'स्टेटमेंट प्रिंट करें',
      totalRecords: 'कुल रिकॉर्ड',
      noTransactions: 'कोई लेन-देन नहीं मिला',
      noTransactionsFound: 'कोई रिकॉर्ड नहीं मिला',
      noTransactionsSub: 'सर्च कीवर्ड बदलें या फिल्टर रीसेट करें।',
      clearFilters: 'फिल्टर साफ़ करें',
      deleteConfirmTitle: 'क्या आप इस प्रविष्टि को हटाना चाहते हैं?',
      deleteConfirmDesc: 'यह रिकॉर्ड हमेशा के लिए हटा दिया जाएगा और फंड बैलेंस फिर से अपडेट हो जाएगा।'
    },
    reports: {
      heading: 'वित्तीय रिपोर्ट और एनालिटिक्स',
      sub: 'कमाई बनाम खर्च का ग्राफ, बचत दर और फंड वृद्धि का विश्लेषण।',
      exportCsv: 'CSV / Excel डाउनलोड करें',
      printStatement: 'स्टेटमेंट प्रिंट करें',
      monthSelector: 'महीना चुनें',
      incomeVsExpense: 'मासिक आय और व्यय तुलना',
      savingsRate: 'बचत और अनुशासन दर',
      fundDistribution: 'फंड बैलेंस का वितरण',
      topExpenseCategories: 'सबसे बड़े खर्च की श्रेणियां',
      financialHealthAnalysis: 'वित्तीय स्वास्थ्य विश्लेषण',
      emergencyRunway: 'इमरजेंसी रनवे बफ़र',
      runwayMonths: 'महीनों का खर्च सुरक्षित है',
      healthRecommendations: 'स्मार्ट वित्तीय सुझाव'
    },
    simulator: {
      title: '6-फंड विभाजन सिम्युलेटर और कैलकुलेटर',
      subtitle: 'किसी भी वेतन या व्यावसायिक कमाई का 6-फंड गणितीय विभाजन तुरंत देखें।',
      get enterIncome() { return `कमाई की राशि दर्ज करें (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      sliderLabel: 'त्वरित प्रीसेट',
      resetDefaults: 'डिफ़ॉल्ट % पर रीसेट करें',
      recordEntryBtn: 'इसे असली कमाई के रूप में दर्ज करें',
      breakdownHeading: 'गणना किया गया 6-फंड विभाजन'
    },
    calculator: {
      title: '6-फंड आय विभाजन कैलकुलेटर',
      subtitle: 'अपनी कमाई का लाइव 6-फंड विभाजन कैलकुलेट करें।',
      get enterAmount() { return `कमाई की राशि दर्ज करें (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      presets: 'त्वरित राशि',
      calculatedBreakdown: 'गणना किया गया 6-फंड विभाजन',
      applyToIncome: 'इस राशि को कमाई में लागू करें'
    },
    settings: {
      title: 'सेटिंग्स और कस्टम विकल्प',
      subtitle: 'थीम, भाषा, कस्टम श्रेणियां, 6-फंड प्रतिशत नियम, बैकअप और प्राइवेसी',
      tabPreferences: 'पसंद (Preferences)',
      tabCustomOptions: 'कस्टम श्रेणियां व विकल्प',
      tabRules: '6-फंड नियम',
      tabBackup: 'डेटा बैकअप व एक्सपोर्ट',
      tabPrivacy: 'गोपनीयता नीति (Privacy)',
      tabLegal: 'शर्तें व स्वामित्व',
      languageHeading: 'ऐप की भाषा (Language)',
      themeHeading: 'रंग थीम (Theme)',
      privacyMaskHeading: 'गोपनीयता मोड (संख्या छुपाएं)',
      privacyMaskDesc: 'सार्वजनिक स्थानों पर स्क्रीन पर दिखने वाली रुपये की राशि को छुपाएं।',
      customPercentagesHeading: '6-फंड प्रतिशत विभाजन अनुकूलक',
      customPercentagesDesc: 'आने वाली कमाई का स्वचालित प्रतिशत नियम बदलें। कुल योग 100% होना अनिवार्य है।',
      totalMustBe100: 'कुल योग ठीक 100% होना चाहिए',
      saveRuleBtn: 'नया नियम सहेजें',
      resetRuleBtn: 'अनुशंसित 6-फंड नियमों पर रीसेट करें',
      backupHeading: 'लोकल स्टोरेज बैकअप और रिस्टोर',
      backupDesc: 'आपका डेटा आपके डिवाइस में 100% सुरक्षित है। नियमित बैकअप JSON फ़ाइल डाउनलोड करें।',
      exportJsonBtn: 'JSON बैकअप डाउनलोड करें',
      importJsonBtn: 'JSON फ़ाइल से रिस्टोर करें',
      exportCsvBtn: 'लेजर CSV / Excel डाउनलोड करें',
      dangerZone: 'डेटा रीसेट क्षेत्र',
      resetAllDataBtn: 'सभी खाता डेटा मिटाएं और रीसेट करें'
    },
    funds: {
      personal: {
        name: 'खुद का खर्च (30%)',
        desc: 'व्यक्तिगत दैनिक खर्च, डाइनिंग, ग्रूमिंग और जीवनशैली'
      },
      family: {
        name: 'परिवार व घर (30%)',
        desc: 'घर का किराया, राशन, परिवार की मदद और घरेलू बिल'
      },
      business: {
        name: 'व्यापार व काम (15%)',
        desc: 'व्यापार आय, चालान, बिक्री, इन्वेंट्री व दुकान/ऑफिस खर्च'
      },
      buffer: {
        name: 'बफ़र / आकस्मिक (5%)',
        desc: 'अप्रत्याशित उतार-चढ़ाव के लिए त्वरित अस्थायी कुशन'
      },
      emergency: {
        name: 'इमरजेंसी फंड (11.25%)',
        desc: 'चिकित्सा, अचानक मरम्मत और आपातकालीन सुरक्षा रिज़र्व'
      },
      saving: {
        name: 'सुरक्षित बचत (7.5%)',
        desc: 'तरल नकद बचत और अल्पकालिक वित्तीय लक्ष्य'
      },
      investment: {
        name: 'निवेश / भविष्य (11.25%)',
        desc: 'दीर्घकालिक संपत्ति, SIP, एसेट्स और भविष्य की वृद्धि'
      }
    }
  },
  hinglish: {
    appName: 'Daily Khata: Pro',
    appSubtitle: 'Universal Daily Financial Ledger & 6-Fund Capital Engine',
    nav: {
      home: 'Khata',
      add: 'Add +',
      tracker: 'Work & Life',
      goals: 'Goals',
      history: 'Ledger',
      reports: 'Analytics'
    },
    header: {
      searchPlaceholder: 'Transactions, notes, categories, amount search karein...',
      manual: 'Manual',
      settings: 'Settings',
      theme: 'Theme',
      language: 'Bhasha',
      privacyMask: 'Amounts Hide Karein',
      simulator: '6-Fund Calculator',
      offlineBadge: '100% Offline & Private'
    },
    home: {
      netBalance: 'Total Net Balance',
      date: 'Aaj Ki Date',
      addIncome: '+ Income Add Karein',
      addExpense: '+ Expense Add Karein',
      newTransaction: 'New Entry',
      thisMonthIncome: 'Is Month Ki Income',
      thisMonthExpense: 'Is Month Ka Kharcha',
      thisMonthNet: 'Month Ka Net Surplus',
      todayIncome: 'Aaj Ki Income',
      todayExpense: 'Aaj Ka Kharcha',
      todayNet: 'Aaj Ki Net Bachath',
      dailySummaryHeading: 'Aaj Ka Hisaab (Daily)',
      monthlySummaryHeading: 'Is Month Ka Hisaab (Monthly)',
      netSavings: 'Net Surplus (Bachath)',
      todayCashFlow: 'Aaj Ka Len-Den',
      sixFundsHeading: '6-Fund Money Pots',
      sixFundsSub: 'Discipline rule ke hisaab se auto-split balance pots',
      allocationRule: 'Split Rule',
      recentTransactions: 'Recent Transactions',
      viewAllLedger: 'Pura Ledger Dekhein →',
      noEntriesYet: 'Abhi koi entry nahi hai',
      noEntriesSub: 'Apni daily income ya expense enter karke 6-fund split start karein.',
      startByAdding: 'First Entry Record Karein',
      goalsSummary: 'Active Financial Goals',
      goalsProgress: 'Overall Goal Progress',
      viewGoals: 'Goals Manage Karein →',
      healthScore: 'Financial Health Score',
      calculator: '6-Fund Split Simulator',
      calculatorSub: 'Kisi bhi income ka live 6-fund breakdown check karein.',
      openSimulator: 'Calculator Kholein'
    },
    add: {
      titleIncome: 'New Income Add Karein',
      titleExpense: 'New Expense Add Karein',
      get amountLabel() { return `Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      amountPlaceholder: '0.00',
      sourceLabel: 'Income Source',
      categoryLabel: 'Expense Category',
      dateLabel: 'Transaction Date',
      paymentModeLabel: 'Payment Mode',
      paymentCash: 'Cash',
      paymentUpi: 'UPI / Online',
      paymentBank: 'Bank Transfer',
      paymentCard: 'Card',
      paymentCheque: 'Cheque',
      paymentWallet: 'Wallet',
      paymentOther: 'Other',
      fundDeductLabel: 'Kis Fund Se Expense Minus Hoga?',
      notesLabel: 'Notes / Details (Optional)',
      notesPlaceholder: 'Invoice details, memo ya description likhein...',
      clientLabel: 'Client / Reference Name (Optional)',
      clientPlaceholder: 'e.g. Client name, Store, Vendor',
      incomeSplitsPreview: 'Automatic 6-Fund Split Preview:',
      saveIncome: 'Income Save & Split Karein',
      saveExpense: 'Expense Save Karein',
      updateEntry: 'Entry Update Karein',
      cancel: 'Cancel',
      addCustomCategory: '+ New Category Add Karein',
      addCustomSource: '+ New Source Add Karein'
    },
    goals: {
      heading: 'Financial Goals & Milestones',
      sub: 'Saving target banayein, fund link karein aur progress track karein.',
      newGoalBtn: 'New Goal Banayein',
      activeGoals: 'In Progress Goals',
      completedGoals: 'Achieved Goals',
      target: 'Target Amount',
      saved: 'Ab Tak Saved',
      remaining: 'Remaining Amount',
      depositBtn: 'Funds Deposit Karein',
      editBtn: 'Edit',
      deleteBtn: 'Delete',
      markDone: 'Complete Mark Karein',
      completedBadge: 'Goal Achieved',
      noGoalsTitle: 'Abhi koi goal nahi banaya gaya',
      noGoalsSub: 'Emergency fund, vehicle ya tech gadget jaisa goal create karein.',
      createFirstGoal: 'New Goal Banayein'
    },
    history: {
      heading: 'Transaction Ledger & Statement',
      sub: 'Aapke sabhi income aur expense entries ka complete audit trail.',
      searchPlaceholder: 'Keywords, notes, client ya category search karein...',
      all: 'Sabhi Records',
      incomeOnly: 'Sirf Incomes',
      expenseOnly: 'Sirf Expenses',
      filterAll: 'Sabhi Records',
      filterIncome: 'Sirf Incomes',
      filterExpense: 'Sirf Expenses',
      filterFund: 'Sabhi Funds',
      filterMode: 'Sabhi Payment Modes',
      exportCsv: 'Export CSV / Excel Sheet',
      printPdf: 'Print Statement PDF',
      totalRecords: 'Total Records',
      noTransactions: 'Koi Transaction Nahi Mili',
      noTransactionsFound: 'Koi matching entry nahi mili',
      noTransactionsSub: 'Search keyword change karein ya filter reset karein.',
      clearFilters: 'Filters Clear Karein',
      deleteConfirmTitle: 'Entry delete karni hai?',
      deleteConfirmDesc: 'Ye entry permanently remove ho jayegi aur fund balance recalculate ho jayega.'
    },
    reports: {
      heading: 'Financial Reports & Analytics',
      sub: 'Income vs Expense ratio, savings rate aur fund growth charts.',
      exportCsv: 'Export CSV / Excel',
      printStatement: 'Print Statement PDF',
      monthSelector: 'Month Select Karein',
      incomeVsExpense: 'Monthly Cash Flow Comparison',
      savingsRate: 'Savings & Discipline Rate',
      fundDistribution: '6-Fund Balances Distribution',
      topExpenseCategories: 'Highest Expense Categories',
      financialHealthAnalysis: 'Financial Health Diagnostics',
      emergencyRunway: 'Emergency Runway Buffer',
      runwayMonths: 'Months of expense reserve ready',
      healthRecommendations: 'Smart Financial Tips'
    },
    simulator: {
      title: '6-Fund Split Simulator & Calculator',
      subtitle: 'Kisi bhi income amount ka live 6-fund mathematical split check karein.',
      get enterIncome() { return `Income Amount Enter Karein (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      sliderLabel: 'Quick Presets',
      resetDefaults: 'Default % Reset Karein',
      recordEntryBtn: 'Is Amount Ko Real Income Entry Banayein',
      breakdownHeading: 'Calculated 6-Fund Split'
    },
    calculator: {
      title: '6-Fund Income Split Calculator',
      subtitle: 'Apni income ka live 6-fund automatic split check karein.',
      get enterAmount() { return `Income Amount Enter Karein (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      presets: 'Quick Amounts',
      calculatedBreakdown: 'Calculated 6-Fund Split',
      applyToIncome: 'Income Entry Mein Apply Karein'
    },
    settings: {
      title: 'Settings & Customization',
      subtitle: 'Theme, Language, Custom Categories, 6-Fund Rules, Backups & Privacy',
      tabPreferences: 'Preferences',
      tabCustomOptions: 'Custom Categories & Options',
      tabRules: '6-Fund Rules',
      tabBackup: 'Data Backup & Export',
      tabPrivacy: 'Privacy Policy',
      tabLegal: 'Terms & Entity',
      languageHeading: 'App Ki Language',
      themeHeading: 'Color Theme',
      privacyMaskHeading: 'Privacy Masking Mode',
      privacyMaskDesc: 'Public spaces mein screen par rupee amount ko hide / mask karein.',
      customPercentagesHeading: '6-Fund Allocation Percentage Customizer',
      customPercentagesDesc: 'Income split hone ke percentage rules ko adjust karein. Total 100% hona chahiye.',
      totalMustBe100: 'Total allocation exact 100% hona chahiye',
      saveRuleBtn: 'New Rules Save Karein',
      resetRuleBtn: 'Recommended Rules Par Reset Karein',
      backupHeading: 'Local Storage Backup & Restore',
      backupDesc: 'Aapka data 100% aapke browser mein secure hai. Regular JSON backup download karein.',
      exportJsonBtn: 'Export JSON Backup',
      importJsonBtn: 'Restore from JSON File',
      exportCsvBtn: 'Export Ledger (CSV / Excel)',
      dangerZone: 'Ledger Reset Zone',
      resetAllDataBtn: 'Sabhi Khata Data Reset Karein'
    },
    funds: {
      personal: {
        name: 'Personal (30%)',
        desc: 'Personal daily kharche, khana, dining, kapde & lifestyle'
      },
      family: {
        name: 'Family & Home (30%)',
        desc: 'Ghar ka rent, rashan, parivar support & bijli-paani'
      },
      business: {
        name: 'Business & More (15%)',
        desc: 'Business aamdani, billing, inventory & office kharche'
      },
      buffer: {
        name: 'Buffer Reserve (5%)',
        desc: 'Achanak aane wale chote kharchon ke liye temporary cushion'
      },
      emergency: {
        name: 'Emergency Fund (11.25%)',
        desc: 'Medical emergency, hospital & achanak sankat reserve'
      },
      saving: {
        name: 'Liquid Savings (7.5%)',
        desc: 'Liquid cash savings & short-term target khareedari'
      },
      investment: {
        name: 'Growth & Investment (11.25%)',
        desc: 'Long-term wealth, SIP, shares & future financial growth'
      }
    }
  },
  es: {
    appName: 'Daily Khata: Pro',
    appSubtitle: 'Libro Contable Financiero Diario y Motor de 6 Fondos',
    nav: {
      home: 'Inicio',
      add: 'Añadir +',
      tracker: 'Trabajo y Vida',
      goals: 'Metas',
      history: 'Libro Mayor',
      reports: 'Análisis'
    },
    header: {
      searchPlaceholder: 'Buscar transacciones, notas, categorías, importes...',
      manual: 'Manual',
      settings: 'Ajustes',
      theme: 'Tema',
      language: 'Idioma',
      privacyMask: 'Ocultar Números',
      simulator: 'Calculadora de División',
      offlineBadge: '100% Sin Conexión y Privado'
    },
    home: {
      netBalance: 'Saldo Neto Total',
      date: 'Hoy',
      addIncome: 'Añadir Ingreso',
      addExpense: 'Añadir Gasto',
      newTransaction: 'Nueva Entrada',
      thisMonthIncome: 'Ingresos del Mes',
      thisMonthExpense: 'Gastos del Mes',
      thisMonthNet: 'Neto del Mes',
      todayIncome: 'Ingresos de Hoy',
      todayExpense: 'Gastos de Hoy',
      todayNet: 'Neto de Hoy',
      dailySummaryHeading: 'Resumen de Hoy (Diario)',
      monthlySummaryHeading: 'Resumen del Mes (Mensual)',
      netSavings: 'Superávit Neto',
      todayCashFlow: 'Flujo de Caja de Hoy',
      sixFundsHeading: '6 Botes de Dinero',
      sixFundsSub: 'Saldos divididos automáticamente según reglas de disciplina financiera',
      allocationRule: 'Regla de División',
      recentTransactions: 'Transacciones Recientes',
      viewAllLedger: 'Ver Libro Completo →',
      noEntriesYet: 'Sin Transacciones Aún',
      noEntriesSub: 'Registra tus ingresos o gastos diarios para activar la división de fondos.',
      startByAdding: 'Registrar Primera Entrada',
      goalsSummary: 'Metas Financieras Activas',
      goalsProgress: 'Progreso Total de Metas',
      viewGoals: 'Gestionar Metas →',
      healthScore: 'Puntuación de Salud Financiera',
      calculator: 'Simulador de 6 Fondos',
      calculatorSub: 'Prueba cualquier monto de ingreso y visualiza la división en vivo.',
      openSimulator: 'Abrir Calculadora'
    },
    add: {
      titleIncome: 'Registrar Entrada de Ingreso',
      titleExpense: 'Registrar Entrada de Gasto',
      get amountLabel() { return `Monto (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      amountPlaceholder: '0.00',
      sourceLabel: 'Fuente de Ingreso',
      categoryLabel: 'Categoría de Gasto',
      dateLabel: 'Fecha de Transacción',
      paymentModeLabel: 'Método de Pago',
      paymentCash: 'Efectivo',
      paymentUpi: 'En Línea / Transferencia',
      paymentBank: 'Transferencia Bancaria',
      paymentCard: 'Tarjeta Débito/Crédito',
      paymentCheque: 'Cheque',
      paymentWallet: 'Billetera Digital',
      paymentOther: 'Otro Método',
      fundDeductLabel: 'Deducir del Fondo',
      notesLabel: 'Notas / Descripción (Opcional)',
      notesPlaceholder: 'Añade referencia, factura o nota...',
      clientLabel: 'Nombre del Cliente / Referencia (Opcional)',
      clientPlaceholder: 'ej. Empresa, Cliente, Proveedor',
      incomeSplitsPreview: 'Desglose Automático de 6 Fondos:',
      saveIncome: 'Guardar Ingreso y Dividir',
      saveExpense: 'Guardar Gasto',
      updateEntry: 'Actualizar Entrada',
      cancel: 'Cancelar',
      addCustomCategory: '+ Añadir Categoría Personalizada',
      addCustomSource: '+ Añadir Fuente Personalizada'
    },
    goals: {
      heading: 'Metas Financieras y Objetivos',
      sub: 'Establece objetivos, vincúlalos con botes de ahorro y sigue el progreso.',
      newGoalBtn: 'Crear Nueva Meta',
      activeGoals: 'En Progreso',
      completedGoals: 'Completadas',
      target: 'Monto Objetivo',
      saved: 'Monto Ahorrado',
      remaining: 'Faltante',
      depositBtn: 'Depositar Fondos',
      editBtn: 'Editar',
      deleteBtn: 'Eliminar',
      markDone: 'Marcar Completada',
      completedBadge: 'Meta Lograda',
      noGoalsTitle: 'No hay metas creadas',
      noGoalsSub: 'Define hitos como Fondo de Emergencia, Equipo o Inversión.',
      createFirstGoal: 'Crear Primera Meta'
    },
    history: {
      heading: 'Libro Mayor de Transacciones',
      sub: 'Historial completo de auditoría de ingresos y gastos.',
      searchPlaceholder: 'Filtrar por palabra clave, nota, cliente, categoría...',
      all: 'Todos los Registros',
      incomeOnly: 'Solo Ingresos',
      expenseOnly: 'Solo Gastos',
      filterAll: 'Todos los Registros',
      filterIncome: 'Solo Ingresos',
      filterExpense: 'Solo Gastos',
      filterFund: 'Todos los Fondos',
      filterMode: 'Todos los Métodos',
      exportCsv: 'Exportar CSV / Excel',
      printPdf: 'Imprimir Estado de Cuenta',
      totalRecords: 'Total de Registros',
      noTransactions: 'No se encontraron transacciones',
      noTransactionsFound: 'Sin registros coincidentes',
      noTransactionsSub: 'Prueba cambiando tus filtros o palabras de búsqueda.',
      clearFilters: 'Limpiar Filtros',
      deleteConfirmTitle: '¿Eliminar Transacción?',
      deleteConfirmDesc: 'Esto eliminará permanentemente este registro y recalculará los saldos.'
    },
    reports: {
      heading: 'Informes Financieros y Análisis',
      sub: 'Perspectivas visuales, ratios de ingresos vs gastos y métricas de crecimiento.',
      exportCsv: 'Exportar CSV / Excel',
      printStatement: 'Imprimir Informe',
      monthSelector: 'Seleccionar Mes',
      incomeVsExpense: 'Comparación de Flujo Mensual',
      savingsRate: 'Tasa de Ahorro y Disciplina',
      fundDistribution: 'Distribución de los 6 Fondos',
      topExpenseCategories: 'Mayores Categorías de Gasto',
      financialHealthAnalysis: 'Diagnóstico de Salud Financiera',
      emergencyRunway: 'Colchón de Emergencia',
      runwayMonths: 'Meses de reserva disponibles',
      healthRecommendations: 'Recomendaciones Inteligentes'
    },
    simulator: {
      title: 'Simulador de División de 6 Fondos',
      subtitle: 'Simula cualquier ingreso con división matemática instantánea.',
      enterIncome: 'Ingresa Monto de Ingreso',
      sliderLabel: 'Cantidades Rápidas',
      resetDefaults: 'Restablecer % por Defecto',
      recordEntryBtn: 'Guardar como Ingreso Real',
      breakdownHeading: 'Distribución de 6 Fondos Calculada'
    },
    calculator: {
      title: 'Calculadora de División de Ingresos',
      subtitle: 'Simula cualquier ingreso y visualiza la división automática.',
      enterAmount: 'Ingresa Monto de Ingreso',
      presets: 'Cantidades Rápidas',
      calculatedBreakdown: 'Distribución Calculada',
      applyToIncome: 'Aplicar a Entrada de Ingreso'
    },
    settings: {
      title: 'Ajustes y Personalización',
      subtitle: 'Tema, Idioma, Opciones Personalizadas, Reglas de 6 Fondos, Copias y Privacidad',
      tabPreferences: 'Preferencias',
      tabCustomOptions: 'Opciones Personalizadas',
      tabRules: 'Reglas de 6 Fondos',
      tabBackup: 'Copia de Seguridad',
      tabPrivacy: 'Privacidad y Seguridad',
      tabLegal: 'Entidad y Términos',
      languageHeading: 'Idioma de la Aplicación',
      themeHeading: 'Tema de Color',
      privacyMaskHeading: 'Modo de Privacidad',
      privacyMaskDesc: 'Oculta cifras numéricas en pantalla en espacios públicos.',
      customPercentagesHeading: 'Personalizador de Porcentajes de 6 Fondos',
      customPercentagesDesc: 'Ajusta el porcentaje automático de ingresos. El total debe sumar 100%.',
      totalMustBe100: 'La asignación total debe sumar exactamente 100%',
      saveRuleBtn: 'Guardar Nueva Regla',
      resetRuleBtn: 'Restablecer Reglas Recomendadas',
      backupHeading: 'Copia de Seguridad Local y Restauración',
      backupDesc: 'Tus datos están 100% seguros en tu navegador. Descarga copias periódicas.',
      exportJsonBtn: 'Exportar Copia JSON',
      importJsonBtn: 'Restaurar desde Archivo JSON',
      exportCsvBtn: 'Exportar Libro (CSV / Excel)',
      dangerZone: 'Zona de Restablecimiento',
      resetAllDataBtn: 'Borrar y Restablecer Todos los Datos'
    },
    funds: {
      personal: {
        name: 'Personal (30%)',
        desc: 'Gastos personales diarios, salidas, estilo de vida'
      },
      family: {
        name: 'Familia y Hogar (35%)',
        desc: 'Alquiler, compras del hogar, servicios públicos'
      },
      buffer: {
        name: 'Reserva Colchón (5%)',
        desc: 'Amortiguador rápido para imprevistos temporales'
      },
      emergency: {
        name: 'Fondo de Emergencia (11.25%)',
        desc: 'Médico, reparaciones urgentes y reserva de emergencia'
      },
      saving: {
        name: 'Ahorro Líquido (7.5%)',
        desc: 'Ahorros líquidos en efectivo y metas a corto plazo'
      },
      investment: {
        name: 'Inversión y Crecimiento (11.25%)',
        desc: 'Patrimonio a largo plazo, activos y crecimiento financiero'
      }
    }
  },
  ar: {
    appName: 'Daily Khata: Pro',
    appSubtitle: 'دفتر الحسابات المالية اليومي ومحرك الصناديق الستة',
    nav: {
      home: 'الرئيسية',
      add: 'إضافة +',
      tracker: 'العمل والحياة',
      goals: 'الأهداف',
      history: 'سجل المعاملات',
      reports: 'التحليلات'
    },
    header: {
      searchPlaceholder: 'بحث في المعاملات، الملاحظات، الفئات، المبالغ...',
      manual: 'دليل الاستخدام',
      settings: 'الإعدادات',
      theme: 'المظهر',
      language: 'اللغة',
      privacyMask: 'إخفاء الأرقام',
      simulator: 'حاسبة التقسيم',
      offlineBadge: '100% دون اتصال وخاص'
    },
    home: {
      netBalance: 'إجمالي الرصيد الصافي',
      date: 'اليوم',
      addIncome: 'إضافة دخل',
      addExpense: 'إضافة مصروف',
      newTransaction: 'معاملة جديدة',
      thisMonthIncome: 'دخل هذا الشهر',
      thisMonthExpense: 'مصاريف هذا الشهر',
      thisMonthNet: 'صافي هذا الشهر',
      todayIncome: 'دخل اليوم',
      todayExpense: 'مصاريف اليوم',
      todayNet: 'صافي اليوم',
      dailySummaryHeading: 'ملخص اليوم (يومي)',
      monthlySummaryHeading: 'ملخص هذا الشهر (شهري)',
      netSavings: 'الفائض الصافي',
      todayCashFlow: 'حركة أموال اليوم',
      sixFundsHeading: 'صناديق الأموال الستة',
      sixFundsSub: 'أرصدة مقسمة تلقائياً وفق قواعد الانضباط المالي',
      allocationRule: 'قاعدة التقسيم',
      recentTransactions: 'أحدث المعاملات',
      viewAllLedger: 'عرض السجل كاملاً ←',
      noEntriesYet: 'لا توجد معاملات بعد',
      noEntriesSub: 'ابدأ بتسجيل دخلك أو مصاريفك اليومية لتفعيل تقسيم الصناديق.',
      startByAdding: 'سجل أول معاملة',
      goalsSummary: 'الأهداف المالية النشطة',
      goalsProgress: 'إجمالي التقدم في الأهداف',
      viewGoals: 'إدارة الأهداف ←',
      healthScore: 'درجة الصحة المالية',
      calculator: 'محاكي تقسيم الصناديق الستة',
      calculatorSub: 'جرّب أي مبلغ دخل وشاهد التوزيع المباشر على الصناديق.',
      openSimulator: 'فتح الحاسبة'
    },
    add: {
      titleIncome: 'تسجيل دخل جديد',
      titleExpense: 'تسجيل مصروف جديد',
      amountLabel: 'المبلغ',
      amountPlaceholder: '0.00',
      sourceLabel: 'مصدر الدخل',
      categoryLabel: 'فئة المصروف',
      dateLabel: 'تاريخ المعاملة',
      paymentModeLabel: 'طريقة الدفع',
      paymentCash: 'نقداً',
      paymentUpi: 'دفع إلكتروني',
      paymentBank: 'تحويل بنكي',
      paymentCard: 'بطاقة مصرفية',
      paymentCheque: 'شيك',
      paymentWallet: 'محفظة رقمية',
      paymentOther: 'طريقة أخرى',
      fundDeductLabel: 'خصم من صندوق',
      notesLabel: 'ملاحظات / وصف (اختياري)',
      notesPlaceholder: 'أضف مرجعاً، رقم فاتورة، أو ملاحظة...',
      clientLabel: 'اسم العميل / المرجع (اختياري)',
      clientPlaceholder: 'مثال: اسم العميل، الشركة، المورد',
      incomeSplitsPreview: 'التوزيع التلقائي على الصناديق الستة:',
      saveIncome: 'حفظ الدخل والتقسيم',
      saveExpense: 'حفظ المصروف',
      updateEntry: 'تحديث المعاملة',
      cancel: 'إلغاء',
      addCustomCategory: '+ إضافة فئة مخصصة',
      addCustomSource: '+ إضافة مصدر مخصص'
    },
    goals: {
      heading: 'الأهداف المالية والإنجازات',
      sub: 'حدد المبالغ المستهدفة واربطها بصناديق الادخار وتتبع تقدمك.',
      newGoalBtn: 'إنشاء هدف جديد',
      activeGoals: 'قيد التنفيذ',
      completedGoals: 'المحققة والمكتملة',
      target: 'المبلغ المستهدف',
      saved: 'المبلغ المدخر',
      remaining: 'المتبقي',
      depositBtn: 'إيداع أموال',
      editBtn: 'تعديل',
      deleteBtn: 'حذف',
      markDone: 'تحديد كمكتمل',
      completedBadge: 'تم تحقيق الهدف',
      noGoalsTitle: 'لم يتم إنشاء أهداف بعد',
      noGoalsSub: 'حدد أهدافاً مثل صندوق الطوارئ أو المعدات أو الاستثمار.',
      createFirstGoal: 'إنشاء أول هدف'
    },
    history: {
      heading: 'سجل المعاملات والبيانات',
      sub: 'سجل تدقيق كامل وشامل لجميع عمليات الدخل والمصروفات.',
      searchPlaceholder: 'بحث بكلمة رئيسية، ملاحظة، عميل، فئة...',
      all: 'جميع السجلات',
      incomeOnly: 'الدخل فقط',
      expenseOnly: 'المصاريف فقط',
      filterAll: 'جميع السجلات',
      filterIncome: 'الدخل فقط',
      filterExpense: 'المصاريف فقط',
      filterFund: 'جميع الصناديق',
      filterMode: 'جميع طرق الدفع',
      exportCsv: 'تصدير CSV / Excel',
      printPdf: 'طباعة كشف الحساب',
      totalRecords: 'إجمالي السجلات',
      noTransactions: 'لم يتم العثور على معاملات',
      noTransactionsFound: 'لا توجد سجلات مطابقة',
      noTransactionsSub: 'جرّب تغيير كلمات البحث أو إعادة تعيين الفلاتر.',
      clearFilters: 'مسح الفلاتر',
      deleteConfirmTitle: 'حذف المعاملة؟',
      deleteConfirmDesc: 'سيؤدي هذا إلى حذف السجل نهائياً وإعادة احتساب الأرصدة.'
    },
    reports: {
      heading: 'التقارير المالية والتحليلات',
      sub: 'رؤى مرئية ونسب الدخل مقابل المصروفات ومؤشرات نمو الصناديق.',
      exportCsv: 'تصدير CSV / Excel',
      printStatement: 'طباعة التقرير',
      monthSelector: 'تحديد الشهر',
      incomeVsExpense: 'مقارنة التدفق النقدي الشهري',
      savingsRate: 'معدل الادخار والانضباط',
      fundDistribution: 'توزيع أرصدة الصناديق الستة',
      topExpenseCategories: 'أعلى فئات الإنفاق',
      financialHealthAnalysis: 'تشخيص الصحة المالية',
      emergencyRunway: 'احتياطي الطوارئ',
      runwayMonths: 'أشهر تغطية المصاريف المتاحة',
      healthRecommendations: 'توصيات ذكية'
    },
    simulator: {
      title: 'محاكي تقسيم الصناديق الستة',
      subtitle: 'محاكاة أي دخل مع تقسيم حسابي فوري.',
      enterIncome: 'أدخل مبلغ الدخل',
      sliderLabel: 'قيم سريعة',
      resetDefaults: 'إعادة تعيين النسب الافتراضية',
      recordEntryBtn: 'تسجيل كدخل فعلي في الحساب',
      breakdownHeading: 'التوزيع المحسوب للصناديق'
    },
    calculator: {
      title: 'حاسبة تقسيم الدخل',
      subtitle: 'محاكاة أي دخل ومشاهدة التوزيع التلقائي.',
      enterAmount: 'أدخل مبلغ الدخل',
      presets: 'مبالغ سريعة',
      calculatedBreakdown: 'التوزيع المحسوب',
      applyToIncome: 'تطبيق المبلغ على دخل جديد'
    },
    settings: {
      title: 'الإعدادات والتخصيص',
      subtitle: 'المظهر، اللغة، الفئات المخصصة، قواعد الصناديق، النسخ الاحتياطي والخصوصية',
      tabPreferences: 'التفضيلات',
      tabCustomOptions: 'خيارات مخصصة',
      tabRules: 'قواعد الصناديق',
      tabBackup: 'النسخ الاحتياطي',
      tabPrivacy: 'الخصوصية والأمان',
      tabLegal: 'الشروط والكيان',
      languageHeading: 'لغة التطبيق',
      themeHeading: 'سمة اللون',
      privacyMaskHeading: 'وضع الخصوصية',
      privacyMaskDesc: 'إخفاء الأرقام المالية على الشاشة في الأماكن العامة.',
      customPercentagesHeading: 'تخصيص نسب الصناديق الستة',
      customPercentagesDesc: 'تعديل قاعدة النسبة المئوية التلقائية للإيرادات. يجب أن يكون المجموع 100%.',
      totalMustBe100: 'يجب أن يساوي إجمالي التخصيص 100% تماماً',
      saveRuleBtn: 'حفظ القاعدة الجديدة',
      resetRuleBtn: 'إعادة تعيين للقواعد الموصى بها',
      backupHeading: 'النسخ الاحتياطي المحلي والاستعادة',
      backupDesc: 'بياناتك محفوظة محلياً بنسبة 100%. قم بتنزيل نسخ احتياطية بانتظام.',
      exportJsonBtn: 'تصدير نسخة JSON',
      importJsonBtn: 'استعادة من ملف JSON',
      exportCsvBtn: 'تصدير السجل (CSV / Excel)',
      dangerZone: 'منطقة إعادة التعيين',
      resetAllDataBtn: 'مسح وإعادة تعيين كافة البيانات'
    },
    funds: {
      personal: {
        name: 'شخصي (30%)',
        desc: 'مصاريف شخصية يومية، مطاعم وأسلوب حياة'
      },
      family: {
        name: 'الأسرة والمنزل (35%)',
        desc: 'إيجار المنزل، المواد الغذائية ودعم الأسرة والفواتير'
      },
      buffer: {
        name: 'احتياطي وقائي (5%)',
        desc: 'مصد مالي مؤقت وسريع للتقلبات غير المتوقعة'
      },
      emergency: {
        name: 'صندوق الطوارئ (11.25%)',
        desc: 'طبي، إصلاحات عاجلة واحتياطي للطوارئ المفاجئة'
      },
      saving: {
        name: 'مدخرات سائلة (7.5%)',
        desc: 'مدخرات نقدية سائلة وأهداف مالية قصيرة المدى'
      },
      investment: {
        name: 'الاستثمار والنمو (11.25%)',
        desc: 'بناء الثروة طويلة الأجل والأصول والنمو المالي'
      }
    }
  },
  fr: {
    appName: 'Daily Khata: Pro',
    appSubtitle: 'Grand Livre Financier Quotidien et Moteur à 6 Fonds',
    nav: {
      home: 'Accueil',
      add: 'Ajouter +',
      tracker: 'Travail & Vie',
      goals: 'Objectifs',
      history: 'Grand Livre',
      reports: 'Analyses'
    },
    header: {
      searchPlaceholder: 'Rechercher transactions, notes, catégories, montants...',
      manual: 'Manuel',
      settings: 'Paramètres',
      theme: 'Thème',
      language: 'Langue',
      privacyMask: 'Masquer Chiffres',
      simulator: 'Calculateur de Répartition',
      offlineBadge: '100% Hors-ligne et Privé'
    },
    home: {
      netBalance: 'Solde Net Total',
      date: "Aujourd'hui",
      addIncome: 'Ajouter Revenu',
      addExpense: 'Ajouter Dépense',
      newTransaction: 'Nouvelle Entrée',
      thisMonthIncome: 'Revenus du Mois',
      thisMonthExpense: 'Dépenses du Mois',
      thisMonthNet: 'Net du Mois',
      todayIncome: "Revenus d'Aujourd'hui",
      todayExpense: "Dépenses d'Aujourd'hui",
      todayNet: "Net d'Aujourd'hui",
      dailySummaryHeading: "Résumé d'Aujourd'hui (Quotidien)",
      monthlySummaryHeading: 'Résumé du Mois (Mensuel)',
      netSavings: 'Excédent Net',
      todayCashFlow: "Flux d'Aujourd'hui",
      sixFundsHeading: '6 Pots Financiers',
      sixFundsSub: 'Soldes répartis automatiquement selon des règles financières strictes',
      allocationRule: 'Règle de Répartition',
      recentTransactions: 'Transactions Récentes',
      viewAllLedger: 'Voir Grand Livre Complet →',
      noEntriesYet: 'Aucune Transaction',
      noEntriesSub: 'Enregistrez vos revenus ou dépenses pour activer la répartition automatique.',
      startByAdding: 'Enregistrer Première Entrée',
      goalsSummary: 'Objectifs Financiers Actifs',
      goalsProgress: 'Progression Globale des Objectifs',
      viewGoals: 'Gérer Objectifs →',
      healthScore: 'Score de Santé Financière',
      calculator: 'Simulateur des 6 Fonds',
      calculatorSub: 'Testez n’importe quel montant et visualisez la répartition instantanément.',
      openSimulator: 'Ouvrir Calculateur'
    },
    add: {
      titleIncome: 'Enregistrer un Revenu',
      titleExpense: 'Enregistrer une Dépense',
      amountLabel: 'Montant (€/$)',
      amountPlaceholder: '0.00',
      sourceLabel: 'Source de Revenu',
      categoryLabel: 'Catégorie de Dépense',
      dateLabel: 'Date de Transaction',
      paymentModeLabel: 'Mode de Paiement',
      paymentCash: 'Espèces',
      paymentUpi: 'Virement / En ligne',
      paymentBank: 'Virement Bancaire',
      paymentCard: 'Carte Débit/Crédit',
      paymentCheque: 'Chèque',
      paymentWallet: 'Portefeuille Numérique',
      paymentOther: 'Autre Mode',
      fundDeductLabel: 'Déduire du Pot de Fonds',
      notesLabel: 'Notes / Description (Optionnel)',
      notesPlaceholder: 'Ajoutez une référence, facture ou note...',
      clientLabel: 'Nom du Client / Référence (Optionnel)',
      clientPlaceholder: 'ex. Entreprise, Client, Fournisseur',
      incomeSplitsPreview: 'Répartition Automatique des 6 Fonds:',
      saveIncome: 'Enregistrer Revenu & Répartir',
      saveExpense: 'Enregistrer Dépense',
      updateEntry: 'Mettre à Jour Entrée',
      cancel: 'Annuler',
      addCustomCategory: '+ Ajouter Catégorie Personnalisée',
      addCustomSource: '+ Ajouter Source Personnalisée'
    },
    goals: {
      heading: 'Objectifs Financiers & Jalons',
      sub: 'Définissez des montants cibles, liez-les aux fonds d’épargne et suivez vos progrès.',
      newGoalBtn: 'Créer Nouvel Objectif',
      activeGoals: 'En Cours',
      completedGoals: 'Atteints & Terminés',
      target: 'Montant Cible',
      saved: 'Montant Épargné',
      remaining: 'Restant Nécessaire',
      depositBtn: 'Déposer des Fonds',
      editBtn: 'Modifier',
      deleteBtn: 'Supprimer',
      markDone: 'Marquer comme Terminé',
      completedBadge: 'Objectif Atteint',
      noGoalsTitle: 'Aucun objectif créé',
      noGoalsSub: 'Définissez des jalons comme Fonds d’Urgence, Matériel ou Investissement.',
      createFirstGoal: 'Créer Premier Objectif'
    },
    history: {
      heading: 'Grand Livre des Transactions',
      sub: 'Historique d’audit complet et détaillé des revenus et dépenses.',
      searchPlaceholder: 'Filtrer par mot-clé, note, client, catégorie...',
      all: 'Tous les Enregistrements',
      incomeOnly: 'Revenus Uniquement',
      expenseOnly: 'Dépenses Uniquement',
      filterAll: 'Tous les Enregistrements',
      filterIncome: 'Revenus Uniquement',
      filterExpense: 'Dépenses Uniquement',
      filterFund: 'Tous les Fonds',
      filterMode: 'Tous les Modes',
      exportCsv: 'Exporter CSV / Excel',
      printPdf: 'Imprimer Relevé',
      totalRecords: 'Total des Enregistrements',
      noTransactions: 'Aucune transaction trouvée',
      noTransactionsFound: 'Aucun enregistrement correspondant',
      noTransactionsSub: 'Essayez de modifier vos termes de recherche ou de réinitialiser les filtres.',
      clearFilters: 'Effacer Filtres',
      deleteConfirmTitle: 'Supprimer la Transaction ?',
      deleteConfirmDesc: 'Cela supprimera définitivement cet enregistrement et recalculera les soldes.'
    },
    reports: {
      heading: 'Rapports Financiers & Analyses',
      sub: 'Aperçus visuels, ratios revenus vs dépenses et métriques de croissance.',
      exportCsv: 'Exporter CSV / Excel',
      printStatement: 'Imprimer Rapport',
      monthSelector: 'Sélectionner le Mois',
      incomeVsExpense: 'Comparaison Flux Mensuels',
      savingsRate: 'Taux d’Épargne & Discipline',
      fundDistribution: 'Répartition des 6 Fonds',
      topExpenseCategories: 'Principales Dépenses',
      financialHealthAnalysis: 'Diagnostic de Santé Financière',
      emergencyRunway: 'Réserve de Sécurité Urgence',
      runwayMonths: 'Mois de dépenses couverts disponibles',
      healthRecommendations: 'Recommandations Intelligentes'
    },
    simulator: {
      title: 'Simulateur de Répartition des 6 Fonds',
      subtitle: 'Simulez tout revenu avec répartition mathématique instantanée.',
      enterIncome: 'Entrez le Montant du Revenu',
      sliderLabel: 'Montants Rapides',
      resetDefaults: 'Réinitialiser % par Défaut',
      recordEntryBtn: 'Enregistrer comme Vrai Revenu',
      breakdownHeading: 'Répartition Calculée des 6 Fonds'
    },
    calculator: {
      title: 'Calculateur de Répartition des Revenus',
      subtitle: 'Simulez un revenu et découvrez le partage automatique.',
      enterAmount: 'Entrez le Montant du Revenu',
      presets: 'Montants Rapides',
      calculatedBreakdown: 'Répartition Calculée',
      applyToIncome: 'Appliquer à une Nouvelle Entrée'
    },
    settings: {
      title: 'Paramètres & Personnalisation',
      subtitle: 'Thème, Langue, Options Personnalisées, Règles des 6 Fonds, Sauvegardes & Confidentialité',
      tabPreferences: 'Préférences',
      tabCustomOptions: 'Options Personnalisées',
      tabRules: 'Règles des 6 Fonds',
      tabBackup: 'Sauvegarde & Données',
      tabPrivacy: 'Confidentialité & Sécurité',
      tabLegal: 'Entité & Conditions',
      languageHeading: 'Langue de l’Application',
      themeHeading: 'Thème de Couleur',
      privacyMaskHeading: 'Mode Confidentialité',
      privacyMaskDesc: 'Masquez les montants sur l’écran dans les espaces publics.',
      customPercentagesHeading: 'Personnalisation des Pourcentages des 6 Fonds',
      customPercentagesDesc: 'Ajustez la répartition automatique des revenus. Le total doit être de 100%.',
      totalMustBe100: 'L’allocation totale doit être exactement égale à 100%',
      saveRuleBtn: 'Enregistrer Nouvelle Règle',
      resetRuleBtn: 'Réinitialiser Règles Conseillées',
      backupHeading: 'Sauvegarde Locale & Restauration',
      backupDesc: 'Vos données sont stockées à 100% dans votre navigateur. Téléchargez des sauvegardes.',
      exportJsonBtn: 'Exporter Sauvegarde JSON',
      importJsonBtn: 'Restaurer Fichier JSON',
      exportCsvBtn: 'Exporter Grand Livre (CSV / Excel)',
      dangerZone: 'Zone de Réinitialisation',
      resetAllDataBtn: 'Effacer & Réinitialiser Toutes les Données'
    },
    funds: {
      personal: {
        name: 'Personnel (30%)',
        desc: 'Dépenses personnelles, sorties, bien-être et style de vie'
      },
      family: {
        name: 'Famille & Foyer (35%)',
        desc: 'Loyer, courses, soutien familial et charges de la maison'
      },
      buffer: {
        name: 'Réserve Tampon (5%)',
        desc: 'Coussin financier temporaire pour fluctuations imprévues'
      },
      emergency: {
        name: 'Fonds d’Urgence (11.25%)',
        desc: 'Médical, réparations urgentes et réserve d’urgence absolue'
      },
      saving: {
        name: 'Épargne Liquide (7.5%)',
        desc: 'Épargne disponible en liquidités et projets à court terme'
      },
      investment: {
        name: 'Investissement & Croissance (11.25%)',
        desc: 'Patrimoine à long terme, actifs et indépendance financière'
      }
    }
  },
  de: {
    appName: 'Daily Khata: Pro',
    appSubtitle: 'Universelles Tägliches Finanzbuch & 6-Töpfe-Kapitalmotor',
    nav: {
      home: 'Buch',
      add: 'Neu +',
      tracker: 'Arbeit & Leben',
      goals: 'Ziele',
      history: 'Hauptbuch',
      reports: 'Analysen'
    },
    header: {
      searchPlaceholder: 'Transaktionen, Notizen, Kategorien, Beträge suchen...',
      manual: 'Handbuch',
      settings: 'Einstellungen',
      theme: 'Design',
      language: 'Sprache',
      privacyMask: 'Zahlen verbergen',
      simulator: 'Aufteilungs-Rechner',
      offlineBadge: '100% Offline & Privat'
    },
    home: {
      netBalance: 'Gesamter Nettosaldo',
      date: 'Heute',
      addIncome: 'Einnahme buchen',
      addExpense: 'Ausgabe buchen',
      newTransaction: 'Neuer Eintrag',
      thisMonthIncome: 'Monatseinnahmen',
      thisMonthExpense: 'Monatsausgaben',
      thisMonthNet: 'Monats-Netto',
      todayIncome: 'Heutige Einnahmen',
      todayExpense: 'Heutige Ausgaben',
      todayNet: 'Heutiges Netto',
      dailySummaryHeading: 'Heutige Übersicht (Täglich)',
      monthlySummaryHeading: 'Monatsübersicht (Monatlich)',
      netSavings: 'Netto-Überschuss',
      todayCashFlow: 'Heutiger Geldfluss',
      sixFundsHeading: '6 Geld-Töpfe',
      sixFundsSub: 'Automatisch aufgeteilte Guthaben nach disziplinierten Finanzregeln',
      allocationRule: 'Aufteilungsregel',
      recentTransactions: 'Letzte Buchungen',
      viewAllLedger: 'Gesamtes Buch anzeigen →',
      noEntriesYet: 'Noch keine Buchungen',
      noEntriesSub: 'Trage deine täglichen Einnahmen oder Ausgaben ein, um die 6-Töpfe-Aufteilung zu starten.',
      startByAdding: 'Ersten Eintrag buchen',
      goalsSummary: 'Aktive Finanzziele',
      goalsProgress: 'Gesamtziel-Fortschritt',
      viewGoals: 'Ziele verwalten →',
      healthScore: 'Finanzgesundheits-Score',
      calculator: '6-Töpfe-Simulator',
      calculatorSub: 'Teste jeden Betrag und sieh die Live-Verteilung auf die 6 Töpfe.',
      openSimulator: 'Rechner öffnen'
    },
    add: {
      titleIncome: 'Einnahme eintragen',
      titleExpense: 'Ausgabe eintragen',
      amountLabel: 'Betrag (€/$)',
      amountPlaceholder: '0.00',
      sourceLabel: 'Einnahmequelle',
      categoryLabel: 'Ausgabenkategorie',
      dateLabel: 'Buchungsdatum',
      paymentModeLabel: 'Zahlungsart',
      paymentCash: 'Bargeld',
      paymentUpi: 'Online / Überweisung',
      paymentBank: 'Banküberweisung',
      paymentCard: 'EC- / Kreditkarte',
      paymentCheque: 'Scheck',
      paymentWallet: 'Digitale Wallet',
      paymentOther: 'Sonstige',
      fundDeductLabel: 'Vom Topf abziehen',
      notesLabel: 'Notizen / Beschreibung (Optional)',
      notesPlaceholder: 'Referenz, Rechnungsnummer oder Memo hinzufügen...',
      clientLabel: 'Kundenname / Referenz (Optional)',
      clientPlaceholder: 'z.B. Firma, Kunde, Lieferant',
      incomeSplitsPreview: 'Automatische 6-Töpfe-Aufteilung:',
      saveIncome: 'Einnahme speichern & teilen',
      saveExpense: 'Ausgabe speichern',
      updateEntry: 'Eintrag aktualisieren',
      cancel: 'Abbrechen',
      addCustomCategory: '+ Eigene Kategorie',
      addCustomSource: '+ Eigene Quelle'
    },
    goals: {
      heading: 'Finanzielle Ziele & Meilensteine',
      sub: 'Setze Zielbeträge, verknüpfe sie mit Spartöpfen und verfolge Meilensteine.',
      newGoalBtn: 'Neues Ziel erstellen',
      activeGoals: 'In Bearbeitung',
      completedGoals: 'Erreicht & Abgeschlossen',
      target: 'Zielbetrag',
      saved: 'Gesparter Betrag',
      remaining: 'Noch benötigt',
      depositBtn: 'Geld einzahlen',
      editBtn: 'Bearbeiten',
      deleteBtn: 'Löschen',
      markDone: 'Als erledigt markieren',
      completedBadge: 'Ziel erreicht',
      noGoalsTitle: 'Noch keine Ziele erstellt',
      noGoalsSub: 'Definiere Meilensteine wie Notgroschen, Ausrüstung oder Investition.',
      createFirstGoal: 'Erstes Ziel erstellen'
    },
    history: {
      heading: 'Transaktions-Hauptbuch',
      sub: 'Vollständiges, durchsuchbares Protokoll aller Einnahmen und Ausgaben.',
      searchPlaceholder: 'Nach Stichwort, Notiz, Kunde, Kategorie filtern...',
      all: 'Alle Datensätze',
      incomeOnly: 'Nur Einnahmen',
      expenseOnly: 'Nur Ausgaben',
      filterAll: 'Alle Datensätze',
      filterIncome: 'Nur Einnahmen',
      filterExpense: 'Nur Ausgaben',
      filterFund: 'Alle Töpfe',
      filterMode: 'Alle Zahlungsarten',
      exportCsv: 'CSV / Excel Export',
      printPdf: 'Kontoauszug drucken',
      totalRecords: 'Datensätze gesamt',
      noTransactions: 'Keine Buchungen gefunden',
      noTransactionsFound: 'Keine passenden Einträge',
      noTransactionsSub: 'Versuche andere Suchbegriffe oder setze die Filter zurück.',
      clearFilters: 'Filter zurücksetzen',
      deleteConfirmTitle: 'Buchung löschen?',
      deleteConfirmDesc: 'Dies löscht den Eintrag dauerhaft und berechnet die Salden neu.'
    },
    reports: {
      heading: 'Finanzberichte & Analysen',
      sub: 'Visuelle Einblicke, Einnahmen-Ausgaben-Verhältnis und Topf-Wachstumsmetriken.',
      exportCsv: 'CSV / Excel Export',
      printStatement: 'Bericht drucken',
      monthSelector: 'Monat auswählen',
      incomeVsExpense: 'Monatlicher Cashflow-Vergleich',
      savingsRate: 'Spar- und Disziplinquote',
      fundDistribution: 'Verteilung der 6 Töpfe',
      topExpenseCategories: 'Höchste Ausgabenkategorien',
      financialHealthAnalysis: 'Finanzgesundheits-Diagnose',
      emergencyRunway: 'Notgroschen-Reichweite',
      runwayMonths: 'Monate an Ausgabenreserve bereit',
      healthRecommendations: 'Smarte Empfehlungen'
    },
    simulator: {
      title: '6-Töpfe-Aufteilungs-Simulator',
      subtitle: 'Simuliere Einnahmen mit sofortiger mathematischer Aufteilung.',
      enterIncome: 'Einnahmebetrag eingeben',
      sliderLabel: 'Schnellbeträge',
      resetDefaults: 'Auf Standard-% zurücksetzen',
      recordEntryBtn: 'Als echte Einnahme verbuchen',
      breakdownHeading: 'Berechnete 6-Töpfe-Aufteilung'
    },
    calculator: {
      title: 'Einnahmen-Aufteilungs-Rechner',
      subtitle: 'Simuliere Einnahmen und sieh die automatische Topfverteilung.',
      enterAmount: 'Einnahmebetrag eingeben',
      presets: 'Schnellbeträge',
      calculatedBreakdown: 'Berechnete Aufteilung',
      applyToIncome: 'Auf neue Einnahme anwenden'
    },
    settings: {
      title: 'Einstellungen & Anpassung',
      subtitle: 'Design, Sprache, Eigene Optionen, 6-Töpfe-Regeln, Backups & Datenschutz',
      tabPreferences: 'Präferenzen',
      tabCustomOptions: 'Eigene Optionen',
      tabRules: '6-Töpfe-Regeln',
      tabBackup: 'Backup & Daten',
      tabPrivacy: 'Datenschutz & Sicherheit',
      tabLegal: 'Rechtliches',
      languageHeading: 'App-Sprache',
      themeHeading: 'Farbschema',
      privacyMaskHeading: 'Privatsphäre-Modus',
      privacyMaskDesc: 'Verberge Beträge auf dem Bildschirm in der Öffentlichkeit.',
      customPercentagesHeading: '6-Töpfe-Prozentverteilung anpassen',
      customPercentagesDesc: 'Passe die automatische Aufteilung an. Die Summe muss 100% betragen.',
      totalMustBe100: 'Gesamtaufteilung muss exakt 100% ergeben',
      saveRuleBtn: 'Neue Regel speichern',
      resetRuleBtn: 'Auf empfohlene Regeln zurücksetzen',
      backupHeading: 'Lokales Backup & Wiederherstellung',
      backupDesc: 'Deine Daten sind 100% lokal im Browser gespeichert. Lade regelmäßig Backups herunter.',
      exportJsonBtn: 'JSON-Backup exportieren',
      importJsonBtn: 'Aus JSON-Datei wiederherstellen',
      exportCsvBtn: 'Hauptbuch exportieren (CSV / Excel)',
      dangerZone: 'Zurücksetz-Bereich',
      resetAllDataBtn: 'Alle Daten löschen & zurücksetzen'
    },
    funds: {
      personal: {
        name: 'Persönlich (30%)',
        desc: 'Persönliche tägliche Ausgaben, Ausgehen, Hobbys & Lifestyle'
      },
      family: {
        name: 'Familie & Haushalt (35%)',
        desc: 'Miete, Lebensmittel, Familienunterstützung & Nebenkosten'
      },
      buffer: {
        name: 'Puffer-Reserve (5%)',
        desc: 'Schnelles Polster für unerwartete kurzfristige Schwankungen'
      },
      emergency: {
        name: 'Notfall-Fonds (11.25%)',
        desc: 'Medizinische Notfälle, Reparaturen & eiserne Notfallreserve'
      },
      saving: {
        name: 'Liquide Ersparnisse (7.5%)',
        desc: 'Schnell verfügbare Barerparnisse & kurzfristige Ziele'
      },
      investment: {
        name: 'Wachstum & Investition (11.25%)',
        desc: 'Langfristiger Vermögensaufbau, ETFs, Assets & Zukunftsabsicherung'
      }
    }
  },
  ru: {
    appName: 'Daily Khata: Pro',
    appSubtitle: 'Универсальный Финансовый Учет и Движок 6 Фондов',
    nav: {
      home: 'Главная',
      add: 'Добавить +',
      tracker: 'Работа и Жизнь',
      goals: 'Цели',
      history: 'Журнал',
      reports: 'Аналитика'
    },
    header: {
      searchPlaceholder: 'Поиск транзакций, заметок, категорий, сумм...',
      manual: 'Руководство',
      settings: 'Настройки',
      theme: 'Тема',
      language: 'Язык',
      privacyMask: 'Скрыть суммы',
      simulator: 'Калькулятор распределения',
      offlineBadge: '100% Офлайн и Конфиденциально'
    },
    home: {
      netBalance: 'Общий чистый баланс',
      date: 'Сегодня',
      addIncome: 'Добавить доход',
      addExpense: 'Добавить расход',
      newTransaction: 'Новая запись',
      thisMonthIncome: 'Доход за месяц',
      thisMonthExpense: 'Расход за месяц',
      thisMonthNet: 'Чистый доход за месяц',
      todayIncome: 'Доход за сегодня',
      todayExpense: 'Расход за сегодня',
      todayNet: 'Чистый доход за сегодня',
      dailySummaryHeading: 'Итоги сегодня (День)',
      monthlySummaryHeading: 'Итоги месяца (Месяц)',
      netSavings: 'Чистая прибыль',
      todayCashFlow: 'Движение средств сегодня',
      sixFundsHeading: '6 Финансовых Фондов',
      sixFundsSub: 'Автоматическое распределение баланса по правилам финансовой дисциплины',
      allocationRule: 'Правило распределения',
      recentTransactions: 'Последние операции',
      viewAllLedger: 'Открыть полный журнал →',
      noEntriesYet: 'Нет транзакций',
      noEntriesSub: 'Начните вносить ежедневные доходы и расходы для авто-распределения.',
      startByAdding: 'Внести первую запись',
      goalsSummary: 'Активные финансовые цели',
      goalsProgress: 'Общий прогресс целей',
      viewGoals: 'Управление целями →',
      healthScore: 'Рейтинг финансового здоровья',
      calculator: 'Симулятор 6 Фондов',
      calculatorSub: 'Проверьте любую сумму дохода и посмотрите авто-распределение по фондам.',
      openSimulator: 'Открыть калькулятор'
    },
    add: {
      titleIncome: 'Внести запись о доходе',
      titleExpense: 'Внести запись о расходе',
      amountLabel: 'Сумма (₽/$)',
      amountPlaceholder: '0.00',
      sourceLabel: 'Источник дохода',
      categoryLabel: 'Категория расхода',
      dateLabel: 'Дата операции',
      paymentModeLabel: 'Способ оплаты',
      paymentCash: 'Наличные',
      paymentUpi: 'Перевод / Онлайн',
      paymentBank: 'Банковский перевод',
      paymentCard: 'Банковская карта',
      paymentCheque: 'Чек',
      paymentWallet: 'Электронный кошелек',
      paymentOther: 'Другое',
      fundDeductLabel: 'Списать из фонда',
      notesLabel: 'Заметки / Описание (Опционально)',
      notesPlaceholder: 'Добавьте комментарий, номер счета или заметку...',
      clientLabel: 'Клиент / Контрагент (Опционально)',
      clientPlaceholder: 'например: Компания, Клиент, Поставщик',
      incomeSplitsPreview: 'Автоматическое распределение по 6 фондам:',
      saveIncome: 'Сохранить доход и распределить',
      saveExpense: 'Сохранить расход',
      updateEntry: 'Обновить запись',
      cancel: 'Отмена',
      addCustomCategory: '+ Добавить категорию',
      addCustomSource: '+ Добавить источник'
    },
    goals: {
      heading: 'Финансовые цели и этапы',
      sub: 'Ставьте целевые суммы, привязывайте к фондам и отслеживайте прогресс.',
      newGoalBtn: 'Создать новую цель',
      activeGoals: 'В процессе',
      completedGoals: 'Достигнутые цели',
      target: 'Целевая сумма',
      saved: 'Накоплено',
      remaining: 'Осталось собрать',
      depositBtn: 'Пополнить цель',
      editBtn: 'Изменить',
      deleteBtn: 'Удалить',
      markDone: 'Отметить завершенной',
      completedBadge: 'Цель достигнута',
      noGoalsTitle: 'Цели еще не созданы',
      noGoalsSub: 'Задайте цели: Резервный фонд, Оборудование или Инвестиции.',
      createFirstGoal: 'Создать первую цель'
    },
    history: {
      heading: 'Журнал операций и выписка',
      sub: 'Полная история всех операций доходов и расходов.',
      searchPlaceholder: 'Поиск по ключевым словам, заметкам, клиентам, категориям...',
      all: 'Все записи',
      incomeOnly: 'Только доходы',
      expenseOnly: 'Только расходы',
      filterAll: 'Все записи',
      filterIncome: 'Только доходы',
      filterExpense: 'Только расходы',
      filterFund: 'Все фонды',
      filterMode: 'Все способы оплаты',
      exportCsv: 'Экспорт в CSV / Excel',
      printPdf: 'Печать выписки',
      totalRecords: 'Всего записей',
      noTransactions: 'Операций не найдено',
      noTransactionsFound: 'Нет подходящих записей',
      noTransactionsSub: 'Попробуйте изменить запрос или сбросить фильтры.',
      clearFilters: 'Очистить фильтры',
      deleteConfirmTitle: 'Удалить запись?',
      deleteConfirmDesc: 'Это действие удалит запись безвозвратно и пересчитает балансы фондов.'
    },
    reports: {
      heading: 'Финансовые отчеты и аналитика',
      sub: 'Наглядные графики, соотношение доходов к расходам и рост фондов.',
      exportCsv: 'Экспорт CSV / Excel',
      printStatement: 'Печать отчета',
      monthSelector: 'Выберите месяц',
      incomeVsExpense: 'Сравнение ежемесячного денежного потока',
      savingsRate: 'Норма сбережений и дисциплина',
      fundDistribution: 'Распределение 6 фондов',
      topExpenseCategories: 'Основные статьи расходов',
      financialHealthAnalysis: 'Диагностика финансового здоровья',
      emergencyRunway: 'Подушка безопасности',
      runwayMonths: 'Месяцев финансовой устойчивости',
      healthRecommendations: 'Умные рекомендации'
    },
    simulator: {
      title: 'Симулятор распределения 6 Фондов',
      subtitle: 'Симулируйте любой доход с мгновенным математическим распределением.',
      enterIncome: 'Введите сумму дохода',
      sliderLabel: 'Быстрые суммы',
      resetDefaults: 'Сбросить % на стандартные',
      recordEntryBtn: 'Записать как реальный доход',
      breakdownHeading: 'Расчетное распределение по фондам'
    },
    calculator: {
      title: 'Калькулятор распределения дохода',
      subtitle: 'Проверьте распределение дохода по фондам.',
      enterAmount: 'Введите сумму дохода',
      presets: 'Быстрые суммы',
      calculatedBreakdown: 'Расчетное распределение',
      applyToIncome: 'Применить к новой записи'
    },
    settings: {
      title: 'Настройки и персонализация',
      subtitle: 'Тема, Язык, Кастомные опции, Правила 6 Фондов, Резервные копии и Безопасность',
      tabPreferences: 'Предпочтения',
      tabCustomOptions: 'Свои категории',
      tabRules: 'Правила 6 Фондов',
      tabBackup: 'Резервное копирование',
      tabPrivacy: 'Конфиденциальность',
      tabLegal: 'Условия и лицензия',
      languageHeading: 'Язык приложения',
      themeHeading: 'Цветовая тема',
      privacyMaskHeading: 'Режим приватности',
      privacyMaskDesc: 'Скрывайте суммы на экране в общественных местах.',
      customPercentagesHeading: 'Настройка процентов 6 Фондов',
      customPercentagesDesc: 'Настройте проценты авто-распределения дохода. Сумма должна быть равна 100%.',
      totalMustBe100: 'Общая сумма процентов должна быть строго 100%',
      saveRuleBtn: 'Сохранить новые правила',
      resetRuleBtn: 'Сбросить на рекомендованные',
      backupHeading: 'Локальный бэкап и восстановление',
      backupDesc: 'Ваши данные на 100% хранятся в браузере. Регулярно скачивайте резервные копии.',
      exportJsonBtn: 'Скачать JSON бэкап',
      importJsonBtn: 'Восстановить из файла JSON',
      exportCsvBtn: 'Экспорт журнала (CSV / Excel)',
      dangerZone: 'Сброс данных',
      resetAllDataBtn: 'Стереть и сбросить все данные'
    },
    funds: {
      personal: {
        name: 'Личный фонд (30%)',
        desc: 'Личные ежедневные расходы, досуг, одежда и стиль жизни'
      },
      family: {
        name: 'Семья и дом (35%)',
        desc: 'Аренда, продукты, коммунальные платежи и поддержка семьи'
      },
      buffer: {
        name: 'Буферный резерв (5%)',
        desc: 'Быстрая временная подушка для непредвиденных колебаний'
      },
      emergency: {
        name: 'Фонд ЧС / Здоровье (11.25%)',
        desc: 'Медицина, срочный ремонт и неприкосновенный резерв'
      },
      saving: {
        name: 'Ликвидные сбережения (7.5%)',
        desc: 'Накопления в быстрой доступности и краткосрочные цели'
      },
      investment: {
        name: 'Инвестиции и рост (11.25%)',
        desc: 'Долгосрочный капитал, активы и финансовая независимость'
      }
    }
  },
  pt: {
    appName: 'Daily Khata: Pro',
    appSubtitle: 'Livro Financeiro Diário e Motor dos 6 Fundos de Capital',
    nav: {
      home: 'Início',
      add: 'Adicionar +',
      tracker: 'Trabalho e Vida',
      goals: 'Metas',
      history: 'Livro-Razão',
      reports: 'Relatórios'
    },
    header: {
      searchPlaceholder: 'Buscar transações, notas, categorias, valores...',
      manual: 'Manual',
      settings: 'Configurações',
      theme: 'Tema',
      language: 'Idioma',
      privacyMask: 'Ocultar Números',
      simulator: 'Calculadora de Divisão',
      offlineBadge: '100% Offline e Privado'
    },
    home: {
      netBalance: 'Saldo Líquido Total',
      date: 'Hoje',
      addIncome: 'Adicionar Receita',
      addExpense: 'Adicionar Despesa',
      newTransaction: 'Novo Registro',
      thisMonthIncome: 'Receita do Mês',
      thisMonthExpense: 'Despesa do Mês',
      thisMonthNet: 'Líquido do Mês',
      todayIncome: 'Receita de Hoje',
      todayExpense: 'Despesa de Hoje',
      todayNet: 'Líquido de Hoje',
      dailySummaryHeading: 'Resumo de Hoje (Diário)',
      monthlySummaryHeading: 'Resumo do Mês (Mensal)',
      netSavings: 'Superávit Líquido',
      todayCashFlow: 'Fluxo de Caixa de Hoje',
      sixFundsHeading: '6 Potes Financeiros',
      sixFundsSub: 'Saldos divididos automaticamente por regras de disciplina financeira',
      allocationRule: 'Regra de Divisão',
      recentTransactions: 'Transações Recentes',
      viewAllLedger: 'Ver Livro Completo →',
      noEntriesYet: 'Nenhuma Transação Ainda',
      noEntriesSub: 'Comece registrando suas receitas ou despesas diárias.',
      startByAdding: 'Registrar Primeiro Lançamento',
      goalsSummary: 'Metas Financeiras Ativas',
      goalsProgress: 'Progresso Geral das Metas',
      viewGoals: 'Gerenciar Metas →',
      healthScore: 'Pontuação de Saúde Financeira',
      calculator: 'Simulador dos 6 Fundos',
      calculatorSub: 'Teste qualquer valor e veja a divisão ao vivo nos potes.',
      openSimulator: 'Abrir Calculadora'
    },
    add: {
      titleIncome: 'Registrar Entrada de Receita',
      titleExpense: 'Registrar Entrada de Despesa',
      amountLabel: 'Valor (R$/$)',
      amountPlaceholder: '0.00',
      sourceLabel: 'Fonte da Receita',
      categoryLabel: 'Categoria da Despesa',
      dateLabel: 'Data da Transação',
      paymentModeLabel: 'Forma de Pagamento',
      paymentCash: 'Dinheiro',
      paymentUpi: 'PIX / Transferência Online',
      paymentBank: 'Transferência Bancária',
      paymentCard: 'Cartão Débito/Crédito',
      paymentCheque: 'Cheque',
      paymentWallet: 'Carteira Digital',
      paymentOther: 'Outro Método',
      fundDeductLabel: 'Deduzir do Pote de Fundo',
      notesLabel: 'Notas / Descrição (Opcional)',
      notesPlaceholder: 'Adicione referência, número de nota fiscal...',
      clientLabel: 'Nome do Cliente / Referência (Opcional)',
      clientPlaceholder: 'ex. Empresa, Cliente, Fornecedor',
      incomeSplitsPreview: 'Divisão Automática dos 6 Fundos:',
      saveIncome: 'Salvar Receita e Dividir',
      saveExpense: 'Salvar Despesa',
      updateEntry: 'Atualizar Entrada',
      cancel: 'Cancelar',
      addCustomCategory: '+ Adicionar Categoria',
      addCustomSource: '+ Adicionar Fonte'
    },
    goals: {
      heading: 'Metas Financeiras e Marcos',
      sub: 'Defina valores alvo, conecte aos potes de poupança e acompanhe o progresso.',
      newGoalBtn: 'Criar Nova Meta',
      activeGoals: 'Em Andamento',
      completedGoals: 'Alcançadas e Concluídas',
      target: 'Valor Alvo',
      saved: 'Valor Poupado',
      remaining: 'Faltante',
      depositBtn: 'Depositar Fundos',
      editBtn: 'Editar',
      deleteBtn: 'Excluir',
      markDone: 'Marcar como Concluída',
      completedBadge: 'Meta Concluída',
      noGoalsTitle: 'Nenhuma meta criada ainda',
      noGoalsSub: 'Defina marcos como Reserva de Emergência, Equipamento ou Investimento.',
      createFirstGoal: 'Criar Primeira Meta'
    },
    history: {
      heading: 'Livro-Razão de Transações',
      sub: 'Histórico de auditoria completo de todas as receitas e despesas.',
      searchPlaceholder: 'Filtrar por palavra-chave, nota, cliente, categoria...',
      all: 'Todos os Registros',
      incomeOnly: 'Apenas Receitas',
      expenseOnly: 'Apenas Despesas',
      filterAll: 'Todos os Registros',
      filterIncome: 'Apenas Receitas',
      filterExpense: 'Apenas Despesas',
      filterFund: 'Todos os Fundos',
      filterMode: 'Todas as Formas de Pagamento',
      exportCsv: 'Exportar CSV / Excel',
      printPdf: 'Imprimir Extrato',
      totalRecords: 'Total de Registros',
      noTransactions: 'Nenhuma transação encontrada',
      noTransactionsFound: 'Nenhum registro correspondente',
      noTransactionsSub: 'Tente alterar os termos de busca ou redefinir os filtros.',
      clearFilters: 'Limpar Filtros',
      deleteConfirmTitle: 'Excluir Transação?',
      deleteConfirmDesc: 'Isso removerá este registro permanentemente e recalculará os saldos.'
    },
    reports: {
      heading: 'Relatórios Financeiros e Análises',
      sub: 'Insights visuais, proporção de receitas vs despesas e crescimento dos fundos.',
      exportCsv: 'Exportar CSV / Excel',
      printStatement: 'Imprimir Relatório',
      monthSelector: 'Selecionar Mês',
      incomeVsExpense: 'Comparação de Fluxo Mensal',
      savingsRate: 'Taxa de Poupança e Disciplina',
      fundDistribution: 'Distribuição dos 6 Fundos',
      topExpenseCategories: 'Maiores Categorias de Gastos',
      financialHealthAnalysis: 'Diagnóstico de Saúde Financeira',
      emergencyRunway: 'Reserva de Emergência',
      runwayMonths: 'Meses de cobertura disponíveis',
      healthRecommendations: 'Recomendações Inteligentes'
    },
    simulator: {
      title: 'Simulador de Divisão dos 6 Fundos',
      subtitle: 'Simule qualquer receita com divisão matemática instantânea.',
      enterIncome: 'Digite o Valor da Receita',
      sliderLabel: 'Valores Rápidos',
      resetDefaults: 'Restaurar % Padrão',
      recordEntryBtn: 'Salvar como Receita Real',
      breakdownHeading: 'Distribuição Calculada dos 6 Fundos'
    },
    calculator: {
      title: 'Calculadora de Divisão de Receitas',
      subtitle: 'Simule receitas e veja o rateio automático nos potes.',
      enterAmount: 'Digite o Valor da Receita',
      presets: 'Valores Rápidos',
      calculatedBreakdown: 'Distribuição Calculada',
      applyToIncome: 'Aplicar a Novo Lançamento'
    },
    settings: {
      title: 'Configurações e Personalização',
      subtitle: 'Tema, Idioma, Categorias Próprias, Regras dos 6 Fundos, Backups e Privacidade',
      tabPreferences: 'Preferências',
      tabCustomOptions: 'Opções Personalizadas',
      tabRules: 'Regras dos 6 Fundos',
      tabBackup: 'Backup de Dados',
      tabPrivacy: 'Privacidade e Segurança',
      tabLegal: 'Entidade e Termos',
      languageHeading: 'Idioma do Aplicativo',
      themeHeading: 'Tema de Cores',
      privacyMaskHeading: 'Modo de Privacidade',
      privacyMaskDesc: 'Oculte valores numéricos na tela em locais públicos.',
      customPercentagesHeading: 'Personalizador de Porcentagens dos 6 Fundos',
      customPercentagesDesc: 'Ajuste a regra de divisão automática. O total deve somar exatamente 100%.',
      totalMustBe100: 'A alocação total deve ser exatamente 100%',
      saveRuleBtn: 'Salvar Nova Regra',
      resetRuleBtn: 'Restaurar Regras Recomendadas',
      backupHeading: 'Backup Local e Restauração',
      backupDesc: 'Seus dados ficam 100% seguros no seu navegador. Baixe backups regularmente.',
      exportJsonBtn: 'Exportar Backup JSON',
      importJsonBtn: 'Restaurar de Arquivo JSON',
      exportCsvBtn: 'Exportar Livro (CSV / Excel)',
      dangerZone: 'Zona de Redefinição',
      resetAllDataBtn: 'Apagar e Redefinir Todos os Dados'
    },
    funds: {
      personal: {
        name: 'Pessoal (30%)',
        desc: 'Gastos diários pessoais, lazer, bem-estar e estilo de vida'
      },
      family: {
        name: 'Família e Casa (35%)',
        desc: 'Aluguel, compras, apoio familiar e contas da casa'
      },
      buffer: {
        name: 'Reserva Tampão (5%)',
        desc: 'Colchão financeiro rápido para oscilações inesperadas'
      },
      emergency: {
        name: 'Fundo de Emergência (11.25%)',
        desc: 'Saúde, consertos urgentes e reserva de emergência'
      },
      saving: {
        name: 'Poupança Líquida (7.5%)',
        desc: 'Poupança em dinheiro de liquidez rápida e metas curtas'
      },
      investment: {
        name: 'Investimento e Crescimento (11.25%)',
        desc: 'Patrimônio de longo prazo, ativos e independência financeira'
      }
    }
  },
  bn: {
    appName: 'ডেইলি খাতা: প্রো',
    appSubtitle: 'দৈনিক আর্থিক খতিয়ান এবং ৬-তহবিল স্মার্ট ক্যাপিটাল ইঞ্জিন',
    nav: {
      home: 'খাতা',
      add: 'যোগ করুন +',
      tracker: 'কাজ ও জীবন',
      goals: 'লক্ষ্য',
      history: 'খতিয়ান',
      reports: 'রিপোর্ট'
    },
    header: {
      searchPlaceholder: 'লেনদেন, নোট, বিভাগ, পরিমাণ খুঁজুন...',
      manual: 'ম্যানুয়াল',
      settings: 'সেটিংস',
      theme: 'থিম',
      language: 'ভাষা',
      privacyMask: 'টাকা লুকান',
      simulator: 'ভাগ ক্যালকুলেটর',
      offlineBadge: '১০০% অফলাইন ও নিরাপদ'
    },
    home: {
      netBalance: 'মোট নিট ব্যালেন্স',
      date: 'আজকের তারিখ',
      addIncome: '+ আয় যোগ করুন',
      addExpense: '+ ব্যয় লিখুন',
      newTransaction: 'নতুন লেনদেন',
      thisMonthIncome: 'চলতি মাসের আয়',
      thisMonthExpense: 'চলতি মাসের ব্যয়',
      thisMonthNet: 'মাসের নিট সঞ্চয়',
      todayIncome: 'আজকের আয়',
      todayExpense: 'আজকের ব্যয়',
      todayNet: 'আজকের নিট সঞ্চয়',
      dailySummaryHeading: 'আজকের সারসংক্ষেপ (দৈনিক)',
      monthlySummaryHeading: 'মাসের সারসংক্ষেপ (মাসিক)',
      netSavings: 'নিট সঞ্চয় (উদ্বৃত্ত)',
      todayCashFlow: 'আজকের লেনদেন প্রবাহ',
      sixFundsHeading: '৬-তহবিল ফান্ড পট',
      sixFundsSub: 'নিয়মমাফিক স্বয়ংক্রিয়ভাবে ভাগ করা তহবিলের ব্যালেন্স',
      allocationRule: 'বন্টন নিয়ম',
      recentTransactions: 'সাম্প্রতিক লেনদেন',
      viewAllLedger: 'সম্পূর্ণ খাতা দেখুন →',
      noEntriesYet: 'এখনও কোনো লেনদেন নেই',
      noEntriesSub: 'স্বয়ংক্রিয় ৬-তহবিল ভাগ সক্রিয় করতে আয় বা ব্যয় যোগ করুন।',
      startByAdding: 'প্রথম হিসাব যোগ করুন',
      goalsSummary: 'সক্রিয় আর্থিক লক্ষ্য',
      goalsProgress: 'মোট লক্ষ্য অগ্রগতি',
      viewGoals: 'লক্ষ্য পরিচালনা →',
      healthScore: 'আর্থিক স্বাস্থ্য স্কোর',
      calculator: '৬-তহবিল ভাগ সিমুলেটর',
      calculatorSub: 'যেকোনো আয়ের পরিমাণ পরীক্ষা করে লাইভ তহবিল বন্টন দেখুন।',
      openSimulator: 'ক্যালকুলেটর খুলুন'
    },
    add: {
      titleIncome: 'নতুন আয় যোগ করুন',
      titleExpense: 'নতুন খরচ লিখুন',
      get amountLabel() { return `পরিমাণ (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
      amountPlaceholder: '0.00',
      sourceLabel: 'আয়ের উৎস',
      categoryLabel: 'ব্যয়ের বিভাগ',
      dateLabel: 'লেনদেনের তারিখ',
      paymentModeLabel: 'পেমেন্ট মাধ্যম',
      paymentCash: 'নগদ (Cash)',
      paymentUpi: 'অনলাইন / বিকাশ / UPI',
      paymentBank: 'ব্যাংক ট্রান্সফার',
      paymentCard: 'কার্ড',
      paymentCheque: 'চেক',
      paymentWallet: 'ডিজিটাল ওয়ালেট',
      paymentOther: 'অন্যান্য মাধ্যম',
      fundDeductLabel: 'তহবিল থেকে বাদ দিন',
      notesLabel: 'নোট / বিবরণ (ঐচ্ছিক)',
      notesPlaceholder: 'রেফারেন্স বা মেমো লিখুন...',
      clientLabel: 'ক্লায়েন্ট বা গ্রাহকের নাম (ঐচ্ছিক)',
      clientPlaceholder: 'যেমন: কোম্পানি, গ্রাহক, বিক্রেতা',
      incomeSplitsPreview: 'স্বয়ংক্রিয় ৬-তহবিল বন্টন চিত্র:',
      saveIncome: 'আয় সংরক্ষণ ও বন্টন',
      saveExpense: 'ব্যয় সংরক্ষণ করুন',
      updateEntry: 'হিসাব আপডেট করুন',
      cancel: 'বাতিল',
      addCustomCategory: '+ নতুন বিভাগ যোগ করুন',
      addCustomSource: '+ নতুন উৎস যোগ করুন'
    },
    goals: {
      heading: 'আর্থিক লক্ষ্য ও মাইলফলক',
      sub: 'লক্ষ্য নির্ধারণ করুন, সঞ্চয় তহবিলের সাথে সংযুক্ত করুন এবং অগ্রগতি ট্র্যাক করুন।',
      newGoalBtn: 'নতুন লক্ষ্য তৈরি করুন',
      activeGoals: 'চলমান লক্ষ্য',
      completedGoals: 'অর্জিত লক্ষ্য',
      target: 'লক্ষ্যমাত্রা',
      saved: 'সঞ্চিত পরিমাণ',
      remaining: 'বাকি প্রয়োজন',
      depositBtn: 'টাকা জমা করুন',
      editBtn: 'সম্পাদনা',
      deleteBtn: 'মুছে ফেলুন',
      markDone: 'সম্পন্ন চিহ্নিত করুন',
      completedBadge: 'লক্ষ্য অর্জিত হয়েছে',
      noGoalsTitle: 'এখনও কোনো লক্ষ্য তৈরি করা হয়নি',
      noGoalsSub: 'জরুরি তহবিল, সরঞ্জাম বা বিনিয়োগের মতো মাইলফলক নির্ধারণ করুন।',
      createFirstGoal: 'প্রথম লক্ষ্য তৈরি করুন'
    },
    history: {
      heading: 'লেনদেন খতিয়ান ও স্টেটমেন্ট',
      sub: 'সকল আয় ও ব্যয়ের সম্পূর্ণ বিস্তারিত খতিয়ান রেকর্ড।',
      searchPlaceholder: 'কীওয়ার্ড, নোট, ক্লায়েন্ট বা বিভাগ অনুসন্ধান করুন...',
      all: 'সকল রেকর্ড',
      incomeOnly: 'শুধু আয়',
      expenseOnly: 'শুধু ব্যয়',
      filterAll: 'সকল রেকর্ড',
      filterIncome: 'শুধু আয়',
      filterExpense: 'শুধু ব্যয়',
      filterFund: 'সকল তহবিল',
      filterMode: 'সকল পেমেন্ট মাধ্যম',
      exportCsv: 'CSV / Excel এক্সপোর্ট',
      printPdf: 'স্টেটমেন্ট প্রিন্ট',
      totalRecords: 'মোট রেকর্ড',
      noTransactions: 'কোনো লেনদেন পাওয়া যায়নি',
      noTransactionsFound: 'কোনো মেলানো রেকর্ড নেই',
      noTransactionsSub: 'অনুসন্ধান কীওয়ার্ড পরিবর্তন করুন বা ফিল্টার রিসেট করুন।',
      clearFilters: 'ফিল্টার মুছুন',
      deleteConfirmTitle: 'লেনদেন মুছে ফেলবেন?',
      deleteConfirmDesc: 'এটি স্থায়ীভাবে মুছে যাবে এবং ব্যালেন্স পুনরায় হিসাব করা হবে।'
    },
    reports: {
      heading: 'আর্থিক রিপোর্ট ও বিশ্লেষণ',
      sub: 'আয় বনাম ব্যয় অনুপাত, সঞ্চয় হার এবং তহবিল বৃদ্ধির গ্রাফ।',
      exportCsv: 'CSV / Excel এক্সপোর্ট',
      printStatement: 'রিপোর্ট প্রিন্ট করুন',
      monthSelector: 'মাস নির্বাচন করুন',
      incomeVsExpense: 'মাসিক ক্যাশ ফ্লো তুলনা',
      savingsRate: 'সঞ্চয় ও শৃঙ্খলার হার',
      fundDistribution: '৬-তহবিলের ব্যালেন্স বণ্টন',
      topExpenseCategories: 'সর্বোচ্চ ব্যয়ের বিভাগ',
      financialHealthAnalysis: 'আর্থিক স্বাস্থ্য ডায়াগনস্টিকস',
      emergencyRunway: 'জরুরি তহবিল সুরক্ষা',
      runwayMonths: 'মাসের ব্যয় সুরক্ষার স্থায়িত্ব',
      healthRecommendations: 'স্মার্ট আর্থিক পরামর্শ'
    },
    simulator: {
      title: '৬-তহবিল ভাগ সিমুলেটর ও ক্যালকুলেটর',
      subtitle: 'যেকোনো আয়ের লাইভ ৬-তহবিল গাণিতিক বিভাজন দেখুন।',
      enterIncome: 'আয়ের পরিমাণ লিখুন',
      sliderLabel: 'দ্রুত প্রিসেট',
      resetDefaults: 'ডিফল্ট % রিসেট করুন',
      recordEntryBtn: 'প্রকৃত আয় হিসাবে যুক্ত করুন',
      breakdownHeading: 'হিসাবকৃত ৬-তহবিল বন্টন'
    },
    calculator: {
      title: '৬-তহবিল আয় বন্টন ক্যালকুলেটর',
      subtitle: 'আয়ের স্বয়ংক্রিয় বিভাজন পরীক্ষা করুন।',
      enterAmount: 'আয়ের পরিমাণ লিখুন',
      presets: 'দ্রুত পরিমাণ',
      calculatedBreakdown: 'হিসাবকৃত বন্টন',
      applyToIncome: 'নতুন আয়ে প্রয়োগ করুন'
    },
    settings: {
      title: 'সেটিংস ও কাস্টমাইজেশন',
      subtitle: 'থিম, ভাষা, কাস্টম অপশন, ৬-তহবিল নিয়ম, ব্যাকআপ এবং গোপনীয়তা',
      tabPreferences: 'পছন্দসমূহ',
      tabCustomOptions: 'কাস্টম অপশন',
      tabRules: '৬-তহবিল নিয়ম',
      tabBackup: 'ডেটা ব্যাকআপ',
      tabPrivacy: 'গোপনীয়তা ও নিরাপত্তা',
      tabLegal: 'শর্তাবলী ও সত্তা',
      languageHeading: 'অ্যাপের ভাষা',
      themeHeading: 'রঙিন থিম',
      privacyMaskHeading: 'প্রাইভেসি মাস্কিং মোড',
      privacyMaskDesc: 'জনসমক্ষে স্ক্রিনে টাকার পরিমাণ লুকিয়ে রাখুন।',
      customPercentagesHeading: '৬-তহবিল শতকরা হার কাস্টমাইজার',
      customPercentagesDesc: 'আয়ের শতকরা হারের নিয়ম সমন্বয় করুন। মোট ১০০% হতে হবে।',
      totalMustBe100: 'মোট বন্টন অবশ্যই ঠিক ১০০% হতে হবে',
      saveRuleBtn: 'নতুন নিয়ম সংরক্ষণ করুন',
      resetRuleBtn: 'সুপারিশকৃত নিয়মে রিসেট করুন',
      backupHeading: 'লোকাল স্টোরেজ ব্যাকআপ ও রিস্টোর',
      backupDesc: 'আপনার ডেটা ব্রাউজারে ১০০% সুরক্ষিত। নিয়মিত ব্যাকআপ ফাইল ডাউনলোড করুন।',
      exportJsonBtn: 'JSON ব্যাকআপ ডাউনলোড',
      importJsonBtn: 'JSON ফাইল থেকে রিস্টোর',
      exportCsvBtn: 'খতিয়ান এক্সপোর্ট (CSV / Excel)',
      dangerZone: 'রিসেট জোন',
      resetAllDataBtn: 'সকল খাতা ডেটা মুছুন ও রিসেট করুন'
    },
    funds: {
      personal: {
        name: 'ব্যক্তিগত (৩০%)',
        desc: 'ব্যক্তিগত দৈনন্দিন খরচ, খাওয়া-দাওয়া ও লাইফস্টাইল'
      },
      family: {
        name: 'পরিবার ও ঘর (৩৫%)',
        desc: 'বাড়ি ভাড়া, বাজার, পরিবার ও বাড়ির ইউটিলিটি বিল'
      },
      buffer: {
        name: 'বাফার রিজার্ভ (৫%)',
        desc: 'অনাকাঙ্ক্ষিত ওঠানামার জন্য দ্রুত অস্থায়ী ব্যাকআপ'
      },
      emergency: {
        name: 'জরুরি তহবিল (১১.২৫%)',
        desc: 'চিকিৎসা, জরুরি মেরামত ও অপ্রত্যাশিত সংকটকালীন তহবিল'
      },
      saving: {
        name: 'তরল সঞ্চয় (৭.৫%)',
        desc: 'সহজে রূপান্তরযোগ্য নগদ সঞ্চয় ও স্বল্পমেয়াদী লক্ষ্য'
      },
      investment: {
        name: 'বিনিয়োগ ও প্রবৃদ্ধি (১১.২৫%)',
        desc: 'দীর্ঘমেয়াদী সম্পদ, প্রবৃদ্ধি ও ভবিষ্যৎ আর্থিক স্বাধীনতা'
      }
    }
  },
  ur: {
    appName: 'ڈیلی کھاتہ: پرو',
    appSubtitle: 'روزمرہ مالی کھاتہ اور ۶ فنڈز کیپیٹل انجن',
    nav: {
      home: 'کھاتہ',
      add: 'شامل کریں +',
      tracker: 'کام اور زندگی',
      goals: 'اہداف',
      history: 'لیجر',
      reports: 'رپورٹس'
    },
    header: {
      searchPlaceholder: 'لین دین، تفصیل، کیٹیگری، رقم تلاش کریں...',
      manual: 'گائیڈ بک',
      settings: 'سیٹنگز',
      theme: 'تھیم',
      language: 'زبان',
      privacyMask: 'رقم چھپائیں',
      simulator: 'تقسیم کیلکولیٹر',
      offlineBadge: '۱۰۰٪ آف لائن اور پرائیویٹ'
    },
    home: {
      netBalance: 'کل خالص بیلنس',
      date: 'آج',
      addIncome: 'آمدنی شامل کریں',
      addExpense: 'خرچ درج کریں',
      newTransaction: 'نیا اندراج',
      thisMonthIncome: 'اس ماہ کی آمدنی',
      thisMonthExpense: 'اس ماہ کا خرچ',
      thisMonthNet: 'ماہانہ خالص بچت',
      todayIncome: 'آج کی آمدنی',
      todayExpense: 'آج کا خرچ',
      todayNet: 'آج کی خالص بچت',
      dailySummaryHeading: 'آج کا حساب (روزانہ)',
      monthlySummaryHeading: 'اس ماہ کا حساب (ماہانہ)',
      netSavings: 'خالص بچت (فاضل)',
      todayCashFlow: 'آج کا کیش فلو',
      sixFundsHeading: '۶ فنڈز بیلنس',
      sixFundsSub: 'مالیاتی نظم و ضبط کے تحت خودکار تقسیم شدہ فنڈز',
      allocationRule: 'تقسیم کا اصول',
      recentTransactions: 'حالیہ لین دین',
      viewAllLedger: 'مکمل کھاتہ دیکھیں ←',
      noEntriesYet: 'کوئی لین دین درج نہیں',
      noEntriesSub: 'فنڈز کی خودکار تقسیم فعال کرنے کے لیے آمدنی یا خرچ درج کریں۔',
      startByAdding: 'پہلا اندراج درج کریں',
      goalsSummary: 'فعال مالی اہداف',
      goalsProgress: 'کل ہدف پیش رفت',
      viewGoals: 'اہداف دیکھیں ←',
      healthScore: 'مالی صحت کا اسکور',
      calculator: '۶ فنڈ تقسیم سمولیٹر',
      calculatorSub: 'آمدنی کی رقم لکھ کر لائیو فنڈ تقسیم دیکھیں۔',
      openSimulator: 'کیلکولیٹر کھولیں'
    },
    add: {
      titleIncome: 'نئی آمدنی درج کریں',
      titleExpense: 'نیا خرچ درج کریں',
      amountLabel: 'رقم',
      amountPlaceholder: '0.00',
      sourceLabel: 'آمدنی کا ذریعہ',
      categoryLabel: 'خرچ کی کیٹیگری',
      dateLabel: 'لین دین کی تاریخ',
      paymentModeLabel: 'طریقہ ادائیگی',
      paymentCash: 'نقد (Cash)',
      paymentUpi: 'آن لائن / ڈیجیٹل',
      paymentBank: 'بینک ٹرانسفر',
      paymentCard: 'بینک کارڈ',
      paymentCheque: 'چیک',
      paymentWallet: 'ڈیجیٹل والٹ',
      paymentOther: 'دیگر طریقہ',
      fundDeductLabel: 'فنڈ سے منہا کریں',
      notesLabel: 'نوٹ / تفصیل (اختیاری)',
      notesPlaceholder: 'انوائس، تفصیل یا حوالہ شامل کریں...',
      clientLabel: 'کسٹمر یا پارٹی کا نام (اختیاری)',
      clientPlaceholder: 'مثلاً: کسٹمر، کمپنی یا وینڈر',
      incomeSplitsPreview: 'خودکار ۶ فنڈز تقسیم کی تفصیل:',
      saveIncome: 'آمدنی محفوظ اور تقسیم کریں',
      saveExpense: 'خرچ محفوظ کریں',
      updateEntry: 'اندراج اپ ڈیٹ کریں',
      cancel: 'منسوخ',
      addCustomCategory: '+ نئی کیٹیگری شامل کریں',
      addCustomSource: '+ نیا ذریعہ شامل کریں'
    },
    goals: {
      heading: 'مالی اہداف اور سنگ میل',
      sub: 'اہداف طے کریں، بچت فنڈز سے منسلک کریں اور پیش رفت دیکھیں۔',
      newGoalBtn: 'نیا ہدف بنائیں',
      activeGoals: 'جاری اہداف',
      completedGoals: 'مکمل شدہ اہداف',
      target: 'ہدف کی رقم',
      saved: 'جمع شدہ رقم',
      remaining: 'باقی رقم',
      depositBtn: 'رقم جمع کریں',
      editBtn: 'ترمیم',
      deleteBtn: 'حذف کریں',
      markDone: 'مکمل نشان زد کریں',
      completedBadge: 'ہدف حاصل کر لیا گیا',
      noGoalsTitle: 'ابھی کوئی ہدف نہیں بنایا گیا',
      noGoalsSub: 'ہنگامی فنڈ، سامان یا سرمایہ کاری جیسے اہداف طے کریں۔',
      createFirstGoal: 'پہلا ہدف بنائیں'
    },
    history: {
      heading: 'لین دین کا لیجر اور ریکارڈ',
      sub: 'تمام آمدنی اور اخراجات کا مکمل تفصیلی آڈٹ ریکارڈ۔',
      searchPlaceholder: 'الفاظ، کسٹمر، کیٹیگری یا رقم تلاش کریں...',
      all: 'تمام ریکارڈز',
      incomeOnly: 'صرف آمدنی',
      expenseOnly: 'صرف اخراجات',
      filterAll: 'تمام ریکارڈز',
      filterIncome: 'صرف آمدنی',
      filterExpense: 'صرف اخراجات',
      filterFund: 'تمام فنڈز',
      filterMode: 'تمام ادائیگی کے طریقے',
      exportCsv: 'ایکسپورٹ CSV / Excel',
      printPdf: 'اسٹیٹمنٹ پرنٹ کریں',
      totalRecords: 'کل ریکارڈز',
      noTransactions: 'کوئی لین دین نہیں ملا',
      noTransactionsFound: 'کوئی مماثل ریکارڈ موجود نہیں',
      noTransactionsSub: 'تلاش کے الفاظ تبدیل کریں یا فلٹرز دوبارہ ترتیب دیں۔',
      clearFilters: 'فلٹرز صاف کریں',
      deleteConfirmTitle: 'کیا یہ اندراج حذف کرنا ہے؟',
      deleteConfirmDesc: 'یہ مستقل طور پر حذف ہو جائے گا اور فنڈ بیلنس دوبارہ ترتیب دیا جائے گا۔'
    },
    reports: {
      heading: 'مالیاتی رپورٹس اور تجزیات',
      sub: 'آمدنی بمقابلہ اخراجات کا تناسب، بچت کی شرح اور فنڈ گراف۔',
      exportCsv: 'ایکسپورٹ CSV / Excel',
      printStatement: 'رپورٹ پرنٹ کریں',
      monthSelector: 'مہینہ منتخب کریں',
      incomeVsExpense: 'ماہانہ کیش فلو موازنہ',
      savingsRate: 'بچت اور ڈسپلن کی شرح',
      fundDistribution: '۶ فنڈز بیلنس تقسیم',
      topExpenseCategories: 'سب سے زیادہ اخراجات کی کیٹیگریز',
      financialHealthAnalysis: 'مالیاتی صحت کا تجزیہ',
      emergencyRunway: 'ہنگامی فنڈ کوریج',
      runwayMonths: 'کتنے ماہ کے اخراجات محفوظ ہیں',
      healthRecommendations: 'سمارٹ تجاویز'
    },
    simulator: {
      title: '۶ فنڈز تقسیم سمولیٹر و کیلکولیٹر',
      subtitle: 'کسی بھی آمدنی کی لائیو ۶ فنڈز تقسیم دیکھیں۔',
      enterIncome: 'آمدنی کی رقم درج کریں',
      sliderLabel: 'فوری رقم',
      resetDefaults: 'ڈیفالٹ فیصد بحال کریں',
      recordEntryBtn: 'حقیقی آمدنی کے طور پر درج کریں',
      breakdownHeading: 'حساب شدہ ۶ فنڈز تقسیم'
    },
    calculator: {
      title: '۶ فنڈز آمدنی تقسیم کیلکولیٹر',
      subtitle: 'آمدنی کی خودکار فنڈ تقسیم جانچیں۔',
      enterAmount: 'آمدنی کی رقم درج کریں',
      presets: 'فوری رقم',
      calculatedBreakdown: 'حساب شدہ تقسیم',
      applyToIncome: 'نئی آمدنی پر لاگو کریں'
    },
    settings: {
      title: 'سیٹنگز اور حسب ضرورت',
      subtitle: 'تھیم، زبان، کیٹیگریز، ۶ فنڈز کے قواعد، بیک اپ اور پرائیویسی',
      tabPreferences: 'ترجیحات',
      tabCustomOptions: 'اپنی مرضی کے اختیارات',
      tabRules: '۶ فنڈز کے اصول',
      tabBackup: 'ڈیٹا بیک اپ',
      tabPrivacy: 'پرائیویسی اور سیکیورٹی',
      tabLegal: 'قانونی شرائط',
      languageHeading: 'ایپ کی زبان',
      themeHeading: 'رنگین تھیم',
      privacyMaskHeading: 'پرائیویسی ماسکنگ موڈ',
      privacyMaskDesc: 'عوامی جگہوں پر اسکرین پر رقوم کو چھپائیں۔',
      customPercentagesHeading: '۶ فنڈز فیصد تقسیم کسٹمائزر',
      customPercentagesDesc: 'آمدنی کی تقسیم کے اصول تبدیل کریں۔ کل ۱۰۰٪ ہونا ضروری ہے۔',
      totalMustBe100: 'کل تقسیم کا بالکل ۱۰۰٪ ہونا لازمی ہے',
      saveRuleBtn: 'نئے اصول محفوظ کریں',
      resetRuleBtn: 'تجویز کردہ اصولوں پر ری سیٹ کریں',
      backupHeading: 'لوکل بیک اپ اور بحالی',
      backupDesc: 'آپ کا ڈیٹا ۱۰۰٪ آپ کے براؤزر میں محفوظ ہے۔ باقاعدگی سے بیک اپ لیں۔',
      exportJsonBtn: 'JSON بیک اپ ڈاؤن لوڈ',
      importJsonBtn: 'JSON فائل سے بحال کریں',
      exportCsvBtn: 'لیجر ایکسپورٹ (CSV / Excel)',
      dangerZone: 'ڈیٹا ری سیٹ زون',
      resetAllDataBtn: 'تمام کھاتہ ڈیٹا صاف اور ری سیٹ کریں'
    },
    funds: {
      personal: {
        name: 'ذاتی فنڈ (۳۰٪)',
        desc: 'ذاتی روزمرہ اخراجات، تفریح اور طرز زندگی'
      },
      family: {
        name: 'خاندان اور گھر (۳۵٪)',
        desc: 'گھر کا کرایہ، راشن، خاندانی کفالت اور یوٹیلیٹی بل'
      },
      buffer: {
        name: 'بفر ریزرو (۵٪)',
        desc: 'غیر متوقع فوری ضرورتوں کے لیے حفاظتی تکیہ'
      },
      emergency: {
        name: 'ہنگامی فنڈ (۱۱.۲۵٪)',
        desc: 'علاج معالجہ، فوری مرمت اور ناگہانی صورتحال کے لیے'
      },
      saving: {
        name: 'نقد بچت (۷.۵٪)',
        desc: 'فوری دستیاب نقد بچت اور قلیل مدتی اہداف'
      },
      investment: {
        name: 'سرمایہ کاری و ترقی (۱۱.۲۵٪)',
        desc: 'طویل مدتی دولت، اثاثے اور مستقبل کی مالی خودمختاری'
      }
    }
  },
  id: {
    appName: 'Daily Khata: Pro',
    appSubtitle: 'Buku Kas Keuangan Harian & Mesin Modal 6 Dana',
    nav: {
      home: 'Kas',
      add: 'Tambah +',
      tracker: 'Kerja & Hidup',
      goals: 'Target',
      history: 'Buku Besar',
      reports: 'Laporan'
    },
    header: {
      searchPlaceholder: 'Cari transaksi, catatan, kategori, jumlah...',
      manual: 'Panduan',
      settings: 'Pengaturan',
      theme: 'Tema',
      language: 'Bahasa',
      privacyMask: 'Sembunyikan Angka',
      simulator: 'Kalkulator Pembagian',
      offlineBadge: '100% Offline & Pribadi'
    },
    home: {
      netBalance: 'Total Saldo Bersih',
      date: 'Hari Ini',
      addIncome: 'Tambah Pemasukan',
      addExpense: 'Tambah Pengeluaran',
      newTransaction: 'Catatan Baru',
      thisMonthIncome: 'Pemasukan Bulan Ini',
      thisMonthExpense: 'Pengeluaran Bulan Ini',
      thisMonthNet: 'Bersih Bulan Ini',
      todayIncome: 'Pemasukan Hari Ini',
      todayExpense: 'Pengeluaran Hari Ini',
      todayNet: 'Bersih Hari Ini',
      dailySummaryHeading: 'Ringkasan Hari Ini (Harian)',
      monthlySummaryHeading: 'Ringkasan Bulan Ini (Bulanan)',
      netSavings: 'Surplus Bersih',
      todayCashFlow: 'Arus Kas Hari Ini',
      sixFundsHeading: '6 Pos Dana Keuangan',
      sixFundsSub: 'Saldo dibagi otomatis sesuai aturan disiplin keuangan',
      allocationRule: 'Aturan Pembagian',
      recentTransactions: 'Transaksi Terkini',
      viewAllLedger: 'Lihat Semua Buku Kas →',
      noEntriesYet: 'Belum Ada Transaksi',
      noEntriesSub: 'Mulai catat pemasukan atau pengeluaran harian Anda.',
      startByAdding: 'Catat Transaksi Pertama',
      goalsSummary: 'Target Keuangan Aktif',
      goalsProgress: 'Total Kemajuan Target',
      viewGoals: 'Kelola Target →',
      healthScore: 'Skor Kesehatan Keuangan',
      calculator: 'Simulator 6 Dana',
      calculatorSub: 'Uji jumlah pemasukan dan lihat pembagian otomatis langsung ke pos dana.',
      openSimulator: 'Buka Kalkulator'
    },
    add: {
      titleIncome: 'Catat Pemasukan',
      titleExpense: 'Catat Pengeluaran',
      amountLabel: 'Jumlah (Rp)',
      amountPlaceholder: '0.00',
      sourceLabel: 'Sumber Pemasukan',
      categoryLabel: 'Kategori Pengeluaran',
      dateLabel: 'Tanggal Transaksi',
      paymentModeLabel: 'Metode Pembayaran',
      paymentCash: 'Tunai (Cash)',
      paymentUpi: 'Transfer / QRIS / Online',
      paymentBank: 'Transfer Bank',
      paymentCard: 'Kartu Debit/Kredit',
      paymentCheque: 'Cek / Bilyet',
      paymentWallet: 'Dompet Digital',
      paymentOther: 'Metode Lainnya',
      fundDeductLabel: 'Potong Dari Pos Dana',
      notesLabel: 'Catatan / Deskripsi (Opsional)',
      notesPlaceholder: 'Tambahkan referensi, no faktur, atau memo...',
      clientLabel: 'Nama Klien / Referensi (Opsional)',
      clientPlaceholder: 'cth: Perusahaan, Klien, Vendor',
      incomeSplitsPreview: 'Rincian Pembagian Otomatis 6 Dana:',
      saveIncome: 'Simpan Pemasukan & Bagi',
      saveExpense: 'Simpan Pengeluaran',
      updateEntry: 'Perbarui Transaksi',
      cancel: 'Batal',
      addCustomCategory: '+ Tambah Kategori Kustom',
      addCustomSource: '+ Tambah Sumber Kustom'
    },
    goals: {
      heading: 'Target Keuangan & Pencapaian',
      sub: 'Tetapkan target, hubungkan dengan pos tabungan, dan pantau kemajuan.',
      newGoalBtn: 'Buat Target Baru',
      activeGoals: 'Sedang Berjalan',
      completedGoals: 'Tercapai & Selesai',
      target: 'Jumlah Target',
      saved: 'Terkumpul',
      remaining: 'Sisa Dibutuhkan',
      depositBtn: 'Setor Dana',
      editBtn: 'Edit',
      deleteBtn: 'Hapus',
      markDone: 'Tandai Selesai',
      completedBadge: 'Target Tercapai',
      noGoalsTitle: 'Belum ada target yang dibuat',
      noGoalsSub: 'Tentukan target seperti Dana Darurat, Peralatan, atau Investasi.',
      createFirstGoal: 'Buat Target Pertama'
    },
    history: {
      heading: 'Buku Besar Transaksi',
      sub: 'Riwayat lengkap pencatatan seluruh pemasukan dan pengeluaran.',
      searchPlaceholder: 'Cari kata kunci, catatan, klien, kategori...',
      all: 'Semua Catatan',
      incomeOnly: 'Pemasukan Saja',
      expenseOnly: 'Pengeluaran Saja',
      filterAll: 'Semua Catatan',
      filterIncome: 'Pemasukan Saja',
      filterExpense: 'Pengeluaran Saja',
      filterFund: 'Semua Dana',
      filterMode: 'Semua Metode',
      exportCsv: 'Ekspor CSV / Excel',
      printPdf: 'Cetak Laporan',
      totalRecords: 'Total Catatan',
      noTransactions: 'Transaksi tidak ditemukan',
      noTransactionsFound: 'Tidak ada catatan yang cocok',
      noTransactionsSub: 'Coba ubah kata kunci pencarian atau reset filter.',
      clearFilters: 'Hapus Filter',
      deleteConfirmTitle: 'Hapus Transaksi?',
      deleteConfirmDesc: 'Tindakan ini akan menghapus transaksi permanen dan menghitung ulang saldo.'
    },
    reports: {
      heading: 'Laporan Keuangan & Analisis',
      sub: 'Wawasan visual, rasio pemasukan vs pengeluaran, dan pertumbuhan dana.',
      exportCsv: 'Ekspor CSV / Excel',
      printStatement: 'Cetak Laporan',
      monthSelector: 'Pilih Bulan',
      incomeVsExpense: 'Perbandingan Arus Kas Bulanan',
      savingsRate: 'Tingkat Tabungan & Disiplin',
      fundDistribution: 'Distribusi Saldo 6 Dana',
      topExpenseCategories: 'Pengeluaran Terbesar',
      financialHealthAnalysis: 'Diagnosa Kesehatan Keuangan',
      emergencyRunway: 'Ketahanan Dana Darurat',
      runwayMonths: 'Bulan cadangan biaya hidup siap',
      healthRecommendations: 'Rekomendasi Cerdas'
    },
    simulator: {
      title: 'Simulator Pembagian 6 Dana',
      subtitle: 'Simulasikan pemasukan apa pun dengan pembagian proporsional instan.',
      enterIncome: 'Masukkan Jumlah Pemasukan',
      sliderLabel: 'Pilihan Cepat',
      resetDefaults: 'Reset ke % Standar',
      recordEntryBtn: 'Simpan Sebagai Pemasukan Nyata',
      breakdownHeading: 'Hasil Pembagian 6 Dana'
    },
    calculator: {
      title: 'Kalkulator Pembagian Pemasukan',
      subtitle: 'Simulasikan pemasukan dan lihat pembagian otomatis ke setiap pos.',
      enterAmount: 'Masukkan Jumlah Pemasukan',
      presets: 'Pilihan Cepat',
      calculatedBreakdown: 'Hasil Pembagian',
      applyToIncome: 'Terapkan ke Pemasukan Baru'
    },
    settings: {
      title: 'Pengaturan & Kustomisasi',
      subtitle: 'Tema, Bahasa, Opsi Kustom, Aturan 6 Dana, Cadangan Data & Privasi',
      tabPreferences: 'Preferensi',
      tabCustomOptions: 'Opsi Kustom',
      tabRules: 'Aturan 6 Dana',
      tabBackup: 'Cadangan & Data',
      tabPrivacy: 'Privasi & Keamanan',
      tabLegal: 'Legal & Ketentuan',
      languageHeading: 'Bahasa Aplikasi',
      themeHeading: 'Tema Warna',
      privacyMaskHeading: 'Mode Privasi',
      privacyMaskDesc: 'Sembunyikan nominal uang di layar saat berada di tempat umum.',
      customPercentagesHeading: 'Kustomisasi Persentase 6 Dana',
      customPercentagesDesc: 'Atur persentase otomatis pemasukan. Total harus tepat 100%.',
      totalMustBe100: 'Total alokasi harus tepat 100%',
      saveRuleBtn: 'Simpan Aturan Baru',
      resetRuleBtn: 'Reset ke Aturan yang Direkomendasikan',
      backupHeading: 'Cadangan Lokal & Pemulihan',
      backupDesc: 'Data Anda 100% aman di browser Anda. Unduh cadangan JSON secara berkala.',
      exportJsonBtn: 'Ekspor Cadangan JSON',
      importJsonBtn: 'Pulihkan dari File JSON',
      exportCsvBtn: 'Ekspor Buku Kas (CSV / Excel)',
      dangerZone: 'Zona Reset',
      resetAllDataBtn: 'Hapus & Reset Semua Data'
    },
    funds: {
      personal: {
        name: 'Pribadi (30%)',
        desc: 'Pengeluaran pribadi harian, makan di luar, hobi & gaya hidup'
      },
      family: {
        name: 'Keluarga & Rumah (35%)',
        desc: 'Sewa rumah, belanja kebutuhan pokok, keluarga & tagihan rumah'
      },
      buffer: {
        name: 'Cadangan Buffer (5%)',
        desc: 'Bantalan darurat sementara untuk fluktuasi tak terduga'
      },
      emergency: {
        name: 'Dana Darurat (11.25%)',
        desc: 'Medis, perbaikan mendesak & cadangan darurat mutlak'
      },
      saving: {
        name: 'Tabungan Likuid (7.5%)',
        desc: 'Tabungan tunai siap pakai & target jangka pendek'
      },
      investment: {
        name: 'Investasi & Pertumbuhan (11.25%)',
        desc: 'Kekayaan jangka panjang, aset & kebebasan finansial masa depan'
      }
    }
  },
  ja: {
    appName: 'Daily Khata: Pro',
    appSubtitle: '毎日の財務台帳＆6ファンド資本エンジン',
    nav: {
      home: 'ホーム',
      add: '追加 +',
      tracker: '仕事と生活',
      goals: '目標',
      history: '総勘定元帳',
      reports: '分析レポート'
    },
    header: {
      searchPlaceholder: '取引、メモ、カテゴリー、金額を検索...',
      manual: 'マニュアル',
      settings: '設定',
      theme: 'テーマ',
      language: '言語',
      privacyMask: '金額を非表示',
      simulator: '自動分割シミュレーター',
      offlineBadge: '100% オフライン＆プライベート'
    },
    home: {
      netBalance: '総純残高',
      date: '今日',
      addIncome: '収入を追加',
      addExpense: '支出を記録',
      newTransaction: '新規取引',
      thisMonthIncome: '今月の収入',
      thisMonthExpense: '今月の支出',
      thisMonthNet: '今月の純利益',
      todayIncome: '今日の収入',
      todayExpense: '今日の支出',
      todayNet: '今日の純利益',
      dailySummaryHeading: '今日のまとめ（日次）',
      monthlySummaryHeading: '今月のまとめ（月次）',
      netSavings: '純剰余金',
      todayCashFlow: '今日のキャッシュフロー',
      sixFundsHeading: '6つの資金ポット',
      sixFundsSub: '規律ある財務ルールに基づき自動分割された残高',
      allocationRule: '配分ルール',
      recentTransactions: '最近の取引履歴',
      viewAllLedger: '台帳全体を表示 →',
      noEntriesYet: '取引はまだありません',
      noEntriesSub: '日々の収入や支出を記録して自動分割を開始しましょう。',
      startByAdding: '最初の取引を記録',
      goalsSummary: '進行中の財務目標',
      goalsProgress: '目標達成度',
      viewGoals: '目標を管理 →',
      healthScore: '財務健全性スコア',
      calculator: '6ファンド分割シミュレーター',
      calculatorSub: '収入金額を入力して各ポットへの配分をリアルタイムで確認できます。',
      openSimulator: '計算機を開く'
    },
    add: {
      titleIncome: '収入の記録',
      titleExpense: '支出の記録',
      amountLabel: '金額 (¥)',
      amountPlaceholder: '0.00',
      sourceLabel: '収入源',
      categoryLabel: '支出カテゴリー',
      dateLabel: '取引日',
      paymentModeLabel: '支払方法',
      paymentCash: '現金',
      paymentUpi: 'オンライン決済 / 振込',
      paymentBank: '銀行振込',
      paymentCard: 'クレジットカード/デビットカード',
      paymentCheque: '小切手',
      paymentWallet: '電子マネー',
      paymentOther: 'その他',
      fundDeductLabel: '引き落としポット',
      notesLabel: 'メモ / 備考（任意）',
      notesPlaceholder: '請求書番号や詳細メモを追加...',
      clientLabel: '取引先 / 顧客名（任意）',
      clientPlaceholder: '例: 取引先企業、顧客名など',
      incomeSplitsPreview: '自動6ファンド配分内訳:',
      saveIncome: '収入を保存して分割',
      saveExpense: '支出を保存',
      updateEntry: '記録を更新',
      cancel: 'キャンセル',
      addCustomCategory: '+ カスタムカテゴリー追加',
      addCustomSource: '+ カスタム収入源追加'
    },
    goals: {
      heading: '財務目標＆マイルストーン',
      sub: '目標金額を設定し、貯蓄ポットと連携して進捗を追跡します。',
      newGoalBtn: '新規目標を作成',
      activeGoals: '進行中',
      completedGoals: '達成済み',
      target: '目標金額',
      saved: '貯蓄済金額',
      remaining: '残り必要額',
      depositBtn: '資金を入金',
      editBtn: '編集',
      deleteBtn: '削除',
      markDone: '完了にする',
      completedBadge: '目標達成',
      noGoalsTitle: '目標がまだありません',
      noGoalsSub: '緊急準備金、設備投資、資産運用などのマイルストーンを設定しましょう。',
      createFirstGoal: '最初の目標を作成'
    },
    history: {
      heading: '取引台帳＆明細',
      sub: 'すべての収入と支出の完全な監査記録。',
      searchPlaceholder: 'キーワード、メモ、顧客、カテゴリーで絞り込み...',
      all: 'すべての記録',
      incomeOnly: '収入のみ',
      expenseOnly: '支出のみ',
      filterAll: 'すべての記録',
      filterIncome: '収入のみ',
      filterExpense: '支出のみ',
      filterFund: 'すべての資金ポット',
      filterMode: 'すべての支払方法',
      exportCsv: 'CSV / Excel エクスポート',
      printPdf: '明細書を印刷',
      totalRecords: '総記録件数',
      noTransactions: '取引が見つかりません',
      noTransactionsFound: '一致する記録がありません',
      noTransactionsSub: '検索キーワードを変更するかフィルターをリセットしてください。',
      clearFilters: 'フィルターをクリア',
      deleteConfirmTitle: '取引を削除しますか？',
      deleteConfirmDesc: 'この記録は完全に削除され、残高が再計算されます。'
    },
    reports: {
      heading: '財務レポート＆分析',
      sub: '収入対支出比率、貯蓄率、資金成長の視覚的グラフ。',
      exportCsv: 'CSV / Excel 出力',
      printStatement: 'レポートを印刷',
      monthSelector: '対象月を選択',
      incomeVsExpense: '月次キャッシュフロー比較',
      savingsRate: '貯蓄＆規律率',
      fundDistribution: '6ファンド残高分布',
      topExpenseCategories: '支出上位カテゴリー',
      financialHealthAnalysis: '財務健全性診断',
      emergencyRunway: '緊急時ランウェイ',
      runwayMonths: '生活費カバー可能月数',
      healthRecommendations: 'スマートアドバイス'
    },
    simulator: {
      title: '6ファンド分割シミュレーター',
      subtitle: 'あらゆる収入を瞬時に数学的配分でシミュレーション。',
      enterIncome: '収入金額を入力',
      sliderLabel: 'クイック設定',
      resetDefaults: 'デフォルト%に戻す',
      recordEntryBtn: '実際の収入として記録',
      breakdownHeading: '計算された6ファンド配分'
    },
    calculator: {
      title: '収入分割計算機',
      subtitle: '収入を入力して各ポットへの自動配分を確認。',
      enterAmount: '収入金額を入力',
      presets: 'クイック金額',
      calculatedBreakdown: '計算された配分',
      applyToIncome: '新規収入に適用'
    },
    settings: {
      title: '設定＆カスタマイズ',
      subtitle: 'テーマ、言語、カスタム設定、6ファンドルール、バックアップ、プライバシー',
      tabPreferences: '環境設定',
      tabCustomOptions: 'カスタム設定',
      tabRules: '6ファンドルール',
      tabBackup: 'データバックアップ',
      tabPrivacy: 'プライバシーとセキュリティ',
      tabLegal: '法的情報と規約',
      languageHeading: 'アプリの言語',
      themeHeading: 'カラーテーマ',
      privacyMaskHeading: 'プライバシーマスキング',
      privacyMaskDesc: '公共の場所で画面上の金額を非表示にします。',
      customPercentagesHeading: '6ファンド配分割合のカスタマイズ',
      customPercentagesDesc: '収入の自動配分割合を調整します。合計は必ず100%にする必要があります。',
      totalMustBe100: '合計配分は正確に100%である必要があります',
      saveRuleBtn: '新しいルールを保存',
      resetRuleBtn: '推奨ルールにリセット',
      backupHeading: 'ローカルバックアップ＆復元',
      backupDesc: 'データはブラウザ内に100%安全に保存されます。定期的にJSONバックアップを保存してください。',
      exportJsonBtn: 'JSONバックアップを出力',
      importJsonBtn: 'JSONファイルから復元',
      exportCsvBtn: '台帳を出力 (CSV / Excel)',
      dangerZone: 'データリセット',
      resetAllDataBtn: 'すべてのデータを消去してリセット'
    },
    funds: {
      personal: {
        name: '個人費 (30%)',
        desc: '日々の個人支出、外食、趣味、ライフスタイル'
      },
      family: {
        name: '家庭・生活費 (35%)',
        desc: '家賃、食費、家族支援、光熱費・生活維持費'
      },
      buffer: {
        name: 'バッファー予備 (5%)',
        desc: '予期せぬ一時的変動に対応する安全クッション'
      },
      emergency: {
        name: '緊急防衛資金 (11.25%)',
        desc: '医療費、緊急修繕、非常時の防衛資金'
      },
      saving: {
        name: '流動性貯蓄 (7.5%)',
        desc: '引き出しやすい現金貯蓄および短期目標資金'
      },
      investment: {
        name: '投資＆成長資金 (11.25%)',
        desc: '長期的な資産形成、積立投資、将来の自立資金'
      }
    }
  },
  zh: {
    appName: 'Daily Khata: Pro',
    appSubtitle: '通用每日财务账本与六基金资本引擎',
    nav: {
      home: '账本',
      add: '记账 +',
      tracker: '工作与生活',
      goals: '目标',
      history: '流水',
      reports: '统计'
    },
    header: {
      searchPlaceholder: '搜索交易、备注、分类、金额...',
      manual: '使用指南',
      settings: '设置',
      theme: '主题',
      language: '语言',
      privacyMask: '隐藏金额',
      simulator: '分账计算器',
      offlineBadge: '100% 离线与隐私保护'
    },
    home: {
      netBalance: '净资产总额',
      date: '今日',
      addIncome: '记收入',
      addExpense: '记支出',
      newTransaction: '新建记账',
      thisMonthIncome: '本月收入',
      thisMonthExpense: '本月支出',
      thisMonthNet: '本月结余',
      todayIncome: '今日收入',
      todayExpense: '今日支出',
      todayNet: '今日结余',
      dailySummaryHeading: '今日摘要（日度）',
      monthlySummaryHeading: '本月摘要（月度）',
      netSavings: '净储蓄盈余',
      todayCashFlow: '今日资金流向',
      sixFundsHeading: '六大资金池',
      sixFundsSub: '根据严谨的财务纪律规则自动分流资金',
      allocationRule: '分账规则',
      recentTransactions: '近期交易流水',
      viewAllLedger: '查看全部账本 →',
      noEntriesYet: '暂无交易记录',
      noEntriesSub: '开始记录每日收入或支出，即可激活六基金自动分流。',
      startByAdding: '记录第一笔账',
      goalsSummary: '进行中的财务目标',
      goalsProgress: '总体目标进度',
      viewGoals: '管理目标 →',
      healthScore: '财务健康评分',
      calculator: '六基金分账模拟器',
      calculatorSub: '输入任意收入金额，实时查看各资金池分配明细。',
      openSimulator: '打开计算器'
    },
    add: {
      titleIncome: '记录收入',
      titleExpense: '记录支出',
      amountLabel: '金额 (¥/$)',
      amountPlaceholder: '0.00',
      sourceLabel: '收入来源',
      categoryLabel: '支出分类',
      dateLabel: '交易日期',
      paymentModeLabel: '支付方式',
      paymentCash: '现金',
      paymentUpi: '在线支付 / 微信 / 支付宝',
      paymentBank: '银行转账',
      paymentCard: '借记卡 / 信用卡',
      paymentCheque: '支票',
      paymentWallet: '电子钱包',
      paymentOther: '其他方式',
      fundDeductLabel: '扣款资金池',
      notesLabel: '备注 / 描述（选填）',
      notesPlaceholder: '添加账单号、备注或说明...',
      clientLabel: '客户 / 关联方（选填）',
      clientPlaceholder: '例如：客户名称、公司、供应商',
      incomeSplitsPreview: '六基金自动分流明细：',
      saveIncome: '保存收入并自动分账',
      saveExpense: '保存支出',
      updateEntry: '更新记录',
      cancel: '取消',
      addCustomCategory: '+ 添加自定义分类',
      addCustomSource: '+ 添加自定义来源'
    },
    goals: {
      heading: '财务目标与里程碑',
      sub: '设定目标金额，关联储蓄资金池，随时追踪进度。',
      newGoalBtn: '创建新目标',
      activeGoals: '进行中',
      completedGoals: '已达成',
      target: '目标金额',
      saved: '已存金额',
      remaining: '尚需存入',
      depositBtn: '存入资金',
      editBtn: '编辑',
      deleteBtn: '删除',
      markDone: '标记完成',
      completedBadge: '目标已达成',
      noGoalsTitle: '尚未创建任何目标',
      noGoalsSub: '设定如应急储备、设备购置或投资计划等里程碑。',
      createFirstGoal: '创建第一个目标'
    },
    history: {
      heading: '交易流水与对账单',
      sub: '所有收入与支出记录的完整审计流水。',
      searchPlaceholder: '按关键词、备注、客户、分类筛选...',
      all: '全部记录',
      incomeOnly: '仅收入',
      expenseOnly: '仅支出',
      filterAll: '全部记录',
      filterIncome: '仅收入',
      filterExpense: '仅支出',
      filterFund: '所有资金池',
      filterMode: '所有支付方式',
      exportCsv: '导出 CSV / Excel',
      printPdf: '打印对账单',
      totalRecords: '记录总数',
      noTransactions: '未找到交易记录',
      noTransactionsFound: '无匹配记录',
      noTransactionsSub: '请尝试更换搜索关键词或重置筛选条件。',
      clearFilters: '清除筛选',
      deleteConfirmTitle: '确定删除该交易？',
      deleteConfirmDesc: '此操作将永久删除该记录并重新计算资金池余额。'
    },
    reports: {
      heading: '财务报表与深度分析',
      sub: '可视化图表、收支比例分析及资金增长趋势。',
      exportCsv: '导出 CSV / Excel',
      printStatement: '打印财务报告',
      monthSelector: '选择月份',
      incomeVsExpense: '月度收支对比',
      savingsRate: '储蓄与财务纪律率',
      fundDistribution: '六大资金池余额分布',
      topExpenseCategories: '主要支出分类排行',
      financialHealthAnalysis: '财务健康诊断',
      emergencyRunway: '应急生存缓冲期',
      runwayMonths: '现有储备可覆盖月数',
      healthRecommendations: '智能财务建议'
    },
    simulator: {
      title: '六基金分账模拟器',
      subtitle: '模拟任意收入并查看即时精确的资金池分流。',
      enterIncome: '输入预估收入金额',
      sliderLabel: '快捷预设',
      resetDefaults: '恢复默认比例',
      recordEntryBtn: '作为真实收入入账',
      breakdownHeading: '计算得出的六基金分流结果'
    },
    calculator: {
      title: '收入分账计算器',
      subtitle: '模拟收入并查看自动分配到各个资金池的金额。',
      enterAmount: '输入收入金额',
      presets: '快捷金额',
      calculatedBreakdown: '计算分流结果',
      applyToIncome: '应用到新收入记录'
    },
    settings: {
      title: '设置与自定义',
      subtitle: '主题、语言、自定义分类、六基金规则、数据备份与隐私',
      tabPreferences: '偏好设置',
      tabCustomOptions: '自定义选项',
      tabRules: '六基金分账规则',
      tabBackup: '数据备份与导出',
      tabPrivacy: '隐私与安全',
      tabLegal: '条款与法律信息',
      languageHeading: '应用语言',
      themeHeading: '色彩主题',
      privacyMaskHeading: '隐私脱敏模式',
      privacyMaskDesc: '在公共场所隐藏屏幕上的金额数字。',
      customPercentagesHeading: '六基金分账百分比自定义',
      customPercentagesDesc: '调整收入自动分账的比例规则。总计必须严格等于 100%。',
      totalMustBe100: '分配总和必须严格等于 100%',
      saveRuleBtn: '保存新规则',
      resetRuleBtn: '恢复推荐规则',
      backupHeading: '本地存储备份与恢复',
      backupDesc: '您的数据 100% 安全保存在本地浏览器中。请定期下载 JSON 备份。',
      exportJsonBtn: '导出 JSON 备份',
      importJsonBtn: '从 JSON 文件恢复',
      exportCsvBtn: '导出账本 (CSV / Excel)',
      dangerZone: '重置数据区域',
      resetAllDataBtn: '清空并重置所有账本数据'
    },
    funds: {
      personal: {
        name: '个人生活 (30%)',
        desc: '个人日常开销、餐饮、娱乐与品质生活'
      },
      family: {
        name: '家庭与居家 (35%)',
        desc: '房租房贷、生鲜食材、家庭抚养与水电杂费'
      },
      buffer: {
        name: '缓冲备用金 (5%)',
        desc: '应对短期意外波动的快速应急缓冲池'
      },
      emergency: {
        name: '紧急防卫金 (11.25%)',
        desc: '医疗保健、突发维修与不可动摇的安全防线'
      },
      saving: {
        name: '流动储蓄 (7.5%)',
        desc: '高流动性现金储备与短期目标积蓄'
      },
      investment: {
        name: '投资与成长 (11.25%)',
        desc: '长期财富积累、基金股票资产与未来财务自由'
      }
    }
  }
};

export const isPureHindi = (lang?: string): boolean => lang === 'hi';
export const isHinglish = (lang?: string): boolean => lang === 'hinglish';
export const isHindiOrHinglish = (lang?: string): boolean => lang === 'hi' || lang === 'hinglish';

export function pickTranslation<T>(
  lang: AppLanguage | string | undefined,
  options: {
    hi: T;
    hinglish: T;
    en: T;
  }
): T {
  if (lang === 'hi') return options.hi;
  if (lang === 'hinglish') return options.hinglish;
  return options.en;
}

