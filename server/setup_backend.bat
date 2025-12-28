@echo off
echo ========================================
echo Setting Up Python Backend Environment
echo ========================================
echo.

echo Step 1: Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Failed to create virtual environment
    echo Please make sure Python is installed
    pause
    exit /b 1
)
echo ✓ Virtual environment created!
echo.

echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
echo ✓ Virtual environment activated!
echo.

echo Step 3: Upgrading pip...
python -m pip install --upgrade pip
echo.

echo Step 4: Installing project dependencies...
echo This may take a few minutes...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo ========================================
echo Backend setup completed successfully!
echo ========================================
echo.
echo Installed packages:
pip list | findstr /I "Flask PyMySQL SQLAlchemy"
echo.
pause
