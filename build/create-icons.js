#!/usr/bin/env node

/**
 * Simple icon generator for Ann AI
 * Creates basic placeholder icons for development builds
 */

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="512" cy="512" r="480" fill="url(#grad1)" stroke="#4a5568" stroke-width="8"/>
  
  <!-- AI Symbol -->
  <g transform="translate(512,512)">
    <!-- Neural network nodes -->
    <circle cx="-120" cy="-80" r="20" fill="white" opacity="0.9"/>
    <circle cx="0" cy="-120" r="20" fill="white" opacity="0.9"/>
    <circle cx="120" cy="-80" r="20" fill="white" opacity="0.9"/>
    <circle cx="-80" cy="0" r="20" fill="white" opacity="0.9"/>
    <circle cx="80" cy="0" r="20" fill="white" opacity="0.9"/>
    <circle cx="-120" cy="80" r="20" fill="white" opacity="0.9"/>
    <circle cx="0" cy="120" r="20" fill="white" opacity="0.9"/>
    <circle cx="120" cy="80" r="20" fill="white" opacity="0.9"/>
    
    <!-- Connections -->
    <line x1="-120" y1="-80" x2="0" y2="-120" stroke="white" stroke-width="3" opacity="0.7"/>
    <line x1="0" y1="-120" x2="120" y2="-80" stroke="white" stroke-width="3" opacity="0.7"/>
    <line x1="-120" y1="-80" x2="-80" y2="0" stroke="white" stroke-width="3" opacity="0.7"/>
    <line x1="120" y1="-80" x2="80" y2="0" stroke="white" stroke-width="3" opacity="0.7"/>
    <line x1="-80" y1="0" x2="80" y2="0" stroke="white" stroke-width="3" opacity="0.7"/>
    <line x1="-80" y1="0" x2="-120" y2="80" stroke="white" stroke-width="3" opacity="0.7"/>
    <line x1="80" y1="0" x2="120" y2="80" stroke="white" stroke-width="3" opacity="0.7"/>
    <line x1="-120" y1="80" x2="0" y2="120" stroke="white" stroke-width="3" opacity="0.7"/>
    <line x1="0" y1="120" x2="120" y2="80" stroke="white" stroke-width="3" opacity="0.7"/>
    
    <!-- Center AI text -->
    <text x="0" y="10" text-anchor="middle" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white">AI</text>
  </g>
</svg>`;

// Create a simple DMG background
const dmgBackground = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f7fafc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#edf2f7;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="500" height="500" fill="url(#bgGrad)"/>
  
  <!-- Subtle pattern -->
  <g opacity="0.1">
    <circle cx="100" cy="100" r="50" fill="#667eea"/>
    <circle cx="400" cy="150" r="30" fill="#764ba2"/>
    <circle cx="150" cy="350" r="40" fill="#667eea"/>
    <circle cx="350" cy="400" r="25" fill="#764ba2"/>
  </g>
  
  <!-- App name -->
  <text x="250" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="300" fill="#4a5568">Ann AI</text>
</svg>`;

console.log('🎨 Creating placeholder icons...');

// Write SVG files
fs.writeFileSync(path.join(__dirname, 'icon.svg'), svgIcon);
fs.writeFileSync(path.join(__dirname, 'dmg-background.svg'), dmgBackground);

console.log('✅ Created SVG files');
console.log('');
console.log('📝 To complete icon setup:');
console.log('1. Convert icon.svg to PNG (1024x1024)');
console.log('2. Use online converters to create:');
console.log('   - icon.icns (macOS)');
console.log('   - icon.ico (Windows)');
console.log('   - icon.png (Linux) - copy the PNG');
console.log('3. Convert dmg-background.svg to PNG (500x500)');
console.log('');
console.log('🌐 Recommended online converters:');
console.log('   - SVG to PNG: https://cloudconvert.com/svg-to-png');
console.log('   - PNG to ICNS: https://cloudconvert.com/png-to-icns');
console.log('   - PNG to ICO: https://cloudconvert.com/png-to-ico');
console.log('');
console.log('💡 Or use this command if you have ImageMagick:');
console.log('   convert icon.svg -resize 1024x1024 icon.png');
console.log('   convert dmg-background.svg -resize 500x500 dmg-background.png');