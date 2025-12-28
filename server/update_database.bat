@echo off
echo ========================================
echo Updating Database Schema
echo ========================================
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo Creating migration for new case fields...
flask db migrate -m "Add new case fields: client details, opposite party, party type, remarks"
echo.

echo Applying migration to database...
flask db upgrade
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo ✓ Database updated successfully!
    echo ========================================
    echo.
    echo New fields added to cases table:
    echo - client_name, client_address, client_phone
    echo - opposite_party, otherside_counsel
    echo - party_type
    echo - remarks
) else (
    echo ========================================
    echo ❌ ERROR: Database update failed
    echo ========================================
)

echo.
pause
