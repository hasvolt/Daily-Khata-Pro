const fs = require('fs');
let content = fs.readFileSync('src/components/LoanUdharLedgerView.tsx', 'utf8');

// Ensure English mode text is simple enough as requested
content = content.replace(/'Lent \(Receivable\)'/g, "'You Lent (They owe you)'");
content = content.replace(/'Borrowed \(Payable\)'/g, "'You Borrowed (You owe)'");

fs.writeFileSync('src/components/LoanUdharLedgerView.tsx', content);
