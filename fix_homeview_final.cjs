const fs = require('fs');
let content = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// Fix Section 4 missing closing div
content = content.replace(
  "        </div>\n        </>\n      )}",
  "        </div>\n      </div>\n      </>\n      )}"
);

// Fix Section 5 fragment closing outside main div
content = content.replace(
  "        </div>\n      </div>\n      </>\n      )}\n    </div>\n  );\n};",
  "        </div>\n      </>\n      )}\n    </div>\n  );\n};"
);

fs.writeFileSync('src/components/HomeView.tsx', content, 'utf8');
