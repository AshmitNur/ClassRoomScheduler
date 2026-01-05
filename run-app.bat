@echo off
title Class Schedule Management System

echo ========================================
echo   Class Schedule Management System
echo ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    echo.
    call npm install
    echo.
)

echo Starting the development server...
echo.
echo The app will be available at: http://localhost:8080/
echo Press Ctrl+C to stop the server.
echo.

call npm run dev
