const fs = require('fs');
let content = fs.readFileSync('src/components/BankingCard3D.tsx', 'utf8');

content = content.replace(
  /className="py-2 px-4 rounded-xl bg-\[#10B981\]\/20 hover:bg-\[#10B981\]\/30 border border-\[#10B981\]\/30 text-\[#10B981\] font-bold text-\[12px\] sm:text-\[14px\] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-\[0_0_15px_rgba\(16,185,129,0\.1\)\] hover:shadow-\[0_0_20px_rgba\(16,185,129,0\.3\)\] backdrop-blur-md"/g,
  'className="py-2 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[12px] sm:text-[14px] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(16,185,129,0.3)]"'
);

content = content.replace(
  /className="py-2 px-4 rounded-xl bg-\[#EF4444\]\/20 hover:bg-\[#EF4444\]\/30 border border-\[#EF4444\]\/30 text-\[#EF4444\] font-bold text-\[12px\] sm:text-\[14px\] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-\[0_0_15px_rgba\(239,68,68,0\.1\)\] hover:shadow-\[0_0_20px_rgba\(239,68,68,0\.3\)\] backdrop-blur-md"/g,
  'className="py-2 px-4 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-[12px] sm:text-[14px] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(239,68,68,0.3)]"'
);

fs.writeFileSync('src/components/BankingCard3D.tsx', content);
