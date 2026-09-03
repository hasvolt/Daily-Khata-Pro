const fs = require('fs');

// 1. Fix global CSS: make bg pure black and surface slightly elevated
let cssContent = fs.readFileSync('src/index.css', 'utf8');
cssContent = cssContent.replace(/--theme-bg: #050505;/g, '--theme-bg: #000000;');
cssContent = cssContent.replace(/--theme-surface: #0A0A0A;/g, '--theme-surface: #0A0A0A;');
cssContent = cssContent.replace(/--theme-card: #0F0F0F;/g, '--theme-card: #09090B;');
fs.writeFileSync('src/index.css', cssContent);

// 2. Fix HomeView.tsx
let homeContent = fs.readFileSync('src/components/HomeView.tsx', 'utf8');
// Fix flat backgrounds (make them stand out as cards against black bg)
homeContent = homeContent.replace(/bg-\[\#050505\]/g, 'bg-[#09090B]');
homeContent = homeContent.replace(/bg-\[\#0F0F0F\]/g, 'bg-[#09090B]');
homeContent = homeContent.replace(/bg-\[\#0A0A0A\]/g, 'bg-[#09090B]');
// Distinct borders
homeContent = homeContent.replace(/border-\[\#1A1A1A\]/g, 'border-[#1C1C1E]');
homeContent = homeContent.replace(/border-\[\#1F1F1F\]/g, 'border-[#1C1C1E]');
// Keep the inner elements a bit darker than the card
homeContent = homeContent.replace(/bg-transparent/g, 'bg-[#050505]');
// Remove specific white shadows or borders if any
homeContent = homeContent.replace(/border border-\[\#1C1C1E\]\/60/g, 'border border-[#1C1C1E]');
homeContent = homeContent.replace(/border border-\[\#1C1C1E\]\/80/g, 'border border-[#1C1C1E]');
fs.writeFileSync('src/components/HomeView.tsx', homeContent);

// 3. Fix BankingCard3D.tsx
let bankingContent = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');
bankingContent = bankingContent.replace(/bg-\[\#0F0F0F\]/g, 'bg-[#09090B]');
bankingContent = bankingContent.replace(/border-\[\#1F1F1F\]/g, 'border-[#1C1C1E]');
// Remove white glare completely!
bankingContent = bankingContent.replace(/background: "radial-gradient\(circle at center, rgba\(255,255,255,0\.12\) 0%, rgba\(255,255,255,0\) 60%\)"/g, 'background: "transparent"');
// Fix Action Buttons bg which might be blending
bankingContent = bankingContent.replace(/bg-transparent/g, 'bg-[#050505]'); // Restore small boxes behind icons to be pitch black against #09090B card
fs.writeFileSync('src/components/BankingCard3D.tsx', bankingContent);

// 4. Fix FundCard3D.tsx
let fundContent = fs.readFileSync('src/components/FundCard3D.tsx', 'utf8');
fundContent = fundContent.replace(/bg-\[\#050505\]/g, 'bg-[#09090B]');
fundContent = fundContent.replace(/border-\[\#1A1A1A\]/g, 'border-[#1C1C1E]');
fundContent = fundContent.replace(/border-\[\#1F1F1F\]/g, 'border-[#1C1C1E]');
// Remove white glare!
fundContent = fundContent.replace(/background: "radial-gradient\(circle at center, rgba\(255,255,255,0\.08\) 0%, rgba\(255,255,255,0\) 70%\)"/g, 'background: "transparent"');
fs.writeFileSync('src/components/FundCard3D.tsx', fundContent);

console.log("Patched colors and glares");
