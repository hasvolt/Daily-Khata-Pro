const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

if (!content.includes('AppLayout')) {
  content = content.replace(
    "export type AppViewMode = 'auto' | 'mobile' | 'desktop';",
    "export type AppViewMode = 'auto' | 'mobile' | 'desktop';\nexport type AppLayout = 'dashboard' | 'compact' | 'minimal';"
  );
  
  content = content.replace(
    'viewMode?: AppViewMode;',
    'viewMode?: AppViewMode;\n  appLayout?: AppLayout;'
  );

  content = content.replace(
    'viewMode?: AppViewMode;',
    'viewMode?: AppViewMode;\n    appLayout?: AppLayout;'
  );

  fs.writeFileSync('src/types.ts', content, 'utf8');
}
