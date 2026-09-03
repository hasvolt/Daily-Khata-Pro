const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// Replace primary funds mapping
content = content.replace(
  /<button\s*type="button"\s*key=\{config\.id\}\s*onClick=\{[^}]+\}\s*className="group relative bg-gradient-to-b [^>]+>[\s\S]*?(?=<\/button>)<\/button>/g,
  `<FundCard3D 
                key={config.id}
                config={config}
                val={val}
                pct={pct}
                fundTranslatedName={fundTranslatedName}
                FundIcon={FundIcon}
                formatCurrency={formatCurrency}
                privacyMask={privacyMask}
                onClick={() => onFilterFund(config.id)}
                isPrimary={true}
              />`
);

fs.writeFileSync('src/components/HomeView.tsx', content);
console.log('Successfully replaced fund cards with FundCard3D');
