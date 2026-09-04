const fs = require('fs');

// Header.tsx
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Remove desktop "Developer" nav item (around line 909)
header = header.replace(
  /\{onOpenDeveloper && \(\s*<div\s*className="relative group"\s*onMouseEnter=\{\(\) => setHoveredMenu\('developer'\)\}\s*onMouseLeave=\{\(\) => setHoveredMenu\(null\)\}\s*>\s*<button\s*onClick=\{onOpenDeveloper\}[\s\S]*?<\/div>\s*\)\}/g,
  ""
);

// Remove mobile "Developer" nav item (around line 1404)
header = header.replace(
  /\{onOpenDeveloper && \(\s*<button\s*onClick=\{\(\) => \{\s*onOpenDeveloper\(\);\s*setIsMobileMenuOpen\(false\);\s*\}\}[\s\S]*?<\/button>\s*\)\}/g,
  ""
);

fs.writeFileSync('src/components/Header.tsx', header, 'utf8');

// SettingsModal.tsx
let settings = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

settings = settings.replace(
  /<button\s*onClick=\{\(\) => setActiveTab\('developer'\)\}[\s\S]*?<\/button>/g,
  ""
);

fs.writeFileSync('src/components/SettingsModal.tsx', settings, 'utf8');

