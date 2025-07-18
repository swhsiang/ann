#!/usr/bin/env node

/**
 * Build preparation script for Ann AI
 * This script helps prepare the build environment and checks for required assets
 */

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const requiredFiles = [
  'icon.icns',    // macOS icon
  'icon.ico',     // Windows icon  
  'icon.png',     // Linux icon
  'dmg-background.png'  // DMG background
];

const optionalFiles = [
  'installer.nsh',
  'entitlements.mac.plist'
];

console.log('🔧 Ann AI Build Preparation');
console.log('============================\n');

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.log('❌ Build directory does not exist. Creating...');
  fs.mkdirSync(buildDir, { recursive: true });
  console.log('✅ Build directory created\n');
} else {
  console.log('✅ Build directory exists\n');
}

// Check for required files
console.log('📋 Checking required build assets:');
let missingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(buildDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} (missing)`);
    missingFiles.push(file);
  }
});

// Check for optional files
console.log('\n📋 Checking optional build assets:');
optionalFiles.forEach(file => {
  const filePath = path.join(buildDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`⚠️  ${file} (optional, will use defaults)`);
  }
});

// Provide guidance for missing files
if (missingFiles.length > 0) {
  console.log('\n🚨 Missing Required Files:');
  console.log('==========================');
  
  missingFiles.forEach(file => {
    switch (file) {
      case 'icon.icns':
        console.log(`\n📱 ${file}:`);
        console.log('   - macOS application icon');
        console.log('   - Create from a 1024x1024 PNG using:');
        console.log('     iconutil -c icns icon.iconset');
        console.log('   - Or use online converter: https://cloudconvert.com/png-to-icns');
        break;
        
      case 'icon.ico':
        console.log(`\n🪟 ${file}:`);
        console.log('   - Windows application icon');
        console.log('   - Create from PNG using online converter');
        console.log('   - Recommended sizes: 16x16, 32x32, 48x48, 256x256');
        console.log('   - Online converter: https://cloudconvert.com/png-to-ico');
        break;
        
      case 'icon.png':
        console.log(`\n🐧 ${file}:`);
        console.log('   - Linux application icon');
        console.log('   - Use 512x512 PNG format');
        console.log('   - Should be the same as your base icon');
        break;
        
      case 'dmg-background.png':
        console.log(`\n🖼️  ${file}:`);
        console.log('   - macOS DMG installer background');
        console.log('   - Recommended size: 500x500 pixels');
        console.log('   - Should match your app branding');
        break;
    }
  });
  
  console.log('\n💡 Quick Start:');
  console.log('   1. Create a 1024x1024 PNG icon for your app');
  console.log('   2. Use online converters to generate .icns and .ico versions');
  console.log('   3. Copy the PNG as icon.png for Linux');
  console.log('   4. Create a 500x500 DMG background image (optional)');
  console.log('   5. Place all files in the build/ directory');
}

// Check package.json configuration
console.log('\n⚙️  Checking package.json configuration:');
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (packageJson.build) {
    console.log('✅ Build configuration found');
    
    // Check for important fields
    const checks = [
      { key: 'appId', value: packageJson.build.appId },
      { key: 'productName', value: packageJson.build.productName },
      { key: 'mac.target', value: packageJson.build.mac?.target },
      { key: 'win.target', value: packageJson.build.win?.target }
    ];
    
    checks.forEach(check => {
      if (check.value) {
        console.log(`✅ ${check.key}: ${JSON.stringify(check.value)}`);
      } else {
        console.log(`⚠️  ${check.key}: not configured`);
      }
    });
  } else {
    console.log('❌ No build configuration found in package.json');
  }
} else {
  console.log('❌ package.json not found');
}

// Final status
console.log('\n🎯 Build Readiness Status:');
if (missingFiles.length === 0) {
  console.log('✅ Ready to build! Run: yarn dist');
} else {
  console.log(`❌ ${missingFiles.length} required files missing`);
  console.log('   Complete the setup above, then run: yarn dist');
}

console.log('\n📚 For detailed instructions, see: docs/BUILD.md');