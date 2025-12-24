# Testing

## Local Testing

Test the same steps that run in GitHub Actions:

```bash
./test-ci-local.sh
```

Or run steps manually:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Sync SvelteKit (required!)
npx svelte-kit sync

# Run tests
npm test

# Type check
npm run check

# Build
npm run package
```

## Individual Commands

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run check         # TypeScript check
npm run package       # Build package
npm run dev           # Dev server
```

## Common Issues

### `.svelte-kit/tsconfig.json` not found

Run `npx svelte-kit sync` first. This generates the `.svelte-kit` directory.

### Optional dependencies error

Use `npm install` instead of `npm ci` in CI environments.

### Tests fail locally but pass in CI

Make sure your `.svelte-kit` folder is up to date:
```bash
npx svelte-kit sync
npm test
```

## GitHub Actions

The CI runs on Node 20 and 22. Tests must pass on both versions.

View results: https://github.com/tguelcan/paragone/actions