@echo off
echo ========================================================
echo   Launching UniEnrich AI Full Stack System
echo   Backend: http://localhost:8000
echo   Frontend: http://localhost:3000
echo ========================================================
start "UniEnrich AI - Backend" cmd /k "cd backend && python main.py"
timeout /t 2 /nobreak >nul
start "UniEnrich AI - Frontend" cmd /k "cd frontend && npm run dev"
echo Platform started! Open http://localhost:3000 in your browser.
pause
