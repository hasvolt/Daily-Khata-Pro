const fs = require('fs');
let content = fs.readFileSync('src/components/MultiCalculatorModal.tsx', 'utf8');

const tabString = `type CalculatorTab = 'standard' | 'funds' | 'sip' | 'emi' | 'gst' | 'discount' | 'inflation' | 'gold' | 'currency';`;
content = content.replace(/type CalculatorTab = [^;]+;/, tabString);

const stateString = `// --- 8. Gold & Silver State ---
  const [goldWeightInput, setGoldWeightInput] = useState<string>('10');
  const [goldRateInput, setGoldRateInput] = useState<string>('75000');
  const [goldMakingChargesInput, setGoldMakingChargesInput] = useState<string>('8');
  
  // --- 9. Currency (Forex) State ---
  const [currencyAmountInput, setCurrencyAmountInput] = useState<string>('100');
  const [currencyRateInput, setCurrencyRateInput] = useState<string>('83.5');
  const [currencyType, setCurrencyType] = useState<'USD' | 'EUR' | 'GBP' | 'AED'>('USD');`;

content = content.replace(/if \(!isOpen\) return null;/, stateString + '\n\n  if (!isOpen) return null;');


const tabArray = `const tabs: { id: CalculatorTab; label: string; icon: any; color: string }[] = [
    { id: 'standard', label: tr.calc.tabStandard, icon: Calculator, color: '#38BDF8' },
    { id: 'funds', label: tr.calc.tabFunds, icon: Layers, color: '#10B981' },
    { id: 'sip', label: tr.calc.tabSip, icon: TrendingUp, color: '#F59E0B' },
    { id: 'emi', label: tr.calc.tabEmi, icon: Landmark, color: '#8B5CF6' },
    { id: 'gst', label: tr.calc.tabGst, icon: Percent, color: '#EC4899' },
    { id: 'discount', label: tr.calc.tabDiscount, icon: Tag, color: '#06B6D4' },
    { id: 'inflation', label: tr.calc.tabInflation, icon: Target, color: '#EAB308' },
    { id: 'gold', label: tr.calc.tabGold || 'Gold / Silver', icon: Sparkles, color: '#FCD34D' },
    { id: 'currency', label: tr.calc.tabForex || 'Currency', icon: DollarSign, color: '#4ADE80' }
  ];`;

content = content.replace(/const tabs[^\]]+\];/, tabArray);


const renderString = `{/* ========================================================= */}
          {/* TAB 8: Gold & Silver */}
          {/* ========================================================= */}
          {activeTab === 'gold' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[var(--theme-text-muted,#CBD5E1)]">Weight (Grams):</span>
                  <input
                    type="number" min="0" step="any" value={goldWeightInput} onChange={(e) => setGoldWeightInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[var(--theme-text-muted,#CBD5E1)]">Rate per 10g ({getCurrencyConfig(getCurrentLanguage()).symbol}):</span>
                  <input
                    type="number" min="0" step="any" value={goldRateInput} onChange={(e) => setGoldRateInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#FCD34D] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[var(--theme-text-muted,#CBD5E1)]">Making Charges (%):</span>
                  <input
                    type="number" min="0" step="0.5" value={goldMakingChargesInput} onChange={(e) => setGoldMakingChargesInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#38BDF8] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>
              </div>
              
              <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5 font-mono text-[12px]">
                <div className="flex justify-between text-[var(--theme-text-muted,#94A3B8)]">
                  <span>Base Value:</span>
                  <span>{getCurrencyConfig(getCurrentLanguage()).symbol}{((parseFloat(goldWeightInput)||0) * (parseFloat(goldRateInput)||0) / 10).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--theme-text-muted,#94A3B8)]">
                  <span>Making + GST (3%):</span>
                  <span>{getCurrencyConfig(getCurrentLanguage()).symbol}{((parseFloat(goldWeightInput)||0) * (parseFloat(goldRateInput)||0) / 10 * ((parseFloat(goldMakingChargesInput)||0)/100 + 0.03)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--theme-text,#F8FAFC)] border-t border-[var(--theme-border,#213E61)] pt-1 text-[14px]">
                  <span className="font-bold">Total Estimated:</span>
                  <span className="font-extrabold text-[#FCD34D]">{getCurrencyConfig(getCurrentLanguage()).symbol}{(((parseFloat(goldWeightInput)||0) * (parseFloat(goldRateInput)||0) / 10) * (1 + (parseFloat(goldMakingChargesInput)||0)/100 + 0.03)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* ========================================================= */}
          {/* TAB 9: Currency (Forex) */}
          {/* ========================================================= */}
          {activeTab === 'currency' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[var(--theme-text-muted,#CBD5E1)]">Amount (Foreign):</span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-[var(--theme-text-dim,#94A3B8)]">$</span>
                    <input
                      type="number" min="0" step="any" value={currencyAmountInput} onChange={(e) => setCurrencyAmountInput(e.target.value)}
                      className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[var(--theme-text,#F8FAFC)] text-[15px] font-mono font-bold rounded-lg pl-7 pr-2.5 py-1.5 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[var(--theme-text-muted,#CBD5E1)]">Exchange Rate:</span>
                  <input
                    type="number" min="0" step="any" value={currencyRateInput} onChange={(e) => setCurrencyRateInput(e.target.value)}
                    className="w-full bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] text-[#4ADE80] text-[15px] font-mono font-bold rounded-lg px-2.5 py-1.5 outline-none"
                  />
                </div>
              </div>
              
              <div className="p-3 rounded-xl bg-[var(--theme-bg,#070E18)] border border-[var(--theme-border,#213E61)] space-y-1.5 font-mono text-[12px]">
                <div className="flex justify-between text-[var(--theme-text,#F8FAFC)] text-[14px]">
                  <span className="font-bold">Converted ({getCurrencyConfig(getCurrentLanguage()).code}):</span>
                  <span className="font-extrabold text-[#4ADE80]">{getCurrencyConfig(getCurrentLanguage()).symbol}{((parseFloat(currencyAmountInput)||0) * (parseFloat(currencyRateInput)||0)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

        </div>`;

content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*};\s*$/g, renderString + '\n      </div>\n    </div>\n  );\n};\n');

fs.writeFileSync('src/components/MultiCalculatorModal.tsx', content);
