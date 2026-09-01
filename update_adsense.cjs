const fs = require('fs');

const filePath = 'src/components/GoogleAdBanner.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace format default
content = content.replace("format = 'auto',", "format = 'horizontal',"); // Prefer horizontal for better UX
content = content.replace("data-ad-format={format}", "data-ad-format={format}");

// Let's add explicit CSS for responsive ad slot sizing to prevent layout shift
// Replace the inline style on <ins>
content = content.replace(
  "style={{ display: 'block', width: '100%', minHeight: '90px', textAlign: 'center' }}",
  "style={{ display: 'block', textAlign: 'center' }}\n          className=\"adsbygoogle custom-responsive-ad\""
);

// We need to inject the CSS for custom-responsive-ad if it's not there, but maybe just using tailwind classes on the container is better?
// Wait, the container has: <div className="w-full min-h-[90px]... flex items-center justify-center">
// It's probably easier to just set the format to 'horizontal' and keep the container as is.

fs.writeFileSync(filePath, content, 'utf8');
