const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace state initializations with lazy initializers from localStorage
const originalSecurityLock = "const [securityLock, setSecurityLock] = useState<SecurityLockConfig>(DEFAULT_SECURITY_LOCK);";
const newSecurityLock = `  const [securityLock, setSecurityLock] = useState<SecurityLockConfig>(() => {
    try {
      const saved = localStorage.getItem('khata_security_config');
      return saved ? JSON.parse(saved) : DEFAULT_SECURITY_LOCK;
    } catch (e) {
      return DEFAULT_SECURITY_LOCK;
    }
  });`;

const originalIsAppLocked = "const [isAppLocked, setIsAppLocked] = useState<boolean>(false);";
const newIsAppLocked = `  const [isAppLocked, setIsAppLocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('khata_security_config');
      if (saved) {
        const config = JSON.parse(saved);
        return config.isEnabled && !!config.pin;
      }
      return false;
    } catch (e) {
      return false;
    }
  });`;

content = content.replace(originalSecurityLock, newSecurityLock);
content = content.replace(originalIsAppLocked, newIsAppLocked);

// There's a useEffect in App.tsx that loads the security config again, we should remove it if it exists to avoid double load, or just keep it as it's harmless.
// Actually let's just write this back.
fs.writeFileSync('src/App.tsx', content, 'utf8');

console.log("App state fixed");
