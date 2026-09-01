const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "import { Entry, FundType, Goal, WorkLog, DailyLifeLog, PersonalNote, KhataData, AppTheme, AppLanguage, AppViewMode, SecurityLockConfig } from './types';",
  "import { Entry, FundType, Goal, WorkLog, DailyLifeLog, PersonalNote, KhataData, AppTheme, AppLanguage, AppViewMode, SecurityLockConfig, AppLayout } from './types';"
);

fs.writeFileSync('src/App.tsx', content, 'utf8');

let content2 = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');
content2 = content2.replace(
  "import { FundType, KhataData, AppTheme, AppLanguage, AppViewMode, SecurityLockConfig } from '../types';",
  "import { FundType, KhataData, AppTheme, AppLanguage, AppViewMode, SecurityLockConfig, AppLayout } from '../types';"
);
fs.writeFileSync('src/components/SettingsModal.tsx', content2, 'utf8');

