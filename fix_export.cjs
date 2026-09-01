const fs = require('fs');
let content = fs.readFileSync('src/utils/trackerExport.ts', 'utf8');
if (!content.includes('getCurrencyConfig')) {
  content = `import { getCurrencyConfig, getCurrentLanguage } from './currencyConfig';\n` + content;
}
fs.writeFileSync('src/utils/trackerExport.ts', content, 'utf8');
