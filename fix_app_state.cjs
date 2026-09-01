const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add state
content = content.replace(
  "const [viewMode, setViewMode] = useState<AppViewMode>('auto');",
  "const [viewMode, setViewMode] = useState<AppViewMode>('auto');\n  const [appLayout, setAppLayout] = useState<AppLayout>('dashboard');"
);

// In load from localStorage
content = content.replace(
  "if (parsed.settings.viewMode) setViewMode(parsed.settings.viewMode);",
  "if (parsed.settings.viewMode) setViewMode(parsed.settings.viewMode);\n          if (parsed.settings.appLayout) setAppLayout(parsed.settings.appLayout);"
);

// In saveToLocalStorage parameters (arg1 object)
content = content.replace(
  "viewMode?: AppViewMode;",
  "viewMode?: AppViewMode;\n      appLayout?: AppLayout;"
);

// In saveToLocalStorage parameters (positional)
content = content.replace(
  "newViewMode?: AppViewMode",
  "newViewMode?: AppViewMode,\n    newAppLayout?: AppLayout"
);

// In saveToLocalStorage data construction (arg1)
content = content.replace(
  "viewMode: updates.viewMode ?? viewMode,",
  "viewMode: updates.viewMode ?? viewMode,\n            appLayout: updates.appLayout ?? appLayout,"
);

// In saveToLocalStorage data construction (positional)
content = content.replace(
  "viewMode: newViewMode ?? viewMode,",
  "viewMode: newViewMode ?? viewMode,\n            appLayout: newAppLayout ?? appLayout,"
);

// In set settings
content = content.replace(
  "newViewMode?: AppViewMode",
  "newViewMode?: AppViewMode, newAppLayout?: AppLayout"
);
content = content.replace(
  "if (newViewMode !== undefined) setViewMode(newViewMode);",
  "if (newViewMode !== undefined) setViewMode(newViewMode);\n    if (newAppLayout !== undefined) setAppLayout(newAppLayout);"
);
content = content.replace(
  "newViewMode",
  "newViewMode, newAppLayout"
);

// Pass appLayout to SettingsModal
content = content.replace(
  "viewMode={viewMode}",
  "viewMode={viewMode}\n          appLayout={appLayout}"
);

content = content.replace(
  "onUpdateSettings={(pct, thm, lang, mask, mode) => {",
  "onUpdateSettings={(pct, thm, lang, mask, mode, layout) => {"
);

content = content.replace(
  "saveAndApplySettings(pct, thm, lang, mask, mode);",
  "saveAndApplySettings(pct, thm, lang, mask, mode, layout);"
);


fs.writeFileSync('src/App.tsx', content, 'utf8');
