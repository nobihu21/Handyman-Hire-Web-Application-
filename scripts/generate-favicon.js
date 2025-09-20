const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  'favicon.ico': 64,
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'logo192.png': 192,
  'logo512.png': 512
};

// Ensure the public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Source logo path
const sourceLogo = path.join(__dirname, '../src/assets/logo.png');

// Generate different sizes
Object.entries(sizes).forEach(([filename, size]) => {
  const outputPath = path.join(publicDir, filename);
  
  sharp(sourceLogo)
    .resize(size, size)
    .toFile(outputPath)
    .then(() => console.log(`Generated ${filename}`))
    .catch(err => console.error(`Error generating ${filename}:`, err));
}); 