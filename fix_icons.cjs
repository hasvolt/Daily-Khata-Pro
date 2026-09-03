const fs = require('fs');

let bankingContent = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');
bankingContent = bankingContent.replace(/bg-\[var\(--theme-surface,#0A0A0A\)\]/g, 'bg-transparent');
bankingContent = bankingContent.replace(/border border-\[var\(--theme-border,#1F1F1F\)\]/g, '');
fs.writeFileSync('src/components/BankingCard3D.tsx', bankingContent);

let homeContent = fs.readFileSync('src/components/HomeView.tsx', 'utf8');
homeContent = homeContent.replace(/bg-\[\#0F0F0F\]/g, 'bg-[#0A0A0A]'); // Ensure very dark
homeContent = homeContent.replace(/bg-\[\#0A0A0A\]/g, 'bg-[#050505]'); // Ensure inner elements are darker
// 6-fund pots might have #0F0F0F now, let's make them #050505
fs.writeFileSync('src/components/HomeView.tsx', homeContent);

let fundContent = fs.readFileSync('src/components/FundCard3D.tsx', 'utf8');
fundContent = fundContent.replace(/bg-\[\#0F0F0F\]/g, 'bg-[#050505]');
fs.writeFileSync('src/components/FundCard3D.tsx', fundContent);

console.log("Patched icon backgrounds");
