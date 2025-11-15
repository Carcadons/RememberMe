#!/bin/bash

# RememberMe Replit Setup Script

echo "🚀 Setting up RememberMe on Replit..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if expo-cli is available, if not install it
if ! command -v expo &> /dev/null; then
    echo "📱 Installing expo-cli..."
    npm install -g expo-cli
fi

# Clear any old expo caches
echo "🧹 Clearing caches..."
rm -rf .expo/
rm -rf node_modules/.cache

# Create web build directory
mkdir -p web-build

# Install patch-package for any necessary patches
npm install --save-dev patch-package postinstall-postinstall

# Create a postinstall script
echo '{
  "scripts": {
    "postinstall": "patch-package"
  }
}' > patch-package.json

echo "✅ Setup complete!"
echo ""
echo "To start the app in web mode (recommended for Replit):"
echo "  npm start"
echo ""
echo "Or directly:"
echo "  npx expo start --web"
echo ""
echo "Then press 'w' to open in web browser"
