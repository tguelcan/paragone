![PARAGONE](./static/logo.svg)

# paragone
> *From Greek "παράγλωσσος" (paraglossus) - multilingual, speaking many languages*

Modern internationalization (i18n) library for SvelteKit with Svelte 5 Runes and remotes support.

[![npm version](https://img.shields.io/npm/v/paragone.svg)](https://www.npmjs.com/package/paragone)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Cookie-based with automatic browser language detection
- Route-specific translation files
- Reactive with Svelte 5 Runes (`$derived`)
- Type-safe TypeScript support
- Minimal setup required
- Remote functions for language switching with `command()`
- Nested keys support (`nav.home`, `button.save`)
- Variable interpolation (`{{name}}`, `{{count}}`)
- Global + Route translations

## Installation

```bash
npm install paragone
```

```bash
pnpm add paragone
```

```bash
bun add paragone
```

## Quick Start

### 1. Setup hooks (detect language)

Create or update `src/hooks.server.ts`:

```typescript
import type { Handle } from '@sveltejs/kit';
import { getLanguage } from 'paragone';

export const handle: Handle = async ({ event, resolve }) => {
  const language = getLanguage(
    event.cookies,
    event.request.headers.get('accept-language')
  );
  
  event.locals.language = language;
  
  return resolve(event);
};
```

### 2. Define your types

Update `src/app.d.ts`:

```typescript
declare global {
  namespace App {
    interface Locals {
      language: string;
    }
  }
}

export {};
```

### 3. Create translation file

Create `src/routes/+page/locale.json`:

```json
{
  "en": {
    "title": "Welcome",
    "greeting": "Hello, {{name}}!",
    "button": {
      "login": "Login",
      "signup": "Sign up"
    }
  },
  "de": {
    "title": "Willkommen",
    "greeting": "Hallo, {{name}}!",
    "button": {
      "login": "Anmelden",
      "signup": "Registrieren"
    }
  }
}
```

### 4. Use in server load function (yes, you can use your locals also server-side)

`src/routes/+page.server.ts`:

```typescript
import type { PageServerLoad } from './$types';
import { I18n } from 'paragone';
import * as locale from './locale.json';

export const load: PageServerLoad = async ({ locals }) => {
  const { t } = new I18n(locale, locals.language);
  
  return {
    title: t('title'),
    language: locals.language
  };
};
```

### 5. Use in Svelte component

`src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import { I18n } from 'paragone';
  import * as locale from './locale.json';
  
  let { data } = $props();
  const { t } = $derived(new I18n(locale, data.language));
</script>

<h1>{t('title')}</h1>
<p>{t('greeting', { name: 'Sarah' })}</p>
<button>{t('button.login')}</button>
<button>{t('button.signup')}</button>
```

### 6. Switch language (command())
but you can also use it in a form remote function or action...:

First, create `src/lib/remotes/common.remote.ts`:

```typescript
import { command, getRequestEvent } from "$app/server";
import { setLanguage } from "paragone";
import z from "zod";

/**
 * Remote function to change the user's language preference
 * @example await changeLanguage('de')
 */
export const changeLanguage = command(
  z.string().min(2).max(10),
  async (language) => {
    const event = getRequestEvent();
    setLanguage(event.cookies, language);
    return { success: true, language };
  }
);
```

Then use it in `src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { changeLanguage } from '$lib/remotes/common.remote';

  async function switchLanguage(lang: string) {
    await changeLanguage(lang);
    await invalidateAll();
  }
</script>

<button onclick={() => switchLanguage('en')}>English</button>
<button onclick={() => switchLanguage('de')}>Deutsch</button>
```

> **Note:** `changeLanguage` is not exported from `paragone` because it uses `$app/server` which only works in the context of your SvelteKit project. See [docs/REMOTE_FUNCTIONS.md](./docs/REMOTE_FUNCTIONS.md) for alternative implementations (Form Actions, API Routes, etc.).

## API Reference

### `I18n` Class

```typescript
const i18n = new I18n(translations, locale);
```

#### Parameters

- `translations`: Object with language keys containing translation objects
- `locale`: Current language code (e.g., `'en'`, `'de'`)

#### Methods

##### `t(key: string, vars?: Record<string, string | number>): string`

Get translation by key with optional variable replacement.

```typescript
t('title')                           // "Welcome"
t('greeting', { name: 'Mike' })      // "Hello, Mike!"
t('button.login')                    // "Login" (nested keys)
```

##### `has(key: string): boolean`

Check if translation key exists.

```typescript
if (i18n.has('optional.key')) {
  console.log(t('optional.key'));
}
```

##### `getLocale(): string`

Get current locale.

```typescript
const locale = i18n.getLocale(); // "en" or "de"
```

### Helper Functions

#### `getLanguage(cookies: Cookies, acceptLanguage: string | null): string`

Get language from cookie or detect from browser's Accept-Language header.

```typescript
import { getLanguage } from 'paragone';

const language = getLanguage(
  event.cookies,
  event.request.headers.get('accept-language')
);
```

#### `setLanguage(cookies: Cookies, language: string): void`

Set language to cookie.

```typescript
import { setLanguage } from 'paragone';

setLanguage(cookies, 'de');
```

### Remote Function

#### `changeLanguage(language: string)`

Change user's language preference. You need to implement this in your own project because it uses SvelteKit's `command()` which cannot be exported from a library.

**Create `src/lib/changeLanguage.ts`:**

```typescript
import { command, getRequestEvent } from "$app/server";
import { setLanguage } from "paragone";
import z from "zod";

export const changeLanguage = command(
  z.string().min(2).max(10),
  async (language) => {
    const event = getRequestEvent();
    setLanguage(event.cookies, language);
    return { success: true, language };
  }
);
```

**Usage:**

```typescript
import { changeLanguage } from '$lib/changeLanguage';

await changeLanguage('de');
await invalidateAll(); // Reload page data
```

See [docs/REMOTE_FUNCTIONS.md](./docs/REMOTE_FUNCTIONS.md) for alternative implementations (Form Actions, API Routes).

## Usage Patterns

### Global Translations

For app-wide translations (navigation, common buttons, etc.):

`src/lib/i18n/locale.json`:

```json
{
  "en": {
    "nav": {
      "home": "Home",
      "about": "About",
      "contact": "Contact"
    }
  },
  "de": {
    "nav": {
      "home": "Startseite",
      "about": "Über uns",
      "contact": "Kontakt"
    }
  }
}
```

Use in layout:

```typescript
import * as globalLocale from '$lib/i18n/locale.json';

const { t } = new I18n(globalLocale, locals.language);
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

### Use in Your Own Remote Functions (Commands)

```typescript
import { command } from '$app/server';
import { I18n } from 'paragone';
import * as locale from './locale.json';
import z from 'zod';

export const saveData = command(z.object({ name: z.string() }), async (data, { locals }) => {
  const { t } = new I18n(locale, locals.language);
  
  // ... your logic
  
  return {
    success: true,
    message: t('messages.saved')
  };
});
```

**Note:** Remote functions must be defined in your project, not imported from `paragone`.

## Configuration

Edit the constants in your local copy if needed:

```typescript
const COOKIE_NAME = 'language';
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'de', 'fr', 'es'];
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

## Browser Language Detection

The system automatically detects the user's browser language on first visit:

1. Checks if `language` cookie exists
2. If not, reads `Accept-Language` header
3. Matches against supported languages
4. Falls back to default (`en`)

Example header: `Accept-Language: de-DE,de;q=0.9,en;q=0.8`
→ Returns `de` (if supported)

## Examples

Check out the [examples](./examples) folder for complete working examples:

- **Basic Usage** - Simple translation setup
- **Multi-Language** - Multiple languages with switcher
- **Nested Keys** - Complex translation structures
- **Remote Functions** - Using translations in commands

## Testing

```bash
npm test
```

## Best Practices

### ✅ DO

- Use `$derived` in components for reactivity
- Structure keys hierarchically
- Use variables for dynamic content
- Call `invalidateAll()` after language change

### ❌ DON'T

- Avoid creating new i18n instances in loops
- Don't hardcode translatable strings
- Pass `language` from server to client

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
7. changeLanguage() sets cookie
   ↓
8. invalidateAll() reloads with new language
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © Tayfun Guelcan

## Links

- [Documentation](./docs)
- [Examples](./examples)
- [Issues](https://github.com/tguelcan/paragone/issues)
- [NPM Package](https://www.npmjs.com/package/paragone)

---

Made for the Svelte community

And by the way
For those who think, “Oh no, not another language library!”, the answer is: Shut up and use it!
