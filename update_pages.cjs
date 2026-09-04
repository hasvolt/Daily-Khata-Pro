const fs = require('fs');

const featuresHTML = `
      <div className="mt-8 p-5 bg-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-xl space-y-3">
        <h3 className="text-sm font-bold text-[var(--theme-text,#F8FAFC)]">Latest Security & Privacy Features</h3>
        <ul className="text-xs text-[var(--theme-text-muted,#94A3B8)] space-y-2 list-disc pl-4">
          <li><strong>100% Offline Architecture:</strong> Your data never leaves your device. No cloud sync, no tracking.</li>
          <li><strong>True DOM-Isolated App Lock:</strong> The PIN lock screen completely unmounts the application, preventing any financial data leakage even via full-page or scrolling screenshots.</li>
          <li><strong>Encrypted Export/Import:</strong> Backup your financial data securely to your local storage.</li>
          <li><strong>Advanced PDF Reporting:</strong> Generate custom offline financial statements directly on your device.</li>
        </ul>
      </div>
`;

function addFeaturesToPage(filePath, searchStr) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('Latest Security & Privacy Features')) return; // already added

    content = content.replace(searchStr, featuresHTML + '\n' + searchStr);
    fs.writeFileSync(filePath, content, 'utf8');
}

addFeaturesToPage('src/components/SourceSafetyPage.tsx', '</PolicySection>');
addFeaturesToPage('src/components/PrivacyPolicyPage.tsx', '</PolicySection>');
addFeaturesToPage('src/components/AboutUsPage.tsx', '</PolicySection>');

console.log("Pages updated");
