const fs = require('fs');

const replaceInFile = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(([search, replacement]) => {
    content = content.replace(search, replacement);
  });
  fs.writeFileSync(file, content, 'utf8');
};

replaceInFile('src/components/DisclaimerPage.tsx', [
  [
    'Please be informed that in the <strong>Free version</strong> of Daily Khata Pro, you may see occasional advertisements, sponsored links, or developer watermarks on generated PDFs and exports. This helps us maintain server costs and provide updates for free. You may upgrade to a premium plan (if available) to remove watermarks and ads.',
    'Please be informed that you may occasionally see promotional links or developer credits within the application. These help support continuous development.'
  ]
]);

replaceInFile('src/components/DeveloperModal.tsx', [
  [
    "{isHindi ? 'पारदर्शी • निःशुल्क • ओपन-सोर्स' : 'Transparent • Free • Open Source'}",
    "{isHindi ? 'पारदर्शी • सुरक्षित • ओपन-सोर्स' : 'Transparent • Secure • Open Source'}"
  ]
]);

replaceInFile('src/utils/version.ts', [
  [
    'Version ${APP_VERSION} · Production Ready · Offline First · Free Open Source',
    'Version ${APP_VERSION} · Production Ready · Offline First · Open Source'
  ]
]);

replaceInFile('src/utils/appTranslations.ts', [
  [
    "mitLicenseDesc: 'Completely free for use, study, modifications, and personal auditing.',",
    "mitLicenseDesc: 'Open for use, study, modifications, and personal auditing.',"
  ],
  [
    "visionDesc: 'Daily Khata Pro is built under the MIT license, completely free, with no trackers, no external cloud dependencies, and zero corporate telemetry.',",
    "visionDesc: 'Daily Khata Pro is built under the MIT license, with no trackers, no external cloud dependencies, and zero corporate telemetry.',"
  ],
  [
    "mitLicenseDesc: 'Use, study aur modifications ke liye 100% free.',",
    "mitLicenseDesc: 'Use, study aur modifications ke liye 100% open.',"
  ],
  [
    "visionDesc: 'Daily Khata Pro is built under the MIT license, completely free, with no trackers, no external cloud dependencies, and zero corporate telemetry.',",
    "visionDesc: 'Daily Khata Pro is built under the MIT license, with no trackers, no external cloud dependencies, and zero corporate telemetry.',"
  ]
]);

replaceInFile('src/utils/pageTranslations.ts', [
  [
    "missionP2: 'Most modern finance apps upload your transactions to remote servers, mine your purchasing behavior for marketing, or lock essential export features behind paywalls. Daily Khata Pro flips this model entirely — your data never leaves your browser or phone, all calculations happen instantly on your device, and every single feature is permanently free under the MIT Open Source license.',",
    "missionP2: 'Most modern finance apps upload your transactions to remote servers, mine your purchasing behavior for marketing, or lock essential export features behind paywalls. Daily Khata Pro flips this model entirely — your data never leaves your browser or phone, all calculations happen instantly on your device, and every single feature is permanently available under the MIT Open Source license.',"
  ],
  [
    "openSourceDesc: 'Daily Khata Pro is provided free and open-source under the terms of the MIT License.',",
    "openSourceDesc: 'Daily Khata Pro is provided as open-source under the terms of the MIT License.',"
  ],
  [
    "visionDesc: 'To provide every individual, freelancer, and small business owner with a reliable, private financial engine that is 100% free, runs offline, and never monetizes personal user data.',",
    "visionDesc: 'To provide every individual, freelancer, and small business owner with a reliable, private financial engine that runs offline, and never monetizes personal user data.',"
  ],
  [
    "missionP2: 'Baaki apps aapka data server par upload karte hain. Daily Khata Pro me aapka data kabhi bhi aapke phone ya laptop se bahar nahi jata, aur ye MIT Open Source license ke tehat lifetime 100% free hai.',",
    "missionP2: 'Baaki apps aapka data server par upload karte hain. Daily Khata Pro me aapka data kabhi bhi aapke phone ya laptop se bahar nahi jata, aur ye MIT Open Source license ke tehat lifetime uplabdh hai.',"
  ],
  [
    "openSourceDesc: 'Daily Khata Pro MIT License ke tehat bilkul free aur open-source available hai.',",
    "openSourceDesc: 'Daily Khata Pro MIT License ke tehat bilkul open-source available hai.',"
  ],
  [
    "visionDesc: 'Har user, freelancer aur small business ko ek aisa private, free aur lifetime offline financial engine dena jo unka data kabhi na beche.',",
    "visionDesc: 'Har user, freelancer aur small business ko ek aisa private, aur lifetime offline financial engine dena jo unka data kabhi na beche.',"
  ]
]);

replaceInFile('src/utils/userManualContent.ts', [
  [
    "desc: 'MIT Permissive License — Free for the world to use and inspect.'",
    "desc: 'MIT Permissive License — Open for the world to use and inspect.'"
  ]
]);
