const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

content = content.replace(
  "import { KhataData, AppTheme, AppLanguage, AppViewMode, FundType, SecurityLockConfig } from '../types';",
  "import { KhataData, AppTheme, AppLanguage, AppViewMode, FundType, SecurityLockConfig, AppLayout } from '../types';"
);

fs.writeFileSync('src/components/SettingsModal.tsx', content, 'utf8');
