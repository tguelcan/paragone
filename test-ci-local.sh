#!/bin/bash

# Local GitHub Actions Test Script
# Simulates what runs in CI

set -e

echo "🧪 Testing GitHub Actions locally..."
echo ""

echo "📦 Step 1: Clean install"
rm -rf node_modules package-lock.json
npm install
echo "✅ Dependencies installed"
echo ""

echo "🔧 Step 2: Sync SvelteKit"
npx svelte-kit sync
echo "✅ SvelteKit synced"
echo ""

echo "🧪 Step 3: Run tests"
npm test
echo "✅ Tests passed"
echo ""

echo "🔍 Step 4: Type check"
npm run check
echo "✅ Type check passed"
echo ""

echo "📦 Step 5: Build package"
npm run package
echo "✅ Package built"
echo ""

echo "🎉 All CI steps passed locally!"
echo ""
echo "To run individual steps:"
echo "  npm test              - Run tests"
echo "  npm run check         - Type check"
echo "  npm run package       - Build package"
echo "  npm run test:coverage - Coverage report"
