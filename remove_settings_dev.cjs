const fs = require('fs');

let settings = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// The block to remove is inside SettingsModal.tsx
// It's the "About the Developer & App Info" section
const startIdx = settings.indexOf('{/* Section: About Developer / Info */}');
if (startIdx !== -1) {
    const endStr = '</div>\n\n            {/* Section: Support & Guide */}';
    const endIdx = settings.indexOf(endStr, startIdx);
    if (endIdx !== -1) {
        settings = settings.substring(0, startIdx) + settings.substring(endIdx + '</div>\n\n'.length);
        fs.writeFileSync('src/components/SettingsModal.tsx', settings, 'utf8');
        console.log("Developer section removed from SettingsModal");
    } else {
        console.log("Could not find end of developer block in SettingsModal");
    }
} else {
    console.log("Could not find developer block in SettingsModal");
}
