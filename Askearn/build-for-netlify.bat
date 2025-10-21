@echo off
echo ========================================
echo Building for Netlify Deployment
echo ========================================
echo.

echo Step 1: Building Next.js app...
call npm run build

echo.
echo Step 2: Exporting static files...
call npm run export

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Static files are in the "out" folder
echo.
echo Next Steps:
echo 1. Go to https://app.netlify.com/drop
echo 2. Drag and drop the "out" folder
echo 3. Done! Your site will be live!
echo.
pause
