# Publishing Guide

This guide explains how to publish `paragone` to npm and GitHub.

## Prerequisites

- npm account with access to publish
- GitHub repository access
- Verified npm email address
- Two-factor authentication enabled (recommended)

## Pre-Publishing Checklist

Before publishing a new version:

- [ ] All tests pass (`npm test`)
- [ ] Type checking passes (`npm run check`)
- [ ] Package builds successfully (`npm run package`)
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated
- [ ] Version number is updated in package.json
- [ ] All changes are committed
- [ ] Working on `main` branch

## Step-by-Step Publishing Process

### 1. Update Version Number

Update the version in `package.json` following [Semantic Versioning](https://semver.org/):

- **Patch** (1.0.x): Bug fixes, minor changes
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

```bash
# Manually edit package.json or use npm version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 2. Update CHANGELOG.md

Add a new section for the version:

```markdown
## [1.0.1] - 2024-12-20

### Added
- New feature description

### Fixed
- Bug fix description

### Changed
- Change description
```

### 3. Commit Changes

```bash
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 1.0.1"
```

### 4. Run Final Checks

```bash
# Run tests
npm test

# Type check
npm run check

# Build and lint
npm run package
```

### 5. Create Git Tag

```bash
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

### 6. Publish to npm

#### First-time Setup

```bash
# Login to npm
npm login

# Verify login
npm whoami
```

#### Publish

```bash
# Dry run (optional, shows what will be published)
npm publish --dry-run

# Publish to npm
npm publish --access public
```

### 7. Create GitHub Release

1. Go to https://github.com/tguelcan/paragone/releases
2. Click "Create a new release"
3. Select the tag `v1.0.1`
4. Set release title: `v1.0.1`
5. Copy relevant section from CHANGELOG.md to description
6. Click "Publish release"

## Automated Publishing (GitHub Actions)

The repository includes a GitHub Action for automated publishing:

### Setup Secrets

1. Go to GitHub repository settings
2. Navigate to Secrets → Actions
3. Add `NPM_TOKEN`:
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Create a new "Automation" token
   - Copy and add to GitHub secrets

### Trigger Publishing

Publishing is automatically triggered on:

- **Release creation**: When you create a new release on GitHub
- **Manual trigger**: Via GitHub Actions workflow dispatch

#### Via Release:

1. Create and push a tag: `git tag v1.0.1 && git push origin v1.0.1`
2. Go to GitHub → Releases → Create new release
3. Select tag, add description, publish
4. GitHub Actions will automatically publish to npm

#### Via Workflow Dispatch:

1. Go to GitHub → Actions → "Publish to NPM"
2. Click "Run workflow"
3. Select branch and trigger

## Verifying Publication

After publishing, verify:

```bash
# Check npm package
npm view paragone

# Check latest version
npm view paragone version

# Install in test project
npm install paragone@latest
```

## Troubleshooting

### Package name already exists

If you get an error about the package name:

1. Check if package exists: `npm view paragone`
2. Make sure you're logged in: `npm whoami`
3. Verify package name is available on npm

### 403 Forbidden

- Make sure you're logged in: `npm login`
- Verify 2FA code if required
- Check package access permissions

### Version already published

- You can't republish the same version
- Increment version number and try again
- Check published versions: `npm view paragone versions`

### Build fails

```bash
# Clean node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run package
```

## Rolling Back

If you need to unpublish or deprecate:

```bash
# Deprecate a version (recommended)
npm deprecate paragone@1.0.1 "Please use version 1.0.2"

# Unpublish within 72 hours (use with caution)
npm unpublish paragone@1.0.1
```

**Warning**: Unpublishing can break projects depending on that version. Use deprecation instead.

## Beta/Preview Releases

For testing before stable release:

```bash
# Update version to beta
npm version prerelease --preid=beta
# Results in: 1.0.1-beta.0

# Publish with beta tag
npm publish --tag beta --access public

# Users install with:
npm install paragone@beta
```

## Release Checklist Summary

- [ ] Version bumped
- [ ] CHANGELOG updated
- [ ] Tests passing
- [ ] Type check passing
- [ ] Package builds
- [ ] Changes committed
- [ ] Git tag created and pushed
- [ ] Published to npm
- [ ] GitHub release created
- [ ] Package verified on npm
- [ ] Documentation links work
- [ ] Announced on relevant channels (optional)

## Post-Release

After successful release:

1. **Verify installation works** in a fresh project
2. **Update documentation** if needed
3. **Close related issues** on GitHub
4. **Announce** on Twitter, Reddit, etc. (optional)
5. **Monitor** for bug reports

## Version History

Keep track of releases:

```bash
# View all published versions
npm view paragone versions

# View package info
npm view paragone
```

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [npm Access Tokens](https://docs.npmjs.com/about-access-tokens)

---

For questions or issues with publishing, contact the maintainers.