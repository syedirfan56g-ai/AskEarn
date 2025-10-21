@echo off
echo Testing if backend server is running...
echo.

curl http://localhost:5000/api/questions 2>nul

if %errorlevel% equ 0 (
    echo.
    echo ✅ Backend server is RUNNING!
    echo.
) else (
    echo.
    echo ❌ Backend server is NOT running!
    echo.
    echo Please run: npm run dev
    echo.
)

pause
