const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// Add import
if (!content.includes('BankingCard3D')) {
  content = content.replace(
    /import \{ HomepageFundSelectorModal \} from '\.\/HomepageFundSelectorModal';/,
    `import { HomepageFundSelectorModal } from './HomepageFundSelectorModal';\nimport { BankingCard3D } from './BankingCard3D';`
  );
}

const startRegex = /\{\/\* 1\. TOTAL NET BALANCE BANNER \*\/\}/;
const endStr = `</button>
          </div>
        </div>
      </div>`;

const startIndex = content.search(startRegex);
if (startIndex !== -1) {
  const substr = content.substring(startIndex);
  const endMatch = substr.indexOf(endStr);
  if (endMatch !== -1) {
    const fullEndIndex = startIndex + endMatch + endStr.length;
    
    const replacement = `{/* 1. TOTAL NET BALANCE BANNER (3D Animated) */}
      <BankingCard3D 
        totalWealth={totalWealth}
        formatCurrency={formatCurrency}
        privacyMask={privacyMask}
        dateFormatted={dateFormatted}
        t={t}
        pageT={pageT}
        onAddClick={onAddClick}
      />`;
      
    content = content.substring(0, startIndex) + replacement + content.substring(fullEndIndex);
    fs.writeFileSync('src/components/HomeView.tsx', content);
    console.log('Successfully replaced banner with BankingCard3D');
  } else {
    console.log('End string not found');
  }
} else {
  console.log('Start regex not found');
}
