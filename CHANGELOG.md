# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-20

### Added

- 🎉 Initial release of `paragone`
- `I18n` class for managing translations
  - `t()` method for translations with variable interpolation
  - `has()` method to check if translation key exists
  - `getLocale()` method to get current locale
- Helper functions:
  - `getLanguage()` for language detection from cookies or browser
  - `setLanguage()` for setting language cookie
- Remote function `changeLanguage()` using SvelteKit's `command()`
- Cookie-based language persistence
- Automatic browser language detection via Accept-Language header
- Support for nested translation keys (`nav.home`, `button.save`)
- Variable interpolation in translations (`{{name}}`, `{{count}}`)
- TypeScript support with full type definitions
- Svelte 5 Runes compatibility (`$derived`)
- Comprehensive test suite with Vitest
  - Unit tests for I18n class
  - Tests for helper functions
  - Integration tests
  - >80% code coverage
- Complete documentation:
  - Getting Started guide
  - API Reference
  - Contributing guidelines
- Example projects:
  - Basic usage example
  - Complete example with all features
- MIT License

### Features

- 🍪 Cookie-based with 1-year expiration
- 🌐 Browser language detection from Accept-Language header
- 🎯 Route-specific translation files
- 🔄 Reactive with Svelte 5 Runes
- 💪 Type-safe TypeScript support
- 🚀 Simple API with minimal setup
- 📦 Remote functions for language switching
- 🔢 Variable interpolation support
- 📁 Global and route-specific translations
- ✅ Graceful error handling (returns key if translation not found)

### Technical Details

- Zero dependencies (peer dependencies: `@sveltejs/kit`, `svelte`)
- Small bundle size
- Server-side and client-side support
- Works with SvelteKit's routing system
- Compatible with form actions and API routes
- Support for SvelteKit commands (remote functions)

---

## [Unreleased]

### Planned Features

- [ ] Pluralization support
- [ ] Date/time formatting
- [ ] Number formatting
- [ ] RTL language support
- [ ] Language fallback chains
- [ ] TypeScript utility types for translation keys
- [ ] CLI tool for translation management
- [ ] Translation file validation
- [ ] More examples (blog, e-commerce, admin panel)

---

## Release Notes

### Version 1.0.0

This is the first stable release of `paragone`. The library provides a simple, modern internationalization solution for SvelteKit applications with Svelte 5 Runes support.

**Key highlights:**
- Production-ready with comprehensive tests
- Full TypeScript support
- Simple API that's easy to learn
- Works seamlessly with SvelteKit's architecture
- Automatic language detection
- Cookie-based persistence

**Getting started:**
```bash
npm install paragone
```

See the [Getting Started Guide](./docs/getting-started.md) for setup instructions.

---

## Migration Guide

### From pre-release versions

This is the first stable release. No migration needed.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## Links

- [NPM Package](https://www.npmjs.com/package/paragone)
- [GitHub Repository](https://github.com/tguelcan/paragone)
- [Documentation](./docs)
- [Examples](./examples)
- [Issues](https://github.com/tguelcan/paragone/issues)