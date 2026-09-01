const fs = require('fs');

function convertToGetter(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import if not present
  if (!content.includes('getCurrencyConfig')) {
    content = `import { getCurrencyConfig, getCurrentLanguage } from './currencyConfig';\n` + content;
  }

  // Regex to match a key-value pair where the string contains (₹) or ($/₹) or (৳/₹)
  // e.g., enterIncome: 'Enter Income Amount (₹)',
  // will become: get enterIncome() { return `Enter Income Amount (${getCurrencyConfig(getCurrentLanguage()).symbol})`; },
  
  content = content.replace(/([a-zA-Z0-9_]+):\s*['"`]([^'"`]*?)\((?:₹|\$\/₹|৳\/₹)\)([^'"`]*?)['"`],/g, (match, key, before, after) => {
    return `get ${key}() { return \`${before}(\${getCurrencyConfig(getCurrentLanguage()).symbol})${after}\`; },`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

convertToGetter('src/utils/appTranslations.ts');
convertToGetter('src/utils/translations.ts');
