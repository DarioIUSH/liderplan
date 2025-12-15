#!/bin/bash
# Script para iniciar el proyecto completo (Frontend + Backend)

echo "🚀 Iniciando LíderPlan..."

# Variables
FRONTEND_DIR="líderplan (1)"
BACKEND_DIR="backend"

echo "📦 Iniciando Frontend en puerto 3000..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo "⏳ Esperando 3 segundos..."
sleep 3

echo "📦 Iniciando Backend en puerto 5000..."
cd "../$BACKEND_DIR"
npm run dev &
BACKEND_PID=$!

echo ""
echo "✅ ======================================"
echo "✅ Frontend: http://localhost:3000"
echo "✅ Backend:  http://localhost:5000"
echo "✅ ======================================"
echo ""
echo "Para detener: presiona Ctrl+C en cualquier ventana"
echo ""

# Mantener procesos activos
wait $FRONTEND_PID $BACKEND_PID
