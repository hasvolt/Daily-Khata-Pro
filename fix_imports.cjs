const fs = require('fs');
let content = fs.readFileSync('src/components/HistoryView.tsx', 'utf8');

// Undo bad replacements
content = content.replace(/import \{ ChevronLeft, ChevronRight, /g, 'import { ');

// Correctly add ChevronLeft and ChevronRight to lucide-react import
content = content.replace(/import \{ Search, Edit3, Trash2, Plus, Zap, Banknote, Smartphone, Building2, Calendar, Download, Printer \} from 'lucide-react';/,
  "import { ChevronLeft, ChevronRight, Search, Edit3, Trash2, Plus, Zap, Banknote, Smartphone, Building2, Calendar, Download, Printer } from 'lucide-react';"
);

fs.writeFileSync('src/components/HistoryView.tsx', content);
