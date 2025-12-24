# Basic i18n Example

This example demonstrates the basic usage of `paragone` in a simple SvelteKit application.

## What This Example Shows

- Setting up language detection in `hooks.server.ts`
- Creating translation files (`locale.json`)
- Using translations in server load functions
- Using translations in Svelte components with `$derived`
- Switching languages with a language picker
- Browser language detection

## File Structure

```
basic/
├── src/
│   ├── hooks.server.ts          # Language detection
│   ├── app.d.ts                 # Type definitions
│   └── routes/
│       ├── +layout.server.ts    # Layout with global translations
│       ├── +layout.svelte       # Layout with language switcher
│       └── +page/
│           ├── locale.json      # Page-specific translations
│           ├── +page.server.ts  # Server load function
│           └── +page.svelte     # Component with translations
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
npm install paragone
```

### 2. Configure SvelteKit

**Important:** Add experimental features to `svelte.config.js`:

```javascript
export default {
  kit: {
    experimental: {
      remoteFunctions: true
    }
  },
  compilerOptions: {
    experimental: {
      async: true
    }
  }
};
```

### 3. Configure Types

**src/app.d.ts**
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

### 4. Set Up Language Detection

**src/hooks.server.ts**
```typescript
import type { Handle } from '@sveltejs/kit';
import { configure, getLanguage } from 'paragone';

// Optional: Configure paragone
configure({
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'de']
});

export const handle: Handle = async ({ event, resolve }) => {
  const language = getLanguage(
    event.cookies,
    event.request.headers.get('accept-language')
  );
  
  event.locals.language = language;
  
  return resolve(event);
};
```

### 5. Create Translation File

**src/routes/+page/locale.json**
```json
{
  "en": {
    "title": "Welcome",
    "subtitle": "A Simple i18n Example",
    "greeting": "Hello, {{name}}!",
    "description": "This is a basic example showing how to use translations in SvelteKit.",
    "features": {
      "title": "Features",
      "item1": "Automatic browser language detection",
      "item2": "Cookie-based language persistence",
      "item3": "Simple API with nested keys",
      "item4": "Variable interpolation support"
    }
  },
  "de": {
    "title": "Willkommen",
    "subtitle": "Ein einfaches i18n-Beispiel",
    "greeting": "Hallo, {{name}}!",
    "description": "Dies ist ein einfaches Beispiel, das zeigt, wie man Übersetzungen in SvelteKit verwendet.",
    "features": {
      "title": "Funktionen",
      "item1": "Automatische Browser-Spracherkennung",
      "item2": "Cookie-basierte Sprachspeicherung",
      "item3": "Einfache API mit verschachtelten Schlüsseln",
      "item4": "Unterstützung für Variablen-Interpolation"
    }
  }
}
```

### 6. Use in Server Load Function

**src/routes/+page.server.ts**
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

### 7. Use in Svelte Component

**src/routes/+page.svelte**
```svelte
<script lang="ts">
  import { I18n } from 'paragone';
  import * as locale from './locale.json';
  
  let { data } = $props();
  
  // Create reactive i18n instance
  const { t } = $derived(new I18n(locale, data.language));
  
  const userName = 'Anna';
</script>

<main>
  <h1>{t('title')}</h1>
  <p class="subtitle">{t('subtitle')}</p>
  
  <p class="greeting">{t('greeting', { name: userName })}</p>
  
  <p>{t('description')}</p>
  
  <section>
    <h2>{t('features.title')}</h2>
    <ul>
      <li>{t('features.item1')}</li>
      <li>{t('features.item2')}</li>
      <li>{t('features.item3')}</li>
      <li>{t('features.item4')}</li>
    </ul>
  </section>
</main>

<style>
  main {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
  }
  
  .subtitle {
    color: #666;
    font-size: 1.2rem;
  }
  
  .greeting {
    font-size: 1.5rem;
    font-weight: bold;
    color: #0066cc;
    margin: 2rem 0;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
  }
  
  li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #00aa00;
    font-weight: bold;
  }
</style>
```

### 8. Add Language Switcher

**src/routes/+layout.svelte**
```svelte
<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { changeLanguage } from 'paragone';
  
  let { data, children } = $props();
  
  async function switchLanguage(lang: string) {
    await changeLanguage(lang);
    await invalidateAll();
  }
</script>

<header>
  <nav>
    <div class="language-switcher">
      <button
        onclick={() => switchLanguage('en')}
        class:active={data.language === 'en'}
      >
        English
      </button>
      <button
        onclick={() => switchLanguage('de')}
        class:active={data.language === 'de'}
      >
        Deutsch
      </button>
    </div>
  </nav>
</header>

{@render children()}

<style>
  header {
    background: #f5f5f5;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
  }
  
  nav {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
  }
  
  .language-switcher {
    display: flex;
    gap: 0.5rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  button:hover {
    background: #e9e9e9;
  }
  
  button.active {
    background: #0066cc;
    color: white;
    border-color: #0066cc;
  }
</style>
```

**src/routes/+layout.server.ts**
```typescript
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    language: locals.language
  };
};
```

## Running the Example

1. Start the development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:5173`

3. Try switching between English and Deutsch using the buttons in the header

4. Refresh the page - your language choice should persist (stored in cookie)

5. Open the page in a private/incognito window with different browser language settings to see automatic detection

## What Happens

1. **First Visit**: 
   - `hooks.server.ts` checks for language cookie
   - If not found, reads browser's `Accept-Language` header
   - Sets language in `locals.language`

2. **Page Load**:
   - `+page.server.ts` creates I18n instance with detected language
   - Returns translated content to the client

3. **Client Rendering**:
   - Component uses `$derived` to create reactive I18n instance
   - All translations update automatically when language changes

4. **Language Switch**:
   - User clicks language button
   - `changeLanguage()` sets cookie
   - `invalidateAll()` reloads all data
   - Page re-renders with new language

## Key Concepts

### 1. Server-Side Translation
```typescript
// In +page.server.ts
const { t } = new I18n(locale, locals.language);
return { title: t('title') };
```

### 2. Client-Side Translation with Reactivity
```typescript
// In +page.svelte
const { t } = $derived(new I18n(locale, data.language));
```
The `$derived` ensures the i18n instance updates when `data.language` changes.

### 3. Variable Interpolation
```typescript
t('greeting', { name: 'Anna' })
// "Hello, Anna!" or "Hallo, Anna!"
```

### 4. Nested Keys
```typescript
t('features.title')
t('features.item1')
```

## Next Steps

- Check out the [Multi-Language Example](../multi-language) for more advanced usage
- See the [Remote Functions Example](../remote-functions) for using translations in commands
- Read the [API Reference](../../docs/api-reference.md) for complete documentation

## Troubleshooting

**Translations not updating when switching language:**
- Make sure you're using `$derived` in your component
- Verify that `invalidateAll()` is called after `changeLanguage()`

**Cookie not persisting:**
- Check browser DevTools → Application → Cookies
- Verify `httpOnly` is set to `false` (it is by default)

**Wrong language detected:**
- Check your browser's language settings
- Look at the `Accept-Language` header in Network tab
- Verify `SUPPORTED_LANGUAGES` includes your language