const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// We need to wrap everything inside the return statement inside the isLockedState check.

// Let's find the start of the return statement
const returnStart = content.indexOf('  return (\n    <div\n      data-theme={theme}\n      data-view-mode={viewMode}\n      className="min-h-screen');

if (returnStart === -1) {
    console.error("Could not find return statement");
    process.exit(1);
}

// Create the locked check string
const lockedCheckStr = `
  const isLockedState = isAppLocked && securityLock.isEnabled && securityLock.pin;

  if (isLockedState) {
    return (
      <div
        data-theme={theme}
        data-view-mode={viewMode}
        className="min-h-screen w-full h-full fixed inset-0 overflow-hidden bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] flex flex-col font-sans"
        style={{ touchAction: 'none' }}
      >
        <LockScreen
          securityConfig={securityLock}
          onUnlockSuccess={handleUnlockSuccess}
          onUpdateSecurityConfig={handleSaveSecurityConfig}
          onResetAllData={handleEmergencyReset}
          language={language}
        />
      </div>
    );
  }
`;

// Replace the return start with the locked check + normal return
content = content.replace(
  '  return (\n    <div\n      data-theme={theme}\n      data-view-mode={viewMode}\n      className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] flex flex-col font-sans transition-colors duration-300"\n    >',
  lockedCheckStr + '\n  return (\n    <div\n      data-theme={theme}\n      data-view-mode={viewMode}\n      className="min-h-screen bg-[var(--theme-bg,#070E18)] text-[var(--theme-text,#F8FAFC)] flex flex-col font-sans transition-colors duration-300"\n    >'
);

// We need to remove the old LockScreen rendering at the bottom
content = content.replace(
  /\{\/\* Global App Passcode Vault Lock Screen \*\/\}\s*\{isAppLocked && securityLock\.isEnabled && securityLock\.pin && \([\s\S]*?<\/LockScreen>\s*\)\}/g,
  ""
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
