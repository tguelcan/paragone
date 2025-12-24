# API Reference

Complete API documentation for `paragone`.

## Table of Contents

- [I18n Class](#i18n-class)
- [Helper Functions](#helper-functions)
- [Remote Functions](#remote-functions)
- [Types](#types)

---

## I18n Class

The main class for handling translations.

### Constructor

```typescript
new I18n(translations: Translations, locale?: string)
```

Creates a new I18n instance.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `translations` | `Translations` | Yes | - | Object containing all translations for supported languages |
| `locale` | `string` | No | `'en'` | Current language code |

#### Example

```typescript
import { I18n } from 'paragone';
import * as locale from './locale.json';

const i18n = new I18n(locale, 'en');
```

---

### Methods

#### `t(key, vars?)`

Get translation by key with optional variable replacement.

```typescript
t(key: string, vars?: Record<string, string | number>): string
```

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | `string` | Yes | Translation key (supports dot notation for nested keys) |
| `vars` | `Record<string, string \| number>` | No | Variables to replace in translation |

##### Returns

`string` - The translated string, or the key itself if translation not found

##### Examples

**Simple translation:**
```typescript
t('title')
// Returns: "Welcome"
```

**Nested keys:**
```typescript
t('nav.home')
// Returns: "Home"

t('button.delete.confirm')
// Returns: "Delete permanently"
```

**Variable replacement:**
```typescript
t('greeting', { name: 'John' })
// Returns: "Hello, John!"

t('welcome', { app: 'MyApp', name: 'Anna' })
// Returns: "Welcome to MyApp, Anna!"

t('count', { count: 5 })
// Returns: "You have 5 messages"
```

**Multiple occurrences:**
```typescript
// Translation: "{{name}} said {{name}} twice"
t('repeat', { name: 'Bob' })
// Returns: "Bob said Bob twice"
```

##### Notes

- If a translation key is not found, the key itself is returned
- Variable placeholders use double curly braces: `{{variableName}}`
- Nested keys are separated by dots: `section.subsection.key`
- Missing variables are not replaced (placeholder remains in text)

---

#### `has(key)`

Check if a translation key exists.

```typescript
has(key: string): boolean
```

##### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | `string` | Yes | Translation key to check (supports dot notation) |

##### Returns

`boolean` - `true` if key exists and is a string, `false` otherwise

##### Examples

```typescript
if (i18n.has('optional.feature.title')) {
  console.log(t('optional.feature.title'));
} else {
  console.log('Feature not available');
}
```

```typescript
i18n.has('title')              // true
i18n.has('nav.home')           // true
i18n.has('nonexistent')        // false
i18n.has('nav.nonexistent')    // false
```

##### Notes

- Returns `false` for non-existent keys
- Returns `false` if the key points to an object (not a string)
- Checks in the current locale only

---

#### `getLocale()`

Get the current locale.

```typescript
getLocale(): string
```

##### Returns

`string` - Current locale code (e.g., `'en'`, `'de'`)

##### Example

```typescript
const currentLocale = i18n.getLocale();
console.log(`Current language: ${currentLocale}`);
// Output: "Current language: en"
```

---

## Helper Functions

Standalone functions for language management.

### `getLanguage(cookies, acceptLanguage)`

Get language from cookie or detect from browser's Accept-Language header.

```typescript
function getLanguage(
  cookies: Cookies,
  acceptLanguage: string | null
): string
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cookies` | `Cookies` | Yes | SvelteKit cookies object |
| `acceptLanguage` | `string \| null` | Yes | Accept-Language header value |

#### Returns

`string` - Detected or default language code

#### Example

```typescript
import { getLanguage } from 'paragone';

// In hooks.server.ts
export const handle: Handle = async ({ event, resolve }) => {
  const language = getLanguage(
    event.cookies,
    event.request.headers.get('accept-language')
  );
  
  event.locals.language = language;
  return resolve(event);
};
```

#### Behavior

1. **Cookie exists**: Returns language from `language` cookie
2. **No cookie**: Parses `Accept-Language` header
3. **No header**: Returns default language (`'en'`)

#### Accept-Language Parsing

The function parses the Accept-Language header according to HTTP specification:

```
Accept-Language: de-DE,de;q=0.9,en;q=0.8
```

- Extracts language codes (ignoring region: `de-DE` → `de`)
- Respects quality values (`q=0.9`)
- Matches against `SUPPORTED_LANGUAGES` array
- Returns first supported language with highest priority
- Falls back to `DEFAULT_LANGUAGE` if no match

#### Examples

```typescript
// With cookie
cookies.get('language') // 'de'
getLanguage(cookies, 'en-US') // Returns: 'de'

// Without cookie, from header
cookies.get('language') // undefined
getLanguage(cookies, 'de-DE,de;q=0.9,en;q=0.8') // Returns: 'de'

// No cookie, no header
getLanguage(cookies, null) // Returns: 'en' (default)

// Unsupported language
getLanguage(cookies, 'fr-FR,fr;q=0.9') // Returns: 'en' (default)
```

---

### `setLanguage(cookies, language)`

Set language to cookie.

```typescript
function setLanguage(cookies: Cookies, language: string): void
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cookies` | `Cookies` | Yes | SvelteKit cookies object |
| `language` | `string` | Yes | Language code to set |

#### Returns

`void`

#### Example

```typescript
import { setLanguage } from 'paragone';

// In a server action or API route
export const actions: Actions = {
  changeLanguage: async ({ request, cookies }) => {
    const data = await request.formData();
    const language = data.get('language');
    
    setLanguage(cookies, language);
    
    return { success: true };
  }
};
```

#### Cookie Settings

The language cookie is set with the following options:

```typescript
{
  path: '/',
  maxAge: 60 * 60 * 24 * 365, // 1 year (31,536,000 seconds)
  sameSite: 'lax',
  httpOnly: false
}
```

| Option | Value | Description |
|--------|-------|-------------|
| `path` | `'/'` | Cookie available on all routes |
| `maxAge` | 1 year | Cookie persists for 1 year |
| `sameSite` | `'lax'` | CSRF protection, allows top-level navigation |
| `httpOnly` | `false` | Accessible to JavaScript (needed for client-side reading) |

---

## Remote Functions

SvelteKit `command()` functions for client-side actions.

### `changeLanguage(language)`

Change user's language preference.

```typescript
async function changeLanguage(language: string): Promise<{ success: boolean; language: string }>
```

This is a SvelteKit remote function (using `command()`) that sets the language cookie and can be called directly from the client.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `language` | `string` | Yes | Language code to set (2-10 characters) |

#### Returns

`Promise<{ success: boolean; language: string }>` - Object with success status and language

#### Example

```typescript
import { invalidateAll } from '$app/navigation';
import { changeLanguage } from 'paragone';

async function switchToGerman() {
  const result = await changeLanguage('de');
  
  if (result.success) {
    // Reload all data with new language
    await invalidateAll();
  }
}
```

#### Complete Component Example

```svelte
<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { changeLanguage } from 'paragone';
  
  let { currentLanguage = 'en' } = $props();
  let isChanging = $state(false);
  
  async function switchLanguage(lang: string) {
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

<select
  value={currentLanguage}
  onchange={(e) => switchLanguage(e.currentTarget.value)}
  disabled={isChanging}
>
  <option value="en">English</option>
  <option value="de">Deutsch</option>
  <option value="fr">Français</option>
</select>
```

#### Validation

The function validates the language parameter:
- Minimum length: 2 characters
- Maximum length: 10 characters
- Uses Zod schema: `z.string().min(2).max(10)`

#### Notes

- Uses `getRequestEvent()` internally to access cookies
- No need to pass cookies or request context
- Always call `invalidateAll()` after to reload page data
- Works only on the client side

---

## Types

### `Translations`

```typescript
type TranslationValue = string | Record<string, unknown>;

type Translations = Record<string, Record<string, TranslationValue>>;
```

Structure for translation objects:

```typescript
const translations: Translations = {
  en: {
    simple: 'Hello',
    nested: {
      key: 'Value'
    }
  },
  de: {
    simple: 'Hallo',
    nested: {
      key: 'Wert'
    }
  }
};
```

### `Cookies`

Imported from `@sveltejs/kit`:

```typescript
import type { Cookies } from '@sveltejs/kit';
```

SvelteKit's cookies interface for reading and writing cookies.

---

## Configuration Constants

These constants can be modified in the source code:

### `COOKIE_NAME`

```typescript
const COOKIE_NAME = 'language';
```

Name of the cookie used to store language preference.

### `DEFAULT_LANGUAGE`

```typescript
const DEFAULT_LANGUAGE = 'en';
```

Fallback language when no preference is found.

### `SUPPORTED_LANGUAGES`

```typescript
const SUPPORTED_LANGUAGES = ['en', 'de'];
```

Array of supported language codes. Used for browser language detection.

**Example:**
```typescript
const SUPPORTED_LANGUAGES = ['en', 'de', 'fr', 'es', 'it', 'pt'];
```

---

## Usage in Different Contexts

### In Server Load Functions

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

### In Svelte Components

```typescript
<script lang="ts">
  import { I18n } from 'paragone';
  import * as locale from './locale.json';
  
  let { data } = $props();
  const { t } = $derived(new I18n(locale, data.language));
</script>

<h1>{t('title')}</h1>
```

### In Form Actions

```typescript
import type { Actions } from './$types';
import { I18n } from 'paragone';
import * as locale from './locale.json';

export const actions: Actions = {
  submit: async ({ request, locals }) => {
    const { t } = new I18n(locale, locals.language);
    
    return {
      message: t('form.success')
    };
  }
};
```

### In API Routes

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { I18n } from 'paragone';
import * as locale from './locale.json';

export const GET: RequestHandler = async ({ locals }) => {
  const { t } = new I18n(locale, locals.language);
  
  return json({
    message: t('api.greeting')
  });
};
```

### In Remote Functions (Commands)

```typescript
import { command } from '$app/server';
import { I18n } from 'paragone';
import * as locale from './locale.json';
import z from 'zod';

export const myCommand = command(z.object({ id: z.string() }), async (data, { locals }) => {
  const { t } = new I18n(locale, locals.language);
  
  return {
    message: t('command.success', { id: data.id })
  };
});
```

---

## Error Handling

The library is designed to fail gracefully:

- **Missing translation key**: Returns the key itself
- **Missing variable**: Leaves placeholder in text (`{{name}}`)
- **Invalid locale**: Uses default locale (`'en'`)
- **Malformed Accept-Language**: Falls back to default
- **Empty translations**: Returns keys as-is

### Example

```typescript
const i18n = new I18n({}, 'en');

i18n.t('missing.key'); // Returns: "missing.key"
i18n.t('hello', { name: 'John' }); // Returns: "hello" (no template)
i18n.has('missing'); // Returns: false
```

---

## Performance Tips

1. **Reuse I18n instances**: Don't create new instances in loops

```typescript
// ❌ Bad
for (const item of items) {
  const { t } = new I18n(locale, language);
  console.log(t('item.name'));
}

// ✅ Good
const { t } = new I18n(locale, language);
for (const item of items) {
  console.log(t('item.name'));
}
```

2. **Use $derived in components**: Ensures proper reactivity

```typescript
// ✅ Correct
const { t } = $derived(new I18n(locale, data.language));
```

3. **Cache translations**: Store in module scope if they don't change

```typescript
import * as locale from './locale.json'; // Cached at module level
```

---

## See Also

- [Getting Started Guide](./getting-started.md)
- [Advanced Usage](./advanced-usage.md)
- [Examples](../examples)