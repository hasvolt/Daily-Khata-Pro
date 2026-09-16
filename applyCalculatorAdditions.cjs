const fs = require('fs');
let code = fs.readFileSync('src/components/CalculatorPage.tsx', 'utf8');

// 1. Add state for Currency and Gold
const stateBlock = `
  // --- 8. Currency (Forex) Converter State ---
  const [currencyAmountInput, setCurrencyAmountInput] = useState<string>('100');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'CAD' | 'AUD'>('USD');
  const [currencyCustomRate, setCurrencyCustomRate] = useState<string>('83.92');
  const [currencyDirection, setCurrencyDirection] = useState<'foreign_to_inr' | 'inr_to_foreign'>('foreign_to_inr');

  const CURRENCY_CONFIGS: Record<string, { symbol: string; name: string; defaultRate: number; flag: string }> = {
    USD: { symbol: '$', name: 'US Dollar', defaultRate: 83.92, flag: '🇺🇸' },
    EUR: { symbol: '€', name: 'Euro', defaultRate: 91.45, flag: '🇪🇺' },
    GBP: { symbol: '£', name: 'British Pound', defaultRate: 108.60, flag: '🇬🇧' },
    AED: { symbol: 'AED', name: 'UAE Dirham', defaultRate: 22.85, flag: '🇦🇪' },
    SAR: { symbol: 'SAR', name: 'Saudi Riyal', defaultRate: 22.38, flag: '🇸🇦' },
    CAD: { symbol: 'CA$', name: 'Canadian Dollar', defaultRate: 61.80, flag: '🇨🇦' },
    AUD: { symbol: 'AU$', name: 'Australian Dollar', defaultRate: 56.40, flag: '🇦🇺' },
  };

  const handleSelectCurrency = (curr: 'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'CAD' | 'AUD') => {
    setSelectedCurrency(curr);
    setCurrencyCustomRate(CURRENCY_CONFIGS[curr].defaultRate.toString());
  };

  const currAmtNum = Math.max(0, parseFloat(currencyAmountInput) || 0);
  const currRateNum = Math.max(0.0001, parseFloat(currencyCustomRate) || 83.92);
  const convertedInr = currencyDirection === 'foreign_to_inr' ? currAmtNum * currRateNum : currAmtNum / currRateNum;

  // --- 9. Gold & Silver Bullion State ---
  const [metalType, setMetalType] = useState<'gold24' | 'gold22' | 'gold18' | 'silver'>('gold24');
  const [metalWeightInput, setMetalWeightInput] = useState<string>('10');
  const [metalWeightUnit, setMetalWeightUnit] = useState<'gm' | 'tola' | 'oz'>('gm');
  const [metalRateInput, setMetalRateInput] = useState<string>('75850');
  const [makingChargesPct, setMakingChargesPct] = useState<string>('8');
  const [goldGstPct, setGoldGstPct] = useState<string>('3');

  const METAL_CONFIGS = {
    gold24: { label: 'Gold 24K (99.9% Pure Bullion)', rate: 75850, unit: '10 Grams' },
    gold22: { label: 'Gold 22K (91.6% Hallmark Jewelry)', rate: 69530, unit: '10 Grams' },
    gold18: { label: 'Gold 18K (75.0% Diamond/Fashion)', rate: 56890, unit: '10 Grams' },
    silver: { label: 'Fine Silver (99.9% Bar / Coin)', rate: 91200, unit: '1 Kilogram' }
  };

  const handleSelectMetal = (m: 'gold24' | 'gold22' | 'gold18' | 'silver') => {
    setMetalType(m);
    setMetalRateInput(METAL_CONFIGS[m].rate.toString());
  };

  const rawWeight = Math.max(0, parseFloat(metalWeightInput) || 0);
  const weightInGrams = metalWeightUnit === 'gm' ? rawWeight : metalWeightUnit === 'tola' ? rawWeight * 11.664 : rawWeight * 31.103;
  const rateInputVal = Math.max(0, parseFloat(metalRateInput) || 0);
  const ratePerGram = metalType === 'silver' ? rateInputVal / 1000 : rateInputVal / 10;
  const metalBaseCost = weightInGrams * ratePerGram;
  const makingPctNum = Math.max(0, parseFloat(makingChargesPct) || 0);
  const makingChargeAmount = (metalBaseCost * makingPctNum) / 100;
  const subtotalBeforeGst = metalBaseCost + makingChargeAmount;
  const gstPctNum = Math.max(0, parseFloat(goldGstPct) || 0);
  const bullionGstAmount = (subtotalBeforeGst * gstPctNum) / 100;
  const grandBullionTotal = subtotalBeforeGst + bullionGstAmount;
  const effectivePerGramCost = weightInGrams > 0 ? grandBullionTotal / weightInGrams : 0;
`;

code = code.replace(
  "const [goalExpectedReturnInput, setGoalExpectedReturnInput] = useState<string>('12');",
  () => "const [goalExpectedReturnInput, setGoalExpectedReturnInput] = useState<string>('12');" + stateBlock
);

// 2. Update navTabs
const oldNavTabs = `  const navTabs: { id: CalculatorViewType; label: string; hindi: string; icon: any }[] = [
    { id: 'standard', label: 'Calculator', hindi: 'साधारण कैलकुलेटर', icon: Calculator },
    { id: 'funds', label: 'Smart Fund Split', hindi: 'स्मार्ट फंड विभाजन', icon: Layers },
    { id: 'sip', label: 'SIP & Wealth', hindi: 'SIP वेल्थ', icon: TrendingUp },
    { id: 'emi', label: 'Loan EMI', hindi: 'लोन EMI', icon: Landmark },
    { id: 'gst', label: 'GST Tax', hindi: 'GST टैक्स', icon: Percent },
    { id: 'discount', label: 'Discount & Margin', hindi: 'छूट एवं मार्जिन', icon: Tag },
    { id: 'inflation', label: 'Goal & Inflation', hindi: 'महंगाई लक्ष्य', icon: Target }
  ];`;

const newNavTabs = `  const navTabs: { id: CalculatorViewType; label: string; hindi: string; icon: any }[] = [
    { id: 'standard', label: 'Standard Calc', hindi: 'साधारण कैलकुलेटर', icon: Calculator },
    { id: 'currency', label: 'Currency / Forex', hindi: 'मुद्रा विनिमय (USD/EUR)', icon: DollarSign },
    { id: 'gold', label: 'Gold & Silver', hindi: 'सोना व चांदी (24K/22K)', icon: Sparkles },
    { id: 'emi', label: 'Loan EMI', hindi: 'लोन EMI', icon: Landmark },
    { id: 'sip', label: 'SIP & Wealth', hindi: 'SIP वेल्थ', icon: TrendingUp },
    { id: 'funds', label: 'Smart Fund Split', hindi: 'स्मार्ट फंड विभाजन', icon: Layers },
    { id: 'gst', label: 'GST Tax', hindi: 'GST टैक्स', icon: Percent },
    { id: 'discount', label: 'Discount & Margin', hindi: 'छूट एवं मार्जिन', icon: Tag },
    { id: 'inflation', label: 'Goal & Inflation', hindi: 'महंगाई लक्ष्य', icon: Target }
  ];`;

code = code.replace(oldNavTabs, () => newNavTabs);

// 3. Update getCurrentCalcParams
const printSlipAdditions = `    if (activeTab === 'currency') {
      return {
        title: isHindi ? 'विदेशी मुद्रा विनिमय गणना' : 'Foreign Currency Exchange Slip',
        type: 'Currency Forex Conversion',
        mainResult: currencyDirection === 'foreign_to_inr' ? formatCurrency(convertedInr) : (CURRENCY_CONFIGS[selectedCurrency]?.symbol || '') + ' ' + convertedInr.toFixed(2),
        resultLabel: currencyDirection === 'foreign_to_inr' ? 'Converted Total in INR' : ('Converted in ' + selectedCurrency),
        items: [
          { label: 'Conversion Direction', value: currencyDirection === 'foreign_to_inr' ? (selectedCurrency + ' to INR') : ('INR to ' + selectedCurrency), isBold: true },
          { label: 'Amount Entered', value: currencyDirection === 'foreign_to_inr' ? ((CURRENCY_CONFIGS[selectedCurrency]?.symbol || '') + ' ' + currAmtNum) : formatCurrency(currAmtNum) },
          { label: 'Exchange Rate Applied', value: '1 ' + selectedCurrency + ' = ₹' + currRateNum.toFixed(2) },
          { label: 'Final Converted Value', value: currencyDirection === 'foreign_to_inr' ? formatCurrency(convertedInr) : ((CURRENCY_CONFIGS[selectedCurrency]?.symbol || '') + ' ' + convertedInr.toFixed(2)), isBold: true, isHighlight: true }
        ],
        notes: 'Calculated via Daily Khata Pro Universal Currency Converter'
      };
    }

    if (activeTab === 'gold') {
      return {
        title: isHindi ? 'स्वर्ण व रजत आभूषण बिल गणना स्लिप' : 'Gold & Silver Bullion Calculation Slip',
        type: 'Precious Metals Valuation',
        mainResult: formatCurrency(grandBullionTotal),
        resultLabel: isHindi ? 'कुल अनुमानित बिल राशि' : 'Total Estimated Bullion Bill',
        items: [
          { label: 'Metal & Purity', value: METAL_CONFIGS[metalType].label, isBold: true },
          { label: 'Weight (Calculated)', value: rawWeight + ' ' + metalWeightUnit + ' (' + weightInGrams.toFixed(2) + ' grams)' },
          { label: 'Base Metal Price', value: formatCurrency(metalBaseCost) },
          { label: 'Making Charges (' + makingPctNum + '%)', value: formatCurrency(makingChargeAmount) },
          { label: 'Bullion GST (' + gstPctNum + '%)', value: formatCurrency(bullionGstAmount) },
          { label: 'Total Payable', value: formatCurrency(grandBullionTotal), isBold: true, isHighlight: true },
          { label: 'Effective Rate / Gram', value: formatCurrency(effectivePerGramCost) }
        ],
        notes: 'Official hallmark benchmark estimates with GST'
      };
    }
`;

code = code.replace("if (activeTab === 'funds') {", () => printSlipAdditions + "\n    if (activeTab === 'funds') {");

// 4. Add the JSX views for Currency and Gold right before the last closing tags
const jsxBlocks = `
      {/* ========================================================================= */}
      {/* 2. CURRENCY (FOREX) CONVERTER */}
      {/* ========================================================================= */}
      {activeTab === 'currency' && (
        <div className="mx-auto max-w-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5 animate-in fade-in duration-150 text-left">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--theme-border,#213E61)]/70 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>{isHindi ? 'विदेशी मुद्रा विनिमय (Forex Calculator)' : 'Universal Currency & Forex Converter'}</span>
              </h2>
              <p className="text-xs text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                {isHindi ? 'USD, EUR, GBP, AED, SAR का भारतीय रुपये (INR) में तत्काल सटीक रूपांतरण' : 'Instant 2-way conversion between Global Currencies and Indian Rupee (INR)'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintCurrent}
                className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-[var(--theme-text-muted,#CBD5E1)] hover:text-emerald-400 hover:border-emerald-400 transition-all cursor-pointer flex items-center gap-1.5"
                title="Print Currency Slip"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Print Slip</span>
              </button>
            </div>
          </div>

          {/* Currency Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)] block">
              {isHindi ? 'मुद्रा चुनें (Select Currency)' : 'Select Target Currency'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(CURRENCY_CONFIGS) as Array<keyof typeof CURRENCY_CONFIGS>).map((currKey) => {
                const item = CURRENCY_CONFIGS[currKey];
                const isChosen = selectedCurrency === currKey;
                return (
                  <button
                    key={currKey}
                    type="button"
                    onClick={() => {
                      handleSelectCurrency(currKey as any);
                      triggerHapticSound('click');
                    }}
                    className={\`p-2.5 rounded-xl border text-left transition-all cursor-pointer \${
                      isChosen
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm ring-1 ring-emerald-400/40'
                        : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] hover:border-emerald-500/40'
                    }\`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{item.flag}</span>
                      <span className="text-[11px] font-mono font-bold">{currKey}</span>
                    </div>
                    <div className="text-xs font-black text-[var(--theme-text,#F8FAFC)] mt-1 truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-mono mt-0.5">
                      1 {currKey} ≈ ₹{item.defaultRate}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversion Direction Toggle */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--theme-text,#F8FAFC)]">
                {currencyDirection === 'foreign_to_inr'
                  ? (selectedCurrency + ' ' + (CURRENCY_CONFIGS[selectedCurrency]?.flag || '') + '  ➜  INR ₹ (Indian Rupee)')
                  : ('INR ₹ (Indian Rupee)  ➜  ' + selectedCurrency + ' ' + (CURRENCY_CONFIGS[selectedCurrency]?.flag || ''))}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrencyDirection(prev => prev === 'foreign_to_inr' ? 'inr_to_foreign' : 'foreign_to_inr');
                triggerHapticSound('click');
              }}
              className="px-3 py-1.5 rounded-xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-primary,#38BDF8)] hover:border-[var(--theme-primary,#38BDF8)] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHindi ? 'दिशा बदलें' : 'Reverse'}</span>
            </button>
          </div>

          {/* Inputs Grid: Amount & Custom Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)] block mb-1.5">
                {currencyDirection === 'foreign_to_inr' ? ('Amount in ' + selectedCurrency + ' (' + CURRENCY_CONFIGS[selectedCurrency]?.symbol + ')') : 'Amount in INR (₹)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={currencyAmountInput}
                  onChange={(e) => setCurrencyAmountInput(e.target.value)}
                  placeholder="100"
                  className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2.5 font-mono text-base font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)]">
                  {'Exchange Rate (1 ' + selectedCurrency + ' = ₹ INR)'}
                </label>
                <button
                  type="button"
                  onClick={() => setCurrencyCustomRate(CURRENCY_CONFIGS[selectedCurrency]?.defaultRate.toString() || '83.92')}
                  className="text-[10px] text-emerald-400 hover:underline font-mono"
                >
                  Reset Default
                </button>
              </div>
              <input
                type="number"
                step="0.01"
                value={currencyCustomRate}
                onChange={(e) => setCurrencyCustomRate(e.target.value)}
                placeholder="83.92"
                className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2.5 font-mono text-base font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Big Converted Result Display Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-[var(--theme-surface,#0E1A29)] to-[var(--theme-surface,#0E1A29)] border border-emerald-500/40 text-center space-y-1.5 shadow-lg">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {currencyDirection === 'foreign_to_inr' ? 'Total Converted Value in Indian Rupee (INR)' : ('Total Converted in ' + selectedCurrency)}
            </div>
            <div className="text-2xl sm:text-4xl font-black font-mono text-[var(--theme-text,#F8FAFC)] tracking-tight">
              {currencyDirection === 'foreign_to_inr' ? formatCurrency(convertedInr) : (CURRENCY_CONFIGS[selectedCurrency]?.symbol + ' ' + convertedInr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
            </div>
            <div className="text-xs text-[var(--theme-text-dim,#94A3B8)] font-mono">
              {currencyDirection === 'foreign_to_inr'
                ? (CURRENCY_CONFIGS[selectedCurrency]?.symbol + ' ' + currAmtNum + ' × ₹' + currRateNum.toFixed(2) + ' per ' + selectedCurrency)
                : ('₹ ' + currAmtNum + ' ÷ ₹' + currRateNum.toFixed(2) + ' per ' + selectedCurrency)}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const text = currencyDirection === 'foreign_to_inr'
                  ? (CURRENCY_CONFIGS[selectedCurrency]?.symbol + ' ' + currAmtNum + ' = ' + formatCurrency(convertedInr))
                  : ('₹ ' + currAmtNum + ' = ' + (CURRENCY_CONFIGS[selectedCurrency]?.symbol || '') + ' ' + convertedInr.toFixed(2));
                handleCopy(text, 'curr-copy');
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)]/40 border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedKey === 'curr-copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'curr-copy' ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>

            {onApplyToIncome && currencyDirection === 'foreign_to_inr' && (
              <button
                type="button"
                onClick={() => onApplyToIncome(Math.round(convertedInr))}
                className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Apply as Income (₹{Math.round(convertedInr).toLocaleString('en-IN')})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GOLD & SILVER BULLION VALUATION */}
      {/* ========================================================================= */}
      {activeTab === 'gold' && (
        <div className="mx-auto max-w-2xl bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5 animate-in fade-in duration-150 text-left">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--theme-border,#213E61)]/70 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[var(--theme-text,#F8FAFC)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{isHindi ? 'स्वर्ण व रजत आभूषण कैलकुलेटर' : 'Gold & Silver Bullion Valuation'}</span>
              </h2>
              <p className="text-xs text-[var(--theme-text-dim,#94A3B8)] mt-0.5">
                {isHindi ? '24K, 22K हॉलमार्क सोना व चांदी: मेकिंग चार्ज, 3% GST एवं प्रति ग्राम शुद्ध दर' : '24K pure bullion, 22K hallmark jewelry & silver with making charges, 3% GST & itemized billing'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintCurrent}
                className="px-2.5 py-1.5 rounded-xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] text-xs font-mono text-[var(--theme-text-muted,#CBD5E1)] hover:text-amber-400 hover:border-amber-400 transition-all cursor-pointer flex items-center gap-1.5"
                title="Print Bullion Slip"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Print Slip</span>
              </button>
            </div>
          </div>

          {/* Metal & Purity Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)] block">
              {isHindi ? 'धातु व शुद्धता चुनें' : 'Select Metal & Purity Standard'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['gold24', 'gold22', 'gold18', 'silver'] as const).map((mKey) => {
                const item = METAL_CONFIGS[mKey];
                const isChosen = metalType === mKey;
                return (
                  <button
                    key={mKey}
                    type="button"
                    onClick={() => {
                      handleSelectMetal(mKey);
                      triggerHapticSound('click');
                    }}
                    className={\`p-2.5 rounded-xl border text-left transition-all cursor-pointer \${
                      isChosen
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm ring-1 ring-amber-400/40'
                        : 'bg-[var(--theme-surface,#0E1A29)] border-[var(--theme-border,#213E61)] text-[var(--theme-text-muted,#CBD5E1)] hover:border-amber-500/40'
                    }\`}
                  >
                    <div className="text-xs font-black text-[var(--theme-text,#F8FAFC)] truncate">
                      {mKey === 'gold24' ? '🪙 Gold 24K' : mKey === 'gold22' ? '💍 Gold 22K (916)' : mKey === 'gold18' ? '✨ Gold 18K' : '🥈 Silver (999)'}
                    </div>
                    <div className="text-[10.5px] font-mono text-amber-400 mt-1 font-bold">
                      ₹{item.rate.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[9.5px] text-[var(--theme-text-dim,#94A3B8)] font-mono mt-0.5">
                      per {item.unit}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weight and Unit Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)] block mb-1.5">
                {isHindi ? 'वज़न (Weight)' : 'Metal Weight'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={metalWeightInput}
                  onChange={(e) => setMetalWeightInput(e.target.value)}
                  placeholder="10"
                  className="flex-1 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2.5 font-mono text-base font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-amber-500 transition-all"
                />
                <div className="flex items-center bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] p-1 rounded-xl gap-1">
                  {(['gm', 'tola', 'oz'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setMetalWeightUnit(u)}
                      className={\`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer \${
                        metalWeightUnit === u
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'text-[var(--theme-text-dim,#94A3B8)] hover:text-white'
                      }\`}
                    >
                      {u === 'gm' ? 'Grams' : u === 'tola' ? 'Tola' : 'Oz'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-[var(--theme-text-dim,#94A3B8)] font-mono mt-1">
                Converted pure weight: <span className="text-amber-400 font-bold">{weightInGrams.toFixed(2)} grams</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)] block mb-1.5">
                {metalType === 'silver' ? 'Rate / 1 KG (₹)' : 'Rate / 10 Grams (₹)'}
              </label>
              <input
                type="number"
                value={metalRateInput}
                onChange={(e) => setMetalRateInput(e.target.value)}
                placeholder="75850"
                className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2.5 font-mono text-base font-bold text-amber-400 focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Charges Grid: Making Charges & GST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)]">
                  {isHindi ? 'मेकिंग चार्ज (Making Charges %)' : 'Making / Craftsmanship (%)'}
                </label>
                <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                  {[0, 6, 8, 12].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setMakingChargesPct(pct.toString())}
                      className="px-1.5 py-0.5 rounded bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] hover:border-amber-400"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                step="0.5"
                value={makingChargesPct}
                onChange={(e) => setMakingChargesPct(e.target.value)}
                placeholder="8"
                className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2.5 font-mono text-base font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)]">
                  {isHindi ? 'जीएसटी (GST %)' : 'Bullion GST Tax (%)'}
                </label>
                <span className="text-[10px] font-mono text-emerald-400">Govt Mandate: 3%</span>
              </div>
              <input
                type="number"
                step="0.5"
                value={goldGstPct}
                onChange={(e) => setGoldGstPct(e.target.value)}
                placeholder="3"
                className="w-full bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl px-3.5 py-2.5 font-mono text-base font-bold text-[var(--theme-text,#F8FAFC)] focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Itemized Billing Breakdown Box */}
          <div className="p-4 rounded-2xl bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-dim,#94A3B8)] border-b border-[var(--theme-border,#213E61)]/70 pb-2 flex items-center justify-between">
              <span>{isHindi ? 'आभूषण बिल विवरण (Invoice Breakdown)' : 'Jewelry Bill Invoice Breakdown'}</span>
              <span className="font-mono text-amber-400 font-bold">1g = ₹{effectivePerGramCost.toFixed(1)} net</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-[var(--theme-text-muted,#CBD5E1)]">
                <span>Base Metal Cost ({weightInGrams.toFixed(2)}g @ ₹{ratePerGram.toFixed(1)}/g):</span>
                <span className="font-bold text-[var(--theme-text,#F8FAFC)]">{formatCurrency(metalBaseCost)}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--theme-text-muted,#CBD5E1)]">
                <span>Making Charges ({makingPctNum}%):</span>
                <span className="font-bold text-amber-300">+{formatCurrency(makingChargeAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--theme-text-muted,#CBD5E1)]">
                <span>Bullion GST Tax ({gstPctNum}%):</span>
                <span className="font-bold text-sky-400">+{formatCurrency(bullionGstAmount)}</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[var(--theme-border,#213E61)] flex items-baseline justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text,#F8FAFC)]">
                {isHindi ? 'कुल देय राशि (Total Payable):' : 'Grand Total Payable:'}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                {formatCurrency(grandBullionTotal)}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const text = METAL_CONFIGS[metalType].label + ' (' + rawWeight + metalWeightUnit + ') Total: ' + formatCurrency(grandBullionTotal) + ' (Making: ' + formatCurrency(makingChargeAmount) + ', GST: ' + formatCurrency(bullionGstAmount) + ')';
                handleCopy(text, 'gold-copy');
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--theme-surface,#0E1A29)] hover:bg-[var(--theme-border,#213E61)]/40 border border-[var(--theme-border,#213E61)] text-xs font-bold text-[var(--theme-text,#F8FAFC)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedKey === 'gold-copy' ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'gold-copy' ? 'Copied to Clipboard!' : 'Copy Bullion Summary'}</span>
            </button>

            {onApplyToExpense && (
              <button
                type="button"
                onClick={() => onApplyToExpense(Math.round(grandBullionTotal))}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <MinusCircle className="w-4 h-4" />
                <span>Add as Expense (₹{Math.round(grandBullionTotal).toLocaleString('en-IN')})</span>
              </button>
            )}
          </div>
        </div>
      )}
`;

// Insert before the last </div>\n  );\n};
const lastClosing = "    </div>\n  );\n};";
code = code.replace(lastClosing, () => jsxBlocks + "\n" + lastClosing);

fs.writeFileSync('src/components/CalculatorPage.tsx', code);
console.log('Successfully updated CalculatorPage.tsx with Currency and Gold calculators!');
