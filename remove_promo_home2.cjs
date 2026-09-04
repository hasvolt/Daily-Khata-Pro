const fs = require('fs');
let home = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

const startStr = '{/* HasVolt Sponsored Ad Card */}';
const endStr = '{/* Homepage Fund Selector Modal */}';

const blockStart = home.indexOf(startStr);
const nextBlockStart = home.indexOf(endStr);
if (blockStart !== -1 && nextBlockStart !== -1) {
    home = home.substring(0, blockStart) + home.substring(nextBlockStart);
    fs.writeFileSync('src/components/HomeView.tsx', home, 'utf8');
    console.log("Removed banner from HomeView successfully");
} else {
    console.log("Failed to find boundaries");
}
