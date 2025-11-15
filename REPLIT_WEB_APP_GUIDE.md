# RememberMe PWA Web App - Replit Setup Guide

## 🎯 Quick Start (30 seconds)

1. **Import to Replit**: Click **+ Create Repl** → **Import from GitHub** → Enter your repo URL
2. **Run Setup**: In the Shell panel, type:
   ```bash
   node setup.js
   ```
3. **Start App**: Click the **Run** button at the top
4. **Done!** Your PWA is now running at `https://YOUR-REPL-NAME.YOUR-USERNAME.repl.co`

## 📱 How to Install as PWA

### On iOS
1. Open the app in Safari
2. Tap the **Share** button (box with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** in the top-right corner
5. App icon appears on your home screen

### On Android
1. Open app in Chrome
2. Tap the **menu** (three dots) in top-right
3. Tap **"Add to Home Screen"**
4. Confirm by tapping **"Add"**
5. App icon appears on your home screen

### On Desktop (Chrome/Edge)
1. Click the **install icon** (computer with arrow) in the address bar
2. Click **"Install"**
3. App opens in its own window

## 💡 What is a PWA?

**Progressive Web App** = Website + Native App Features

✅ **Installable** → Add to home screen like a native app
✅ **Offline Mode** → Works without internet (after first visit)
✅ **Push Notifications** → Send reminders (coming soon)
✅ **Fast** → Cached locally, instant load times
✅ **Secure** → HTTPS-only, sandboxed
✅ **Native Features** → Camera, filesystem, etc. (with permissions)

## 🏃‍♂️ Development Commands

```bash
# Start development server (auto-reload)
npm run dev

# Production build (optimized for deployment)
npm run build

# Preview production build locally
npm run preview

# Type check
npm run lint

# Re-run setup
node setup.js
```

## 🔧 Configuration Files

### Replit Files
- **`.replit`** → Replit configuration (port, run command, environment)
- **`replit.nix`** → Nix package manager config (Node.js 20)
- **`setup.js`** → Automated setup script
- **`vite.config.ts`** → Vite bundler + PWA plugin config

### PWA Files
- **`/public/manifest.json`** → App metadata (name, icons, colors)
- **`index.html`** → Entry point + iOS install prompts
- **`vite.config.ts`** → Service Worker + caching strategy

### Key Settings
```json
{
  "name": "RememberMe",
  "display": "standalone",  // Opens like native app (no browser UI)
  "orientation": "portrait-primary",  // Locks to portrait
  "theme_color": "#6366f1"  // Status bar color (Android)
}
```

## 🔐 Security Features

### Encryption
- All data encrypted with AES-256 before storage
- Encryption key derived from your passcode
- Biometric unlock (simulated, password fallback available)
- Local-first: Data never leaves your device

### Service Worker Security
- HTTPS-only (enforced by browsers)
- Sandboxed execution context
- No access to DOM (isolated)
- Updates require user confirmation

## 🌐 Offline Mode

### How It Works
1. **Initial Visit**: All assets cached locally
2. **Subsequent Visits**: Loads instantly from cache
3. **Updates**: New versions downloaded in background
4. **Offline**: Full functionality without internet

### Cache Storage
- **App Shell**: HTML, CSS, JS (cached permanently)
- **Data**: IndexedDB (browser database)
- **Images**: Optional caching
- **Fonts**: Google Fonts cached

### Testing Offline
1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Check **"Offline"** checkbox
4. Refresh page
5. App still works! 🎉

## 🚀 Performance Optimizations

### Vite Features
- **Instant DEV server** → Hot Module Replacement (HMR)
- **Lazy loading** → Routes loaded on demand
- **Code splitting** → Smaller bundle sizes
- **Tree shaking** → Unused code removed
- **Minification** → Production builds optimized

### Service Worker Caching
- **Pre-cache**: All critical assets cached on install
- **Runtime cache**: Images/fonts cached on first load
- **Stale-while-revalidate**: Always fast, updates in background
- **Max cache age**: 1 year for fonts, 30 days for images

## 📊 Database

### IndexeDB (Browser's Local Database)
```typescript
// What it replaces:
- SQLite (native)
- AsyncStorage (React Native)
- LocalStorage (limited storage)

// Benefits:
✅ 500MB+ storage (browser-dependent)
✅ Indexed queries (fast search)
✅ Transactional (atomic operations)
✅ Async API (non-blocking)
✅ Structured data (tables/indexes)
```

### Encryption at Rest
```typescript
// Before storing:
{ fullName: "John Doe" }

// After encryption:
{ fullName_encrypted: "U2FsdGVkX1+v..." } // AES-256
```

### Data Model
- **Person Cards**: Main contact records
- **Quick Facts**: Memory triggers (30 char limit)
- **Notes**: Meeting notes with timestamps
- **Tags**: Categories and search keywords

## 🎯 PWA Best Practices

### ✅ Do
- Test on real devices
- Use responsive design
- Handle offline gracefully
- Show loading states
- Cache strategically
- Version your service worker
- Test installation flow

### ❌ Don't
- Cache everything (be selective)
- Break the back button
- Hide the URL (bad UX)
- Ignore update prompts
- Store sensitive data unencrypted
- Block the main thread

## 📱 iOS-Specific Features

### iOS 11.3+ Support
- ✅ Add to Home Screen
- ✅ Splash screens
- ✅ Status bar styling
- ✅ Standalone mode (no Safari UI)
- ⚠️ No Web App Manifest support (uses meta tags instead)
- ⚠️ No Push Notifications (iOS limitation)

### iOS Limitations
- Push notifications not available (iOS only allows Safari and Chrome)
- Background sync limited
- No installation prompts (manual only)
- No badge icons

## 🔍 Testing Your PWA

### Lighthouse Audit
1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Check: Performance, Accessibility, Best Practices, SEO, PWA
4. Click **"Analyze page load"**
5. Aim for 90+ scores

### Manual Tests
- [ ] Install from browser
- [ ] Launch from home screen
- [ ] Works offline
- [ ] Offline indicator shown
- [ ] Responsive on mobile
- [ ] Fast load times (<3s)

## 🐛 Troubleshooting

### App won't install
**Cause**: Not served over HTTPS (or localhost)
**Fix**: Replit provides HTTPS automatically ✅

### Service worker not registering
**Cause**: Cache issue
**Fix**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### White screen after install
**Cause**: Asset caching issue
**Fix**: Clear cache or re-build:
```bash
npm run build
```

### Icons not showing
**Cause**: Missing icon files
**Fix**: Add icons to `/public/icons/` or use defaults

### Slow updates
**Cause**: Service worker caching
**Fix**: Force update:
```js
// In browser console:
navigator.serviceWorker.controller?.postMessage({type: 'SKIP_WAITING'});
```

## 🆘 Getting Help

### Replit Issues
- **Docs**: https://docs.replit.com
- **Community**: https://replit.com/community
- **Status**: https://status.replit.com

### PWA Development
- **MDN PWA Guide**: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- **Vite PWA Plugin**: https://vite-pwa-org.netlify.app/
- **IndexedDB**: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

### Project-Specific
- **README.md**: App features & architecture
- **REPLIT_DEPLOY_GUIDE.md**: Deployment instructions
- **src/storage/database.ts**: Database implementation
- **src/utils/encryption.ts**: Encryption algorithms

## 📖 Next Steps

1. **Customize**: Edit colors in `/src/constants/index.ts`
2. **Add Features**: Build more screens in `/src/screens/`
3. **Style**: Add CSS in component files or create CSS modules
4. **Test**: Run Lighthouse audit and fix issues
5. **Deploy**: Follow REPLIT_DEPLOY_GUIDE.md for production
6. **Share**: Send Replit URL to friends/colleagues

## 🎉 Summary

You now have a:
- ✅ **Fully functional PWA** (installable on iOS/Android/Desktop)
- ✅ **Encrypted local database** (privacy-first)
- ✅ **Offline-capable app** (works without internet)
- ✅ **Replit-hosted** (easy to share & deploy)
- ✅ **Fast development** (Vite + hot reload)
- ✅ **Type-safe** (TypeScript)

**Start building!** 🚀

---

*Need more help? Check the troubleshooting section or open an issue on GitHub.*
