@echo off
echo ========================================
echo Starting Flask Backend Server
echo ========================================
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo Starting server on http://localhost:5000...
echo.
echo ========================================
echo Server is running!
echo ========================================
echo.
echo API Endpoints available:
echo - http://localhost:5000/api/health
echo - http://localhost:5000/api/auth/register
echo - http://localhost:5000/api/auth/login
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python run.py
