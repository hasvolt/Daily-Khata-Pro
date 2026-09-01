const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

content = content.replace(
  "        </div>\n      )}\n      {/* Compact Layout List */}",
  "        </div>\n      </div>\n      </>\n      )}\n      {/* Compact Layout List */}"
);

fs.writeFileSync('src/components/HomeView.tsx', content, 'utf8');
