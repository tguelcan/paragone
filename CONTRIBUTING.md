# Contributing

Thanks for considering contributing to paragone!

## Getting Started

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

### Setup

```bash
git clone https://github.com/YOUR_USERNAME/paragone.git
cd paragone
npm install
npm test
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

- Tabs for indentation
- Single quotes
- Semicolons
- Keep functions small



### Naming

- Classes: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case

### Error Handling

Fail gracefully - return fallback values instead of throwing errors.

## Testing

Write tests for new features. Run with `npm test`.

## Submitting Changes

### Branches

Use descriptive names like `feature/add-xyz` or `fix/bug-name`.

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

### Pull Requests

1. Fork and create a branch
2. Make your changes
3. Commit and push
4. Open a pull request



## Questions

Open an issue or start a discussion.

Thanks for contributing!