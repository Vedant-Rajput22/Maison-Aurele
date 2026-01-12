const fs = require('fs');
const path = require('path');

const traceFile = path.join(__dirname, '..', '.next', 'server', 'middleware.js.nft.json');

// Only create if it doesn't exist (Turbopack bug workaround)
if (!fs.existsSync(traceFile)) {
    console.log('Creating missing middleware trace file...');
    fs.writeFileSync(traceFile, JSON.stringify({
        version: 1,
        files: []
    }));
    console.log('✓ Created middleware.js.nft.json');
} else {
    console.log('✓ middleware.js.nft.json already exists');
}
