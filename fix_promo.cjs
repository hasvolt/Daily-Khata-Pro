const fs = require('fs');

// 1. Remove zoom: 0.6 from HasVoltPromoBanner
let banner = fs.readFileSync('src/components/HasVoltPromoBanner.tsx', 'utf8');
banner = banner.replace(/style=\{\{\s*zoom:\s*0\.6\s*\}\}\s*/g, '');
fs.writeFileSync('src/components/HasVoltPromoBanner.tsx', banner, 'utf8');

// 2. Add hide state and close button in HomeView
let home = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// Add state
home = home.replace(
  '  const [isSelectorOpen, setIsSelectorOpen] = useState(false);',
  '  const [isSelectorOpen, setIsSelectorOpen] = useState(false);\n  const [isPromoHidden, setIsPromoHidden] = useState(() => localStorage.getItem("hide_promo_home") === "true");'
);

// Add the banner with relative positioning and close button
const bannerHtml = `
        {/* HasVolt Sponsored Ad Card */}
        {!isPromoHidden && (
          <div className="relative h-full animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => {
                setIsPromoHidden(true);
                localStorage.setItem("hide_promo_home", "true");
              }}
              className="absolute -top-1 -right-1 z-10 p-1.5 bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] hover:text-white rounded-full border border-[var(--theme-border,#213E61)] shadow-md transition-colors"
              title="Hide Banner"
              aria-label="Hide Banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <HasVoltPromoBanner variant="card" language={language} />
          </div>
        )}
`;

home = home.replace(
  /\{\/\* HasVolt Sponsored Ad Card \*\/\}\s*<div className="h-full">\s*<HasVoltPromoBanner variant="card" language=\{language\} \/>\s*<\/div>/g,
  bannerHtml
);

fs.writeFileSync('src/components/HomeView.tsx', home, 'utf8');

console.log("Promo fix done");
