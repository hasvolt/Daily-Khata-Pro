const fs = require('fs');
let content = fs.readFileSync('src/components/GoogleAdBanner.tsx', 'utf8');

content = content.replace(
  /className="adsbygoogle"\s*style=\{\{ display: 'block', textAlign: 'center' \}\}\s*className="adsbygoogle custom-responsive-ad"/g,
  'className="adsbygoogle custom-responsive-ad"\n          style={{ display: "block", textAlign: "center" }}'
);

fs.writeFileSync('src/components/GoogleAdBanner.tsx', content, 'utf8');
