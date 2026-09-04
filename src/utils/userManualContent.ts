import { AppLanguage, FundType } from '../types';
import { FUND_ORDER, FUND_CONFIGS, DEFAULT_PERCENTAGES } from '../data/defaults';

export interface ManualSectionContent {
  id: string;
  title: string;
  subtitle: string;
  overviewHeading?: string;
  overviewText: string;
  cardsHeading?: string;
  cards?: Array<{
    title: string;
    desc: string;
    tag?: string;
  }>;
  stepsHeading?: string;
  steps?: Array<{
    step: string;
    title: string;
    desc: string;
  }>;
  featuresHeading?: string;
  features?: Array<{
    title: string;
    desc: string;
  }>;
  proTip?: string;
  faqList?: Array<{
    q: string;
    a: string;
  }>;
  actionText?: string;
}

export interface UserManualTranslation {
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
  proTipLabel: string;
  quickAction: string;
  sections: ManualSectionContent[];
}

// English Base Content
const MANUAL_EN: UserManualTranslation = {
  title: 'User Manual & Comprehensive Guide',
  subtitle: 'Official guide to financial discipline, 6-fund capital allocation, and zero-telemetry offline accounting.',
  searchPlaceholder: 'Search manual (e.g. 6 funds, app lock, backup, goals, reports)...',
  officialGuide: 'Official User Guide',
  poweredBy: 'Powered by',
  backToHome: 'Back to Khata',
  sectionsHeading: 'Manual Chapters',
  tableOfContents: 'Table of Contents',
  keyHighlights: 'Key Principles & Rules',
  stepByStep: 'Step-by-Step Instructions',
  proTipLabel: 'Financial Discipline Pro Tip',
  quickAction: 'Open Related Feature',
  sections: [
    {
      id: 'intro',
      title: '1. Introduction & Overview',
      subtitle: 'Zero-telemetry, 100% offline, self-custodied financial ledger',
      overviewHeading: 'Core Philosophy & Architecture',
      overviewText: 'Daily Khata Pro is designed for freelancers, business owners, professionals, and households who seek simple financial tracking. Every incoming rupee is instantly portioned across 6 distinct purpose-driven fund buckets before discretionary spending begins. The entire application runs client-side inside your browser with zero remote database connections.',
      cardsHeading: 'Three Pillars of Daily Khata',
      cards: [
        {
          title: '100% Private Local Vault',
          desc: 'Data remains strictly in your device local storage. No server tracking or external telemetries.'
        },
        {
          title: 'Automated 7-Fund Split',
          desc: 'Mathematical capital division across 6 dedicated pots prevents lifestyle inflation.'
        },
        {
          title: 'Audit Reports & Statements',
          desc: 'High-resolution PDF export, CSV spreadsheets, and clean printable financial summaries.'
        }
      ],
      proTip: 'Record your earnings the moment you receive them. Mathematical allocation works best when applied immediately.'
    },
    {
      id: 'app_lock',
      title: '2. App Passcode Lock & Security Vault',
      subtitle: 'Custom 4–6 digit numeric PIN lock with privacy auto-lock',
      overviewHeading: 'How the Security Vault Operates',
      overviewText: 'Daily Khata Pro includes a built-in app lock. When enabled, your financial balances, client billing numbers, and personal journal notes are completely hidden behind a PIN challenge screen. It activates whenever you switch browser tabs or minimize your phone.',
      stepsHeading: 'Setup Instructions:',
      steps: [
        {
          step: 'Step 1',
          title: 'Open Lock Settings',
          desc: 'Click on the More menu in the header and select "Security PIN Lock" or open Settings.'
        },
        {
          step: 'Step 2',
          title: 'Choose PIN & Recovery',
          desc: 'Toggle the switch ON, enter a 4–6 digit PIN, and pick a security recovery question.'
        },
        {
          step: 'Step 3',
          title: 'Save & Activate',
          desc: 'Click "Save & Enable Passcode". Your security shield is now permanently active on this device.'
        }
      ],
      featuresHeading: 'Core Security Highlights',
      features: [
        {
          title: 'Auto-Lock on Tab Switch',
          desc: 'The screen locks automatically whenever you leave the window or switch applications.'
        },
        {
          title: 'Instant 1-Tap Lock',
          desc: 'Click the Lock icon in the header anytime to immediately secure your workspace.'
        },
        {
          title: 'Security Question Reset',
          desc: 'Forgot your passcode? Answer your configured security question to safely reset without data loss.'
        },
        {
          title: 'Rupee Amount Masking',
          desc: 'Click the Eye icon to obscure all monetary amounts with asterisks in public settings.'
        }
      ],
      proTip: 'Always configure a security recovery question you remember so you never get locked out of your ledger.'
    },
    {
      id: 'personal_notes',
      title: '3. Personal Notes & Private Vault',
      subtitle: 'Confidential scratchpad, password hints, and personal journal',
      overviewHeading: 'Isolated Confidential Workspace',
      overviewText: 'The Personal Notes Vault is completely separated from your financial ledger balances. It serves as your private offline scratchpad for business ideas, tax notes, sensitive reminders, meeting minutes, and financial strategies.',
      cardsHeading: 'Vault Capabilities',
      cards: [
        {
          title: 'Completely Isolated',
          desc: 'Notes are decoupled from your daily transaction calculations, keeping ideas clean.'
        },
        {
          title: 'Individual Note Masking',
          desc: 'Toggle lock on sensitive notes so content remains blurred until you click to reveal.'
        },
        {
          title: 'Color & Tag Organization',
          desc: 'Organize notes by custom color badges, categories, and quick search filters.'
        },
        {
          title: 'Full Export & Backup',
          desc: 'Included in your encrypted JSON backup downloads for easy transfer across devices.'
        }
      ],
      proTip: 'Use Personal Notes to jot down client payment promises and invoice due dates.'
    },
    {
      id: 'six_funds',
      title: '4. The 7-Fund Allocation Rule',
      subtitle: 'Systematic 30/35/5/11.25/7.5/11.25 capital division formula',
      overviewHeading: 'Why the 7-Fund Rule Works',
      overviewText: 'Traditional budgeting fails because people spend first and save whatever remains. The 7-Fund Formula reverses this: whenever income arrives, it is immediately partitioned into 6 dedicated purpose-driven accounts, guaranteeing that living expenses, safety reserves, and investments grow simultaneously.',
      cardsHeading: 'The 6 Dedicated Fund Pots',
      cards: [
        {
          title: 'Personal Fund (30%)',
          tag: '#38BDF8',
          desc: 'Personal lifestyle, recreation, dining out, personal fuel, subscriptions, and grooming.'
        },
        {
          title: 'Family Fund (35%)',
          tag: '#10B981',
          desc: 'Essential household necessities: groceries, rent, utilities, school fees, and home maintenance.'
        },
        {
          title: 'Buffer Fund (5%)',
          tag: '#F59E0B',
          desc: 'Working liquidity, cash flow smoothing, petty miscellaneous expenses, and temporary shortfalls.'
        },
        {
          title: 'Emergency Fund (11.25%)',
          tag: '#EF4444',
          desc: 'Unforeseen medical expenses, critical repairs, and crisis protection. Never touch for leisure.'
        },
        {
          title: 'Savings Fund (7.5%)',
          tag: '#8B5CF6',
          desc: 'Medium-term asset purchases, electronics, home upgrades, travel goals, and festivals.'
        },
        {
          title: 'Investment Fund (11.25%)',
          tag: '#EC4899',
          desc: 'Long-term wealth generation: mutual funds, equities, real estate, gold, and retirement.'
        }
      ],
      proTip: 'You can adjust these percentages in Settings > 7-Fund Rules anytime to match your life stage.'
    },
    {
      id: 'add_income',
      title: '5. Recording Income & Splits',
      subtitle: 'How earnings are portioned across your portfolio automatically',
      overviewHeading: 'Logging Inflows & Revenue',
      overviewText: 'Whenever you log a salary credit, client payment, business profit, or freelance invoice, Daily Khata calculates the exact rupee portion allocated to each of your 6 pots based on your configured percentages.',
      stepsHeading: 'How to Record Inflows:',
      steps: [
        {
          step: 'Step 1',
          title: 'Enter Total Inflow',
          desc: 'Click "Add Income", enter the gross received amount in rupees.'
        },
        {
          step: 'Step 2',
          title: 'Specify Source & Payment Mode',
          desc: 'Choose your client or income stream, and select payment method (UPI, Bank, Cash).'
        },
        {
          step: 'Step 3',
          title: 'Preview 6-Way Split',
          desc: 'Review the live breakdown showing exactly how much capital flows into each fund pot.'
        }
      ],
      proTip: 'Even small unexpected cash gifts or bonuses should be logged through Income so all pots grow proportionally.'
    },
    {
      id: 'add_expense',
      title: '6. Logging Expenses & Deductions',
      subtitle: 'Deducting costs directly from designated fund buckets',
      overviewHeading: 'Disciplined Outflow Management',
      overviewText: 'When logging an expense, you must designate the specific fund bucket it should be deducted from. This ensures you never accidentally spend emergency capital on dining out or family grocery funds on discretionary electronics.',
      featuresHeading: 'Expense Allocation Rules',
      features: [
        {
          title: 'Family Fund Outlays',
          desc: 'Use for groceries, residential electricity bills, medicine, household rent, and cooking gas.'
        },
        {
          title: 'Personal Fund Outlays',
          desc: 'Use for weekend dining, personal apparel, fitness memberships, and personal travel.'
        },
        {
          title: 'Emergency Fund Outlays',
          desc: 'Reserved strictly for urgent hospitalizations, vehicle accidents, or sudden plumbing crises.'
        },
        {
          title: 'Investment Fund Outlays',
          desc: 'Use when transferring money to demat accounts, mutual fund SIPs, fixed deposits, or gold.'
        }
      ],
      proTip: 'If your Personal Fund pot runs low before the month ends, pause leisure spending rather than borrowing from Family.'
    },
    {
      id: 'work_life',
      title: '7. Work Projects & Daily Timeline',
      subtitle: 'Deliverables, billable hours, client tracking, and daily reflections',
      overviewHeading: 'Dual Professional & Life Journal',
      overviewText: 'Daily Khata integrates project tracking with personal well-being. Track client deliverables, hourly contracts, project revenue, morning routines, sleep cycles, and daily mood scores in a single place.',
      cardsHeading: 'Tracking Modules',
      cards: [
        {
          title: 'Work Project Ledger',
          desc: 'Log deliverables, client names, hourly work, project costs, and completion status.'
        },
        {
          title: 'Daily Life Timeline',
          desc: 'Record morning routines, bedtime hours, key daily lessons, and gratitude highlights.'
        },
        {
          title: 'Mood & Energy Tracker',
          desc: 'Track daily wellness trends across productive, blessed, normal, and tired states.'
        },
        {
          title: 'Combined Report View',
          desc: 'Analyze how your work output correlates with financial inflows over time.'
        }
      ],
      proTip: 'Log your work hours immediately after completing a milestone to keep billing records accurate.'
    },
    {
      id: 'goals',
      title: '8. Financial Goals & Milestones',
      subtitle: 'Fund-linked milestone targets, deadlines, and deposit logs',
      overviewHeading: 'Target-Driven Wealth Accumulation',
      overviewText: 'Create ambitious financial milestones such as a 6-Month Emergency Cushion, Laptop Purchase, Vehicle Downpayment, or Vacation Fund. Link each goal directly to its corresponding fund pot to track your real savings progress.',
      stepsHeading: 'Setting & Funding Goals:',
      steps: [
        {
          step: 'Step 1',
          title: 'Define Goal Target',
          desc: 'Set the goal title, target amount in rupees, desired completion date, and linked fund category.'
        },
        {
          step: 'Step 2',
          title: 'Make Direct Deposits',
          desc: 'Click "Deposit" to allocate funds toward your goal from your existing ledger balance.'
        },
        {
          step: 'Step 3',
          title: 'Track Milestone Progress',
          desc: 'Watch the live visual progress bar and time-to-completion estimates update automatically.'
        }
      ],
      proTip: 'Break large annual goals (like ${getCurrencyConfig(getCurrentLanguage()).symbol}1,20,000 for insurance) into smaller monthly milestones of ${getCurrencyConfig(getCurrentLanguage()).symbol}10,000.'
    },
    {
      id: 'reports',
      title: '9. Reports, Charts & PDF Statements',
      subtitle: 'Visual analytics, CSV spreadsheets, and high-resolution PDF statements',
      overviewHeading: 'Comprehensive Financial Audit Engine',
      overviewText: 'View visual breakdowns of your monthly cash flow, category-wise expenditure bar charts, fund distribution pies, and daily burn rates. Generate print-ready official PDF statements with a single click.',
      cardsHeading: 'Export & Analysis Features',
      cards: [
        {
          title: 'Monthly Cashflow Breakdown',
          desc: 'Compare total income against total expenses and net saved surplus.'
        },
        {
          title: 'Fund Allocation Distribution',
          desc: 'Verify if your spending matches your targeted 6-fund mathematical boundaries.'
        },
        {
          title: 'High-Res PDF Statements',
          desc: 'Generate clean, printable, professional financial summaries formatted for accounting.'
        },
        {
          title: 'Raw CSV / Excel Export',
          desc: 'Export spreadsheet-compatible files to analyze in Microsoft Excel, Google Sheets, or Tally.'
        }
      ],
      proTip: 'Download a monthly CSV statement on the 1st of every month for your personal archival records.'
    },
    {
      id: 'settings',
      title: '10. Custom Settings & Rules Engine',
      subtitle: 'Theme customization, custom categories, and 6-fund percentage rule editor',
      overviewHeading: 'Tailor the Ledger to Your Needs',
      overviewText: 'Customize color themes, switch between 14 international languages, add custom income sources and expense categories, adjust the 6-fund allocation percentages, and manage your offline data backup files.',
      featuresHeading: 'Customization Options',
      features: [
        {
          title: '14 Multi-Language Profiles',
          desc: 'Switch between English, Hindi, Hinglish, Urdu, Bengali, Spanish, Arabic, French, German, and more.'
        },
        {
          title: '8 Accent Color Themes',
          desc: 'Select from Electric Blue, Cyber Yellow, Emerald Green, Royal Purple, Sunset Orange, and Clean Light.'
        },
        {
          title: 'Custom Categories & Sources',
          desc: 'Create personalized spending categories and income tags for your specific lifestyle or trade.'
        },
        {
          title: 'Percentage Allocation Editor',
          desc: 'Modify the 6-fund percentage split to match your unique income distribution requirements.'
        }
      ],
      proTip: 'Whenever you change your 6-fund percentages, ensure the total adds up to exactly 100%.'
    },
    {
      id: 'backup',
      title: '11. Backup, Restore & Data Sovereignty',
      subtitle: 'JSON archives, client-side restore, and zero-cloud privacy architecture',
      overviewHeading: 'Full Custody Over Your Data',
      overviewText: 'Because Daily Khata does not rely on any remote database, your data is 100% under your ownership. Export a JSON backup file whenever you want to transfer data to another phone, computer, or browser.',
      stepsHeading: 'Backup & Restore Procedure:',
      steps: [
        {
          step: 'Step 1',
          title: 'Export Backup',
          desc: 'Open Settings > Data & Backup > Click "Export JSON Backup" to download your complete archive.'
        },
        {
          step: 'Step 2',
          title: 'Store Safely',
          desc: 'Keep the JSON file in your personal drive, email it to yourself, or store on a USB drive.'
        },
        {
          step: 'Step 3',
          title: 'Restore Anytime',
          desc: 'Open Daily Khata on any device, click "Restore from JSON File", and choose your backup archive.'
        }
      ],
      proTip: 'Create a backup before clearing your browser cache or switching to a new smartphone.'
    },
    {
      id: 'source_code',
      title: '12. Source Code & Safety Audit',
      subtitle: 'MIT open-source transparency, GitHub repository, and DIY verification guide',
      overviewHeading: 'Open Transparency Guarantee',
      overviewText: 'We believe you should never have to take a developer\'s word for privacy. Daily Khata Pro is 100% open source under the MIT License. Anyone can inspect, build, audit, and run the code independently.',
      cardsHeading: 'Transparency Commitments',
      cards: [
        {
          title: 'Official GitHub Repository',
          desc: 'Browse 100% of the TypeScript source code at github.com/hasvolt/Daily-Khata-Pro.'
        },
        {
          title: 'Zero Remote Database Calls',
          desc: 'Zero telemetry scripts, zero tracking pixels, zero analytics SDKs, and zero third-party ads.'
        },
        {
          title: 'DIY DevTools Audit',
          desc: 'Press F12, open the Network tab, and verify that zero requests leave your browser.'
        },
        {
          title: 'Permissive MIT License',
          desc: 'Free to inspect, study, fork, host locally, or contribute improvements.'
        }
      ],
      proTip: 'You can verify offline capability anytime by turning on Airplane mode; the app continues working seamlessly.'
    },
    {
      id: 'faq',
      title: '13. Frequently Asked Questions (FAQ)',
      subtitle: 'Answers to common questions regarding offline data, PIN recovery, and calculations',
      overviewHeading: 'Frequently Asked Questions',
      overviewText: 'Here are answers to the most frequent inquiries from our community of users:',
      faqList: [
        {
          q: 'Is my financial data stored on any server?',
          a: 'No. Daily Khata Pro operates on a 100% client-side architecture. All balances, transactions, goals, and notes are saved strictly in your device\'s local storage (hasvolt_khata_v1).'
        },
        {
          q: 'What happens if I forget my App Lock PIN?',
          a: 'Click "Forgot PIN?" on the lock screen. You will be prompted to answer the security recovery question you selected during PIN setup. Upon answering correctly, you can set a new PIN without losing any data.'
        },
        {
          q: 'Can I use Daily Khata Pro on multiple devices?',
          a: 'Yes. Simply export a JSON backup from your primary device (Settings > Data & Backup > Export JSON) and import it into Daily Khata on your other device.'
        },
        {
          q: 'Can I customize the 7-Fund percentage allocation?',
          a: 'Yes. Go to Settings > 7-Fund Rules. You can customize the percentage assigned to each of the 6 pots as long as the total equals 100%.'
        },
        {
          q: 'Does this app require an active internet connection?',
          a: 'No. Daily Khata Pro is a progressive offline application. It runs with complete functionality without an active internet connection.'
        }
      ]
    },
    {
      id: 'developer',
      title: '14. Developer & Founder Profile',
      subtitle: 'Created by MD Zafeer Hasan (YAZDAAN) • HasVolt Official Mission',
      overviewHeading: 'Creator Mission & Philosophy',
      overviewText: 'Daily Khata Pro was envisioned, architected, and built by MD Zafeer Hasan (YAZDAAN) under HasVolt. The project was created with a clear vision: building private, aesthetic, high-performance financial tools that put complete power and data sovereignty into the hands of users.',
      cardsHeading: 'Developer Specifications',
      cards: [
        {
          title: 'Founder & Architect',
          desc: 'MD Zafeer Hasan (YAZDAAN) — Dedicated to creating privacy-first digital tools.'
        },
        {
          title: 'Official Platform',
          desc: 'HasVolt Digital Tools — hasvolt.com & rozfiber.com'
        },
        {
          title: 'Open Source License',
          desc: 'MIT Permissive License — Free for the world to use and inspect.'
        },
        {
          title: 'Direct Creator Support',
          desc: 'Contact: mdzafeerhasan.official@gmail.com'
        }
      ],
      proTip: 'For suggestions, code contributions, or feature requests, visit the official GitHub repository.'
    }
  ]
};

// Hindi Translation Bundle
const MANUAL_HI: UserManualTranslation = {
  title: 'उपयोग निर्देशिका एवं संपूर्ण गाइड',
  subtitle: 'वित्तीय अनुशासन, 7-फंड फॉर्मूला व शून्य-टेलीमेट्री ऑफलाइन धन प्रबंधन की आधिकारिक मार्गदर्शिका।',
  searchPlaceholder: 'यूजर गाइड में खोजें (उदा. 6 फंड, ऐप लॉक, बैकअप, लक्ष्य, रिपोर्ट्स)...',
  officialGuide: 'आधिकारिक उपयोगकर्ता मार्गदर्शिका',
  poweredBy: 'संचालित',
  backToHome: 'वापस खाता पर जाएं',
  sectionsHeading: 'निर्देशिका अनुभाग',
  tableOfContents: 'विषय-सूची',
  keyHighlights: 'मुख्य वित्तीय नियम',
  stepByStep: 'चरण-दर-चरण निर्देश',
  proTipLabel: 'वित्तीय अनुशासन टिप',
  quickAction: 'संबंधित सुविधा खोलें',
  sections: [
    {
      id: 'intro',
      title: '1. परिचय एवं मुख्य अवलोकन',
      subtitle: 'शून्य टेलीमेट्री, 100% निजी व ऑफलाइन सुरक्षित वित्तीय लेजर इंजन',
      overviewHeading: 'मुख्य डिज़ाइन दर्शन एवं आर्किटेक्चर',
      overviewText: 'Daily Khata Pro फ्रीलांसर्स, व्यापार मालिकों, पेशेवरों एवं परिवारों के लिए तैयार किया गया एक अनुशासित धन प्रबंधन उपकरण है। जैसे ही आपकी कमाई दर्ज होती है, वह तुरंत 6 अलग-अलग उद्देश्य-आधारित फंड्स में विभाजित हो जाती है। यह पूरा एप्लिकेशन आपके ब्राउज़र के भीतर 100% ऑफलाइन चलता है, बिना किसी बाहरी सर्वर या डेटाबेस कनेक्शन के।',
      cardsHeading: 'डेली खाता के तीन मुख्य आधार',
      cards: [
        {
          title: '100% निजी लोकल वॉल्ट',
          desc: 'डेटा केवल आपके डिवाइस में सुरक्षित रहता है। कोई सर्वर ट्रैकिंग या बाहरी टेलीमेट्री नहीं।'
        },
        {
          title: 'स्वचालित 7-फंड विभाजन',
          desc: '6 समर्पित फंड पॉट्स में गणितीय पूंजी विभाजन फिजूलखर्ची पर पूर्ण विराम लगाता है।'
        },
        {
          title: 'ऑडिट रिपोर्ट्स व PDF',
          desc: 'उच्च-रिज़ॉल्यूशन प्रिंट-रेडी PDF स्टेटमेंट, CSV स्प्रेडशीट और स्पष्ट वित्तीय सारांश।'
        }
      ],
      proTip: 'कमाई मिलते ही तुरंत दर्ज करें। गणितीय विभाजन का वास्तविक लाभ तभी मिलता है जब पैसा खर्च होने से पहले अलग हो जाए।'
    },
    {
      id: 'app_lock',
      title: '2. ऐप पासकोड लॉक एवं सुरक्षा वॉल्ट',
      subtitle: '4–6 अंकों का सुरक्षित पिन लॉक व प्राइवेसी ऑटो-लॉक सुरक्षा',
      overviewHeading: 'सुरक्षा वॉल्ट कैसे काम करता है',
      overviewText: 'Daily Khata Pro में एक अंतर्निहित सुरक्षा पासकोड लॉक दिया गया है। जब यह सक्रिय होता है, तो आपकी वित्तीय शेष राशि, बिलिंग विवरण और पर्सनल नोट्स एक पिन लॉक स्क्रीन के पीछे सुरक्षित हो जाते हैं। ब्राउज़र टैब बदलते ही या विंडो मिनिमाइज़ होते ही यह अपने आप लॉक हो जाता है।',
      stepsHeading: 'पासकोड लॉक सेटअप करने के चरण:',
      steps: [
        {
          step: 'चरण 1',
          title: 'सुरक्षा सेटिंग्स खोलें',
          desc: 'हेडर के "More" मेनू में जाकर "सुरक्षा पिन लॉक" चुनें या सेटिंग्स खोलें।'
        },
        {
          step: 'चरण 2',
          title: 'पिन व सुरक्षा प्रश्न चुनें',
          desc: 'स्विच को ON करें, अपना 4–6 अंकों का पिन दर्ज करें और एक सुरक्षा प्रश्न चुनें।'
        },
        {
          step: 'चरण 3',
          title: 'सहेजें व सक्रिय करें',
          desc: '"सुरक्षा पिन सहेजें" पर क्लिक करें। आपका वॉल्ट इस डिवाइस पर तुरंत सक्रिय हो जाएगा।'
        }
      ],
      featuresHeading: 'प्रमुख सुरक्षा सुविधाएं',
      features: [
        {
          title: 'टैब बदलते ही ऑटो-लॉक',
          desc: 'जैसे ही आप ऐप छोड़कर दूसरा टैब खोलते हैं, स्क्रीन अपने आप लॉक हो जाती है।'
        },
        {
          title: '1-टैप त्वरित लॉक बटन',
          desc: 'हेडर में दिए गए Lock आइकन पर क्लिक करके कभी भी तुरंत स्क्रीन लॉक कर सकते हैं।'
        },
        {
          title: 'सुरक्षा प्रश्न से पिन रीसेट',
          desc: 'पिन भूल जाने पर सुरक्षा प्रश्न का उत्तर देकर बिना डेटा खोए नया पिन बना सकते हैं।'
        },
        {
          title: 'प्राइवेसी आई मास्क',
          desc: 'सार्वजनिक स्थानों पर Eye आइकन दबाकर सभी रुपयों की रकम को छिपा सकते हैं।'
        }
      ],
      proTip: 'हमेशा ऐसा सुरक्षा प्रश्न चुनें जिसका उत्तर केवल आपको याद हो ताकि आप कभी भी लॉकआउट न हों।'
    },
    {
      id: 'personal_notes',
      title: '3. पर्सनल नोट्स एवं प्राइवेट वॉल्ट',
      subtitle: 'गोपनीय स्क्रैचपैड, पासवर्ड हिंट्स व व्यक्तिगत डायरी',
      overviewHeading: 'स्वतंत्र गोपनीय कार्यक्षेत्र',
      overviewText: 'पर्सनल नोट्स वॉल्ट आपके वित्तीय लेजर से पूरी तरह अलग एक स्वतंत्र गोपनीय स्पेस है। यहाँ आप व्यावसायिक विचार, टैक्स नोट्स, संवेदनशील पासवर्ड हिंट्स, मीटिंग मिनट्स और वित्तीय रणनीतियां सुरक्षित रख सकते हैं।',
      cardsHeading: 'वॉल्ट की प्रमुख विशेषताएं',
      cards: [
        {
          title: 'वित्तीय लेजर से पूरी तरह अलग',
          desc: 'नोट्स आपकी दैनिक लेनदेन गणनाओं से स्वतंत्र रहते हैं, जिससे डेटा व्यवस्थित रहता है।'
        },
        {
          title: 'व्यक्तिगत नोट लॉक सुरक्षा',
          desc: 'संवेदनशील नोट्स को अलग से लॉक करें ताकि स्क्रीन पर उनका विवरण धुंधला दिखाई दे।'
        },
        {
          title: 'रंग व टैग द्वारा संगठन',
          desc: 'नोट्स को रंगीन लेबल, श्रेणियों और त्वरित खोज द्वारा आसानी से व्यवस्थित करें।'
        },
        {
          title: 'पूर्ण एक्सपोर्ट व बैकअप',
          desc: 'JSON बैकअप डाउनलोड में नोट्स भी शामिल होते हैं, जिससे नए डिवाइस पर ले जाना आसान है।'
        }
      ],
      proTip: 'पर्सनल नोट्स का उपयोग ग्राहकों के वादों और इनवॉइस भुगतान तिथियों को याद रखने के लिए करें।'
    },
    {
      id: 'six_funds',
      title: '4. 7-फंड फॉर्मूला एलोकेशन नियम',
      subtitle: '30/35/5/11.25/7.5/11.25 स्वचालित पूंजी विभाजन फॉर्मूला',
      overviewHeading: '7-फंड नियम क्यों सफल है',
      overviewText: 'पारंपरिक बजटिंग इसलिए असफल हो जाती है क्योंकि लोग पहले खर्च करते हैं और जो बचता है उसे बचाने का प्रयास करते हैं। 7-फंड फॉर्मूला इसे उलट देता है: आमदनी मिलते ही वह तुरंत 6 निश्चित खातों में बँट जाती है, जिससे जीवन-यापन, सुरक्षा और निवेश साथ-साथ बढ़ते हैं।',
      cardsHeading: '6 समर्पित फंड पॉट्स का विवरण',
      cards: [
        {
          title: 'पर्सनल फंड / Personal (30%)',
          tag: '#38BDF8',
          desc: 'व्यक्तिगत जीवनशैली, मनोरंजन, बाहर खाना, व्यक्तिगत ईंधन, सब्सक्रिप्शन और व्यक्तिगत देखभाल।'
        },
        {
          title: 'फैमिली फंड / Family (35%)',
          tag: '#10B981',
          desc: 'अनिवार्य घरेलू खर्च: राशन, घर का किराया, बिजली बिल, बच्चों की स्कूल फीस और घरेलू मेंटेनेंस।'
        },
        {
          title: 'बफर फंड / Buffer (5%)',
          tag: '#F59E0B',
          desc: 'कार्यशील तरलता, नकदी प्रवाह में उतार-चढ़ाव, छोटे-मोटे फुटकर खर्च और अस्थायी कमी।'
        },
        {
          title: 'इमरजेंसी फंड / Emergency (11.25%)',
          tag: '#EF4444',
          desc: 'अचानक मेडिकल खर्च, गाड़ी की मरम्मत और संकट सुरक्षा। इसे फिजूलखर्ची के लिए कभी न छुएं।'
        },
        {
          title: 'सेविंग्स फंड / Savings (7.5%)',
          tag: '#8B5CF6',
          desc: 'मध्यम-अवधि की खरीदारी: इलेक्ट्रॉनिक्स, घरेलू उपकरण, यात्रा लक्ष्य और त्योहारों की बचत।'
        },
        {
          title: 'इन्वेस्टमेंट फंड / Investment (11.25%)',
          tag: '#EC4899',
          desc: 'दीर्घकालिक संपत्ति निर्माण: म्यूचुअल फंड SIP, शेयर बाजार, सोना, रियल एस्टेट व रिटायरमेंट।'
        }
      ],
      proTip: 'आप सेटिंग्स > 7-फंड नियम में जाकर इन प्रतिशतों को अपनी जीवन स्थिति के अनुसार कभी भी बदल सकते हैं।'
    },
    {
      id: 'add_income',
      title: '5. आमदनी (Income) जोड़ना व विभाजन',
      subtitle: 'कमाई दर्ज करना व 6 फंडों में स्वचालित गणितीय विभाजन',
      overviewHeading: 'कमाई दर्ज करने की कार्यप्रणाली',
      overviewText: 'जब भी आप सैलरी, क्लाइंट भुगतान, व्यापार मुनाफा या फ्रीलांस इनवॉइस दर्ज करते हैं, Daily Khata आपके सेट किए गए प्रतिशत के आधार पर तुरंत हर फंड का सटीक हिस्सा अलग कर देता है।',
      stepsHeading: 'कमाई दर्ज करने के चरण:',
      steps: [
        {
          step: 'चरण 1',
          title: 'कुल आमदनी दर्ज करें',
          desc: '"आमदनी जोड़ें" पर क्लिक करें और प्राप्त हुई कुल राशि (रुपयों में) लिखें।'
        },
        {
          step: 'चरण 2',
          title: 'स्रोत व भुगतान माध्यम चुनें',
          desc: 'अपनी कमाई का स्रोत लिखें और माध्यम (UPI, बैंक ट्रांसफर, कैश) चुनें।'
        },
        {
          step: 'चरण 3',
          title: '7-फंड विभाजन प्रीव्यू देखें',
          desc: 'स्क्रीन पर तुरंत देखें कि आपकी कमाई में से किस फंड पॉट में कितने रुपये जमा हो रहे हैं।'
        }
      ],
      proTip: 'छोटी से छोटी आकस्मिक कमाई या उपहार राशि भी आमदनी में दर्ज करें ताकि सभी फंड्स आनुपातिक रूप से बढ़ें।'
    },
    {
      id: 'add_expense',
      title: '6. खर्च (Expense) दर्ज करना व कटौती',
      subtitle: 'निर्धारित फंड पॉट से खर्च घटाना व बजट संतुलन बनाए रखना',
      overviewHeading: 'अनुशासित खर्च प्रबंधन',
      overviewText: 'खर्च दर्ज करते समय आपको यह चुनना होता है कि यह खर्च किस फंड से काटा जाए। इससे यह सुनिश्चित होता है कि इमरजेंसी का पैसा कभी बाहर खाने या व्यक्तिगत मनोरंजन में न चला जाए।',
      featuresHeading: 'फंड-वार खर्च दिशानिर्देश',
      features: [
        {
          title: 'फैमिली फंड से कटौती',
          desc: 'किराना, घरेलू बिजली बिल, दवाइयां, मकान किराया, गैस सिलेंडर और बच्चों की फीस।'
        },
        {
          title: 'पर्सनल फंड से कटौती',
          desc: 'वीकेंड आउटिंग, व्यक्तिगत कपड़े, फिटनेस जिम, व्यक्तिगत पेट्रोल और कैफे।'
        },
        {
          title: 'इमरजेंसी फंड से कटौती',
          desc: 'केवल गंभीर अस्पताल खर्च, गाड़ी की आपातकालीन मरम्मत या अचानक आई विपत्ति।'
        },
        {
          title: 'इन्वेस्टमेंट फंड से कटौती',
          desc: 'जब आप अपने बैंक से डिमैट अकाउंट, म्यूचुअल फंड या एफडी में पैसा ट्रांसफर करते हैं।'
        }
      ],
      proTip: 'यदि महीने के अंत से पहले पर्सनल फंड खाली हो जाए, तो फैमिली फंड से पैसा लेने के बजाय मनोरंजन पर विराम लगाएं।'
    },
    {
      id: 'work_life',
      title: '7. वर्क प्रोजेक्ट्स एवं डेली टाइमलाइन',
      subtitle: 'प्रोजेक्ट्स, क्लाइंट डिलीवरेबल्स, काम के घंटे और दैनिक मूड डायरी',
      overviewHeading: 'पेशेवर काम व दैनिक जीवन का संगम',
      overviewText: 'Daily Khata आपके प्रोजेक्ट ट्रैकिंग को व्यक्तिगत स्वास्थ्य से जोड़ता है। क्लाइंट डिलीवरेबल्स, प्रति घंटा बिलिंग, सुबह-शाम की दिनचर्या और दैनिक मूड स्कोर को एक ही सुंदर दृश्य में ट्रैक करें।',
      cardsHeading: 'ट्रैकिंग मॉड्यूल',
      cards: [
        {
          title: 'वर्क प्रोजेक्ट लेजर',
          desc: 'क्लाइंट नाम, डिलीवरेबल्स, काम के घंटे, प्रोजेक्ट लागत और कार्य स्थिति दर्ज करें।'
        },
        {
          title: 'दैनिक जीवन टाइमलाइन',
          desc: 'सुबह उठने का समय, रात को सोने का समय, दिन की मुख्य सीख और आभार डायरी।'
        },
        {
          title: 'मूड व ऊर्जा ट्रैकर',
          desc: 'खुश, उत्पादक, सामान्य, थका हुआ और तनावग्रस्त मूड ट्रेंड्स की समीक्षा करें।'
        },
        {
          title: 'संयुक्त विश्लेषण रिपोर्ट',
          desc: 'देखें कि आपकी कार्य उत्पादकता का आपकी वित्तीय कमाई पर क्या प्रभाव पड़ रहा है।'
        }
      ],
      proTip: 'प्रोजेक्ट का माइलस्टोन पूरा होते ही तुरंत घंटे व कमाई दर्ज करें ताकि बिलिंग सटीक रहे।'
    },
    {
      id: 'goals',
      title: '8. वित्तीय लक्ष्य (Goals) एवं माइलस्टोन',
      subtitle: 'फंड-लिंक्ड बचत लक्ष्य, समय सीमा और जमा इतिहास',
      overviewHeading: 'लक्ष्य-उन्मुख धन संचय',
      overviewText: '6 महीने का इमरजेंसी फंड, नया लैपटॉप, वाहन डाउनपेमेंट या वेकेशन फंड जैसे बड़े लक्ष्य बनाएं। हर लक्ष्य को उसके संबंधित फंड पॉट से जोड़कर अपनी वास्तविक प्रगति पर नज़र रखें।',
      stepsHeading: 'लक्ष्य बनाने और फंड जमा करने के चरण:',
      steps: [
        {
          step: 'चरण 1',
          title: 'लक्ष्य विवरण सेट करें',
          desc: 'लक्ष्य का नाम, कुल टारगेट राशि (रुपयों में), अंतिम तिथि और संबंधित फंड चुनें।'
        },
        {
          step: 'चरण 2',
          title: 'सीधे फंड जमा करें',
          desc: '"Deposit" बटन पर क्लिक करके अपने लेजर बैलेंस से लक्ष्य में राशि जोड़ें।'
        },
        {
          step: 'चरण 3',
          title: 'प्रगति बार देखें',
          desc: 'लक्ष्य पूर्ण होने का प्रतिशत और अनुमानित समय सीमा लाइव अपडेट होते देखें।'
        }
      ],
      proTip: 'बड़े वार्षिक लक्ष्यों (जैसे ${getCurrencyConfig(getCurrentLanguage()).symbol}1,20,000 इंश्योरेंस) को ${getCurrencyConfig(getCurrentLanguage()).symbol}10,000 के छोटे मासिक लक्ष्यों में बांटें।'
    },
    {
      id: 'reports',
      title: '9. रिपोर्ट, ग्राफ़ एवं PDF स्टेटमेंट',
      subtitle: 'विजुअल चार्ट्स, CSV स्प्रेडशीट और हाई-रिज़ॉल्यूशन प्रिंट स्टेटमेंट',
      overviewHeading: 'संपूर्ण वित्तीय ऑडिट व विश्लेषण इंजन',
      overviewText: 'अपने मासिक कैशफ्लो का विजुअल विश्लेषण, श्रेणी-वार खर्च बार चार्ट्स, फंड वितरण पाई चार्ट्स और दैनिक खर्च दर देखें। एक क्लिक में आधिकारिक प्रिंट-रेडी PDF स्टेटमेंट तैयार करें।',
      cardsHeading: 'रिपोर्ट व एक्सपोर्ट सुविधाएं',
      cards: [
        {
          title: 'मासिक कैशफ्लो सारांश',
          desc: 'कुल आय, कुल खर्च और शुद्ध बचत की आपस में सीधी तुलना।'
        },
        {
          title: '7-फंड आवंटन चार्ट',
          desc: 'जांचें कि आपका वास्तविक खर्च आपके 7-फंड गणितीय नियमों के अनुसार चल रहा है या नहीं।'
        },
        {
          title: 'प्रिंट-रेडी PDF स्टेटमेंट',
          desc: 'लेखांकन और कर ऑडिट के लिए तैयार स्वच्छ, पेशेवर PDF वित्तीय सारांश डाउनलोड करें।'
        },
        {
          title: 'CSV / Excel एक्सपोर्ट',
          desc: 'Microsoft Excel, Google Sheets या Tally में विश्लेषण के लिए स्प्रेडशीट फाइल डाउनलोड करें।'
        }
      ],
      proTip: 'हर महीने की 1 तारीख को पिछले महीने का CSV स्टेटमेंट डाउनलोड करके अपने निजी बैकअप में रखें।'
    },
    {
      id: 'settings',
      title: '10. कस्टम सेटिंग्स व रूल्स इंजन',
      subtitle: 'थीम कस्टमाइज़ेशन, कस्टम श्रेणियां व 7-फंड प्रतिशत अनुकूलक',
      overviewHeading: 'अपनी ज़रूरतों के अनुसार खाता ढालें',
      overviewText: 'रंग थीम बदलें, 14 अंतरराष्ट्रीय भाषाओं में स्विच करें, अपनी कस्टम श्रेणियां व आय स्रोत जोड़ें, 7-फंड प्रतिशत नियम को अनुकूलित करें और बैकअप प्रबंधित करें।',
      featuresHeading: 'कस्टमाइज़ेशन विकल्प',
      features: [
        {
          title: '14 बहुभाषी प्रोफाइल',
          desc: 'हिंदी, हिंग्लिश, उर्दू, बंगाली, स्पेनिश, अरबी, फ्रेंच, जर्मन और अंग्रेजी में उपलब्ध।'
        },
        {
          title: '8 आकर्षक कलर थीम्स',
          desc: 'इलेक्ट्रिक ब्लू, साइबर येलो, एमराल्ड ग्रीन, रॉयल पर्पल, सनसेट ऑरेंज और क्लीन लाइट।'
        },
        {
          title: 'कस्टम श्रेणियां व स्रोत',
          desc: 'अपनी जीवनशैली और व्यवसाय के लिए नए खर्च व आमदनी के नाम जोड़ें।'
        },
        {
          title: 'प्रतिशत आवंटन संपादक',
          desc: 'अपनी ज़रूरत के अनुसार 6 फंडों के प्रतिशत अनुपात को कभी भी कस्टमाइज़ करें।'
        }
      ],
      proTip: 'जब भी 7-फंड प्रतिशत बदलें, सुनिश्चित करें कि सभी 6 फंडों का कुल योग ठीक 100% हो।'
    },
    {
      id: 'backup',
      title: '11. बैकअप, रिस्टोर एवं डेटा संप्रभुता',
      subtitle: 'JSON बैकअप फ़ाइलें, ऑफलाइन रिस्टोर व शून्य क्लाउड निर्भरता',
      overviewHeading: 'अपने डेटा पर 100% आपका अधिकार',
      overviewText: 'चूंकि Daily Khata किसी भी रिमोट सर्वर पर निर्भर नहीं है, इसलिए आपका डेटा पूरी तरह आपके नियंत्रण में है। जब भी आप फोन या कंप्यूटर बदलना चाहें, बस JSON बैकअप डाउनलोड करें और नए डिवाइस पर रिस्टोर कर लें।',
      stepsHeading: 'बैकअप व रिस्टोर करने के चरण:',
      steps: [
        {
          step: 'चरण 1',
          title: 'बैकअप डाउनलोड करें',
          desc: 'सेटिंग्स > डेटा बैकअप खोलें और "JSON बैकअप डाउनलोड करें" पर क्लिक करें।'
        },
        {
          step: 'चरण 2',
          title: 'फ़ाइल सुरक्षित रखें',
          desc: 'इस JSON फ़ाइल को अपनी निजी ड्राइव, ईमेल या पेनड्राइव में सहेज कर रखें।'
        },
        {
          step: 'चरण 3',
          title: 'कभी भी रिस्टोर करें',
          desc: 'किसी भी डिवाइस पर ऐप खोलें, "JSON फ़ाइल से रिस्टोर करें" चुनें और अपना बैकअप लोड करें।'
        }
      ],
      proTip: 'ब्राउज़र कैश साफ़ करने या नया फोन बदलने से पहले हमेशा एक ताज़ा JSON बैकअप डाउनलोड करें।'
    },
    {
      id: 'source_code',
      title: '12. सोर्स कोड, गिटहब एवं सुरक्षा ऑडिट',
      subtitle: 'MIT ओपन-सोर्स पारदर्शिता, गिटहब रिपॉजिटरी व स्वयं सत्यापन गाइड',
      overviewHeading: 'खुली पारदर्शिता का वचन',
      overviewText: 'हमारा मानना है कि प्राइवेसी के लिए किसी के वादे पर निर्भर नहीं रहना चाहिए। Daily Khata Pro MIT लाइसेंस के तहत 100% ओपन सोर्स है। कोई भी व्यक्ति कोड की स्वतंत्र रूप से समीक्षा, ऑडिट और संचालन कर सकता है।',
      cardsHeading: 'पारदर्शिता की प्रमुख बातें',
      cards: [
        {
          title: 'आधिकारिक गिटहब रिपॉजिटरी',
          desc: 'github.com/hasvolt/Daily-Khata-Pro पर जाकर 100% सोर्स कोड देखें।'
        },
        {
          title: 'शून्य रिमोट डेटाबेस कॉल',
          desc: 'शून्य टेलीमेट्री, शून्य ट्रैकिंग पिक्सेल, शून्य एनालिटिक्स SDKs और शून्य डेटा शेयरिंग।'
        },
        {
          title: 'स्वयं DevTools ऑडिट',
          desc: 'ब्राउज़र में F12 दबाएं, Network टैब देखें और सत्यापित करें कि 0 डेटा बाहर जाता है।'
        },
        {
          title: 'MIT ओपन सोर्स लाइसेंस',
          desc: 'अध्ययन करने, संशोधित करने, स्थानीय रूप से चलाने और सुधारने के लिए पूरी तरह स्वतंत्र।'
        }
      ],
      proTip: 'हवाई जहाज़ मोड (Airplane Mode) चालू करके ऐप चलाएं; ऐप बिना इंटरनेट के 100% सुचारू रूप से चलता है।'
    },
    {
      id: 'faq',
      title: '13. अक्सर पूछे जाने वाले प्रश्न (FAQ)',
      subtitle: 'ऑफ़लाइन डेटा, पिन रिकवरी और गणितीय गणनाओं से जुड़े महत्वपूर्ण उत्तर',
      overviewHeading: 'अक्सर पूछे जाने वाले सवाल और उनके जवाब',
      overviewText: 'यहाँ हमारे उपयोगकर्ताओं द्वारा सबसे ज़्यादा पूछे जाने वाले सवालों के विस्तृत जवाब दिए गए हैं:',
      faqList: [
        {
          q: 'क्या मेरा वित्तीय डेटा किसी सर्वर पर सुरक्षित है?',
          a: 'नहीं। Daily Khata Pro पूरी तरह से 100% क्लाइंट-साइड ऑफलाइन चलता है। आपके सभी बैलेंस, लेनदेन, लक्ष्य और नोट्स केवल आपके डिवाइस के लोकल स्टोरेज (hasvolt_khata_v1) में सहेजे जाते हैं।'
        },
        {
          q: 'अगर मैं ऐप लॉक का पिन भूल जाऊं तो क्या होगा?',
          a: 'लॉक स्क्रीन पर "पिन भूल गए?" पर क्लिक करें। आपसे वही सुरक्षा प्रश्न पूछा जाएगा जो आपने पिन बनाते समय चुना था। सही उत्तर देते ही आप बिना डेटा खोए नया पिन बना सकते हैं।'
        },
        {
          q: 'क्या मैं Daily Khata को एक से ज़्यादा फ़ोन या लैपटॉप पर चला सकता हूँ?',
          a: 'हाँ। बस अपने पहले फ़ोन से JSON बैकअप डाउनलोड करें (Settings > डेटा बैकअप > Export JSON) और दूसरे फ़ोन में Daily Khata खोलकर उसे रिस्टोर (Import JSON) कर लें।'
        },
        {
          q: 'क्या मैं 7-फंड के प्रतिशत को बदल सकता हूँ?',
          a: 'हाँ। Settings > 7-फंड नियम में जाएं। आप अपनी इच्छा अनुसार 6 फंडों के प्रतिशत बदल सकते हैं, बस सभी का कुल योग 100% होना चाहिए।'
        },
        {
          q: 'क्या इस ऐप को चलाने के लिए इंटरनेट कनेक्शन ज़रूरी है?',
          a: 'बिल्कुल नहीं। Daily Khata Pro एक प्रोग्रेसिव ऑफलाइन वेब ऐप (PWA) है और बिना इंटरनेट के भी सभी सुविधाएं पूरी तरह काम करती हैं।'
        }
      ]
    },
    {
      id: 'developer',
      title: '14. डेवलपर एवं संस्थापक प्रोफाइल',
      subtitle: 'एमडी जफीर हसन द्वारा निर्मित • HasVolt ऑफिशियल मिशन',
      overviewHeading: 'संस्थापक का मिशन एवं दृष्टिकोण',
      overviewText: 'Daily Khata Pro की परिकल्पना और निर्माण एमडी जफीर हसन द्वारा HasVolt के तहत किया गया है। इसका उद्देश्य एक ऐसा स्वतंत्र, सुरुचिपूर्ण और सुरक्षित वित्तीय उपकरण बनाना है जो उपयोगकर्ताओं को उनके डेटा की पूरी गोपनीयता और संप्रभुता दे।',
      cardsHeading: 'डेवलपर विनिर्देश',
      cards: [
        {
          title: 'संस्थापक एवं आर्किटेक्ट',
          desc: 'एमडी जफीर हसन — प्राइवेसी-फर्स्ट डिजिटल टूल्स के निर्माता।'
        },
        {
          title: 'आधिकारिक प्लेटफॉर्म',
          desc: 'HasVolt Digital Tools — hasvolt.com एवं rozfiber.com'
        },
        {
          title: 'ओपन सोर्स लाइसेंस',
          desc: 'MIT Permissive License — दुनिया भर के उपयोग और अध्ययन के लिए मुफ्त।'
        },
        {
          title: 'सीधा संपर्क एवं सपोर्ट',
          desc: 'ईमेल: mdzafeerhasan.official@gmail.com'
        }
      ],
      proTip: 'सुझावों, कोड योगदान या नई सुविधाओं के अनुरोध के लिए आधिकारिक गिटहब रिपॉजिटरी पर जाएं।'
    }
  ]
};

// Hinglish Translation Bundle (Indian Conversational English/Hindi)
const MANUAL_HINGLISH: UserManualTranslation = {
  ...MANUAL_HI,
  title: 'User Manual & Comprehensive Guide',
  subtitle: 'Systematic financial discipline aur 6-fund formula ki official guide.',
  searchPlaceholder: 'User guide mein search karein (e.g. 6 funds, app lock, backup, goals)...',
  officialGuide: 'Official User Guide',
  backToHome: 'Back to Khata',
  sectionsHeading: 'Manual Chapters',
  tableOfContents: 'Table of Contents',
  keyHighlights: 'Key Principles & Rules',
  stepByStep: 'Step-by-Step Instructions',
  proTipLabel: 'Financial Discipline Pro Tip',
  quickAction: 'Open Related Feature'
};

// Urdu Translation Bundle
const MANUAL_UR: UserManualTranslation = {
  ...MANUAL_HI,
  title: 'صارف کی رہنمائی اور مکمل گائیڈ',
  subtitle: 'مالیاتی نظم و ضبط، 6 فنڈ فارمولہ اور مکمل پرائیویسی کے ساتھ آف لائن اکاؤنٹنگ گائیڈ۔',
  searchPlaceholder: 'گائیڈ میں تلاش کریں (مثلاً 6 فنڈز، ایپ لاک، بیک اپ، اہداف)...',
  officialGuide: 'سرکاری گائیڈ',
  backToHome: 'کھاتہ پر واپس جائیں',
  sectionsHeading: 'رہنمائی کے ابواب',
  tableOfContents: 'فہرست مضامین',
  keyHighlights: 'بنیادی اصول اور قواعد',
  stepByStep: 'مرحلہ وار ہدایات',
  proTipLabel: 'مالیاتی مشورہ',
  quickAction: 'متعلقہ فیچر کھولیں'
};

// Bengali Translation Bundle
const MANUAL_BN: UserManualTranslation = {
  ...MANUAL_HI,
  title: 'ব্যবহারকারী নির্দেশিকা এবং সম্পূর্ণ গাইড',
  subtitle: 'আর্থিক শৃঙ্খলা, ৬-তহবিল সূত্র এবং ১০০% গোপনীয় অফলাইন হিসাব পরিচালনার গাইড।',
  searchPlaceholder: 'গাইড অনুসন্ধান করুন (যেমন ৬ তহবিল, অ্যাপ লক, ব্যাকআপ, লক্ষ্য)...',
  officialGuide: 'অফিসিয়াল গাইড',
  backToHome: 'খাতায় ফিরে যান',
  sectionsHeading: 'নির্দেশিকা অধ্যায়',
  tableOfContents: 'সূচিপত্র',
  keyHighlights: 'মূল নিয়ম ও নীতি',
  stepByStep: 'ধাপে ধাপে নির্দেশাবলী',
  proTipLabel: 'আর্থিক শৃঙ্খলা টিপ',
  quickAction: 'সম্পর্কিত ফিচার খুলুন'
};

// Spanish Translation Bundle
const MANUAL_ES: UserManualTranslation = {
  ...MANUAL_EN,
  title: 'Manual de Usuario y Guía Completa',
  subtitle: 'Guía oficial de disciplina financiera, asignación de 6 fondos y contabilidad sin conexión.',
  searchPlaceholder: 'Buscar en el manual (ej. 6 fondos, bloqueo, copia de seguridad)...',
  officialGuide: 'Guía Oficial de Usuario',
  backToHome: 'Volver a Khata',
  sectionsHeading: 'Capítulos del Manual',
  tableOfContents: 'Tabla de Contenidos',
  keyHighlights: 'Principios y Reglas Clave',
  stepByStep: 'Instrucciones Paso a Paso',
  proTipLabel: 'Consejo de Disciplina Financiera',
  quickAction: 'Abrir Función Relacionada'
};

// Arabic Translation Bundle
const MANUAL_AR: UserManualTranslation = {
  ...MANUAL_EN,
  title: 'دليل المستخدم والدليل الشامل',
  subtitle: 'الدليل الرسمي للانضباط المالي، وتخصيص الصناديق الستة، والمحاسبة غير المتصلة بالإنترنت.',
  searchPlaceholder: 'البحث في الدليل (مثل الصناديق الستة، قفل التطبيق، النسخ الاحتياطي)...',
  officialGuide: 'دليل المستخدم الرسمي',
  backToHome: 'العودة إلى الحساب',
  sectionsHeading: 'أقسام الدليل',
  tableOfContents: 'جدول المحتويات',
  keyHighlights: 'المبادئ والقواعد الأساسية',
  stepByStep: 'تعليمات خطوة بخطوة',
  proTipLabel: 'نصيحة الانضباط المالي',
  quickAction: 'فتح الميزة ذات الصلة'
};

// French Translation Bundle
const MANUAL_FR: UserManualTranslation = {
  ...MANUAL_EN,
  title: 'Manuel d\'utilisation et guide complet',
  subtitle: 'Guide officiel de discipline financière, d\'allocation en 6 fonds et de comptabilité hors ligne.',
  searchPlaceholder: 'Rechercher dans le manuel (ex: 6 fonds, verrouillage, sauvegarde)...',
  officialGuide: 'Guide Officiel de l\'Utilisateur',
  backToHome: 'Retour à Khata',
  sectionsHeading: 'Chapitres du Manuel',
  tableOfContents: 'Table des Matières',
  keyHighlights: 'Principes et Règles Clés',
  stepByStep: 'Instructions Étape par Étape',
  proTipLabel: 'Conseil de Discipline Financière',
  quickAction: 'Ouvrir la Fonctionnalité'
};

// German Translation Bundle
const MANUAL_DE: UserManualTranslation = {
  ...MANUAL_EN,
  title: 'Benutzerhandbuch & Umfassender Leitfaden',
  subtitle: 'Offizieller Leitfaden für Finanzdisziplin, 6-Fonds-Aufteilung und Offline-Buchhaltung.',
  searchPlaceholder: 'Im Handbuch suchen (z.B. 6 Fonds, PIN-Sperre, Backup)...',
  officialGuide: 'Offizieller Benutzerleitfaden',
  backToHome: 'Zurück zu Khata',
  sectionsHeading: 'Kapitel des Handbuchs',
  tableOfContents: 'Inhaltsverzeichnis',
  keyHighlights: 'Wichtige Grundsätze & Regeln',
  stepByStep: 'Schritt-für-Schritt-Anleitung',
  proTipLabel: 'Finanzdisziplin-Tipp',
  quickAction: 'Zugehörige Funktion öffnen'
};

// Russian Translation Bundle
const MANUAL_RU: UserManualTranslation = {
  ...MANUAL_EN,
  title: 'Руководство пользователя и полное руководство',
  subtitle: 'Официальное руководство по финансовой дисциплине, распределению 6 фондов и автономному учету.',
  searchPlaceholder: 'Поиск по руководству (напр., 6 фондов, блокировка, резервное копирование)...',
  officialGuide: 'Официальное руководство пользователя',
  backToHome: 'Назад к Khata',
  sectionsHeading: 'Главы руководства',
  tableOfContents: 'Содержание',
  keyHighlights: 'Ключевые принципы и правила',
  stepByStep: 'Пошаговые инструкции',
  proTipLabel: 'Совет по финансовой дисциплине',
  quickAction: 'Открыть связанную функцию'
};

// Portuguese Translation Bundle
const MANUAL_PT: UserManualTranslation = {
  ...MANUAL_EN,
  title: 'Manual do Usuário e Guia Abrangente',
  subtitle: 'Guia oficial para disciplina financeira, alocação em 6 fundos e contabilidade offline.',
  searchPlaceholder: 'Pesquisar no manual (ex: 6 fundos, bloqueio, backup)...',
  officialGuide: 'Guia Oficial do Usuário',
  backToHome: 'Voltar ao Khata',
  sectionsHeading: 'Capítulos do Manual',
  tableOfContents: 'Índice',
  keyHighlights: 'Princípios e Regras Principais',
  stepByStep: 'Instruções Passo a Passo',
  proTipLabel: 'Dica de Disciplina Financeira',
  quickAction: 'Abrir Recurso Relacionado'
};

// Indonesian Translation Bundle
const MANUAL_ID: UserManualTranslation = {
  ...MANUAL_EN,
  title: 'Panduan Pengguna & Panduan Lengkap',
  subtitle: 'Panduan resmi untuk disiplin keuangan, alokasi 6 dana, dan pembukuan offline.',
  searchPlaceholder: 'Cari panduan (mis. 6 dana, kunci aplikasi, cadangan)...',
  officialGuide: 'Panduan Pengguna Resmi',
  backToHome: 'Kembali ke Khata',
  sectionsHeading: 'Bab Panduan',
  tableOfContents: 'Daftar Isi',
  keyHighlights: 'Prinsip & Aturan Utama',
  stepByStep: 'Petunjuk Langkah demi Langkah',
  proTipLabel: 'Kiat Disiplin Keuangan',
  quickAction: 'Buka Fitur Terkait'
};

// Japanese Translation Bundle
const MANUAL_JA: UserManualTranslation = {
  ...MANUAL_EN,
  title: 'ユーザーマニュアル＆総合ガイド',
  subtitle: '規律ある資金管理、6つのファンド配分、オフライン家計簿の公式ガイド。',
  searchPlaceholder: 'マニュアルを検索（例：6つのファンド、アプリロック、バックアップ）...',
  officialGuide: '公式ユーザーガイド',
  backToHome: 'Khataに戻る',
  sectionsHeading: 'マニュアルの章',
  tableOfContents: '目次',
  keyHighlights: '重要な原則とルール',
  stepByStep: 'ステップバイステップの手順',
  proTipLabel: '資金管理のプロのヒント',
  quickAction: '関連機能を開く'
};

// Chinese Translation Bundle
const MANUAL_ZH: UserManualTranslation = {
  ...MANUAL_EN,
  title: '用户手册与综合指南',
  subtitle: '财务纪律、6基金资本分配及离线安全记账官方指南。',
  searchPlaceholder: '搜索手册（如 6个基金、应用锁、备份、目标）...',
  officialGuide: '官方用户指南',
  backToHome: '返回账本',
  sectionsHeading: '手册章节',
  tableOfContents: '目录',
  keyHighlights: '核心原则与规则',
  stepByStep: '分步操作说明',
  proTipLabel: '财务纪律专业建议',
  quickAction: '打开相关功能'
};

const USER_MANUAL_TRANSLATIONS: Record<AppLanguage, UserManualTranslation> = {
  en: MANUAL_EN,
  hi: MANUAL_HI,
  hinglish: MANUAL_HINGLISH,
  ur: MANUAL_UR,
  bn: MANUAL_BN,
  es: MANUAL_ES,
  ar: MANUAL_AR,
  fr: MANUAL_FR,
  de: MANUAL_DE,
  ru: MANUAL_RU,
  pt: MANUAL_PT,
  id: MANUAL_ID,
  ja: MANUAL_JA,
  zh: MANUAL_ZH
};

export function getUserManualContent(lang?: string): UserManualTranslation {
  const normalized = (lang || 'en').toLowerCase() as AppLanguage;
  return USER_MANUAL_TRANSLATIONS[normalized] || USER_MANUAL_TRANSLATIONS.en;
}
