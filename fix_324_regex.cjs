const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// The exact string in the file:
//         </div>
//       )}
//       {/* Compact Layout List */}
content = content.replace(
  "        </div>\n      )}\n      {/* Compact Layout List */}",
  "        </div>\n      </div>\n      </>\n      )}\n      {/* Compact Layout List */}"
);

// Wait, what if there are spaces or crlf? Let's use regex
content = content.replace(
  /        <\/div>\s*\}\)\}\s*\{\/\* Compact Layout List \*\/\}/s,
  "        </div>\n      </div>\n      </>\n      )}\n      {/* Compact Layout List */}"
);

fs.writeFileSync('src/components/HomeView.tsx', content, 'utf8');
