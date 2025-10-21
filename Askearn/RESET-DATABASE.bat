@echo off
echo ========================================
echo    FIXING LOGIN ISSUE
echo ========================================
echo.
echo This will reset your database and fix login issues.
echo.
pause

echo.
echo [Step 1/2] Deleting old database...
if exist server\askearn.db (
    del server\askearn.db
    echo ✓ Old database deleted
) else (
    echo ✓ No old database found
)

echo.
echo [Step 2/2] Creating fresh database...
call npm run seed

echo.
echo ========================================
echo    DONE! Login is now fixed!
echo ========================================
echo.
echo You can now login with:
echo   Email: alice@test.com
echo   Password: password123
echo.
echo Or admin:
echo   Email: admin@askearn.com
echo   Password: admin123
echo.
echo Run "npm run dev" to start the server
echo.
pause
