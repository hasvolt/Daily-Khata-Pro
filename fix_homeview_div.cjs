const fs = require('fs');

let home = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

home = home.replace(
  '      <HomepageFundSelectorModal',
  '      </div>\n      <HomepageFundSelectorModal'
);

fs.writeFileSync('src/components/HomeView.tsx', home, 'utf8');
