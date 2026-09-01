const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace '₹ ****' or "₹ ****" or `₹ ****`
  content = content.replace(/['"`]₹ \*\*\*\*['"`]/g, "`${getCurrencyConfig(getCurrentLanguage()).symbol} ****`");

  // Replace >₹...
  content = content.replace(/>₹\{([^}]+)\}/g, ">{getCurrencyConfig(getCurrentLanguage()).symbol}{$1}");
  content = content.replace(/>₹([^<]+)</g, ">{getCurrencyConfig(getCurrentLanguage()).symbol}$1<");

  // Replace +₹... and -₹... in JSX text
  content = content.replace(/\+₹\{([^}]+)\}/g, "+{getCurrencyConfig(getCurrentLanguage()).symbol}{$1}");
  content = content.replace(/\-₹\{([^}]+)\}/g, "-{getCurrencyConfig(getCurrentLanguage()).symbol}{$1}");
  content = content.replace(/≈ ₹ /g, "≈ {getCurrencyConfig(getCurrentLanguage()).symbol} ");
  content = content.replace(/Record ₹\{([^}]+)\}/g, "Record {getCurrencyConfig(getCurrentLanguage()).symbol}{$1}");
  content = content.replace(/Apply ₹\{([^}]+)\}/g, "Apply {getCurrencyConfig(getCurrentLanguage()).symbol}{$1}");
  content = content.replace(/Create Goal for ₹\{([^}]+)\}/g, "Create Goal for {getCurrencyConfig(getCurrentLanguage()).symbol}{$1}");
  
  // Also any remaining ₹ that's just bare in JSX text
  content = content.replace(/>₹\s*</g, ">{getCurrencyConfig(getCurrentLanguage()).symbol}<");
  content = content.replace(/₹\{/g, "{getCurrencyConfig(getCurrentLanguage()).symbol}{");
  content = content.replace(/\(CP ₹\)/g, "(CP {getCurrencyConfig(getCurrentLanguage()).symbol})");
  content = content.replace(/\(SP ₹\)/g, "(SP {getCurrencyConfig(getCurrentLanguage()).symbol})");

  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('src/components/CalculatorPage.tsx');
replaceInFile('src/components/MultiCalculatorModal.tsx');
replaceInFile('src/components/AddView.tsx');
