const fs = require('fs');

let banner = fs.readFileSync('src/components/HasVoltPromoBanner.tsx', 'utf8');
banner = banner.replace(
  '<div className={`hasvolt-promo-wrapper ${className} w-full`}>\n      <div className="relative w-full h-full"><div className={`hasvolt-promo-wrapper ${className} w-full`}>',
  '<div className={`hasvolt-promo-wrapper ${className} w-full relative`}>'
);
fs.writeFileSync('src/components/HasVoltPromoBanner.tsx', banner, 'utf8');
