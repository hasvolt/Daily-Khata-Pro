const fs = require('fs');

let banner = fs.readFileSync('src/components/HasVoltPromoBanner.tsx', 'utf8');

// Add X icon to imports
banner = banner.replace("import { ExternalLink, Copy, Check, Globe, MapPin, Search, Maximize2 } from 'lucide-react';", "import { ExternalLink, Copy, Check, Globe, MapPin, Search, Maximize2, X } from 'lucide-react';");

// Add state to component
banner = banner.replace(
  '  const [isCopied, setIsCopied] = useState(false);',
  '  const [isCopied, setIsCopied] = useState(false);\n  const [isHidden, setIsHidden] = useState(() => localStorage.getItem("hide_hasvolt_promo") === "true");'
);

// Early return if hidden
banner = banner.replace(
  '  const isHindi = language === \'hi\' || language === \'hinglish\';',
  '  const isHindi = language === \'hi\' || language === \'hinglish\';\n\n  if (isHidden) return null;'
);

// Add the X button to the wrapper div. 
// We can just add it inside the main container.
const target = '<div className={`hasvolt-promo-wrapper ${className} w-full`}>';
const replacement = target + '\n' + `
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsHidden(true);
            localStorage.setItem("hide_hasvolt_promo", "true");
          }}
          className="absolute -top-2 -right-2 z-50 p-1 bg-[var(--theme-surface,#0E1A29)] text-[var(--theme-text-muted,#94A3B8)] hover:text-white rounded-full border border-[var(--theme-border,#213E61)] shadow-md transition-colors"
          title="Hide Banner"
          aria-label="Hide Banner"
        >
          <X className="w-4 h-4" />
        </button>
`;

banner = banner.replace(target, target + '\n      <div className="relative w-full h-full">' + replacement);

// And we need to close that new relative div.
banner = banner.replace('    </div>\n\n      {/* Modal / Expanded View */}', '      </div>\n    </div>\n\n      {/* Modal / Expanded View */}');

fs.writeFileSync('src/components/HasVoltPromoBanner.tsx', banner, 'utf8');
console.log("Internal banner fix applied");
