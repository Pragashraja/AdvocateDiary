@echo off
echo ========================================
echo Installing Python Packages
echo ========================================
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing updated packages...
echo This may take a few minutes...
echo.

pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Failed to install some packages
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ All packages installed successfully!
========================================
echo.
echo Installed packages:
pip list | findstr /I "Flask PyMySQL SQLAlchemy Pillow"
echo.
pause
