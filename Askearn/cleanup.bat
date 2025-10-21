@echo off
echo ========================================
echo Cleaning Up Unnecessary Files
echo ========================================
echo.

echo Removing Railway files...
del /Q deploy-railway.bat 2>nul
del /Q deploy-to-railway.bat 2>nul
del /Q RAILWAY-SETUP.md 2>nul

echo Removing MongoDB files...
del /Q add-mongodb.bat 2>nul
del /Q MONGODB-SETUP.md 2>nul
del /Q server\db-mongodb.js 2>nul

echo Removing Supabase files...
del /Q SUPABASE-QUICK-START.md 2>nul
del /Q test-supabase.js 2>nul
del /Q fix-database-url.bat 2>nul
del /Q fix-env-all.bat 2>nul
del /Q setup-env-vars.bat 2>nul

echo Removing OAuth files...
del /Q setup-oauth.bat 2>nul
del /Q OAUTH-SETUP-GUIDE.md 2>nul
del /Q OAUTH-COMPLETE.md 2>nul
del /Q FIREBASE-SETUP.md 2>nul
del /Q FIREBASE-COMPLETE.md 2>nul

echo Removing NextAuth files...
rmdir /S /Q app\api\auth\[...nextauth] 2>nul

echo Removing admin script...
del /Q create-admin.js 2>nul

echo Removing old login page...
del /Q app\login\page-simple.js 2>nul

echo.
echo ========================================
echo Cleanup Complete!
echo ========================================
echo.
echo Remaining files:
echo - build-for-netlify.bat (for building)
echo - NETLIFY-FIREBASE-SETUP.md (setup guide)
echo - DEPLOY-NETLIFY-FIREBASE.md (quick guide)
echo.
pause
