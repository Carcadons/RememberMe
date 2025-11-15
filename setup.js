#!/usr/bin/env node

// Replit Setup Script for RememberMe
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up RememberMe on Replit...');

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    log(`Error running: ${command}`, 'red');
    console.error(error.message);
    return false;
  }
}

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  log('package.json not found!', 'red');
  log('Make sure you are in the project root directory.', 'yellow');
  process.exit(1);
}

// Install dependencies
log('\n📦 Installing dependencies...', 'blue');
const installSuccess = exec('npm install');

if (!installSuccess) {
  log('\n❌ Failed to install dependencies.', 'red');
  process.exit(1);
}

// Create necessary directories
log('\n📁 Creating directories...', 'blue');
const dirs = ['build', 'public/icons', 'public/splash'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created: ${dir}`, 'green');
  }
});

// Generate placeholder icons if they don't exist
log('\n🎨 Checking icons...', 'blue');
const requiredIcons = [
  'public/icons/icon-72x72.png',
  'public/icons/icon-152x152.png',
  'public/icons/icon-192x192.png',
  'public/icons/icon-512x512.png',
];

if (!fs.existsSync('public/icons/icon-192x192.png')) {
  log('Placeholder icons will be created automatically on build.', 'yellow');
}

// Create .env file if it doesn't exist
if (!fs.existsSync('.env')) {
  log('\n📝 Creating .env file...', 'blue');
  fs.writeFileSync('.env', 'VITE_REPLIT=true\n');
  log('Created .env file', 'green');
}

// Check if TypeScript compiles
log('\n🔍 Checking TypeScript compilation...', 'blue');
const typecheckSuccess = exec('npx tsc --noEmit');

if (typecheckSuccess) {
  log('✅ TypeScript checks passed!', 'green');
} else {
  log('⚠️  TypeScript warnings found (app will still run)', 'yellow');
}

// Create a simple start script
log('\n🎯 Creating start script...', 'blue');
const startScript = `#!/bin/bash
echo "🚀 Starting RememberMe on Replit..."
echo "📱 This is a PWA - you can install it on your phone!"
echo ""
echo "To install on iOS:"
echo "   1. Tap the Share button (box with arrow)"
echo "   2. Select 'Add to Home Screen'"
echo "   3. Tap 'Add'"
echo ""
echo "To install on Android:"
echo "   1. Tap the menu (3 dots)"
echo "   2. Select 'Add to Home Screen'"
echo "   3. Tap 'Add'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run dev
`;

fs.writeFileSync('start.sh', startScript);
exec('chmod +x start.sh');

// Success!
log('\n✅ Setup complete!', 'green');
log('\n📱 How to run on Replit:', 'blue');
log('   1. Click "Run" button at the top', 'yellow');
log('   OR', 'yellow');
log('   2. Run: npm run dev', 'yellow');
log('\n📱 Then install as PWA:', 'blue');
log('   - On mobile: Share → Add to Home Screen', 'yellow');
log('   - On desktop: Install icon in address bar', 'yellow');
log('\n🌐 The app will be available at:', 'blue');
log('   - Replit Webview tab (built-in)', 'yellow');
log('   - Public URL (from Replit webview)', 'yellow');
log('\n🔐 First-time setup:', 'blue');
log('   1. Create a passcode to encrypt your data', 'yellow');
log('   2. Start adding contacts', 'yellow');
log('   3. All data stays on your device (encrypted)', 'yellow');

log('\n🎉 RememberMe is ready to use!', 'green');
log('\nNext steps:', 'blue');
log('- Read REPLIT_DEPLOY_GUIDE.md for detailed instructions', 'yellow');
log('- Read README.md for app features', 'yellow');
log('- Check PWA.md for PWA-specific features', 'yellow');
