const fs = require('fs');
let manual = fs.readFileSync('src/utils/userManualContent.ts', 'utf8');

const target = 'title: \'Local Data Backup\',';
const insert = `    {
      title: '100% Offline & Private Security',
      desc: 'All your financial data stays securely encrypted on your local device. The new DOM-Isolated App Lock prevents any screen grabbing or data leak, ensuring total privacy without requiring cloud sync.'
    },
    {
      title: 'App Lock Screen & FOUC Prevention',
      desc: 'Set up a custom PIN to lock the app immediately. Screen refreshes will not flash your data anymore before the lock screen kicks in.'
    },`;

if (!manual.includes('100% Offline & Private Security')) {
    manual = manual.replace(target, insert + '\n    ' + target);
    fs.writeFileSync('src/utils/userManualContent.ts', manual, 'utf8');
}
