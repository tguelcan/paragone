# Contributing to paragone

Thank you for your interest in contributing to this project! We welcome contributions from everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Environment details** (OS, Node version, SvelteKit version, etc.)
- **Code samples** if applicable
- **Screenshots** if relevant

**Example:**

```markdown
## Bug: Language not persisting after page reload

**Steps to reproduce:**
1. Switch language to German
2. Reload the page
3. Language resets to English

**Expected:** Language should remain German
**Actual:** Language resets to default

**Environment:**
- OS: macOS 14.1
- Node: 20.11.0
- SvelteKit: 2.49.1
- Browser: Chrome 120
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement needed?
- **Proposed solution** - how would you implement it?
- **Alternatives considered**
- **Impact** - breaking changes, performance, etc.

### Pull Requests

We actively welcome your pull requests! Here's the process:

1. Fork the repo
2. Create a branch from `main`
3. Make your changes
4. Add tests if applicable
5. Ensure tests pass
6. Update documentation
7. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm, pnpm, or bun

### Setup Steps

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/paragone.git
   cd paragone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Run tests in watch mode:
   ```bash
   npm run test:watch
   ```

5. Build the package:
   ```bash
   npm run package
   ```

6. Check TypeScript types:
   ```bash
   npm run check
   ```

## Project Structure

```
paragone/
├── src/
│   ├── lib/
│   │   ├── i18n/
│   │   │   ├── i18n.ts              # Core I18n class
│   │   │   ├── i18n.remote.ts       # Remote functions
│   │   │   ├── i18n.test.ts         # Tests
│   │   │   └── locale.json          # Example translations
│   │   └── index.ts                 # Public exports
│   └── routes/                      # Demo/development routes
├── docs/                            # Documentation
├── examples/                        # Usage examples
├── tests/                           # Additional tests
├── package.json
├── README.md
└── CONTRIBUTING.md
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all code
- Define proper types, avoid `any`
- Use interfaces for public APIs
- Export types that users might need

### Code Style

- Use tabs for indentation (project default)
- Use single quotes for strings
- Add semicolons
- Use trailing commas in multi-line structures
- Keep functions small and focused
- Add JSDoc comments for public APIs

**Example:**

```typescript
// Get translation by key with optional variable replacement
// @param key - Translation key (supports dot notation)
// @param vars - Variables to replace in translation
// @returns Translated string or key if not found
t = (key: string, vars?: Record<string, string | number>): string => {
  // Implementation
};
```

### Naming Conventions

- **Classes:** PascalCase (`I18n`)
- **Functions:** camelCase (`getLanguage`, `setLanguage`)
- **Constants:** UPPER_SNAKE_CASE (`DEFAULT_LANGUAGE`)
- **Types/Interfaces:** PascalCase (`Translations`, `TranslationValue`)
- **Files:** kebab-case (`i18n.ts`, `i18n.remote.ts`)

### Error Handling

- Fail gracefully - return fallback values instead of throwing
- Return the key if translation is not found
- Log warnings for development, not in production

```typescript
// ✅ Good - graceful fallback
if (!value) return key;

// ❌ Bad - throwing errors
if (!value) throw new Error('Translation not found');
```

## Testing Guidelines

### Writing Tests

- Write tests for all new features
- Update tests when changing existing features
- Use descriptive test names
- Group related tests with `describe`
- One assertion per test when possible

**Test Structure:**

```typescript
describe('Feature Name', () => {
  describe('specific functionality', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = myFunction(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage

- Aim for >80% coverage
- All public APIs must have tests
- Test edge cases and error conditions
- Test different locales

## Submitting Changes

### Branch Naming

Use descriptive branch names:

- `feature/add-language-fallback`
- `fix/cookie-expiration`
- `docs/update-api-reference`
- `refactor/simplify-translation-lookup`

### Commit Messages

Write clear, descriptive commit messages:

```
feat: add support for language fallback chain

- Implement fallback to default language
- Add tests for fallback behavior
- Update documentation

Fixes #123
```

**Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Maintenance tasks

### Pull Request Process

1. Update your fork:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

3. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/my-feature
   ```

5. Create Pull Request:
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the template

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added that prove fix/feature works
- [ ] Dependent changes merged

## Related Issues
Fixes #(issue number)
```

## Release Process

Releases are managed by maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag
4. Push to GitHub
5. Publish to npm
6. Create GitHub release

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Reach out to maintainers

## Recognition

Contributors are recognized in:
- GitHub contributors page
- CHANGELOG.md
- Release notes

Thank you for contributing!