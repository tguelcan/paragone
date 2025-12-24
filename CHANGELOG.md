# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-12-24

### Added
- Configuration system with `configure()` and `getConfig()` functions
- Configurable options: cookieName, defaultLanguage, supportedLanguages, cookieOptions
- Working demo in `/src/routes/`
- Configuration documentation

### Changed
- I18n constructor now accepts optional locale parameter
- Improved TypeScript types

### Fixed
- Remote function issues with getRequestEvent()
- Cookie options type compatibility

### Note
Requires experimental features in svelte.config.js:
```js
experimental: { remoteFunctions: true },
compilerOptions: { experimental: { async: true } }
```

---

## [1.0.0] - 2024-12-20

### Added
- Initial release
- I18n class with t(), has(), and getLocale() methods
- Helper functions: getLanguage(), setLanguage()
- Remote function changeLanguage() using command()
- Cookie-based language persistence
- Browser language detection via Accept-Language header
- Nested translation keys support
- Variable interpolation ({{name}}, {{count}})
- TypeScript support
- Svelte 5 Runes compatibility
- Test suite with Vitest
- Documentation and examples
- MIT License

### Features
- Cookie-based with automatic browser detection
- Route-specific translation files
- Reactive with Svelte 5 Runes
- Type-safe TypeScript
- Simple API
- Remote functions for language switching
- Zero dependencies (only peer deps)

---

## [Unreleased]

### Planned
- Pluralization support
- Date/time formatting
- Number formatting
- RTL language support
- Language fallback chains

---

## Release Notes

### Version 1.0.0

First stable release. Simple internationalization for SvelteKit with Svelte 5 Runes.

Install: `npm install paragone`

See [Getting Started Guide](./docs/getting-started.md) for setup.

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