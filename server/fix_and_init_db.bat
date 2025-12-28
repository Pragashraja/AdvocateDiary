@echo off
echo ========================================
echo Fixing and Initializing Database
echo ========================================
echo.

echo Step 1: Cleaning up corrupted migrations folder...
if exist migrations (
    rmdir /s /q migrations
    echo ✓ Removed corrupted migrations folder
)
echo.

echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo Step 3: Installing missing package...
pip install marshmallow-sqlalchemy==1.1.0
echo.

echo Step 4: Initializing Flask migrations...
flask db init
echo.

echo Step 5: Creating migration files...
flask db migrate -m "Initial migration"
echo.

echo Step 6: Applying migrations to database...
flask db upgrade
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo ✓ Database initialized successfully!
    echo ========================================
    echo.
    echo Tables created in MySQL:
    echo - users
    echo - clients
    echo - cases
    echo - documents
    echo - calendar_events
) else (
    echo ========================================
    echo ❌ ERROR: Database initialization failed
    echo ========================================
)

echo.
pause
