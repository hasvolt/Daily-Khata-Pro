const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const handleAppLayoutChange = `
  const handleAppLayoutChange = (newLayout: AppLayout) => {
    setAppLayout(newLayout);
    saveToLocalStorage({ appLayout: newLayout });
    showToast('App layout updated');
  };
`;

content = content.replace(
  "const handleViewModeChange = (newMode: AppViewMode) => {",
  handleAppLayoutChange + "\n  const handleViewModeChange = (newMode: AppViewMode) => {"
);

content = content.replace(
  "onViewModeChange={handleViewModeChange}",
  "onViewModeChange={handleViewModeChange}\n        appLayout={appLayout}\n        onLayoutChange={handleAppLayoutChange}"
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
