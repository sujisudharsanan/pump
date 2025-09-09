@echo off
REM Clean Project Script - Fixes common VS Code/Node.js errors
REM Usage: clean_project.bat

title Clean Project Script - VS Code Error Fixer

echo.
echo 🧹 Clean Project Script - VS Code Error Fixer
echo ==============================================
echo.

REM Check if we're in a Node.js project
if not exist "package.json" (
    echo ❌ No package.json found. Are you in a Node.js project directory?
    pause
    exit /b 1
)

echo ✅ Found package.json - proceeding with cleanup...
echo.

REM Step 1: Check for node_modules and package-lock.json
set NODE_MODULES_EXISTS=false
set PACKAGE_LOCK_EXISTS=false
set YARN_LOCK_EXISTS=false

if exist "node_modules" (
    set NODE_MODULES_EXISTS=true
    echo ⚠️  Found node_modules directory
)

if exist "package-lock.json" (
    set PACKAGE_LOCK_EXISTS=true
    echo ⚠️  Found package-lock.json file
)

if exist "yarn.lock" (
    set YARN_LOCK_EXISTS=true
    echo ⚠️  Found yarn.lock file
)

REM Step 2: Confirmation prompt
if "%NODE_MODULES_EXISTS%"=="true" goto :confirm
if "%PACKAGE_LOCK_EXISTS%"=="true" goto :confirm
if "%YARN_LOCK_EXISTS%"=="true" goto :confirm
goto :no_cleanup

:confirm
echo.
echo This script will:
if "%NODE_MODULES_EXISTS%"=="true" echo   - Delete node_modules directory
if "%PACKAGE_LOCK_EXISTS%"=="true" echo   - Delete package-lock.json file
if "%YARN_LOCK_EXISTS%"=="true" echo   - Delete yarn.lock file
echo   - Clear npm cache
echo   - Reinstall all dependencies
echo.

set /p CONFIRM="Do you want to continue? (y/N): "
if /i "%CONFIRM%"=="y" goto :cleanup
if /i "%CONFIRM%"=="yes" goto :cleanup

echo ✅ Operation cancelled by user.
pause
exit /b 0

:cleanup
echo.
echo ✅ Starting cleanup process...
echo.

REM Delete node_modules
if "%NODE_MODULES_EXISTS%"=="true" (
    echo ✅ Removing node_modules directory...
    rmdir /s /q "node_modules" 2>nul
    if exist "node_modules" (
        echo ❌ Failed to remove node_modules
        pause
        exit /b 1
    ) else (
        echo ✅ ✓ node_modules removed successfully
    )
)

REM Delete package-lock.json
if "%PACKAGE_LOCK_EXISTS%"=="true" (
    echo ✅ Removing package-lock.json...
    del "package-lock.json" 2>nul
    if exist "package-lock.json" (
        echo ❌ Failed to remove package-lock.json
        pause
        exit /b 1
    ) else (
        echo ✅ ✓ package-lock.json removed successfully
    )
)

REM Delete yarn.lock
if "%YARN_LOCK_EXISTS%"=="true" (
    echo ✅ Removing yarn.lock...
    del "yarn.lock" 2>nul
    if not exist "yarn.lock" (
        echo ✅ ✓ yarn.lock removed successfully
    )
)

goto :cache_clean

:no_cleanup
echo ✅ No node_modules or package-lock.json found to clean.

:cache_clean
REM Step 3: Clear npm cache
echo.
echo ✅ Clearing npm cache...
call npm cache clean --force
if %errorlevel% neq 0 (
    echo ❌ Failed to clear npm cache
    pause
    exit /b 1
)
echo ✅ ✓ npm cache cleared successfully

REM Step 4: Reinstall dependencies
echo.
echo ✅ Reinstalling dependencies...
echo ✅ This may take a few minutes...
echo.

call npm install
if %errorlevel% neq 0 (
    echo.
    echo ❌ Failed to install dependencies
    echo ❌ Please check your internet connection and try again
    pause
    exit /b 1
)

echo.
echo ✅ ✓ Dependencies installed successfully
echo.
echo ✅ 🎉 Project cleanup completed successfully!
echo.
echo ✅ Next steps:
echo   - Restart VS Code
echo   - Run 'npm start' or 'npm run dev' to start your project
echo   - Check that TypeScript/ESLint errors are resolved
echo.
echo ✅ Cleanup script finished. Happy coding! 🚀
echo.
pause
