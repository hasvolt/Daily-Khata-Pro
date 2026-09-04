const fs = require('fs');

let home = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// The Today card container starts with:
// <div className="bg-gradient-to-br from-[var(--theme-card,#040E24)] to-[var(--theme-surface,#020A1A)] border border-[var(--theme-primary,#38BDF8)]/20 hover:border-[#38BDF8]/40 rounded-[20px] sm:rounded-3xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 space-y-3 transform scale-[0.97] sm:scale-100 origin-top">
// We want to make it look distinct. E.g., a glow, different header styling.

home = home.replace(
  '<div className="bg-gradient-to-br from-[var(--theme-card,#040E24)] to-[var(--theme-surface,#020A1A)] border border-[var(--theme-primary,#38BDF8)]/20 hover:border-[#38BDF8]/40 rounded-[20px] sm:rounded-3xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 space-y-3 transform scale-[0.97] sm:scale-100 origin-top">',
  '<div className="bg-gradient-to-br from-[var(--theme-card,#040E24)] via-[#0A1930] to-[var(--theme-surface,#020A1A)] border-2 border-[var(--theme-primary,#38BDF8)]/40 hover:border-[#38BDF8]/70 rounded-[20px] sm:rounded-3xl p-3 sm:p-4 shadow-[0_0_15px_rgba(56,189,248,0.1)] hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] transition-all duration-300 space-y-3 transform scale-[0.97] sm:scale-100 origin-top relative overflow-hidden">\n          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent opacity-70"></div>'
);

// The Monthly card:
// <div className="bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[#1E4E9E] rounded-[20px] sm:rounded-3xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 space-y-3 min-w-0 overflow-hidden transform scale-[0.97] sm:scale-100 origin-top">
home = home.replace(
  '<div className="bg-[var(--theme-card,#040E24)] border border-[var(--theme-border,#0D2654)] hover:border-[#1E4E9E] rounded-[20px] sm:rounded-3xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 space-y-3 min-w-0 overflow-hidden transform scale-[0.97] sm:scale-100 origin-top">',
  '<div className="bg-[var(--theme-surface,#020A1A)] border border-[var(--theme-border,#0D2654)] hover:border-[#1E4E9E] rounded-[20px] sm:rounded-3xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 space-y-3 min-w-0 overflow-hidden transform scale-[0.97] sm:scale-100 origin-top relative">\n          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-primary,#38BDF8)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>'
);

fs.writeFileSync('src/components/HomeView.tsx', home, 'utf8');
console.log("Home cards updated");
