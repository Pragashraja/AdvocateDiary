@echo off
echo ========================================
echo Setting Up Python Backend Environment
echo ========================================
echo.

echo Checking for Python installation...
echo.

REM Try 'py' command (Windows Python Launcher)
py --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Found Python using 'py' command
    set PYTHON_CMD=py
    goto :create_venv
)

REM Try 'python' command
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Found Python using 'python' command
    set PYTHON_CMD=python
    goto :create_venv
)

REM Try 'python3' command
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Found Python using 'python3' command
    set PYTHON_CMD=python3
    goto :create_venv
)

echo.
echo ❌ ERROR: Could not find Python
echo.
echo Please try these commands in a NEW Command Prompt:
echo   py --version
echo   python --version
echo   python3 --version
echo.
echo If none work, Python may not be in your PATH.
echo.
pause
exit /b 1

:create_venv
echo Using command: %PYTHON_CMD%
%PYTHON_CMD% --version
echo.

echo Step 1: Creating virtual environment...
%PYTHON_CMD% -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Failed to create virtual environment
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
