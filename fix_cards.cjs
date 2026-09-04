const fs = require('fs');
let home = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// 1. Differentiate "Today" card vs "Monthly" card
// Today Card: Give it a slight primary border accent and a faint gradient
home = home.replace(
  '<div className="bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[#1E4E9E] rounded-[20px] sm:rounded-3xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 space-y-3">',
  '<div className="bg-gradient-to-br from-[var(--theme-card,#040E24)] to-[var(--theme-surface,#020A1A)] border border-[var(--theme-primary,#38BDF8)]/20 hover:border-[#38BDF8]/40 rounded-[20px] sm:rounded-3xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 space-y-3 transform scale-[0.97] sm:scale-100 origin-top">'
);

// Monthly Card: Standard theme border, different gradient, add scale-[0.97]
home = home.replace(
  '<div className="bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[#1E4E9E] rounded-[20px] sm:rounded-3xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 space-y-3 min-w-0 overflow-hidden">',
  '<div className="bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[#1E4E9E] rounded-[20px] sm:rounded-3xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 space-y-3 min-w-0 overflow-hidden transform scale-[0.97] sm:scale-100 origin-top">'
);

fs.writeFileSync('src/components/HomeView.tsx', home, 'utf8');

console.log("Cards fix done");
