@echo off
echo ========================================
echo Installing Missing Package
echo ========================================
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing flask-marshmallow...
pip install flask-marshmallow==1.2.1

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Failed to install package
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ Package installed successfully!
echo ========================================
echo.
pause
