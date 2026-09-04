const fs = require('fs');
let sw = fs.readFileSync('public/sw.js', 'utf8');
sw = sw.replace(/const CACHE_NAME = 'daily-khata-pro-v2\.5\.0';/g, "const CACHE_NAME = 'daily-khata-pro-v2.6.0';");
fs.writeFileSync('public/sw.js', sw, 'utf8');
console.log("SW updated");
