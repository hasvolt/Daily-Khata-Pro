const fs = require('fs');
let code = fs.readFileSync('src/components/CalculatorPage.tsx', 'utf8');

// 1. Update CalculatorViewType
code = code.replace(
  "export type CalculatorViewType = 'standard' | 'funds' | 'sip' | 'emi' | 'gst' | 'discount' | 'inflation';",
  "export type CalculatorViewType = 'standard' | 'currency' | 'gold' | 'emi' | 'sip' | 'funds' | 'gst' | 'discount' | 'inflation';"
);

// 2. Add Currency and Gold state
const stateToAdd = `
  // --- 7. Currency (Forex) Converter State ---
  const [currencyAmountInput, setCurrencyAmountInput] = useState<string>('100');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'CAD' | 'AUD'>('USD');
  const [currencyCustomRate, setCurrencyCustomRate] = useState<string>('83.92');
  const [currencyDirection, setCurrencyDirection] = useState<'foreign_to_inr' | 'inr_to_foreign'>('foreign_to_inr');

  const CURRENCY_PRESETS: Record<string, { symbol: string; name: string; defaultRate: number; flag: string }> = {
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
    setCurrencyCustomRate(CURRENCY_PRESETS[curr].defaultRate.toString());
  };

  const currAmtNum = Math.max(0, parseFloat(currencyAmountInput) || 0);
  const currRateNum = Math.max(0.001, parseFloat(currencyCustomRate) || 83.92);
  const convertedInr = currencyDirection === 'foreign_to_inr' ? currAmtNum * currRateNum : currAmtNum / currRateNum;

  // --- 8. Gold & Silver Bullion State ---
  const [metalType, setMetalType] = useState<'gold24' | 'gold22' | 'gold18' | 'silver'>('gold24');
  const [metalWeightInput, setMetalWeightInput] = useState<string>('10');
  const [metalWeightUnit, setMetalWeightUnit] = useState<'gm' | 'tola' | 'oz'>('gm');
  const [metalRateInput, setMetalRateInput] = useState<string>('75850');
  const [makingChargesPct, setMakingChargesPct] = useState<string>('8');
  const [goldGstPct, setGoldGstPct] = useState<string>('3');

  const METAL_PRESETS = {
    gold24: { label: 'Gold 24K (99.9% Pure Bullion)', rate: 75850, unit: '10 Grams' },
    gold22: { label: 'Gold 22K (91.6% Hallmark Jewelry)', rate: 69530, unit: '10 Grams' },
    gold18: { label: 'Gold 18K (75.0% Diamond/Fashion)', rate: 56890, unit: '10 Grams' },
    silver: { label: 'Fine Silver (99.9% Bar / Coin)', rate: 91200, unit: '1 Kilogram' }
  };

  const handleSelectMetal = (m: 'gold24' | 'gold22' | 'gold18' | 'silver') => {
    setMetalType(m);
    setMetalRateInput(METAL_PRESETS[m].rate.toString());
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

code = code.replace("const [goalExpectedReturnInput, setGoalExpectedReturnInput] = useState<string>('12');", "const [goalExpectedReturnInput, setGoalExpectedReturnInput] = useState<string>('12');\n" + stateToAdd);

// 3. Update navTabs
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

code = code.replace(oldNavTabs, newNavTabs);

// 4. Update getCurrentCalcParams for Currency and Gold
const currencyAndGoldPrint = `    if (activeTab === 'currency') {
      return {
        title: isHindi ? 'विदेशी मुद्रा विनिमय गणना' : 'Foreign Currency Exchange Slip',
        type: 'Currency Forex Conversion',
        mainResult: currencyDirection === 'foreign_to_inr' ? formatCurrency(convertedInr) : \`\${CURRENCY_PRESETS[selectedCurrency].symbol} \${convertedInr.toFixed(2)}\`,
        resultLabel: currencyDirection === 'foreign_to_inr' ? 'Converted Total in INR' : \`Converted in \${selectedCurrency}\`,
        items: [
          { label: 'Conversion Direction', value: currencyDirection === 'foreign_to_inr' ? \`\${selectedCurrency} to INR\` : \`INR to \${selectedCurrency}\`, isBold: true },
          { label: 'Amount Entered', value: currencyDirection === 'foreign_to_inr' ? \`\${CURRENCY_PRESETS[selectedCurrency].symbol} \${currAmtNum}\` : formatCurrency(currAmtNum) },
          { label: 'Exchange Rate Applied', value: \`1 \${selectedCurrency} = ₹\${currRateNum.toFixed(2)}\` },
          { label: 'Final Converted Value', value: currencyDirection === 'foreign_to_inr' ? formatCurrency(convertedInr) : \`\${CURRENCY_PRESETS[selectedCurrency].symbol} \${convertedInr.toFixed(2)}\`, isBold: true, isHighlight: true }
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
          { label: 'Metal & Purity', value: METAL_PRESETS[metalType].label, isBold: true },
          { label: 'Weight (Calculated)', value: \`\${rawWeight} \${metalWeightUnit} (\${weightInGrams.toFixed(2)} grams)\` },
          { label: 'Base Metal Price', value: formatCurrency(metalBaseCost) },
          { label: \`Making Charges (\${makingPctNum}%)\`, value: formatCurrency(makingChargeAmount) },
          { label: \`Bullion GST (\${gstPctNum}%)\`, value: formatCurrency(bullionGstAmount) },
          { label: 'Total Payable', value: formatCurrency(grandBullionTotal), isBold: true, isHighlight: true },
          { label: 'Effective Rate / Gram', value: formatCurrency(effectivePerGramCost) }
        ],
        notes: 'Official hallmark benchmark estimates with GST'
      };
    }
`;

code = code.replace("if (activeTab === 'funds') {", currencyAndGoldPrint + "\n    if (activeTab === 'funds') {");

fs.writeFileSync('src/components/CalculatorPage.tsx', code);
console.log('Step 1 complete');
