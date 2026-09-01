const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "        if (parsed.settings?.viewMode) {\n          setViewMode(parsed.settings.viewMode);\n        }",
  "        if (parsed.settings?.viewMode) {\n          setViewMode(parsed.settings.viewMode);\n        }\n        if (parsed.settings?.appLayout) {\n          setAppLayout(parsed.settings.appLayout);\n        }"
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
