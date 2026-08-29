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
  funds: Record<FundType, { name: string; desc: string }>;
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
      amountLabel: 'Amount (₹)',
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
      enterIncome: 'Enter Hypothetical Income Amount (₹)',
      sliderLabel: 'Quick Presets',
      resetDefaults: 'Reset to Default %',
      recordEntryBtn: 'Save & Record As Real Income Entry',
      breakdownHeading: 'Calculated 6-Fund Distribution'
    },
    calculator: {
      title: '6-Fund Income Split Calculator',
      subtitle: 'Simulate any income and view automated pot partitioning.',
      enterAmount: 'Enter Income Amount (₹)',
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
        name: 'Family & Home (35%)',
        desc: 'House rent, groceries, family support & home utilities'
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
      amountLabel: 'राशि (₹)',
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
      enterIncome: 'कमाई की राशि दर्ज करें (₹)',
      sliderLabel: 'त्वरित प्रीसेट',
      resetDefaults: 'डिफ़ॉल्ट % पर रीसेट करें',
      recordEntryBtn: 'इसे असली कमाई के रूप में दर्ज करें',
      breakdownHeading: 'गणना किया गया 6-फंड विभाजन'
    },
    calculator: {
      title: '6-फंड आय विभाजन कैलकुलेटर',
      subtitle: 'अपनी कमाई का लाइव 6-फंड विभाजन कैलकुलेट करें।',
      enterAmount: 'कमाई की राशि दर्ज करें (₹)',
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
        name: 'परिवार व घर (35%)',
        desc: 'घर का किराया, राशन, परिवार की मदद और घरेलू बिल'
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
      amountLabel: 'Amount (₹)',
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
      enterIncome: 'Income Amount Enter Karein (₹)',
      sliderLabel: 'Quick Presets',
      resetDefaults: 'Default % Reset Karein',
      recordEntryBtn: 'Is Amount Ko Real Income Entry Banayein',
      breakdownHeading: 'Calculated 6-Fund Split'
    },
    calculator: {
      title: '6-Fund Income Split Calculator',
      subtitle: 'Apni income ka live 6-fund automatic split check karein.',
      enterAmount: 'Income Amount Enter Karein (₹)',
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
        desc: 'Personal daily expenses, dining, grooming & lifestyle'
      },
      family: {
        name: 'Family & Home (35%)',
        desc: 'House rent, groceries, family support & home utility'
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
  }
};
