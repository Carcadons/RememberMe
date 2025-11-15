# RememberMe on Replit - Complete Setup Guide

## Overview

This guide will help you run the RememberMe app on Replit. Due to Replit's environment limitations, we'll use **Web mode** (React Native Web) instead of native iOS/Android builds.

## What Works on Replit ✅

- ✅ Authentication system (passcode + biometric simulation)
- ✅ Local SQLite storage with encryption
- ✅ Add/edit/view person cards
- ✅ Search functionality (basic)
- ✅ Export to PDF
- ✅ Web-based UI

## Limitations on Replit ⚠️

- ❌ Native iOS/Android builds (requires Xcode/Android Studio)
- ❌ Biometric authentication (actual Face ID/Touch ID)
- ❌ Camera access for photos
- ❌ Contact import from device
- ❌ Calendar integration (native calendars)

## Step-by-Step Replit Setup

### Step 1: Push to GitHub & Import to Replit

1. **Initialize git repository** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - RememberMe app"
```

2. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/RememberMe.git
git branch -M main
git push -u origin main
```

3. **Import to Replit**:
   - Go to [Replit](https://replit.com)
   - Click "+ Create Repl"
   - Choose "Import from GitHub"
   - Enter your repository URL
   - Select "Node.js" as the language
   - Click "Import from GitHub"

### Step 2: Run the Automated Setup

Once imported, open Replit's Shell and run:

```bash
./replit-setup.sh
```

This will:
- Install all dependencies
- Clear caches
- Set up the environment

### Step 3: Update Configuration

In Replit's Shell, run these commands to optimize for web:

```bash
# Install web-specific dependencies
npm install --save-dev @expo/webpack-config

# Create production build config
mkdir -p web-build
```

### Step 4: Start the Development Server

In Replit, you have several options:

**Option A: Use Replit's Run Button**
- Replit will automatically run `npx expo start web --lan`
- Click "Run" at the top

**Option B: Use the Shell**
```bash
npm start
```

**Option C: Direct Web Mode**
```bash
npx expo start --web
```

You'll see output like:
```
› Metro waiting on http://localhost:8081
› Web is waiting on http://localhost:8081
```

### Step 5: View the Web App

In Replit:
1. Look for the "Webview" tab at the top
2. Click on it to see the app
3. Or click the "New Tab" button and enter the URL shown in the console

Alternatively, open the URL in a new browser tab:
```
https://YOUR-REPL-NAME.YOUR-USERNAME.repl.co
```

### Step 6: First Time Setup

1. **Create a passcode** (4+ characters):
   - Enter on first screen
   - Re-enter to confirm

2. **Unlock the app**:
   - Enter your passcode
   - Click "Unlock"

3. **Start using RememberMe**:
   - Click "+" to add a person
   - Fill in: name, title, context
   - Add 1-3 quick facts (max 30 chars each)
   - Save

## Replit-Specific Files

### `.replit` - Replit Configuration
This file tells Replit:
- What command to run on startup
- Which ports to use
- Environment settings

### `replit.nix` - Nix Package Configuration
Defines Node.js and tool versions for Replit's Nix environment.

### `replit-setup.sh` - Automated Setup Script
Sets up the environment automatically.

## Development on Replit

### Starting Development
```bash
npm start
```
Press `w` in the terminal to open web mode.

### Making Changes
1. Edit files in the Replit editor
2. Changes will hot-reload automatically in the web view
3. No need to restart (most of the time)

### Testing Encryption
The SQLite database uses AES-256 encryption. To test:

1. Add a person card
2. Check the database file:
```bash
# In Replit Shell:
ls -la | grep .db
```

The database should be encrypted and unreadable without the key.

### Export Data
To export all your person cards:

```typescript
// In app/src/utils/export.ts (create if needed)
export const exportAllData = async () => {
  const people = await database.getAllPeople();
  const json = JSON.stringify(people, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  // Trigger download in web
};
```

## Production Deployment on Replit

### Build for Production

```bash
npx expo build:web
```

This creates a production build in `web-build/` directory.

### Deploy to Replit Production

1. In Replit:
   - Go to your Repl
   - Click "Deployments" at the top
   - Click "Static" deployment type
   - Set deployment directory to `web-build`
   - Click "Deploy"

2. Replit will provide a public URL: `https://rememberme-production.up.railway.app`

### Custom Domain (Optional)

1. Buy or use your own domain
2. In Replit Deployment settings:
   - Click "Custom Domain"
   - Enter your domain
3. Add the CNAME record to your DNS provider

## Troubleshooting on Replit

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port already in use"
- Click "Stop" on the current running app
- Click "Run" again

### Error: "Webpack configuration issue"
```bash
npm install --save-dev @expo/webpack-config
```

### Slow Performance
- Upgrade to Replit "Hacker" plan for more resources
- Or run: `npx expo start --web --no-dev --minify`

### Webview Not Loading
1. Try opening in new tab: `https://YOUR-REPL-NAME.YOUR-USERNAME.repl.co`
2. Check Shell for errors
3. Make sure process is running (green dot in Shell)

## Backend Database on Replit

Since Replit files are ephemeral (can be deleted), you have options:

### Option 1: Use Replit Database (Recommended)

```typescript
// Save to Replit Database
const { createClient } = require('@replit/database');
const db = createClient();

// Save encrypted data
db.set('persons_encrypted', encryptedData);
```

### Option 2: Download Database Locally

```bash
# Download the SQLite database
wget https://YOUR-REPL-NAME.YOUR-USERNAME.repl.co/files/.expo-sqlite/RememberMe.db
```

### Option 3: Export to GitHub

Use GitHub Actions to backup the database periodically.

## Replit-Specific Features

### Secrets (Environment Variables)
1. Click "Secrets" in Replit's left sidebar
2. Add sensitive data:
   - `ENCRYPTION_KEY_SALT`
   - `API_KEYS` (for future integrations)

### Multiplayer
- Share your Replit
- Multiple people can code simultaneously
- Share the app preview URL with your team

### Version Control
```bash
# Commit changes
git add .
git commit -m "Your changes"
git push
```

Replit automatically commits changes periodically.

## Next Steps

Once running, consider:

1. **Add more features**:
   - Calendar integration (web-based)
   - Contact import (CSV upload)
   - Better search
   - Export options

2. **Styling**:
   - Responsive design for mobile
   - Dark mode toggle

3. **Backend**:
   - Add Express.js for API
   - Store data in Replit Database
   - Sync between devices

## Getting Help

- **Replit Docs**: https://docs.replit.com
- **Expo Web**: https://docs.expo.dev/workflow/web/
- **Project Issues**: https://github.com/YOUR_USERNAME/RememberMe/issues

## Summary

| Feature | Local Dev | Replit Web | Notes |
|---------|-----------|------------|-------|
| Auth | ✅ | ✅ | Passcode works |
| Biometric | ✅ | ⚠️ | Simulated/no actual biometric |
| Storage | ✅ | ✅ | SQLite encrypted |
| Add/Edit | ✅ | ✅ | All features work |
| Search | ✅ | ✅ | Basic works, fuzzy needs tuning |
| Photos | ✅ | ❌ | Camera not accessible |
| Calendar | ✅ | ⚠️ | Web calendar API only |
| Export | ✅ | ✅ | PDF/web download works |
| iOS/Android | ✅ | ❌ | Need Xcode/Android Studio |

## Quick Commands Reference

```bash
# Start development
npm start

# Web only
npx expo start --web

# Production build
npx expo build:web

# Run setup script
./replit-setup.sh

# Clear cache
npx expo start -c

# Check logs
tail -f ~/.expo/logs/*.log
```

---

**Ready to launch on Replit!** 🚀

Run `./replit-setup.sh` to get started!
