const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// I'll replace lines 88 to 92 carefully. Let's see the context.
// Let's replace the whole interface block starting from viewMode
const toReplace = `  viewMode?: AppViewMode;
  onViewModeChange,
  appLayout = 'dashboard',
  onLayoutChange?: (mode: AppViewMode) => void;
  appLayout?: AppLayout;
  onLayoutChange?: (layout: AppLayout) => void;
}`;

const correctInterface = `  viewMode?: AppViewMode;
  onViewModeChange?: (mode: AppViewMode) => void;
  appLayout?: AppLayout;
  onLayoutChange?: (layout: AppLayout) => void;
}`;

content = content.replace(toReplace, correctInterface);

// Also check the function args
const toReplaceArgs = `  privacyMask = false,
  onTogglePrivacyMask,
  viewMode = 'auto',
  appLayout = 'dashboard',
  onLayoutChange,
  onViewModeChange,
  appLayout = 'dashboard',
  onLayoutChange
}) => {`;

const correctArgs = `  privacyMask = false,
  onTogglePrivacyMask,
  viewMode = 'auto',
  onViewModeChange,
  appLayout = 'dashboard',
  onLayoutChange
}) => {`;

content = content.replace(toReplaceArgs, correctArgs);

// I will just use regex to clean up if exact match fails
fs.writeFileSync('src/components/SettingsModal.tsx', content, 'utf8');
