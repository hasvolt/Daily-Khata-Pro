import { CommercialArticle } from './newsPortalData';

export const EXPANDED_ARTICLES_BATCH_7: CommercialArticle[] = [
  {
    id: 'sovereign-rbi-tokenization-card-fraud-prevention-rules',
    title: 'Card-on-File Tokenization: RBI’s Cybersecurity Shield Against Payment Gateway Data Leaks',
    hindiTitle: 'कार्ड टोकनाइजेशन: ऑनलाइन पेमेंट गेटवे डेटा लीक के खिलाफ आरबीआई का अचूक सुरक्षा कवच',
    subtitle: 'How mathematical surrogate tokens prevent e-commerce merchants from storing 16-digit debit/credit card numbers and CVV codes.',
    hindiSubtitle: 'ई-कॉमर्स वेबसाइटों पर असली कार्ड नंबर व सीवीवी सेव होने से रोकने और साइबर हैकिंग से सुरक्षा का संपूर्ण तकनीकी विश्लेषण।',
    category: 'tech-ai',
    categoryLabel: { en: 'Tech, AI & Fintech', hi: 'एआई, टेक व फिनटेक' },
    readTime: '8 min read',
    publishedAt: 'Jul 20, 2026',
    author: {
      name: 'Sourabh K. Mathur',
      role: 'Cybersecurity & Payment Infrastructure Auditor',
      organization: 'Digital Banking Security Directorate',
      avatarInitials: 'SM'
    },
    heroImageGradient: 'from-slate-950 via-purple-950 to-indigo-950',
    heroBadge: 'CYBER DEFENSE',
    keyTakeaways: [
      {
        en: 'The RBI prohibits e-commerce merchants and payment aggregators from storing actual 16-digit debit or credit card credentials on their databases.',
        hi: 'आरबीआई ने ई-कॉमर्स कंपनियों और पेमेंट गेटवे द्वारा अपने सर्वर पर ग्राहकों के असली 16-अंकों वाले कार्ड नंबर सुरक्षित रखने पर पूर्ण रोक लगा दी है।'
      },
      {
        en: 'Tokenization replaces actual card details with an algorithmically generated unique encrypted token tied specifically to a single device and merchant.',
        hi: 'टोकनाइजेशन असली कार्ड नंबर की जगह एक विशिष्ट एन्क्रिप्टेड कोड (टोकन) जनरेट करता है जो केवल उसी डिवाइस और वेबसाइट के लिए मान्य होता है।'
      },
      {
        en: 'Even if a merchant’s database suffers a severe cybersecurity breach, the stolen tokens are useless and cannot be exploited on any other website.',
        hi: 'यदि किसी शॉपिंग वेबसाइट का डेटा हैक भी हो जाए, तो चुराए गए टोकन का इस्तेमाल किसी अन्य साइट पर नहीं किया जा सकता, जिससे ग्राहक 100% सुरक्षित रहते हैं।'
      }
    ],
    marketImpact: {
      status: 'Bullish',
      sentimentLabel: 'Uncompromising Consumer Security'
    },
    keyStats: [
      { value: 'Zero Card Data', label: 'Stored on Merchant Servers', hindiLabel: 'वेबसाइट सर्वर पर शून्य कार्ड डेटा', change: 'RBI Mandate' },
      { value: 'Device-Bound', label: 'Cryptographic Token Security', hindiLabel: 'उपकरण व मर्चेंट से बंधा सुरक्षित टोकन', change: 'Breach-Proof' },
      { value: '100% Free', label: 'Token Generation Cost for Consumers', hindiLabel: 'उपभोक्ताओं के लिए टोकन निर्माण बिल्कुल मुफ्त', change: 'No Extra Fee' }
    ],
    contentSections: [
      {
        heading: 'Why Merchant Database Leaks Were Ruining Cardholders',
        hindiHeading: 'शॉपिंग वेबसाइटों के डेटा लीक से ग्राहकों को क्यों होता था भारी नुकसान?',
        paragraphs: [
          {
            en: 'Before mandatory tokenization, nearly every food delivery, online shopping, and travel booking website stored customers’ plain-text card numbers and expiry dates to facilitate "one-click checkout." When malicious actors breached these commercial servers, millions of card records were dumped on the dark web for unauthorized international transactions. Tokenization rendered this entire cyber-crime ecosystem obsolete overnight.',
            hi: 'टोकनाइजेशन नियम से पहले, ऑनलाइन शॉपिंग और ट्रैवल बुकिंग वेबसाइटें ग्राहकों के कार्ड नंबर और एक्सपायरी डेट अपने सर्वर पर सेव कर लेती थीं। जब भी कोई वेबसाइट हैक होती थी, तो लाखों कार्ड का डेटा डार्क वेब पर बिक जाता था। टोकनाइजेशन ने इस पूरे साइबर क्राइम को एक झटके में पूरी तरह खत्म कर दिया है।'
          }
        ]
      }
    ],
    tags: ['Tokenization', 'Cyber Security', 'RBI Rules', 'Credit Cards', 'Data Breach', 'Digital Safety']
  },
  {
    id: 'sovereign-rbi-floating-rate-term-deposit-indexation-guard',
    title: 'Floating Rate Fixed Deposits (FRFD): Protecting Cash Savings from Interest Rate Cyclicality',
    hindiTitle: 'फ्लोटिंग रेट फिक्स्ड डिपॉजिट (FRFD): महंगाई और गिरती ब्याज दरों से बचत की सुरक्षा',
    subtitle: 'Why locking long-term liquidity in static fixed deposits loses purchasing power and how floating rate FDs adapt dynamically.',
    hindiSubtitle: 'स्थिर ब्याज दर वाली बैंक एफडी में पैसे फंसाने के बजाय फ्लोटिंग एफडी के जरिए हर छह महीने में बढ़ते ब्याज का लाभ कैसे उठाएं।',
    category: 'wealth',
    categoryLabel: { en: 'Capital Markets & Wealth', hi: 'शेयर बाज़ार व वेल्थ' },
    readTime: '8 min read',
    publishedAt: 'Jul 18, 2026',
    author: {
      name: 'Pooja Venkateshwaran',
      role: 'Retail Banking Products & Treasury Lead',
      organization: 'Consumer Banking & Wealth Guild',
      avatarInitials: 'PV'
    },
    heroImageGradient: 'from-blue-950 via-slate-900 to-cyan-950',
    heroBadge: 'BANKING ADVICE',
    keyTakeaways: [
      {
        en: 'Floating Rate Fixed Deposits benchmark their interest rate to an external reference rate (such as the RBI Repo Rate or Treasury Bill yield).',
        hi: 'फ्लोटिंग रेट फिक्स्ड डिपॉजिट अपनी ब्याज दर को बाहरी बेंचमार्क (जैसे आरबीआई रेपो रेट या ट्रेजरी बिल यील्ड) से जोड़ते हैं।'
      },
      {
        en: 'Depositors automatically benefit from rate hikes during inflationary cycles without needing to break the deposit and pay premature penalties.',
        hi: 'महंगाई के समय जब भी आरबीआई ब्याज दरें बढ़ाता है, तो जमाकर्ताओं को बिना पुरानी एफडी तोड़े और बिना जुर्माना दिए स्वतः बढ़ी हुई दर का लाभ मिलता है।'
      },
      {
        en: 'Eliminates the regret of locking long-term savings at cyclical interest rate troughs.',
        hi: 'यह सबसे कम ब्याज दरों के दौर में अपनी मेहनत की बचत को कई सालों के लिए फंसाने के अफसोस से पूरी तरह बचाता है।'
      }
    ],
    marketImpact: {
      status: 'Neutral',
      sentimentLabel: 'Dynamic Cashflow Protection'
    },
    keyStats: [
      { value: 'Semi-Annual', label: 'Rate Reset Period Frequency', hindiLabel: 'ब्याज दर पुनरीक्षण की छमाही अवधि', change: 'Dynamic' },
      { value: 'Zero Penalty', label: 'No Exit Fee Required for Automatic Upward Revision', hindiLabel: 'दर बढ़ने पर एफडी तोड़ने की कोई जरूरत नहीं', change: 'Auto-Adjust' },
      { value: 'DICGC Covered', label: 'Principal Insurance Up to ₹5 Lakh', hindiLabel: '₹5 लाख तक सरकारी जमा बीमा सुरक्षा', change: 'Insured' }
    ],
    contentSections: [
      {
        heading: 'The Inherent Inflation Penalty of Vanilla Bank FDs',
        hindiHeading: 'पारंपरिक बैंक सावधि जमा (FD) में छिपा हुआ महंगाई का नुकसान',
        paragraphs: [
          {
            en: 'When a saver locks in a 5-year fixed deposit at a fixed 6.50% interest rate during a rate trough, and subsequent inflation spikes force the central bank to hike benchmark rates to 8.50%, the saver is trapped in negative real yields. Floating Rate Term Deposits eliminate this asymmetry by moving synchronously with macroeconomic monetary conditions.',
            hi: 'जब कोई व्यक्ति मंदी के समय 6.50% की निश्चित दर पर 5 साल की एफडी करा लेता है और बाद में महंगाई बढ़ने पर बाजार दरें 8.50% हो जाती हैं, तो उसे हर साल भारी नुकसान होता है। फ्लोटिंग एफडी इस विसंगति को दूर करती है और बाजार की दरों के साथ-साथ आपके रिटर्न को भी स्वतः बढ़ाती है।'
          }
        ]
      }
    ],
    tags: ['Floating FD', 'Fixed Deposits', 'Repo Rate', 'Inflation Hedge', 'Banking Products', 'Safe Savings']
  },
  {
    id: 'freelancer-presumptive-taxation-section-44ada-cashflow-rules',
    title: 'Section 44ADA Presumptive Taxation for Professionals: 50% Profit Rule & 44AB Exemption',
    hindiTitle: 'पेशेवरों के लिए धारा 44ADA प्रिजम्प्टिव टैक्सेशन: 50% खर्च नियम व ऑडिट से पूर्ण मुक्ति',
    subtitle: 'How software consultants, lawyers, doctors, and designers earning up to ₹75 Lakh declare only 50% as taxable profit with zero books.',
    hindiSubtitle: 'सॉफ्टवेयर इंजीनियरों, वकीलों, डॉक्टरों और फ्रीलांसर्स द्वारा बिना बहीखाता रखे अपनी कमाई के 50% हिस्से पर ही टैक्स भरने की कानूनी छूट।',
    category: 'policy',
    categoryLabel: { en: 'Tax & Regulations', hi: 'टैक्स व नीतियां' },
    readTime: '9 min read',
    publishedAt: 'Jul 15, 2026',
    author: {
      name: 'CA Sandeep Goyal',
      role: 'Partner, Professional & Gig Economy Taxation',
      organization: 'Chartered Professionals Tax Confederation',
      avatarInitials: 'SG'
    },
    heroImageGradient: 'from-slate-950 via-emerald-950 to-blue-950',
    heroBadge: 'GIG ECONOMY TAX',
    keyTakeaways: [
      {
        en: 'Section 44ADA allows notified professionals with gross receipts up to ₹75 Lakh (if digital receipts exceed 95%) to declare just 50% as taxable income.',
        hi: 'धारा 44ADA ₹75 लाख तक की कमाई वाले पेशेवरों को (यदि 95% भुगतान डिजिटल हैं) अपनी कुल कमाई का केवल 50% ही कर योग्य लाभ दर्शाने की छूट देती है।'
      },
      {
        en: 'Complete exemption from maintaining voluminous books of accounts under Section 44AA and mandatory tax audit under Section 44AB.',
        hi: 'धारा 44AA के तहत भारी-भरकम बहीखाते रखने और धारा 44AB के तहत सीए द्वारा अनिवार्य टैक्स ऑडिट कराने से पूरी तरह छूट मिलती है।'
      },
      {
        en: 'The remaining 50% is legally presumed to cover home office overheads, software licenses, gadget depreciation, and communication expenses.',
        hi: 'बाकी 50% राशि को कानूनी रूप से घर के ऑफिस, लैपटॉप के मूल्यह्रास, सॉफ्टवेयर और इंटरनेट खर्च के रूप में स्वतः मान लिया जाता है।'
      }
    ],
    marketImpact: {
      status: 'Bullish',
      sentimentLabel: 'Massive Compliance Relief for Professionals'
    },
    keyStats: [
      { value: '50% Flat', label: 'Presumed Statutory Professional Expenditure', hindiLabel: 'कानूनी रूप से मान्य 50% व्यावसायिक खर्च', change: 'No Bills Needed' },
      { value: '₹75 Lakh', label: 'Turnover Ceiling with 95% Digital Receipts', hindiLabel: 'डिजिटल भुगतानों के साथ अधिकतम सीमा', change: 'Raised Limit' },
      { value: 'Zero Audit', label: 'Exemption from Chartered Accountant Tax Audit', hindiLabel: 'सीए टैक्स ऑडिट की कोई जरूरत नहीं', change: 'Section 44AB Relief' }
    ],
    contentSections: [
      {
        heading: 'Ending the Nightmare of Individual Invoice Accounting',
        hindiHeading: 'फ्रीलांसर्स के लिए एक-एक बिल सहेजने के झंझट का खात्मा',
        paragraphs: [
          {
            en: 'For freelance developers, UI/UX designers, and management consultants working with overseas remote clients, tracking receipts for coffee, electricity, and laptop depreciation to defend against tax officer scrutiny was a painful drain on productive hours. Section 44ADA cuts through this bureaucracy by providing a clear statutory presumption: if you receive ₹40 Lakh, you pay tax on exactly ₹20 Lakh.',
            hi: 'विदेशी कंपनियों के लिए रिमोट काम करने वाले सॉफ्टवेयर इंजीनियरों और डिजाइनरों के लिए लैपटॉप, इंटरनेट और बिजली के बिलों का हिसाब रखना बहुत सिरदर्द भरा काम था। धारा 44ADA ने इसे बेहद सरल बना दिया: यदि आपकी कुल कमाई ₹40 लाख है, तो सरकार मानती है कि ₹20 लाख आपका खर्च हो गया और आपको केवल ₹20 लाख पर ही टैक्स देना है।'
          }
        ]
      }
    ],
    tags: ['Section 44ADA', 'Presumptive Tax', 'Freelancers', 'Remote Work', 'Income Tax', 'Gig Economy']
  },
  {
    id: 'sebi-algo-trading-guidelines-retail-investor-safeguards',
    title: 'SEBI Algorithmic Trading Safeguards: API Risk Controls, Latency Floors & Retail Protections',
    hindiTitle: 'सेबी एल्गोरिद्मिक ट्रेडिंग नियम: ऑटोमेटेड ट्रेडिंग बॉट्स पर लगाम व खुदरा निवेशकों की सुरक्षा',
    subtitle: 'How regulatory testing sandboxes, unique strategy identifiers, and rate limits prevent flash crashes and rogue code disasters.',
    hindiSubtitle: 'एल्गो ट्रेडिंग के जरिए छोटे निवेशकों को भारी नुकसान से बचाने के लिए सेबी द्वारा तय किए गए कड़े तकनीकी व कानूनी नियम।',
    category: 'wealth',
    categoryLabel: { en: 'Capital Markets & Wealth', hi: 'शेयर बाज़ार व वेल्थ' },
    readTime: '8 min read',
    publishedAt: 'Jul 12, 2026',
    author: {
      name: 'Ashwin N. Varma',
      role: 'Algorithmic Market Infrastructure Analyst',
      organization: 'Quantitative Finance & Market Integrity Forum',
      avatarInitials: 'AV'
    },
    heroImageGradient: 'from-amber-950 via-slate-900 to-indigo-950',
    heroBadge: 'QUANT TRADING',
    keyTakeaways: [
      {
        en: 'SEBI mandates that all algorithmic trading strategies deployed via broker APIs must be certified and tagged with a unique Strategy Identifier.',
        hi: 'सेबी का सख्त नियम है कि ब्रोकर एपीआई के जरिए चलाई जाने वाली सभी एल्गो ट्रेडिंग रणनीतियों का प्रमाणित होना और यूनिक कोड होना अनिवार्य है।'
      },
      {
        en: 'Order-to-trade ratios (OTR) penalize high-frequency quote stuffing designed to artificially slow down retail order execution.',
        hi: 'ऑर्डर-टू-ट्रेड रेशियो (OTR) उन संस्थाओं पर भारी जुर्माना लगाता है जो जानबूझकर लाखों फर्जी ऑर्डर डालकर सिस्टम को धीमा करते हैं।'
      },
      {
        en: 'Brokers must provide retail clients with mandatory "kill switches" to terminate runaway automated order executions immediately.',
        hi: 'ब्रोकरों के लिए अपने सॉफ्टवेयर में एक "किल स्विच" देना अनिवार्य है जिससे अचानक गड़बड़ी होने पर ग्राहक एक क्लिक में सभी ऑर्डर रोक सकें।'
      }
    ],
    marketImpact: {
      status: 'Neutral',
      sentimentLabel: 'Prudent Market Discipline'
    },
    keyStats: [
      { value: 'Unique ID', label: 'Mandatory Tag on Every Automated Order', hindiLabel: 'प्रत्येक स्वचालित ऑर्डर पर अनिवार्य टैग', change: 'Audit Trail' },
      { value: 'Kill Switch', label: 'Mandatory Panic Disconnect for Retail Users', hindiLabel: 'एक-क्लिक में एल्गो रोकने का अनिवार्य बटन', change: 'Emergency Stop' },
      { value: 'Zero Stuffing', label: 'Strict Limits on High-Frequency Quote Flooding', hindiLabel: 'फर्जी ऑर्डरों की बाढ़ पर कड़ा प्रतिबंध', change: 'Fair Access' }
    ],
    contentSections: [
      {
        heading: 'Leveling the Playing Field Between Supercomputers and Retail Investors',
        hindiHeading: 'हाई-स्पीड सुपरकंप्यूटरों और आम खुदरा निवेशकों के बीच निष्पक्षता',
        paragraphs: [
          {
            en: 'High-frequency algorithmic trading desks located in colocation centers adjacent to exchange matching engines execute thousands of orders per second. Without stringent oversight, algorithmic glitches can trigger sudden cascading flash crashes that wipe out retail stop-loss orders. SEBI’s rigorous algorithmic guidelines ensure that market integrity is maintained above raw computational speed.',
            hi: 'स्टॉक एक्सचेंज के सर्वर के पास लगे सुपरकंप्यूटर एक सेकंड में हजारों ऑर्डर पंच करते हैं। यदि इन पर निगरानी न रखी जाए, तो कंप्यूटर की किसी गलती से शेयर बाजार कुछ ही मिनटों में धड़ाम हो सकता है जिससे छोटे निवेशकों का भारी नुकसान होता है। सेबी के नए नियम यह सुनिश्चित करते हैं कि बाजार में निष्पक्षता हमेशा बनी रहे।'
          }
        ]
      }
    ],
    tags: ['Algo Trading', 'SEBI', 'Market Safeguards', 'Kill Switch', 'Stock Market', 'Risk Management']
  },
  {
    id: 'pm-mudra-yojana-tarun-plus-limit-expansion-economics',
    title: 'PM MUDRA Yojana Limit Doubled to ₹20 Lakh: Tarun Plus Category & Collateral-Free Credit',
    hindiTitle: 'पीएम मुद्रा योजना की सीमा बढ़कर हुई ₹20 लाख: तरुण प्लस श्रेणी व बिना गारंटी लोन',
    subtitle: 'Detailed eligibility analysis of Shishu, Kishore, Tarun, and newly introduced Tarun Plus loan categories for micro entrepreneurs.',
    hindiSubtitle: 'शिशु, किशोर, तरुण और नई ₹20 लाख वाली "तरुण प्लस" श्रेणी के तहत छोटे व्यापारियों को बिना गारंटी के बैंक लोन मिलने की पूरी प्रक्रिया।',
    category: 'industry',
    categoryLabel: { en: 'Startups & Industry', hi: 'स्टार्टअप्स व उद्योग' },
    readTime: '8 min read',
    publishedAt: 'Jul 10, 2026',
    author: {
      name: 'Babu Lal Meena',
      role: 'Microfinance & Priority Sector Lending Director',
      organization: 'Rural Enterprise Development Council',
      avatarInitials: 'BM'
    },
    heroImageGradient: 'from-emerald-950 via-slate-900 to-amber-950',
    heroBadge: 'MUDRA EXPANSION',
    keyTakeaways: [
      {
        en: 'The maximum loan limit under PM MUDRA Yojana has been doubled from ₹10 Lakh to ₹20 Lakh under the new "Tarun Plus" category.',
        hi: 'पीएम मुद्रा योजना के तहत अधिकतम ऋण सीमा को ₹10 लाख से दोगुना करके नई "तरुण प्लस" श्रेणी के तहत ₹20 लाख कर दिया गया है।'
      },
      {
        en: 'Eligible borrowers who have previously taken and successfully repaid a Tarun loan are automatically eligible for the upgraded ₹20 Lakh ceiling.',
        hi: 'जिन उद्यमियों ने पहले तरुण लोन लिया था और उसका समय पर पूरा भुगतान कर दिया है, वे सीधे ₹20 लाख के नए लोन के लिए पात्र हैं।'
      },
      {
        en: 'Backed by the Credit Guarantee Fund for Micro Units (CGFMU); commercial banks are legally forbidden from demanding third-party collateral.',
        hi: 'यह लोन सूक्ष्म इकाई क्रेडिट गारंटी फंड (CGFMU) द्वारा समर्थित है; बैंक कानूनी रूप से किसी भी प्रकार की जमीन या गारंटी नहीं मांग सकते।'
      }
    ],
    marketImpact: {
      status: 'Bullish',
      sentimentLabel: 'Grassroots Entrepreneurship Boost'
    },
    keyStats: [
      { value: '₹20 Lakh', label: 'Enhanced Maximum Loan Ceiling (Tarun Plus)', hindiLabel: 'तरुण प्लस श्रेणी में अधिकतम लोन सीमा', change: 'Doubled' },
      { value: 'Zero Collateral', label: '100% Guarantee Backed by CGFMU', hindiLabel: 'बिना कोई संपत्ति गिरवी रखे लोन', change: 'Statutory Rule' },
      { value: '₹48 Lakh Cr+', label: 'Cumulative Sanctioned MUDRA Disbursals', hindiLabel: 'अब तक कुल वितरित मुद्रा लोन राशि', change: 'Historic Scale' }
    ],
    contentSections: [
      {
        heading: 'Bridging the "Missing Middle" for Scaling Small Enterprises',
        hindiHeading: 'छोटे व्यवसायों को मध्यम स्तर तक बढ़ाने के लिए वित्तीय पुल',
        paragraphs: [
          {
            en: 'For millions of small manufacturing workshops, automotive repair garages, and food processing units, a ₹10 Lakh loan was adequate for initial setup but inadequate for acquiring modern CNC machinery or expanding working capital inventories. The introduction of the Tarun Plus tier up to ₹20 Lakh bridges this vital growth chasm without saddling entrepreneurs with exorbitant private moneylender rates.',
            hi: 'लाखों छोटी वर्कशॉपों, फूड प्रोसेसिंग यूनिटों और दुकानों के लिए ₹10 लाख का लोन शुरुआती काम के लिए तो ठीक था, लेकिन नई आधुनिक मशीनरी खरीदने या थोक में कच्चा माल लेने के लिए कम पड़ जाता था। ₹20 लाख की नई सीमा ने छोटे उद्यमियों को अपनी क्षमता दोगुनी करने का सुनहरा अवसर प्रदान किया है।'
          }
        ]
      }
    ],
    tags: ['MUDRA Loan', 'Tarun Plus', 'MSME', 'Small Business', 'Collateral Free', 'Government Schemes']
  }
];
