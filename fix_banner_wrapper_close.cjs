const fs = require('fs');
let banner = fs.readFileSync('src/components/HasVoltPromoBanner.tsx', 'utf8');
banner = banner.replace('      </div>\n    </div>\n\n      {/* Modal / Expanded View */}', '    </div>\n\n      {/* Modal / Expanded View */}');
fs.writeFileSync('src/components/HasVoltPromoBanner.tsx', banner, 'utf8');
