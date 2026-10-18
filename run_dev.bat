@echo off
title Waqas Mehmood Platform (React + Laravel)
color 0b

echo ===================================================================
echo     WAQAS MEHMOOD PLATFORM - STARTING LOCAL ENVIRONMENT
echo ===================================================================
echo.

set PATH=C:\Program Files\nodejs;C:\Users\Admin\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe;C:\Users\Admin\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;C:\Users\Admin\AppData\Local\Microsoft\WinGet\Packages\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\bin;%PATH%

echo [1/2] Starting Laravel API Backend on http://127.0.0.1:8000 ...
start "Laravel Backend API" cmd /k "cd /d %~dp0backend && php.exe artisan serve --port=8000"

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "React Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo All services launched!
echo Open your browser at: http://localhost:5173
echo.
pause
