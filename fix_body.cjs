const fs = require('fs');
let content = fs.readFileSync('src/components/LockScreen.tsx', 'utf8');

const effectString = `
  // Lock body scroll completely while lock screen is active
  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);
`;

content = content.replace('  const isHindi = language === \'hi\';', effectString + '\n  const isHindi = language === \'hi\';');

fs.writeFileSync('src/components/LockScreen.tsx', content, 'utf8');
