const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // For React components: Add import if not present
  if (filePath.endsWith('.tsx') && !content.includes('getCurrencyConfig')) {
    content = `import { getCurrencyConfig, getCurrentLanguage } from '../utils/currencyConfig';\n` + content;
  }

  // Generic (₹) to ({getCurrencyConfig...})
  content = content.replace(/\(₹\)/g, "({getCurrencyConfig(getCurrentLanguage()).symbol})");
  content = content.replace(/>₹</g, ">{getCurrencyConfig(getCurrentLanguage()).symbol}<");

  // For specific formatting strings like ₹${
  content = content.replace(/₹\$\{/g, "${getCurrencyConfig(getCurrentLanguage()).symbol}${");

  // For SimulatorModal
  content = content.replace(/>\s*₹\s*</g, ">{getCurrencyConfig(getCurrentLanguage()).symbol}<");
  content = content.replace(/₹\{amt/g, "{getCurrencyConfig(getCurrentLanguage()).symbol}{amt");

  // For userManualContent.ts
  if (filePath.includes('userManualContent.ts')) {
    content = content.replace(/₹/g, "${getCurrencyConfig(getCurrentLanguage()).symbol}");
    if (!content.includes('getCurrencyConfig')) {
      content = `import { getCurrencyConfig, getCurrentLanguage } from './currencyConfig';\n` + content;
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('src/components/GoalModal.tsx');
replaceInFile('src/components/DepositGoalModal.tsx');
replaceInFile('src/components/WorkModal.tsx');
replaceInFile('src/components/SimulatorModal.tsx');
replaceInFile('src/components/FundSplitCalculatorModal.tsx');
replaceInFile('src/components/SafetyPage.tsx');
replaceInFile('src/components/SourceCodeModal.tsx');
replaceInFile('src/utils/userManualContent.ts');
replaceInFile('src/utils/trackerExport.ts');
