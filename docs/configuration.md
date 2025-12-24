# Configuration

Configure paragone to match your needs. All settings are optional.

## Quick Start

Configure paragone in your `src/hooks.server.ts`:

```typescript
import type { Handle } from '@sveltejs/kit';
import { configure, getLanguage } from 'paragone';

// Configure paragone
configure({
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'de', 'fr'],
  cookieName: 'lang'
});

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.language = getLanguage(
    event.cookies,
    event.request.headers.get('accept-language')
  );
  return resolve(event);
};
```

## Configuration Options

### `defaultLanguage`

**Type:** `string`  
**Default:** `'en'`

The fallback language used when no language is detected from cookies or browser.

```typescript
configure({
  defaultLanguage: 'de' // German as default
});
```

### `supportedLanguages`

**Type:** `string[]`  
**Default:** `['en', 'de']`

Array of language codes your application supports. Used for browser language detection.

```typescript
configure({
  supportedLanguages: ['en', 'de', 'fr', 'es', 'it']
});
```

### `cookieName`

**Type:** `string`  
**Default:** `'language'`

Name of the cookie used to store the user's language preference.

```typescript
configure({
  cookieName: 'user_lang'
});
```

### `cookieOptions`

**Type:** `object`  
**Default:** See below

Cookie settings.

```typescript
configure({
  cookieOptions: {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: false,
    secure: true
  }
});
```

#### Cookie Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `path` | `string` | `'/'` | Cookie path scope |
| `maxAge` | `number` | `31536000` | Cookie lifetime in seconds (default: 1 year) |
| `sameSite` | `'strict' \| 'lax' \| 'none'` | `'lax'` | CSRF protection level |
| `httpOnly` | `boolean` | `false` | If true, cookie not accessible via JavaScript |
| `secure` | `boolean` | `undefined` | If true, cookie only sent over HTTPS |

## Complete Example

```typescript
import type { Handle } from '@sveltejs/kit';
import { configure, getLanguage } from 'paragone';

configure({
  // Basic settings
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'de', 'fr', 'es'],
  cookieName: 'app_language',
  
  // Cookie settings
  cookieOptions: {
    path: '/',
    maxAge: 60 * 60 * 24 * 90, // 90 days
    sameSite: 'strict',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production'
  }
});

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.language = getLanguage(
    event.cookies,
    event.request.headers.get('accept-language')
  );
  return resolve(event);
};
```

## Get Current Configuration

Get current configuration:

```typescript
import { getConfig } from 'paragone';

const config = getConfig();
console.log('Default language:', config.defaultLanguage);
console.log('Supported languages:', config.supportedLanguages);
```

## Common Configurations

### Multi-Language Application

```typescript
configure({
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'de', 'fr', 'es', 'it', 'pt', 'nl'],
  cookieName: 'locale'
});
```

### Short Cookie Lifetime

For applications where language preference shouldn't persist long:

```typescript
configure({
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 7 // 7 days
  }
});
```

### Strict Security

High security setup:

```typescript
configure({
  cookieOptions: {
    sameSite: 'strict',
    secure: true,
    httpOnly: true // Note: This prevents client-side reading
  }
});
```

### Development vs Production

```typescript
const isProduction = process.env.NODE_ENV === 'production';

configure({
  cookieOptions: {
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax'
  }
});
```

## Configuration Best Practices

### Configure Once

Call `configure()` once in `hooks.server.ts`.

```typescript
// Good
configure({ defaultLanguage: 'de' });
export const handle: Handle = async ({ event, resolve }) => {
  // ...
};

// Bad - multiple configurations
configure({ defaultLanguage: 'de' });
configure({ supportedLanguages: ['en', 'de'] }); // Overwrites previous config
```

### 2. Use Environment Variables

```typescript
configure({
  defaultLanguage: process.env.DEFAULT_LANG || 'en',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
});
```

### Match Translation Files

Match `supportedLanguages` with your translation files:

```typescript
// If you have translations for en, de, fr
configure({
  supportedLanguages: ['en', 'de', 'fr']
});
```

### Cookie Lifetime

- **Long (1 year):** Better UX, user preference persists
- **Short (30 days):** Better privacy, more frequent re-detection
- **Session:** Maximum privacy, lost on browser close

```typescript
// Long-term preference
configure({
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 365 // 1 year
  }
});

// Session-based
configure({
  cookieOptions: {
    maxAge: undefined // Session cookie
  }
});
```

## TypeScript Support

The configuration is fully typed:

```typescript
import type { ParagoneConfig } from 'paragone';

const config: Partial<ParagoneConfig> = {
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'de'],
  cookieName: 'lang'
};

configure(config);
```

## Troubleshooting

### Language Not Persisting

Check cookie settings in browser DevTools:

```typescript
configure({
  cookieOptions: {
    path: '/', // Must match your app's path
    sameSite: 'lax', // 'none' requires secure: true
    httpOnly: false // true prevents JavaScript access
  }
});
```

### Wrong Default Language

Ensure `defaultLanguage` is set correctly:

```typescript
configure({
  defaultLanguage: 'de' // Your preferred default
});
```

### Browser Language Not Detected

Check that `supportedLanguages` includes the browser's language:

```typescript
configure({
  supportedLanguages: ['en', 'de', 'fr'] // Add browser's language here
});
```

## Related

- [Getting Started](./getting-started.md) - Basic setup
- [API Reference](./api-reference.md) - Complete API
- [Examples](../examples) - Working examples