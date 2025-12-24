# i18n System

A simple, modern internationalization solution for SvelteKit with Svelte 5 Runes.

## 📁 Structure

```
src/lib/i18n/
├── i18n.ts           # Main class + helpers (getLanguage, setLanguage)
├── i18n.remote.ts    # Remote function for language switching
├── locale.json       # Global translations (optional)
└── README.md         # This file
```

## Features

- 🍪 Cookie-based with browser language detection
- 🎯 Route-specific translation files
- 🔄 Reactive with Svelte 5 Runes (`$derived`)
- 💪 Type-safe TypeScript
- 🚀 Simple - just one class
- 📦 Remote functions for language switching

## Quick Start

### 1. Create `locale.json` in your route

```json
{
  "en": {
    "title": "My Page",
    "welcome": "Hello, {{name}}!",
    "button": {
      "save": "Save",
      "cancel": "Cancel"
    }
  },
  "de": {
    "title": "Meine Seite",
    "welcome": "Hallo, {{name}}!",
    "button": {
      "save": "Speichern",
      "cancel": "Abbrechen"
    }
  }
}
```

### 2. Use in `+page.server.ts`

```typescript
import type { PageServerLoad } from './$types';
import { I18n } from '$lib/i18n/i18n';
import * as locale from './locale.json';

export const load: PageServerLoad = async ({ locals }) => {
  const { t } = new I18n(locale, locals.language);
  
  return {
    title: t('title'),
    language: locals.language
  };
};
```

### 3. Use in `+page.svelte`

```svelte
<script lang="ts">
  import { I18n } from '$lib/i18n/i18n';
  import * as locale from './locale.json';
  
  let { data } = $props();
  const { t } = $derived(new I18n(locale, data.language));
</script>

<h1>{t('title')}</h1>
<p>{t('welcome', { name: 'Max' })}</p>
<button>{t('button.save')}</button>
```

### 4. Switch language (Remote Function)

```svelte
<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { changeLanguage } from '$lib/i18n/i18n.remote';
  
  async function switchLanguage(lang: string) {
    await changeLanguage(lang);  // Super simple - no context needed!
    await invalidateAll();
  }
</script>

<button onclick={() => switchLanguage('en')}>English</button>
<button onclick={() => switchLanguage('de')}>Deutsch</button>
```

## API Reference

### `I18n` Class

```typescript
const i18n = new I18n(translations, locale);
```

#### `t(key, vars?)`
Get translation with optional variables.

```typescript
t('title')                           // "My Page"
t('welcome', { name: 'Anna' })       // "Hello, Anna!"
t('button.save')                     // "Save" (nested keys)
```

#### `has(key)`
Check if translation key exists.

```typescript
if (i18n.has('optional.key')) {
  console.log(t('optional.key'));
}
```

#### `getLocale()`
Get current locale.

```typescript
const locale = i18n.getLocale(); // "en" or "de"
```

### Helper Functions

#### `getLanguage(cookies, acceptLanguage)`
Get language from cookie or detect from browser.

```typescript
import { getLanguage } from '$lib/i18n/i18n';

const language = getLanguage(event.cookies, event.request.headers.get('accept-language'));
```

#### `setLanguage(cookies, language)`
Set language to cookie.

```typescript
import { setLanguage } from '$lib/i18n/i18n';

setLanguage(cookies, 'de');
```

### Remote Function

#### `changeLanguage(language)`
Change user's language preference (remote function).  
Uses `getRequestEvent()` internally to access cookies - no context parameter needed!

```typescript
import { changeLanguage } from '$lib/i18n/i18n.remote';

await changeLanguage('de');  // That's it!
await invalidateAll(); // Reload page data
```

## Browser Language Detection

The system automatically detects the user's browser language on first visit:

1. Checks if `language` cookie exists
2. If not, reads `Accept-Language` header
3. Matches against supported languages
4. Falls back to default (`en`)

**Configure supported languages** in `i18n.ts`:

```typescript
const SUPPORTED_LANGUAGES = ['en', 'de', 'fr', 'es'];
```

## Global Translations

For app-wide translations (nav, common buttons, etc.), use `src/lib/i18n/locale.json`:

```typescript
import * as globalLocale from '$lib/i18n/locale.json';

const { t } = new I18n(globalLocale, locals.language);
```

## Examples

### In `data.remote.ts`

```typescript
import { command } from '$app/server';
import { I18n } from '$lib/i18n/i18n';
import * as locale from './locale.json';

export const myCommand = command(z.string(), async (id, { locals }) => {
  const { t } = new I18n(locale, locals.language);
  
  return {
    success: true,
    message: t('messages.success')
  };
});
```

### In Layout Files

```typescript
// +layout.server.ts
import { I18n } from '$lib/i18n/i18n';
import * as locale from '$lib/i18n/locale.json';

export const load = async ({ locals }) => {
  const { t } = new I18n(locale, locals.language);
  
  return {
    nav: {
      home: t('nav.home'),
      about: t('nav.about')
    },
    language: locals.language
  };
};
```

### Merge Global + Route Translations

```typescript
import * as globalLocale from '$lib/i18n/locale.json';
import * as pageLocale from './locale.json';

const combined = {
  en: { ...globalLocale.en, ...pageLocale.en },
  de: { ...globalLocale.de, ...pageLocale.de }
};

const { t } = new I18n(combined, locals.language);
```

## Best Practices

### ✅ DO

- Use `$derived` in components for reactivity
- Structure keys hierarchically (`page.section.title`)
- Use variables for dynamic content (`{{name}}`)
- Call `invalidateAll()` after language change
- Import locale directly: `import * as locale from './locale.json'`

### ❌ DON'T

- Don't create new i18n instances in loops
- Don't hardcode translatable strings
- Don't forget to pass `language` from server to client

## How It Works

```
1. Request comes in
   ↓
2. hooks.server.ts calls getLanguage()
   ↓
3. Checks: Cookie → Browser → Default ('en')
   ↓
4. Stores in locals.language
   ↓
5. Page loads with language
   ↓
6. User clicks language button
   ↓
7. changeLanguage() uses getRequestEvent() to access cookies
   ↓
8. Sets cookie via setLanguage()
   ↓
9. invalidateAll() reloads with new language
```

## Configuration

Edit `src/lib/i18n/i18n.ts`:

```typescript
const COOKIE_NAME = 'language';
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'de']; // Your languages
```

Cookie settings:

```typescript
{
  path: '/',
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: 'lax',
  httpOnly: false
}
```

---

**Simple. Smart. Done.** 🎉