@echo off
echo Starting CAST DataMart Dashboard...
echo.
echo Frontend will be available at: http://localhost:9999
echo Backend API will be available at: http://localhost:8888
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start the backend server on port 8888
start "DataMart API Server" cmd /k "cd /d %~dp0 && set BACKEND_PORT=8888 && node server/index.js"

REM Wait a moment for the server to start
timeout /t 3 /nobreak >nul

REM Start the frontend on port 9999
start "DataMart Dashboard" cmd /k "cd /d %~dp0 && set PORT=9999 && npm run dev"

echo Both servers are starting...
echo Close this window or press any key to exit
pause >nul