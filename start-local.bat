@echo off
title Waqas Mehmood - Local Development Launcher
echo ==============================================================
echo Starting Waqas Mehmood Platform Locally (Frontend + Backend)
echo ==============================================================
echo.

echo [1/3] Starting Laravel Backend on http://127.0.0.1:8000 ...
start "Waqas Backend (Port 8000)" cmd /k "cd /d %~dp0backend && php artisan serve --port=8000"

echo [2/3] Starting React Vite Frontend on http://localhost:5173 ...
start "Waqas Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo [3/3] Waiting for servers to initialize and launching browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ==============================================================
echo Local Development Environment is RUNNING!
echo - Home:      http://localhost:5173/
echo - Services:  http://localhost:5173/services
echo - About:     http://localhost:5173/about
echo - Contact:   http://localhost:5173/contact
echo - All Tools: http://localhost:5173/all-tools
echo - AI Math:   http://localhost:5173/tools/ai-math-solver
echo - Sub-Tool:  http://localhost:5173/tools/word-counter
echo - API Check: http://127.0.0.1:8000/api/portfolio
echo ==============================================================
echo Keep the command windows open while testing.
pause
