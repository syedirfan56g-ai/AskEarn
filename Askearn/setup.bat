@echo off
echo ========================================
echo AskEarn Setup Script
echo ========================================
echo.

echo Installing dependencies...
call npm install

echo.
echo Seeding database...
call npm run seed

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To start the app, run: npm run dev
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Demo accounts:
echo - alice@test.com / password123
echo - bob@test.com / password123
echo.
pause
