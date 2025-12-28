@echo off
echo ========================================
echo Creating Advocate Diary Database
echo ========================================
echo.

REM Try common MySQL installation paths
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pRaja@2025 < setup_database.sql
    goto :done
)

if exist "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" (
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -pRaja@2025 < setup_database.sql
    goto :done
)

if exist "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pRaja@2025 < setup_database.sql
    goto :done
)

REM If MySQL is in PATH
mysql -u root -pRaja@2025 < setup_database.sql 2>nul
if %errorlevel% equ 0 goto :done

echo.
echo ERROR: Could not find MySQL installation.
echo Please run this command manually:
echo.
echo mysql -u root -pRaja@2025 ^< setup_database.sql
echo.
pause
exit /b 1

:done
echo.
echo ========================================
echo Database setup completed successfully!
echo ========================================
echo.
pause
