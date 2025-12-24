# i18n File Structure

Clean and simple - everything in one place.

## 📂 Directory Structure

```
src/
├── lib/
│   └── i18n/                           # All i18n files in one folder
│       ├── i18n.ts                     # Main class + helpers (123 lines)
│       ├── i18n.remote.ts              # Remote function (11 lines)
│       ├── locale.json                 # Global translations (optional)
│       └── README.md                   # Documentation
│
├── hooks.server.ts                     # Language detection (9 lines)
│
└── routes/
    └── (app)/
        └── your-route/
            ├── locale.json             # Route-specific translations
            ├── +page.server.ts         # Server-side usage
            ├── +page.svelte            # Client-side usage
            └── data.remote.ts          # Remote functions usage
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. REQUEST                                                  │
│  ↓ User visits page                                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  2. hooks.server.ts                                         │
│  ↓ getLanguage(cookies, acceptLanguage)                     │
│  ↓ Checks: Cookie → Browser → Default ('en')               │
│  ↓ Sets: locals.language                                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  3. +page.server.ts                                         │
│  ↓ import * as locale from './locale.json'                  │
│  ↓ const { t } = new I18n(locale, locals.language)         │
│  ↓ return { language: locals.language }                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  4. +page.svelte                                            │
│  ↓ const { t } = $derived(new I18n(locale, data.language)) │
│  ↓ <h1>{t('title')}</h1>                                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  5. USER SWITCHES LANGUAGE                                  │
│  ↓ await changeLanguage('de')                               │
│  ↓ getRequestEvent() gets current request context           │
│  ↓ setLanguage(event.cookies, 'de')                         │
│  ↓ await invalidateAll()                                    │
│  ↓ → Back to step 1 with new language                       │
└─────────────────────────────────────────────────────────────┘
```

## 📦 What Each File Does

### `i18n.ts` (Core)
- **I18n class** - Main translation class
- **getLanguage()** - Get language from cookie or browser
- **setLanguage()** - Save language to cookie
- **Browser detection** - Parse Accept-Language header

### `i18n.remote.ts` (Action)
- **changeLanguage()** - Remote function to switch language
- Uses `getRequestEvent()` to access cookies directly
- No context parameter needed - super clean!
- Uses `setLanguage()` from `i18n.ts`

### `hooks.server.ts` (Entry Point)
- Calls `getLanguage()` on every request
- Stores result in `locals.language`
- That's it! (9 lines)

### `locale.json` (Data)
- Translation files per route or global
- Simple JSON: `{ "en": {...}, "de": {...} }`

## 📝 Import Paths

```typescript
// Main class
import { I18n } from '$lib/i18n/i18n';

// Remote function
import { changeLanguage } from '$lib/i18n/i18n.remote';

// Helpers (usually not needed directly)
import { getLanguage, setLanguage } from '$lib/i18n/i18n';

// Global translations
import * as locale from '$lib/i18n/locale.json';

// Route translations
import * as locale from './locale.json';
```

## ✨ Benefits of This Structure

✅ **All i18n code in one folder** - Easy to find
✅ **Minimal footprint** - Only 136 lines of code total
✅ **No scattered files** - Everything related is together
✅ **Clear separation** - Core, Remote, Data
✅ **hooks.server.ts stays clean** - Just 9 lines
✅ **Easy to maintain** - One place to change configuration

## 🎯 Line Count

```
i18n.ts          123 lines (class + helpers)
i18n.remote.ts    11 lines (remote function with getRequestEvent)
hooks.server.ts    9 lines (just calls getLanguage)
───────────────────────────────────────────
Total:           143 lines for complete i18n system
```

**Simple. Smart. Done.** 🚀