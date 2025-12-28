@echo off
echo ========================================
echo Installing React Frontend Packages
echo ========================================
echo.
echo This may take 2-3 minutes...
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Failed to install packages
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ Frontend packages installed!
echo ========================================
echo.
echo Ready to start the React development server!
echo.
pause
