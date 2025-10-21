@echo off
echo ========================================
echo Cleaning up project for deployment
echo ========================================
echo.

echo [1/4] Removing node_modules directory...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo ✓ node_modules removed
) else (
    echo ✓ node_modules not found
)

echo.
echo [2/4] Removing .next directory...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✓ .next removed
) else (
    echo ✓ .next not found
)

echo.
echo [3/4] Removing build artifacts...
del /q "*.log" 2>nul
del /q "package-lock.json" 2>nul
echo ✓ Build artifacts removed

echo.
echo [4/4] Keeping only necessary files...
echo ✓ Keeping HTML files
echo ✓ Keeping JS files
echo ✓ Keeping CSS files
echo ✓ Keeping configuration files

echo.
echo ========================================
echo Cleanup complete!
echo Project is now ready for deployment.
echo Size should be under 5 MB.
echo ========================================
pause