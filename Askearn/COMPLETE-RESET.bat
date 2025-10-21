@echo off
cls
echo ========================================
echo    ASKEARN - COMPLETE FIX
echo ========================================
echo.
echo Ye script sab kuch fix kar degi!
echo.
pause

echo.
echo [1/5] Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo ✓ Done

echo.
echo [2/5] Deleting old database...
if exist server\askearn.db (
    del /F server\askearn.db
    echo ✓ Old database deleted
) else (
    echo ✓ No old database found
)

echo.
echo [3/5] Deleting .next folder...
if exist .next (
    rmdir /S /Q .next
    echo ✓ .next deleted
) else (
    echo ✓ No .next folder
)

echo.
echo [4/5] Creating fresh database...
call npm run seed
echo.

echo.
echo [5/5] Starting server...
echo.
echo ========================================
echo Server starting...
echo ========================================
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Wait for "Ready" message, then:
echo 1. Open: http://localhost:3000/login
echo 2. Email: alice@test.com
echo 3. Password: password123
echo.
echo ========================================
echo.

start cmd /k "npm run dev"

echo.
echo ✓ Server started in new window!
echo.
echo Check the new terminal window for "Ready" message
echo Then try logging in!
echo.
pause
