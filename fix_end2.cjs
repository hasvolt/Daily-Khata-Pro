const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

content = content.replace(
  "            )}\n          </div>\n        </div>\n      </div>\n      </>\n      )}\n    </div>\n  );\n};",
  "            )}\n          </div>\n        </div>\n      </>\n      )}\n    </div>\n  );\n};"
);

fs.writeFileSync('src/components/HomeView.tsx', content, 'utf8');
