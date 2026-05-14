#!/bin/bash

# Запуск бэкенда и фронтенда одновременно

echo "🚀 Запуск Team Management App..."
echo ""

# Запуск бэкенда в фоне
echo "📦 Запуск бэкенда на порту 3000..."
cd backend && npm run dev &
BACKEND_PID=$!

# Небольшая задержка для инициализации бэкенда
sleep 3

# Запуск фронтенда в фоне
echo "⚛️  Запуск фронтенда на порту 5173..."
cd /Users/wasd/WebstormProjects/untitled50/practicee/frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Оба сервера запущены!"
echo ""
echo "Frontend:  http://localhost:5173"
echo "Backend:   http://localhost:3000"
echo "WebSocket: ws://localhost:3000"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Ловушка для завершения обоих процессов при выходе
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

# Ждём завершения процессов
wait
