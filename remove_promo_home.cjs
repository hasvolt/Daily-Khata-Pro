const fs = require('fs');

let home = fs.readFileSync('src/components/HomeView.tsx', 'utf8');

// The banner block in HomeView:
const startStr = '{/* HasVolt Sponsored Ad Card */}';
const endStr = '</HasVoltPromoBanner>\n          </div>\n        )}'; // Wait, let's just find the block.

const blockStart = home.indexOf(startStr);
if (blockStart !== -1) {
    const nextBlockStart = home.indexOf('{/* Customization Selector Modal */}', blockStart);
    if (nextBlockStart !== -1) {
        home = home.substring(0, blockStart) + home.substring(nextBlockStart);
        fs.writeFileSync('src/components/HomeView.tsx', home, 'utf8');
        console.log("Removed banner from HomeView");
    }
}
