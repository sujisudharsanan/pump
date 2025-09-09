#!/bin/bash

# ESLint and Prettier Auto-Fix Script
# This script runs ESLint with automatic fixes across the entire project

echo "🔧 Running ESLint with automatic fixes across the project..."
echo ""

# Run ESLint with automatic fixing on all TypeScript and JavaScript files
npx eslint "src/**/*.{ts,tsx,js,jsx}" --fix --max-warnings 50

echo ""
echo "✅ ESLint auto-fix completed!"
echo ""

# Optional: Also run Prettier separately for any additional formatting
echo "🎨 Running Prettier for additional formatting..."
npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"

echo ""
echo "🎉 Code formatting complete!"
echo ""
echo "📊 Final ESLint check (warnings only):"
npx eslint "src/**/*.{ts,tsx,js,jsx}" --max-warnings 50
