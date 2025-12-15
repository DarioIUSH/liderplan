@echo off
REM Script para iniciar el proyecto completo (Frontend + Backend)

echo.
echo ========================================
echo  Iniciando LiderPlan Full Stack
echo ========================================
echo.

REM Variables
set FRONTEND_DIR=líderplan (1)
set BACKEND_DIR=backend

echo [1] Abriendo carpeta Backend...
start cmd /k "cd /d "%cd%\%BACKEND_DIR%" && npm run dev"

echo [2] Esperando 3 segundos...
timeout /t 3 /nobreak

echo [3] Abriendo carpeta Frontend...
start cmd /k "cd /d "%cd%\%FRONTEND_DIR%" && npm run dev"

echo.
echo ========================================
echo  Servidores iniciados:
echo  - Frontend: http://localhost:3000
echo  - Backend:  http://localhost:5000
echo ========================================
echo.

REM Abrir navegador
start http://localhost:3000

echo Presiona cualquier tecla para cerrar esta ventana...
pause
