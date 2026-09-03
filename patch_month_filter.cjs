const fs = require('fs');
let content = fs.readFileSync('src/components/HistoryView.tsx', 'utf8');

// Add activeMonth state
if (!content.includes('const [activeMonth, setActiveMonth]')) {
  content = content.replace(
    /const \[deletingId, setDeletingId\] = useState<string \| null>\(null\);/,
    `const [deletingId, setDeletingId] = useState<string | null>(null);\n  const [activeMonth, setActiveMonth] = useState<string>('all');`
  );
}

// Add Month filtering logic right after initial sorting
if (!content.includes('// Month Filter')) {
  content = content.replace(
    /let filtered = entries\.slice\(\)\.sort\(\(a, b\) => \{/,
    `// Unique months extraction
  const uniqueMonths = Array.from(new Set(entries.map(e => e.date.substring(0, 7)))).sort((a, b) => b.localeCompare(a));
  
  let filtered = entries.slice().sort((a, b) => {`
  );

  content = content.replace(
    /\/\/ Search filter/,
    `// Month filter
  if (activeMonth !== 'all') {
    filtered = filtered.filter(e => e.date.startsWith(activeMonth));
  }

  // Search filter`
  );
}

// Add UI for Month Filter right after Filter Chips Bar
if (!content.includes('activeMonth === month')) {
  const filterChipsBar = `      <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar no-print w-full">`;
  const monthFilterUI = `
      {/* Filter Chips Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar no-print w-full">
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onFilterChange(opt.key)}
            className={\`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all shrink-0 whitespace-nowrap shadow-sm \${
              activeFilter === opt.key
                ? 'bg-[var(--theme-primary,#38BDF8)] border-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                : 'bg-[var(--theme-card,#132438)] text-[#94A3B8] border border-[var(--theme-border,#213E61)] hover:text-[#F8FAFC]'
            }\`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Month Filter Chips */}
      {uniqueMonths.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1.5 mt-1 no-scrollbar no-print w-full">
          <button
            onClick={() => setActiveMonth('all')}
            className={\`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-[12px] font-bold transition-all shrink-0 whitespace-nowrap shadow-sm \${
              activeMonth === 'all'
                ? 'bg-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                : 'bg-[var(--theme-card,#132438)] text-[#94A3B8] border border-[var(--theme-border,#213E61)] hover:text-[#F8FAFC]'
            }\`}
          >
            {isHindi ? 'सभी महीने' : 'All Months'}
          </button>
          {uniqueMonths.map((month) => {
            const mDate = new Date(\`\${month}-01T00:00:00\`);
            const label = mDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short', year: 'numeric' });
            return (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={\`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-[12px] font-bold transition-all shrink-0 whitespace-nowrap shadow-sm \${
                  activeMonth === month
                    ? 'bg-[var(--theme-primary,#38BDF8)] border border-[var(--theme-primary,#38BDF8)] text-[var(--theme-btn-text,#040D17)]'
                    : 'bg-[var(--theme-card,#132438)] text-[#94A3B8] border border-[var(--theme-border,#213E61)] hover:text-[#F8FAFC]'
                }\`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}`;

  // Find and replace the Filter Chips Bar block
  content = content.replace(/\{\/\* Filter Chips Bar \*\/\}\s*<div className="flex gap-2 overflow-x-auto pb-1\.5 no-scrollbar no-print w-full">[\s\S]*?<\/div>/, monthFilterUI);
}

fs.writeFileSync('src/components/HistoryView.tsx', content);
