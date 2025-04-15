// Simple SVG icon creation script
const fs = require('fs');
const path = require('path');

// Create a simple SVG icon with "NLQ" text
function createIcon(size) {
  const fontSize = Math.floor(size * 0.5);
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#0d6efd" rx="5" ry="5"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${fontSize}px" fill="white" text-anchor="middle" dominant-baseline="middle">NLQ</text>
  </svg>`;
  
  return svg;
}

// Create icons in different sizes
const sizes = [16, 48, 128];
const outputDir = path.join(__dirname, 'images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons
sizes.forEach(size => {
  const svg = createIcon(size);
  fs.writeFileSync(path.join(outputDir, `icon${size}.svg`), svg);
  console.log(`Created icon${size}.svg`);
});

console.log('Icon generation complete!');
