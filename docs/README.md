# Documentation

Welcome to the `paragone` documentation! This guide will help you implement internationalization in your SvelteKit application.

## Table of Contents

- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Advanced Topics](#advanced-topics)
- [FAQ](#faq)
- [Contributing](#contributing)

---

## Getting Started

New to `paragone`? Start here!

### [Getting Started Guide](./getting-started.md)

A comprehensive guide that walks you through:
- Installation
- Basic setup
- Creating translation files
- Using translations in components
- Adding a language switcher
- Configuration options

**Perfect for**: First-time users, quick setup

---

## API Reference

Complete API documentation for all classes, methods, and functions.

### [API Reference](./api-reference.md)

Detailed documentation covering:
- `I18n` class and all its methods
- Helper functions (`getLanguage`, `setLanguage`)
- Remote functions (`changeLanguage`)
- Type definitions
- Configuration constants
- Usage examples for each API

**Perfect for**: Developers who need detailed API information, reference during development

---

## Examples

Learn by doing with complete working examples.

### Available Examples

#### [Basic Example](../examples/basic)
Simple implementation showing:
- Basic translation setup
- Language detection
- Language switcher
- Cookie persistence

**Perfect for**: Quick start, understanding the basics

#### [Complete Example](../examples/complete-example)
Comprehensive example demonstrating:
- Global translations
- Route-specific translations
- Form actions with translations
- Remote functions
- API routes
- Layout translations
- Error pages

**Perfect for**: Real-world applications, advanced patterns

---

## Quick Reference

### Installation

```bash
npm install paragone
```

### Minimal Setup

**1. hooks.server.ts**
```typescript
import { getLanguage } from 'paragone';

export const handle = async ({ event, resolve }) => {
  event.locals.language = getLanguage(
    event.cookies,
    event.request.headers.get('accept-language')
  );
  return resolve(event);
};
```

**2. +page.svelte**
```svelte
<script lang="ts">
  import { I18n } from 'paragone';
  import * as locale from './locale.json';
  
  let { data } = $props();
  const { t } = $derived(new I18n(locale, data.language));
</script>

<h1>{t('title')}</h1>
```

**3. Language Switcher**
```svelte
<script lang="ts">
  import { changeLanguage } from 'paragone';
  import { invalidateAll } from '$app/navigation';
  
  async function switchLanguage(lang: string) {
    await changeLanguage(lang);
    await invalidateAll();
  }
</script>

<button onclick={() => switchLanguage('en')}>English</button>
<button onclick={() => switchLanguage('de')}>Deutsch</button>
```

---

## Advanced Topics

### Translation Organization

#### Global Translations
Store app-wide translations in `src/lib/i18n/locale.json`:
```json
{
  "en": {
    "nav": { "home": "Home", "about": "About" },
    "common": { "save": "Save", "cancel": "Cancel" }
  },
  "de": {
    "nav": { "home": "Startseite", "about": "Über uns" },
    "common": { "save": "Speichern", "cancel": "Abbrechen" }
  }
}
```

#### Route-Specific Translations
Create `locale.json` in each route folder for page-specific translations.

#### Merging Translations
```typescript
import * as globalLocale from '$lib/i18n/locale.json';
import * as pageLocale from './locale.json';

const combined = {
  en: { ...globalLocale.en, ...pageLocale.en },
  de: { ...globalLocale.de, ...pageLocale.de }
};
```

### Using in Different Contexts

| Context | How to Use |
|---------|-----------|
| **Server Load Functions** | `new I18n(locale, locals.language)` |
| **Svelte Components** | `$derived(new I18n(locale, data.language))` |
| **Form Actions** | `new I18n(locale, locals.language)` |
| **API Routes** | `new I18n(locale, locals.language)` |
| **Remote Functions** | `new I18n(locale, locals.language)` |

### Nested Keys

Use dot notation for organization:
```typescript
t('nav.home')              // "Home"
t('button.save')           // "Save"
t('form.validation.email') // "Invalid email"
```

### Variable Interpolation

```typescript
t('greeting', { name: 'John' })
// "Hello, John!"

t('cart.items', { count: 5, total: 49.99 })
// "You have 5 items ($49.99)"
```

---

## FAQ

### How do I add a new language?

1. Add translations to your `locale.json`:
   ```json
   {
     "en": { ... },
     "de": { ... },
     "fr": { ... }  // New language
   }
   ```

2. Update `SUPPORTED_LANGUAGES` in the source if needed

3. Add language option to your switcher

### How do I handle missing translations?

The library returns the key if a translation is not found:
```typescript
t('missing.key') // Returns: "missing.key"
```

You can check if a key exists:
```typescript
if (i18n.has('optional.feature')) {
  return t('optional.feature');
}
return 'Feature not available';
```

### How do I use translations in TypeScript functions?

```typescript
function processData(language: string) {
  const { t } = new I18n(locale, language);
  return {
    message: t('processing.complete')
  };
}
```

### Why use $derived in components?

`$derived` ensures the i18n instance updates when the language changes:
```typescript
// ✅ Good - reactive
const { t } = $derived(new I18n(locale, data.language));

// ❌ Bad - won't update
const { t } = new I18n(locale, data.language);
```

### How do I test components with translations?

Mock the translation object in your tests:
```typescript
const mockLocale = {
  en: { title: 'Test Title' }
};

// In your test
const i18n = new I18n(mockLocale, 'en');
expect(i18n.t('title')).toBe('Test Title');
```

### Can I use this with SSR?

Yes! The library works seamlessly with SvelteKit's SSR. Translations are resolved on the server and sent to the client.

### How do I change the default language?

Edit the `DEFAULT_LANGUAGE` constant in your local copy:
```typescript
const DEFAULT_LANGUAGE = 'de'; // Changed from 'en'
```

### How long does the language cookie last?

By default, 1 year. Customize in `setLanguage()`:
```typescript
cookies.set('language', language, {
  maxAge: 60 * 60 * 24 * 30 // 30 days
});
```

---

## Best Practices

### DO

- Use `$derived` in Svelte components
- Structure keys hierarchically
- Use variables for dynamic content
- Call `invalidateAll()` after language change
- Keep translations co-located with routes
- Test with multiple languages

### DON'T

- Don't create i18n instances in loops
- Don't hardcode translatable strings
- Don't forget to pass language from server to client
- Don't use complex logic in translation files
- Don't expose API keys in translation files

---

## Performance Tips

1. **Reuse i18n instances**: Create once per request/component
2. **Use $derived**: Proper reactivity without unnecessary re-creation
3. **Split translations**: Use route-specific files to reduce bundle size
4. **Cache translations**: Import at module level

---

## Troubleshooting

### Language not switching

**Problem**: Language doesn't change when clicking switcher

**Solution**:
```typescript
// Make sure to call invalidateAll()
await changeLanguage('de');
await invalidateAll(); // This is required!
```

### Translations not showing

**Checklist**:
- [ ] Translation key exists in `locale.json`
- [ ] Language is passed from `+page.server.ts` to component
- [ ] Using `$derived` in component
- [ ] Translation file imported correctly

### Cookie not persisting

**Check**:
- Browser DevTools → Application → Cookies
- Verify `httpOnly: false` (default)
- Check cookie domain and path settings
- Ensure `sameSite` is appropriate for your setup

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- How to report bugs
- How to suggest features
- Development setup
- Coding guidelines
- Testing guidelines
- Submitting pull requests

---

## Additional Resources

- [NPM Package](https://www.npmjs.com/package/paragone) - Published package
- [GitHub Repository](https://github.com/tguelcan/paragone) - Source code
- [Issue Tracker](https://github.com/tguelcan/paragone/issues) - Report bugs or request features
- **[Changelog](../CHANGELOG.md)** - Version history
- **[License](../LICENSE)** - MIT License

---

## Support

Need help? Here's how to get support:

1. Check the documentation - Most questions are answered here
2. Search issues - Someone might have had the same question
3. Open an issue - For bugs or feature requests
4. Start a discussion - For general questions

---

Made for the Svelte community