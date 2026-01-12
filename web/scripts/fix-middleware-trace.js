const fs = require('fs');
const path = require('path');

const serverDir = path.join(__dirname, '..', '.next', 'server');
const traceFile = path.join(serverDir, 'middleware.js.nft.json');
const middlewareFile = path.join(serverDir, 'middleware.js');

// Ensure server directory exists
if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
}

// Create trace file if missing (Turbopack bug workaround)
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

// Create middleware.js if missing (Turbopack bug workaround)
if (!fs.existsSync(middlewareFile)) {
    console.log('Creating missing middleware.js...');
    // Create a minimal Edge middleware stub
    const middlewareContent = `
// Auto-generated middleware stub (Turbopack workaround)
// The actual middleware logic is handled by Next.js at runtime
export default function middleware(request) {
  return;
}

export const config = {
  matcher: ['/:path*'],
};
`;
    fs.writeFileSync(middlewareFile, middlewareContent.trim());
    console.log('✓ Created middleware.js');
} else {
    console.log('✓ middleware.js already exists');
}
