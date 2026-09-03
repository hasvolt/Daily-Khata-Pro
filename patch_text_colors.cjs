const fs = require('fs');

const files = [
  'src/components/ReportView.tsx',
  'src/components/HomeView.tsx',
  'src/components/HistoryView.tsx',
  'src/components/BankingCard3D.tsx',
  'src/components/CalculatorPage.tsx',
  'src/components/AddView.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/text-\[#F8FAFC\]/g, 'text-[var(--theme-text,#F8FAFC)]');
    fs.writeFileSync(file, content);
  }
});
