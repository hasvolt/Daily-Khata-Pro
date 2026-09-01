const fs = require('fs');

const filePath = 'src/components/HasVoltPromoBanner.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') {
        setShowBanner(true);
      }
    } catch (e) {
      setShowBanner(true); // Fallback to show if timezone check fails
    }
  }, []);

  if (!showBanner) return null;

  // Keyboard escape listener`;

content = content.replace('  // Keyboard escape listener', replacement);

fs.writeFileSync(filePath, content, 'utf8');
