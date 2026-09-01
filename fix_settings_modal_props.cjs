const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// Add to imports
content = content.replace(
  "import { AppLanguage, AppTheme, AppViewMode, FundType, KhataData, SecurityLockConfig } from '../types';",
  "import { AppLanguage, AppTheme, AppViewMode, AppLayout, FundType, KhataData, SecurityLockConfig } from '../types';"
);
content = content.replace(
  "import { AppLanguage, AppTheme, AppViewMode, FundType,",
  "import { AppLanguage, AppTheme, AppViewMode, AppLayout, FundType,"
);

// Add to interface
content = content.replace(
  "onViewModeChange?: (mode: AppViewMode) => void;",
  "onViewModeChange?: (mode: AppViewMode) => void;\n  appLayout?: AppLayout;\n  onLayoutChange?: (layout: AppLayout) => void;"
);

// Add to function args
content = content.replace(
  "viewMode = 'auto',",
  "viewMode = 'auto',\n  appLayout = 'dashboard',\n  onLayoutChange,"
);
content = content.replace(
  "onViewModeChange",
  "onViewModeChange,\n  appLayout = 'dashboard',\n  onLayoutChange"
);

fs.writeFileSync('src/components/SettingsModal.tsx', content, 'utf8');
