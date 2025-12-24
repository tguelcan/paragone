# Complete i18n Example

A comprehensive example showcasing all features of `paragone`.

## Prerequisites

Before starting, make sure you have:
- SvelteKit project with Svelte 5
- Node.js 18 or higher

## Important: SvelteKit Configuration

Add experimental features to `svelte.config.js`:

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

Without these settings, remote functions will not work.

## Features Demonstrated

✅ Global translations (navigation, common UI)  
✅ Route-specific translations  
✅ Language switcher component  
✅ Browser language detection  
✅ Cookie persistence  
✅ Server-side translations (`+page.server.ts`)  
✅ Client-side translations (`+page.svelte`)  
✅ Form actions with translations  
✅ API routes with translations  
✅ Remote functions (commands) with translations  
✅ Variable interpolation  
✅ Nested translation keys  
✅ Conditional translations with `has()`  
✅ Layout translations  
✅ Error pages with translations  

## Complete File Structure

```
complete-example/
├── src/
│   ├── lib/
│   │   ├── i18n/
│   │   │   └── locale.json              # Global translations
│   │   ├── changeLanguage.ts            # Local remote function
│   │   └── components/
│   │       ├── LanguageSwitcher.svelte  # Language picker
│   │       └── Nav.svelte               # Navigation
│   ├── routes/
│   │   ├── +layout.server.ts            # Global layout data
│   │   ├── +layout.svelte               # App layout
│   │   ├── +page/
│   │   │   ├── locale.json              # Home page translations
│   │   │   ├── +page.server.ts          # Home server load
│   │   │   └── +page.svelte             # Home component
│   │   ├── about/
│   │   │   ├── locale.json              # About page translations
│   │   │   ├── +page.server.ts
│   │   │   └── +page.svelte
│   │   ├── contact/
│   │   │   ├── locale.json              # Contact page translations
│   │   │   ├── +page.server.ts          # With form action
│   │   │   ├── +page.svelte
│   │   │   └── data.remote.ts           # Remote function
│   │   └── api/
│   │       └── message/
│   │           └── +server.ts           # API route with i18n
│   ├── app.d.ts                         # Type definitions
│   ├── app.html                         # HTML template
│   └── hooks.server.ts                  # Language detection
└── README.md
```

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install paragone zod
```

### 2. Configure Types

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

### 3. Global Translations

**src/lib/i18n/locale.json**

```json
{
  "en": {
    "app": {
      "name": "My App",
      "tagline": "A complete i18n example"
    },
    "nav": {
      "home": "Home",
      "about": "About",
      "contact": "Contact",
      "blog": "Blog"
    },
    "common": {
      "loading": "Loading...",
      "error": "An error occurred",
      "success": "Success!",
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "close": "Close",
      "submit": "Submit",
      "language": "Language",
      "currentLanguage": "Current language: {{lang}}"
    },
    "footer": {
      "copyright": "© 2024 My App. All rights reserved.",
      "madeWith": "Made with ❤️ using SvelteKit"
    }
  },
  "de": {
    "app": {
      "name": "Meine App",
      "tagline": "Ein vollständiges i18n-Beispiel"
    },
    "nav": {
      "home": "Startseite",
      "about": "Über uns",
      "contact": "Kontakt",
      "blog": "Blog"
    },
    "common": {
      "loading": "Lädt...",
      "error": "Ein Fehler ist aufgetreten",
      "success": "Erfolgreich!",
      "save": "Speichern",
      "cancel": "Abbrechen",
      "delete": "Löschen",
      "edit": "Bearbeiten",
      "close": "Schließen",
      "submit": "Absenden",
      "language": "Sprache",
      "currentLanguage": "Aktuelle Sprache: {{lang}}"
    },
    "footer": {
      "copyright": "© 2024 Meine App. Alle Rechte vorbehalten.",
      "madeWith": "Gemacht mit ❤️ mit SvelteKit"
    }
  }
}
```

### 4. Create Local Language Switcher Function

**src/lib/changeLanguage.ts**

```typescript
import { command, getRequestEvent } from "$app/server";
import { setLanguage } from "paragone";
import z from "zod";

/**
 * Remote function to change the user's language preference
 * This must be defined in your project, not imported from paragone
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

> **Important:** The `changeLanguage` function cannot be exported from `paragone` because it uses `$app/server` which only works in your SvelteKit project context. You must create it locally as shown above.

### 5. Language Switcher Component

**src/lib/components/LanguageSwitcher.svelte**

```svelte
<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { changeLanguage } from '$lib/changeLanguage';
  import { I18n } from 'paragone';
  import * as globalLocale from '$lib/i18n/locale.json';
  
  let { currentLanguage = 'en' } = $props();
  
  const { t } = $derived(new I18n(globalLocale, currentLanguage));
  
  let isChanging = $state(false);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];
  
  async function switchLanguage(lang: string) {
    if (lang === currentLanguage || isChanging) return;
    
    isChanging = true;
    try {
      await changeLanguage(lang);
      await invalidateAll();
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      isChanging = false;
    }
  }
</script>

<div class="language-switcher">
  <label for="language-select">{t('common.language')}</label>
  <select
    id="language-select"
    value={currentLanguage}
    onchange={(e) => switchLanguage(e.currentTarget.value)}
    disabled={isChanging}
  >
    {#each languages as lang}
      <option value={lang.code}>
        {lang.flag} {lang.name}
      </option>
    {/each}
  </select>
  
  {#if isChanging}
    <span class="loader">{t('common.loading')}</span>
  {/if}
</div>

<style>
  .language-switcher {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  label {
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .loader {
    font-size: 0.8rem;
    color: #666;
  }
</style>
```

### 6. Navigation Component

**src/lib/components/Nav.svelte**

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { I18n } from 'paragone';
  import * as globalLocale from '$lib/i18n/locale.json';
  
  let { currentLanguage = 'en' } = $props();
  
  const { t } = $derived(new I18n(globalLocale, currentLanguage));
  
  const navItems = [
    { path: '/', key: 'nav.home' },
    { path: '/about', key: 'nav.about' },
    { path: '/contact', key: 'nav.contact' }
  ];
</script>

<nav>
  <ul>
    {#each navItems as item}
      <li>
        <a 
          href={item.path}
          class:active={$page.url.pathname === item.path}
        >
          {t(item.key)}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  nav {
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }
  
  ul {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 1rem 0;
  }
  
  a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s;
  }
  
  a:hover {
    background: #e0e0e0;
  }
  
  a.active {
    background: #0066cc;
    color: white;
  }
</style>
```

### 7. Layout Files

**src/hooks.server.ts**

First, configure paragone in your hooks:

```typescript
import type { Handle } from '@sveltejs/kit';
import { configure, getLanguage } from 'paragone';

configure({
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'de']
});

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.language = getLanguage(
    event.cookies,
    event.request.headers.get('accept-language')
  );
  return resolve(event);
};
```

**src/routes/+layout.server.ts**

```typescript
import type { LayoutServerLoad } from './$types';
import { I18n } from 'paragone';
import * as globalLocale from '$lib/i18n/locale.json';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { t } = new I18n(globalLocale, locals.language);
  
  return {
    language: locals.language,
    // Pass global translations to all pages
    global: {
      appName: t('app.name'),
      appTagline: t('app.tagline')
    }
  };
};
```

**src/routes/+layout.svelte**

```svelte
<script lang="ts">
  import { I18n } from 'paragone';
  import * as globalLocale from '$lib/i18n/locale.json';
  import Nav from '$lib/components/Nav.svelte';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
  
  let { data, children } = $props();
  
  const { t } = $derived(new I18n(globalLocale, data.language));
</script>

<div class="app">
  <header>
    <div class="header-content">
      <div class="branding">
        <h1>{data.global.appName}</h1>
        <p class="tagline">{data.global.appTagline}</p>
      </div>
      
      <LanguageSwitcher currentLanguage={data.language} />
    </div>
    
    <Nav currentLanguage={data.language} />
  </header>
  
  <main>
    {@render children()}
  </main>
  
  <footer>
    <p>{t('footer.copyright')}</p>
    <p>{t('footer.madeWith')}</p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .branding h1 {
    margin: 0;
    font-size: 2rem;
  }
  
  .tagline {
    margin: 0.5rem 0 0 0;
    opacity: 0.9;
  }
  
  main {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem;
    margin-top: 4rem;
  }
  
  footer p {
    margin: 0.5rem 0;
  }
</style>
```

### 8. Home Page

**src/routes/+page/locale.json**

```json
{
  "en": {
    "hero": {
      "title": "Welcome to {{appName}}",
      "subtitle": "Experience internationalization done right",
      "cta": "Get Started"
    },
    "features": {
      "title": "Features",
      "feature1": {
        "title": "🍪 Cookie-Based",
        "description": "Language preference stored in cookies with automatic browser detection"
      },
      "feature2": {
        "title": "🔄 Reactive",
        "description": "Built with Svelte 5 Runes for seamless reactivity"
      },
      "feature3": {
        "title": "💪 Type-Safe",
        "description": "Full TypeScript support for better developer experience"
      },
      "feature4": {
        "title": "🚀 Simple API",
        "description": "Easy to use with minimal setup required"
      }
    },
    "stats": {
      "users": "{{count}} happy users",
      "languages": "{{count}} languages supported",
      "downloads": "{{count}} downloads"
    }
  },
  "de": {
    "hero": {
      "title": "Willkommen bei {{appName}}",
      "subtitle": "Erleben Sie richtig gemachte Internationalisierung",
      "cta": "Loslegen"
    },
    "features": {
      "title": "Funktionen",
      "feature1": {
        "title": "🍪 Cookie-Basiert",
        "description": "Sprachpräferenz in Cookies mit automatischer Browser-Erkennung"
      },
      "feature2": {
        "title": "🔄 Reaktiv",
        "description": "Mit Svelte 5 Runes für nahtlose Reaktivität gebaut"
      },
      "feature3": {
        "title": "💪 Typsicher",
        "description": "Volle TypeScript-Unterstützung für bessere Entwicklererfahrung"
      },
      "feature4": {
        "title": "🚀 Einfache API",
        "description": "Einfach zu verwenden mit minimalem Setup"
      }
    },
    "stats": {
      "users": "{{count}} zufriedene Nutzer",
      "languages": "{{count}} unterstützte Sprachen",
      "downloads": "{{count}} Downloads"
    }
  }
}
```

**src/routes/+page.server.ts**

```typescript
import type { PageServerLoad } from './$types';
import { I18n } from 'paragone';
import * as locale from './locale.json';

export const load: PageServerLoad = async ({ locals }) => {
  const { t } = new I18n(locale, locals.language);
  
  return {
    hero: {
      title: t('hero.title', { appName: 'i18n Demo' }),
      subtitle: t('hero.subtitle')
    },
    stats: {
      users: 1234,
      languages: 15,
      downloads: 5678
    }
  };
};
```

**src/routes/+page.svelte**

```svelte
<script lang="ts">
  import { I18n } from 'paragone';
  import * as locale from './locale.json';
  
  let { data } = $props();
  
  const { t } = $derived(new I18n(locale, data.language));
</script>

<div class="home">
  <section class="hero">
    <h1>{data.hero.title}</h1>
    <p>{data.hero.subtitle}</p>
    <button class="cta">{t('hero.cta')}</button>
  </section>
  
  <section class="features">
    <h2>{t('features.title')}</h2>
    <div class="feature-grid">
      {#each [1, 2, 3, 4] as i}
        <div class="feature-card">
          <h3>{t(`features.feature${i}.title`)}</h3>
          <p>{t(`features.feature${i}.description`)}</p>
        </div>
      {/each}
    </div>
  </section>
  
  <section class="stats">
    <div class="stat">
      <strong>{t('stats.users', { count: data.stats.users.toLocaleString() })}</strong>
    </div>
    <div class="stat">
      <strong>{t('stats.languages', { count: data.stats.languages })}</strong>
    </div>
    <div class="stat">
      <strong>{t('stats.downloads', { count: data.stats.downloads.toLocaleString() })}</strong>
    </div>
  </section>
</div>

<style>
  .hero {
    text-align: center;
    padding: 4rem 0;
  }
  
  .hero h1 {
    font-size: 3rem;
    margin: 0 0 1rem 0;
  }
  
  .hero p {
    font-size: 1.5rem;
    color: #666;
    margin: 0 0 2rem 0;
  }
  
  .cta {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .cta:hover {
    transform: translateY(-2px);
  }
  
  .features {
    margin: 4rem 0;
  }
  
  .features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }
  
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .feature-card {
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .feature-card h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }
  
  .feature-card p {
    margin: 0;
    color: #666;
  }
  
  .stats {
    display: flex;
    justify-content: space-around;
    margin: 4rem 0;
    padding: 2rem;
    background: #f5f5f5;
    border-radius: 8px;
  }
  
  .stat {
    text-align: center;
  }
  
  .stat strong {
    font-size: 1.5rem;
    color: #667eea;
  }
</style>
```

### 9. Contact Page with Form Action and Remote Function

**src/routes/contact/locale.json**

```json
{
  "en": {
    "title": "Contact Us",
    "subtitle": "We'd love to hear from you",
    "form": {
      "name": "Name",
      "email": "Email",
      "message": "Message",
      "submit": "Send Message",
      "sending": "Sending..."
    },
    "validation": {
      "nameRequired": "Name is required",
      "emailRequired": "Email is required",
      "emailInvalid": "Please enter a valid email",
      "messageRequired": "Message is required",
      "messageTooShort": "Message must be at least 10 characters"
    },
    "success": "Thank you, {{name}}! Your message has been sent.",
    "error": "Failed to send message. Please try again."
  },
  "de": {
    "title": "Kontaktieren Sie uns",
    "subtitle": "Wir würden gerne von Ihnen hören",
    "form": {
      "name": "Name",
      "email": "E-Mail",
      "message": "Nachricht",
      "submit": "Nachricht senden",
      "sending": "Wird gesendet..."
    },
    "validation": {
      "nameRequired": "Name ist erforderlich",
      "emailRequired": "E-Mail ist erforderlich",
      "emailInvalid": "Bitte geben Sie eine gültige E-Mail ein",
      "messageRequired": "Nachricht ist erforderlich",
      "messageTooShort": "Nachricht muss mindestens 10 Zeichen lang sein"
    },
    "success": "Danke, {{name}}! Ihre Nachricht wurde gesendet.",
    "error": "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut."
  }
}
```

**src/routes/contact/data.remote.ts**

```typescript
import { command } from '$app/server';
import { I18n } from 'paragone';
import * as locale from './locale.json';
import z from 'zod';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10)
});

export const sendMessage = command(contactSchema, async (data, { locals }) => {
  const { t } = new I18n(locale, locals.language);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate validation
  if (!data.name) {
    return { success: false, error: t('validation.nameRequired') };
  }
  
  if (!data.email.includes('@')) {
    return { success: false, error: t('validation.emailInvalid') };
  }
  
  if (data.message.length < 10) {
    return { success: false, error: t('validation.messageTooShort') };
  }
  
  return {
    success: true,
    message: t('success', { name: data.name })
  };
});
```

**src/routes/contact/+page.svelte**

```svelte
<script lang="ts">
  import { I18n } from 'paragone';
  import * as locale from './locale.json';
  import { sendMessage } from './data.remote';
  
  let { data } = $props();
  
  const { t } = $derived(new I18n(locale, data.language));
  
  let form = $state({ name: '', email: '', message: '' });
  let isSubmitting = $state(false);
  let result = $state<{ success: boolean; message: string } | null>(null);
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    result = null;
    
    try {
      const response = await sendMessage(form);
      result = { success: response.success, message: response.message || response.error || '' };
      
      if (response.success) {
        form = { name: '', email: '', message: '' };
      }
    } catch (error) {
      result = { success: false, message: t('error') };
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="contact">
  <h1>{t('title')}</h1>
  <p class="subtitle">{t('subtitle')}</p>
  
  <form onsubmit={handleSubmit}>
    <div class="form-group">
      <label for="name">{t('form.name')}</label>
      <input
        id="name"
        type="text"
        bind:value={form.name}
        required
        disabled={isSubmitting}
      />
    </div>
    
    <div class="form-group">
      <label for="email">{t('form.email')}</label>
      <input
        id="email"
        type="email"
        bind:value={form.email}
        required
        disabled={isSubmitting}
      />
    </div>
    
    <div class="form-group">
      <label for="message">{t('form.message')}</label>
      <textarea
        id="message"
        bind:value={form.message}
        required
        rows="5"
        disabled={isSubmitting}
      ></textarea>
    </div>
    
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? t('form.sending') : t('form.submit')}
    </button>
  </form>
  
  {#if result}
    <div class="result" class:success={result.success} class:error={!result.success}>
      {result.message}
    </div>
  {/if}
</div>

<style>
  .contact {
    max-width: 600px;
    margin: 0 auto;
  }
  
  h1 {
    text-align: center;
  }
  
  .subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    box-sizing: border-box;
  }
  
  input:focus,
  textarea:focus {
    outline: none;
    border-color: #667eea;
  }
  
  button {
    width: 100%;
    padding: 1rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  button:hover:not(:disabled) {
    background: #5568d3;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .result {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 4px;
    text-align: center;
  }
  
  .result.success {
    background: #d4edda;
    color: #155724;
  }
  
  .result.error {
    background: #f8d7da;
    color: #721c24;
  }
</style>
```

## Why Create changeLanguage Locally?

The `changeLanguage` function uses SvelteKit's `command()` and `$app/server`, which are only available in the context of a SvelteKit application, not in an npm library. Therefore, you must implement this function in your own project.

**Benefits of this approach:**
- Full control over implementation
- Can add custom validation, logging, or database updates
- Can adapt to your specific needs

**Alternative implementations:**
- See [docs/REMOTE_FUNCTIONS.md](../../docs/REMOTE_FUNCTIONS.md) for Form Actions and API Route examples
- Use server actions if you prefer traditional SvelteKit patterns
- Create custom API endpoints for REST-style language switching

## Running the Example

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and explore:

- Switch between English and German
- Navigate between pages
- Submit the contact form
- Refresh the page to see cookie persistence
- Open in incognito to see browser language detection

## Key Takeaways

1. **Global vs Route translations**: Use both for optimal organization
2. **$derived for reactivity**: Essential in Svelte components
3. **Remote functions**: Clean way to handle client-side actions
4. **Type safety**: TypeScript support throughout
5. **Cookie persistence**: Language survives page reloads
6. **Browser detection**: Automatic on first visit

## Learn More

- [API Reference](../../docs/api-reference.md)
- [Getting Started](../../docs/getting-started.md)
- [Basic Example](../basic)