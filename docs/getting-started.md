# Getting Started

This guide will walk you through setting up `paragone` in your SvelteKit project.

## Prerequisites

- SvelteKit project with Svelte 5
- Node.js 18 or higher
- Basic understanding of SvelteKit's file structure

## Installation

Install the package using your preferred package manager:

```bash
npm install paragone
```

```bash
pnpm add paragone
```

```bash
bun add paragone
```

## Step 1: Configure TypeScript

Add the `language` property to your app locals by updating `src/app.d.ts`:

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

## Step 2: Set Up Language Detection

Create or update `src/hooks.server.ts` to detect the user's language on each request:

```typescript
import type { Handle } from '@sveltejs/kit';
import { getLanguage } from 'paragone';

export const handle: Handle = async ({ event, resolve }) => {
  // Get language from cookie or browser's Accept-Language header
  const language = getLanguage(
    event.cookies,
    event.request.headers.get('accept-language')
  );
  
  // Store in locals for use in load functions
  event.locals.language = language;
  
  return resolve(event);
};
```

## Step 3: Create Translation Files

Create a `locale.json` file in your route directory. For example, `src/routes/+page/locale.json`:

```json
{
  "en": {
    "title": "Welcome to My App",
    "description": "This is a simple i18n example",
    "greeting": "Hello, {{name}}!",
    "nav": {
      "home": "Home",
      "about": "About",
      "contact": "Contact"
    },
    "button": {
      "getStarted": "Get Started",
      "learnMore": "Learn More"
    }
  },
  "de": {
    "title": "Willkommen in meiner App",
    "description": "Dies ist ein einfaches i18n-Beispiel",
    "greeting": "Hallo, {{name}}!",
    "nav": {
      "home": "Startseite",
      "about": "Über uns",
      "contact": "Kontakt"
    },
    "button": {
      "getStarted": "Loslegen",
      "learnMore": "Mehr erfahren"
    }
  }
}
```

## Step 4: Use in Server Load Functions

In your `+page.server.ts` or `+layout.server.ts`:

```typescript
import type { PageServerLoad } from './$types';
import { I18n } from 'paragone';
import * as locale from './locale.json';

export const load: PageServerLoad = async ({ locals }) => {
  const { t } = new I18n(locale, locals.language);
  
  return {
    title: t('title'),
    description: t('description'),
    language: locals.language
  };
};
```

## Step 5: Use in Svelte Components

In your `+page.svelte`:

```svelte
<script lang="ts">
  import { I18n } from 'paragone';
  import * as locale from './locale.json';
  
  let { data } = $props();
  
  // Create reactive i18n instance using $derived
  const { t } = $derived(new I18n(locale, data.language));
</script>

<h1>{t('title')}</h1>
<p>{t('description')}</p>
<p>{t('greeting', { name: 'Anna' })}</p>

<nav>
  <a href="/">{t('nav.home')}</a>
  <a href="/about">{t('nav.about')}</a>
  <a href="/contact">{t('nav.contact')}</a>
</nav>

<button>{t('button.getStarted')}</button>
<button>{t('button.learnMore')}</button>
```

## Step 6: Add Language Switcher

Create a language switcher component:

```svelte
<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { changeLanguage } from 'paragone';
  
  let { currentLanguage = 'en' } = $props();
  
  async function switchLanguage(lang: string) {
    // Call remote function to change language
    await changeLanguage(lang);
    
    // Reload all data with new language
    await invalidateAll();
  }
</script>

<div class="language-switcher">
  <button
    onclick={() => switchLanguage('en')}
    disabled={currentLanguage === 'en'}
  >
    English
  </button>
  <button
    onclick={() => switchLanguage('de')}
    disabled={currentLanguage === 'de'}
  >
    Deutsch
  </button>
</div>

<style>
  .language-switcher {
    display: flex;
    gap: 0.5rem;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

Use it in your layout or page:

```svelte
<script lang="ts">
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
  
  let { data } = $props();
</script>

<LanguageSwitcher currentLanguage={data.language} />
```

## Configuration

You can customize the default behavior by modifying these constants in the source:

### Supported Languages

Edit `SUPPORTED_LANGUAGES` to define which languages your app supports:

```typescript
const SUPPORTED_LANGUAGES = ['en', 'de', 'fr', 'es', 'it'];
```

### Default Language

Set the fallback language:

```typescript
const DEFAULT_LANGUAGE = 'en';
```

### Cookie Settings

Customize cookie behavior:

```typescript
const COOKIE_NAME = 'language';

// In setLanguage function:
cookies.set(COOKIE_NAME, language, {
  path: '/',
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: 'lax',
  httpOnly: false,
  secure: true // Enable in production
});
```

## Next Steps

- **[API Reference](./api-reference.md)** - Learn about all available methods
- **[Advanced Usage](./advanced-usage.md)** - Explore advanced patterns
- **[Examples](../examples)** - See complete working examples

## Troubleshooting

### Language not switching

Make sure you're calling `invalidateAll()` after `changeLanguage()`:

```typescript
await changeLanguage('de');
await invalidateAll(); // Don't forget this!
```

### Translations not showing

1. Check that your `locale.json` structure is correct
2. Verify that you're passing `locals.language` from server to client
3. Make sure you're using `$derived` for reactivity in components

### Cookie not persisting

Check your cookie settings in the browser DevTools. Make sure:
- Path is set to `'/'`
- SameSite is `'lax'` or `'none'` (with secure)
- Domain is correct

## Common Patterns

### Global + Route Translations

Merge global translations with page-specific ones:

```typescript
import * as globalLocale from '$lib/i18n/locale.json';
import * as pageLocale from './locale.json';

const combined = {
  en: { ...globalLocale.en, ...pageLocale.en },
  de: { ...globalLocale.de, ...pageLocale.de }
};

const { t } = new I18n(combined, locals.language);
```

### Use in Form Actions

```typescript
import type { Actions } from './$types';
import { I18n } from 'paragone';
import * as locale from './locale.json';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { t } = new I18n(locale, locals.language);
    
    // ... handle form
    
    return {
      success: true,
      message: t('form.success')
    };
  }
};
```

### Use in API Routes

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { I18n } from 'paragone';
import * as locale from './locale.json';

export const GET: RequestHandler = async ({ locals }) => {
  const { t } = new I18n(locale, locals.language);
  
  return json({
    message: t('api.welcome')
  });
};
```

## Best Practices

1. **Structure your keys hierarchically**: Use dot notation for better organization (`nav.home`, `button.save`)

2. **Use variables for dynamic content**: Instead of concatenating strings, use `{{variable}}` syntax

3. **Keep translations co-located**: Store route-specific translations in the route folder

4. **Use $derived for reactivity**: Always use `$derived` when creating i18n instances in components

5. **Test with multiple languages**: Regularly switch between languages during development

6. **Avoid creating i18n instances in loops**: Create once and reuse

7. **Type your translation keys**: Consider creating types for your translation keys for better autocomplete

You're all set! 🎉