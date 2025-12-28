@echo off
echo ========================================
echo Initializing Database Schema
echo ========================================
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Step 1: Initializing Flask migrations...
flask db init
echo.

echo Step 2: Creating migration files...
flask db migrate -m "Initial migration"
echo.

echo Step 3: Applying migrations to database...
flask db upgrade
echo.

echo ========================================
echo ✓ Database schema initialized!
echo ========================================
echo.
echo Tables created:
echo - users
echo - clients
echo - cases
echo - documents
echo - calendar_events
echo.
pause
