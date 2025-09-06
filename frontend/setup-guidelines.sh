#!/bin/bash

echo "🚀 Setting up Automated Development Guidelines..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
print_info "Installing development dependencies..."
npm install --legacy-peer-deps
if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Initialize Husky
print_info "Setting up Git hooks with Husky..."
npm run prepare
if [ $? -eq 0 ]; then
    print_status "Git hooks configured successfully"
else
    print_warning "Git hooks setup failed (this is OK if not in a Git repository)"
fi

# Run initial quality check
print_info "Running initial quality assessment..."
npm run quality
if [ $? -eq 0 ]; then
    print_status "Initial quality check passed"
else
    print_warning "Some quality checks failed - this is normal for existing code"
    print_info "Running auto-fixes..."
    npm run lint:fix
    npm run format
    print_status "Auto-fixes applied"
fi

# Set up VS Code settings
print_info "Configuring VS Code settings..."
mkdir -p .vscode

cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.strictness": "strict",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
EOF

cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "vitest.explorer"
  ]
}
EOF

print_status "VS Code configuration created"

# Create launch configuration for debugging
cat > .vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
EOF

print_status "VS Code debugging configuration created"

# Create development environment file template
if [ ! -f ".env.example" ]; then
cat > .env.example << 'EOF'
# Development Environment Configuration
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE=Frontend Application
VITE_ENABLE_MOCK_API=true
EOF
print_status "Environment template created"
fi

# Create gitignore additions
if [ -f ".gitignore" ]; then
    # Add to existing gitignore
    cat >> .gitignore << 'EOF'

# Development Guidelines
.env.local
.env.development.local
.env.test.local
.env.production.local

# VS Code
.vscode/settings.json.bak

# Coverage reports
coverage/
.nyc_output/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# ESLint cache
.eslintcache

# Prettier cache
.prettiercache
EOF
else
    print_warning ".gitignore not found - please create one manually"
fi

# Final checks
print_info "Running final validation..."
echo ""

# Check if all tools are working
print_info "Validating tool setup..."

# Check TypeScript
if npm run type-check > /dev/null 2>&1; then
    print_status "TypeScript configuration valid"
else
    print_warning "TypeScript configuration needs attention"
fi

# Check ESLint
if npm run lint > /dev/null 2>&1; then
    print_status "ESLint configuration valid"
else
    print_warning "ESLint found issues (run 'npm run lint:fix' to auto-fix)"
fi

# Check Prettier
if npm run format:check > /dev/null 2>&1; then
    print_status "Code formatting is consistent"
else
    print_warning "Code formatting needs attention (run 'npm run format' to fix)"
fi

# Check if tests run
if npm run test:run > /dev/null 2>&1; then
    print_status "Test suite is functional"
else
    print_warning "Some tests are failing"
fi

echo ""
print_status "🎉 Automated Development Guidelines setup complete!"
echo ""
print_info "Next steps:"
echo "  1. Review the DEVELOPMENT_GUIDELINES.md file"
echo "  2. Install recommended VS Code extensions"
echo "  3. Run 'npm run dev' to start development"
echo "  4. Make a test commit to verify pre-commit hooks"
echo ""
print_info "Available commands:"
echo "  • npm run quality      - Run all quality checks"
echo "  • npm run dev          - Start development server"
echo "  • npm run test:ui      - Open test UI"
echo "  • npm run lint:fix     - Auto-fix code issues"
echo "  • npm run format       - Format all code"
echo ""
print_status "Happy coding! 🚀"
