@echo off
echo ========================================
echo    AskEarn Login Fix Tool
echo ========================================
echo.

echo [1/3] Checking database...
node fix-login.js

echo.
echo ========================================
echo.
echo If you saw any errors above, we'll fix them now.
echo.
set /p continue="Do you want to reset the database? (y/n): "

if /i "%continue%"=="y" (
    echo.
    echo [2/3] Resetting database...
    if exist server\askearn.db del server\askearn.db
    npm run seed
    
    echo.
    echo [3/3] Database reset complete!
    echo.
    echo ========================================
    echo    You can now login with:
    echo ========================================
    echo    alice@test.com / password123
    echo    bob@test.com / password123
    echo    admin@askearn.com / admin123
    echo ========================================
    echo.
    echo Run "npm run dev" to start the server
    echo.
) else (
    echo.
    echo Skipped database reset.
    echo If you're still having issues, run this script again and choose 'y'
    echo.
)

pause
