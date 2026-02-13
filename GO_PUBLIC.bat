@echo off
cd /d "%~dp0"
echo ===================================================
echo   JEBALI SWEET - MODE PUBLIC (CONNECTE)
echo ===================================================
echo.
echo ETAPE 1 : Lancement du Backend...
echo ---------------------------------------------------
start "Jebali Backend Server" cmd /k "cd backend && npm start"

echo.
echo ETAPE 2 : Attente du demarrage (5 secondes)...
timeout /t 5 /nobreak >nul

echo.
echo ETAPE 3 : Lancement de Ngrok (URL FIXE)...
echo ---------------------------------------------------
echo URL: https://nakisha-unidyllic-shona.ngrok-free.dev
echo ---------------------------------------------------
echo.
call npx ngrok http --domain=nakisha-unidyllic-shona.ngrok-free.dev 5000
pause
