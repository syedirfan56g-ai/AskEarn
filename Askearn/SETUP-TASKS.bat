@echo off
echo ========================================
echo AskEarn Task System Setup
echo ========================================
echo.

echo Step 1: Checking if database exists...
if exist "server\askearn.db" (
    echo Database found!
) else (
    echo Database not found. It will be created automatically.
)
echo.

echo Step 2: Seeding task questions...
echo This will add questions for all 5 task levels.
echo.
call npm run seed-tasks
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Open: http://localhost:3000
echo 3. Sign up and start earning!
echo.
echo Press any key to exit...
pause >nul
