# RememberMe - Private Pocket Dossier

A privacy-focused mobile app that helps busy professionals prepare for meetings in under 3 seconds with memory-trigger based briefings.

## Core Features

### MVP Built
- **Privacy-first architecture**: All data encrypted locally with biometric authentication
- **Lightning-fast prep cards**: Quick memory triggers (not long biographies)
- **Calendar integration**: See today's meetings at a glance
- **Fast search**: Fuzzy + phonetic search for quick access
- **Local storage**: SQLite with AES-256 encryption (no cloud required)
- **Import**: From phone contacts and LinkedIn (preview mode)
- **Export**: vCard and PDF formats

### Tech Stack
- **Framework**: React Native with TypeScript
- **Navigation**: React Navigation (bottom tabs + stack)
- **Storage**: Expo SQLite with SQLCipher encryption
- **Encryption**: Crypto-ES (AES-256-GCM)
- **Auth**: Expo Local Authentication (Face ID/Touch ID)
- **Search**: Fuse.js (fuzzy + phonetic)
- **UI**: Custom components with dark mode support

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── storage/            # Database layer
├── types/              # TypeScript types
├── utils/              # Utilities (encryption, auth, etc)
├── hooks/              # Custom React hooks
├── constants/          # Colors, spacing, config
└── assets/             # Images, fonts

## Data Model

### PersonCard
Stored with field-level encryption, <30 chars per quick fact.

```typescript
{
  id: string;
  fullName: string;
  preferredName?: string;
  title?: string;
  company?: string;
  photoURI?: string;
  oneLineContext?: string;  // "How I know them"
  quickFacts: [ {label, value (30-char max), icon} ];
  tags: string[];
  lastMet?: Date;
  notes: [{date, shortNote, meetingContext}];
  linkedContacts: {phone, email, linkedinURL};
  privacy: {sharedWith[], consentGiven};
  starred?: boolean;
  createdAt/updatedAt: Date;
}
```

## Security Architecture

### Key Features
- **Client-side only**: No server, no data transmission
- **Biometric lock**: Face ID / Touch ID required
- **Encryption**: AES-256 with per-field encryption
- **Passcode backup**: 4+ digit alphanumeric fallback
- **Key derivation**: PBKDF2 with 100k iterations
- **Local-first**: Optional cloud sync (not required)

### Storage
```
SQLite (encrypted) → Field-level AES-256 → Biometric unlock
```

### Consent Framework
Built-in templates for requesting permission to store data:
- "Hi [Name] - I keep brief memory notes..."
- One-tap send via email/message
- Redact sensitive fields when sharing

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator

### Installation

```bash
cd RememberMe
npm install
```

### Run Development

```bash
# iOS
npm run ios

# Android
npm run android

# Web (limited features)
npm run web
```

### First Launch Setup

1. **Set passcode**: 4+ characters (alphanumeric)
2. **Biometric setup**: Optional Face ID/Touch ID
3. **Grant permissions**: Calendar (read-only), Contacts (optional)
4. **Create first card**: Add a test contact

### Running Tests

```bash
npm test
```

## Key Components

### 1. Quick Prep Card
- Large circular photo
- Preferred name prominently displayed
- 3 memory chips (30 chars each)
- Last meeting context
- Last note preview
- **Target**: <3s scan time

### 2. Fast Add Flow
- Import from contacts/LinkedIn
- Confirm 3 quick facts
- One-line context
- **Target**: 10s to create

### 3. Meeting Notes
- One-tap add after meeting
- Auto-suggest from calendar event
- **Target**: 5s to capture key points

## UX Design Principles

### Micro-Copy Focus
- "Ask about [name]'s startup"
- "Kids: Emma & Noah"
- "Coffee: Oat milk latte"
- "Met at SaaStr 2024"

### Haptic Feedback
- Success: Light tap
- Star: Medium pulse
- Swipe actions: Pattern feedback

### Dark Mode
- OLED-friendly pure black
- Reduced eye strain
- Battery optimization

## Performance Targets

- App launch: <2s
- Prep card display: <3s
- Search results: <1s
- Add new person: <10s
- Meeting note capture: <5s

## Privacy Compliance

### GDPR/PDPA Ready
- Data minimization by design
- Explicit consent workflows
- Right to deletion (one-tap)
- Local audit logs
- Export all data (JSON)
- No third-party tracking

### Encryption at Rest
- All personal data encrypted
- Encryption keys in keychain
- No plaintext storage
- Biometric-protected

## Monetization Hooks

**
**Freemium**
- Free: Local storage, basic features
- Pro: Cloud sync, team sharing, calendar auto-link
- Enterprise: Team directory, SSO, audit logs

## Next Features (Beyond MVP)

### Team Sharing
- Role-based access
- Expiry dates on shared cards
- View tracking
- Consent receipts

### Smart Suggestions
- Auto-extract from email subjects
- Message history analysis (opt-in)
- LinkedIn profile enrichment
- Conference attendee import

### Meeting Intelligence
- Pre-meeting push notifications
- "Ask about X" reminders
- Follow-up task capture
- CRM integration (read-only)

## API Integration Points

### Calendar
```javascript
// Read-only access
GET /calendar/events?start=today&end=today
```

### Contacts (Import)
```javascript
// One-time import with user confirmation
GET /contacts?limit=100
```

### LinkedIn (Preview)
```javascript
// OAuth + read-only profile
GET /profile/basic
```

## Scalability Considerations

- **10 contacts**: <10MB database
- **100 contacts**: <50MB database
- **1000 contacts**: <200MB database
- Search indexed for <100ms response
- Photos: Thumbnail storage (100x100)

## Development Notes

### Security
- Never log PII
- All encryption client-side
- Secure random number generation
- Pin certificate if adding cloud sync

### Performance
- FlatList for long lists
- Memoized components
- Image lazy loading
- Search debouncing (300ms)

### Accessibility
- VoiceOver / TalkBack support
- Dynamic font sizes
- High contrast mode
- Large touch targets (44x44px min)

## License

Private project - all rights reserved.

## Contributing

Internal use only at this time.

## Support

For questions about architecture or implementation decisions, refer to:
- `/src/constants` - Configuration
- `/src/types` - Data models
- `/src/storage` - Database layer
- `/src/utils` - Security utilities

## Analytics & Privacy

RememberMe collects **zero analytics**. All data stays local unless you opt into cloud sync (coming in Pro).

---

**Build with privacy, designed for speed, made for human connections.**
