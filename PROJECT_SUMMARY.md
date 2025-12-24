# paragone - Project Summary

## What is paragone?

**paragone** is a modern, lightweight internationalization (i18n) library for SvelteKit with Svelte 5 Runes support.

> *From Greek "παράγλωσσος" (paraglossus) - multilingual, speaking many languages*

### Key Features
- Cookie-based language persistence with automatic browser detection
- Reactive with Svelte 5 Runes (`$derived`)
- Fully type-safe with TypeScript
- Simple API - minimal setup required
- Remote functions using SvelteKit's `command()`
- Nested keys and variable interpolation
- Support for global and route-specific translations

---

## Project Status

### Ready for Publishing

- **Version:** 1.0.0
- **Tests:** 43 tests passing ✓
- **Type Check:** Passing ✓
- **Build:** Success ✓
- **Documentation:** Complete ✓
- **Examples:** 2 working examples ✓
- **CI/CD:** GitHub Actions configured ✓

---

## Project Structure

```
paragone/
├── src/lib/
│   ├── i18n/
│   │   ├── i18n.ts              # Core I18n class (123 lines)
│   │   ├── i18n.remote.ts       # Remote function (11 lines)
│   │   ├── i18n.test.ts         # Tests (43 tests)
│   │   └── locale.json          # Example translations
│   └── index.ts                 # Public exports
│
├── docs/
│   ├── README.md                # Documentation index
│   ├── getting-started.md       # Setup guide
│   └── api-reference.md         # Complete API docs
│
├── examples/
│   ├── basic/                   # Simple example
│   └── complete-example/        # Advanced example
│
├── .github/workflows/
│   ├── ci.yml                   # Tests & build
│   └── publish.yml              # NPM publishing
│
├── README.md                    # Main documentation
├── CHANGELOG.md                 # Version history
├── CONTRIBUTING.md              # Contribution guide
├── PUBLISHING.md                # Publishing guide
├── LICENSE                      # MIT License
└── package.json                 # Package configuration
```

---

## Publishing Workflow

### Quick Publish to NPM

```bash
# 1. Check everything works
npm test
npm run check
npm run package

# 2. Login to npm
npm login

# 3. Publish
npm publish
```

### Via GitHub Actions (Recommended)

1. Create NPM token at https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Add as GitHub secret: `NPM_TOKEN`
3. Create a GitHub Release
4. Automatic publishing triggered

---

## Documentation Overview

### For Users

1. **README.md** - Quick start, features, basic usage
2. **docs/getting-started.md** - Step-by-step setup guide
3. **docs/api-reference.md** - Complete API documentation
4. **examples/** - Working code examples

### For Contributors

1. **CONTRIBUTING.md** - How to contribute
2. **PUBLISHING.md** - Publishing process
3. **PROJECT_SUMMARY.md** - This file

---

## Testing

### Run Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

### Test Coverage
- **43 tests** covering:
  - I18n class methods
  - Helper functions
  - Edge cases
  - Integration scenarios

---

## Development

### Commands
```bash
npm run dev          # Start dev server
npm run build        # Build project
npm run package      # Build package for publishing
npm run check        # TypeScript check
npm test             # Run tests
```

### Making Changes

1. Edit source files in `src/lib/i18n/`
2. Update tests in `src/lib/i18n/i18n.test.ts`
3. Run tests: `npm test`
4. Run type check: `npm run check`
5. Build: `npm run package`

---

## Usage Example

```typescript
// hooks.server.ts
import { getLanguage } from 'paragone';

export const handle = async ({ event, resolve }) => {
  event.locals.language = getLanguage(
    event.cookies,
    event.request.headers.get('accept-language')
  );
  return resolve(event);
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { I18n } from 'paragone';
  import * as locale from './locale.json';
  
  let { data } = $props();
  const { t } = $derived(new I18n(locale, data.language));
</script>

<h1>{t('welcome')}</h1>
```

```svelte
<!-- Language Switcher -->
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

## Next Steps

### Before First Release

- [x] All tests passing
- [x] Documentation complete
- [x] Examples working
- [x] CI/CD configured
- [ ] Check NPM package name availability: `npm view paragone`
- [ ] Create GitHub repository
- [ ] Publish to NPM

### After Release

- [ ] Announce on Twitter/Reddit/Svelte Discord
- [ ] Monitor for bug reports
- [ ] Create roadmap for future features
- [ ] Add more examples (blog, e-commerce, etc.)

---

## Future Features (Ideas)

- Pluralization support
- Date/time formatting helpers
- Number formatting
- RTL language support
- Language fallback chains
- TypeScript utility types for translation keys
- CLI tool for translation management
- Translation file validation
- SSG optimization

---

## Package Info

- **Name:** `paragone`
- **Version:** 1.0.0
- **License:** MIT
- **Author:** Tayfun Guelcan
- **Keywords:** svelte, sveltekit, svelte5, i18n, internationalization, translation, locale, runes

### Dependencies
- **Peer Dependencies:**
  - `@sveltejs/kit: ^2.0.0`
  - `svelte: ^5.0.0`
- **Dev Dependencies:** See package.json

---

## Links

- **GitHub:** https://github.com/tguelcan/paragone
- **NPM:** https://www.npmjs.com/package/paragone
- **Issues:** https://github.com/tguelcan/paragone/issues
- **Documentation:** /docs

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Contribution Steps

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes and add tests
4. Run tests: `npm test`
5. Commit: `git commit -m "feat: add my feature"`
6. Push and create Pull Request

---

## License

MIT © Tayfun Guelcan - See [LICENSE](./LICENSE) for details.

---

## Support

- Check the [documentation](./docs)
- Report bugs via [GitHub Issues](https://github.com/tguelcan/paragone/issues)
- Request features via [GitHub Issues](https://github.com/tguelcan/paragone/issues)
- Ask questions in [GitHub Discussions](https://github.com/tguelcan/paragone/discussions)

---

Made for the Svelte community

*Last updated: December 2024*