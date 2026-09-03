const fs = require('fs');
let content = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');

content = content.replace(
  /bg-white\/20/g,
  'bg-[var(--theme-text,#F8FAFC)]/10'
);

// Oh wait, there are also background circles that are hardcoded: 
// bg-gradient-to-br from-[#38BDF8] to-[#8B5CF6] 
// bg-gradient-to-br from-[#10B981] to-[#3B82F6] 
// These are fine as they are just colorful glowing blobs. But let's check if the glare layer has rgba(255,255,255,0.15).
// Let's replace the glare with a subtle white glare that works in both, or just a generic light glare.
// rgba(255,255,255,...) is actually fine for glare even in light mode if opacity is very low, but maybe it should be theme-dependent or just kept as is since it's just 15%.
// Let's check the glare layer:
content = content.replace(
  /rgba\(255,255,255,0\.15\)/g,
  'rgba(255,255,255,0.12)'
);

fs.writeFileSync('src/components/BankingCard3D.tsx', content);
