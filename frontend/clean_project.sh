#!/bin/bash

# Clean Project Script - Fixes common VS Code/Node.js errors
# Usage: ./clean_project.sh

echo "🧹 Clean Project Script - VS Code Error Fixer"
echo "=============================================="
echo ""

# Function to print colored messages
print_message() {
    echo "✅ $1"
}

print_warning() {
    echo "⚠️  $1"
}

print_error() {
    echo "❌ $1"
}

# Check if we're in a Node.js project
if [ ! -f "package.json" ]; then
    print_error "No package.json found. Are you in a Node.js project directory?"
    exit 1
fi

print_message "Found package.json - proceeding with cleanup..."
echo ""

# Step 1: Check for node_modules and package-lock.json
NODE_MODULES_EXISTS=false
PACKAGE_LOCK_EXISTS=false

if [ -d "node_modules" ]; then
    NODE_MODULES_EXISTS=true
    print_warning "Found node_modules directory"
fi

if [ -f "package-lock.json" ]; then
    PACKAGE_LOCK_EXISTS=true
    print_warning "Found package-lock.json file"
fi

if [ -f "yarn.lock" ]; then
    print_warning "Found yarn.lock file"
fi

# Step 2: Confirmation prompt
if [ "$NODE_MODULES_EXISTS" = true ] || [ "$PACKAGE_LOCK_EXISTS" = true ]; then
    echo ""
    echo "This script will:"
    [ "$NODE_MODULES_EXISTS" = true ] && echo "  - Delete node_modules directory"
    [ "$PACKAGE_LOCK_EXISTS" = true ] && echo "  - Delete package-lock.json file"
    echo "  - Clear npm cache"
    echo "  - Reinstall all dependencies"
    echo ""
    
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_message "Operation cancelled by user."
        exit 0
    fi
    
    echo ""
    print_message "Starting cleanup process..."
    echo ""
    
    # Delete node_modules
    if [ "$NODE_MODULES_EXISTS" = true ]; then
        print_message "Removing node_modules directory..."
        rm -rf node_modules
        if [ $? -eq 0 ]; then
            print_message "✓ node_modules removed successfully"
        else
            print_error "Failed to remove node_modules"
            exit 1
        fi
    fi
    
    # Delete package-lock.json
    if [ "$PACKAGE_LOCK_EXISTS" = true ]; then
        print_message "Removing package-lock.json..."
        rm -f package-lock.json
        if [ $? -eq 0 ]; then
            print_message "✓ package-lock.json removed successfully"
        else
            print_error "Failed to remove package-lock.json"
            exit 1
        fi
    fi
    
    # Delete yarn.lock if it exists
    if [ -f "yarn.lock" ]; then
        print_message "Removing yarn.lock..."
        rm -f yarn.lock
        print_message "✓ yarn.lock removed successfully"
    fi
else
    print_message "No node_modules or package-lock.json found to clean."
fi

# Step 3: Clear npm cache
echo ""
print_message "Clearing npm cache..."
npm cache clean --force
if [ $? -eq 0 ]; then
    print_message "✓ npm cache cleared successfully"
else
    print_error "Failed to clear npm cache"
    exit 1
fi

# Step 4: Reinstall dependencies
echo ""
print_message "Reinstalling dependencies..."
print_message "This may take a few minutes..."
echo ""

npm install
if [ $? -eq 0 ]; then
    echo ""
    print_message "✓ Dependencies installed successfully"
    echo ""
    print_message "🎉 Project cleanup completed successfully!"
    echo ""
    print_message "Next steps:"
    echo "  - Restart VS Code"
    echo "  - Run 'npm start' or 'npm run dev' to start your project"
    echo "  - Check that TypeScript/ESLint errors are resolved"
else
    echo ""
    print_error "Failed to install dependencies"
    print_error "Please check your internet connection and try again"
    exit 1
fi

echo ""
print_message "Cleanup script finished. Happy coding! 🚀"
