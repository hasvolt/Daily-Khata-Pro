const fs = require('fs');
let content = fs.readFileSync('src/components/UserManualModal.tsx', 'utf8');

if (!content.includes('const [isMobileMenuOpen, setIsMobileMenuOpen]')) {
  content = content.replace(
    'const [searchQuery, setSearchQuery] = useState<string>(\'\');',
    'const [searchQuery, setSearchQuery] = useState<string>(\'\');\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(true);'
  );
}

// Sidebar classes: hide on mobile if isMobileMenuOpen is false
content = content.replace(
  'className="w-full md:w-80 h-[30vh] min-h-[180px] md:h-auto md:flex-none border-b md:border-b-0 md:border-r border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] flex flex-col shrink-0"',
  'className={`w-full md:w-80 h-full md:h-auto md:flex-none border-b md:border-b-0 md:border-r border-[var(--theme-border,#213E61)] bg-[var(--theme-bg,#070E18)] flex-col shrink-0 ${isMobileMenuOpen ? \'flex\' : \'hidden md:flex\'}`}'
);

// On click, close mobile menu
content = content.replace(
  'onClick={() => setActiveSectionId(s.id)}',
  'onClick={() => {\n                      setActiveSectionId(s.id);\n                      setIsMobileMenuOpen(false);\n                    }}'
);

// Main Content Area classes: hide on mobile if isMobileMenuOpen is true
content = content.replace(
  'className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-5 sm:space-y-6 bg-[var(--theme-surface,#0E1A29)] custom-scrollbar"',
  'className={`flex-1 overflow-y-auto p-4 sm:p-7 space-y-5 sm:space-y-6 bg-[var(--theme-surface,#0E1A29)] custom-scrollbar ${!isMobileMenuOpen ? \'block\' : \'hidden md:block\'}`}'
);

// Add a "Back to Menu" button inside Chapter Heading for mobile
content = content.replace(
  '<CurrentIcon className="w-5 h-5" />',
  `<button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden mr-2 p-1 rounded-md bg-[var(--theme-card,#132438)] border border-[var(--theme-border,#213E61)] text-[#F8FAFC] hover:bg-[var(--theme-card-hover,#19304A)]"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <CurrentIcon className="w-5 h-5 hidden md:block" />`
);

// Need to import ChevronLeft from lucide-react
if (!content.includes('ChevronLeft')) {
  content = content.replace(
    'import {\n  BookOpen,',
    'import {\n  ChevronLeft,\n  BookOpen,'
  );
}

fs.writeFileSync('src/components/UserManualModal.tsx', content, 'utf8');
