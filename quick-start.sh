#!/bin/bash

# Быстрый старт для разработки

set -e

echo "🔧 Quick Dev Setup для Team Management App"
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 18+ перед продолжением."
    exit 1
fi

echo "✅ Node.js $(node -v) обнаружен"

# Проверка npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"
    exit 1
fi

echo "✅ npm $(npm -v) обнаружен"
echo ""

# Установка зависимостей
echo "📦 Установка зависимостей..."
echo ""

if [ -d "frontend/node_modules" ]; then
    echo "✅ Фронтенд зависимости уже установлены"
else
    echo "🔄 Установка зависимостей фронтенда..."
    cd frontend && npm install && cd ..
fi

if [ -d "backend/node_modules" ]; then
    echo "✅ Бэкенд зависимости уже установлены"
else
    echo "🔄 Установка зависимостей бэкенда..."
    cd backend && npm install && cd ..
fi

echo ""
echo "✨ Готово к разработке!"
echo ""
echo "🚀 Для запуска используйте:"
echo ""
echo "   Терминал 1 (Бэкенд):"
echo "   cd backend && npm run dev"
echo ""
echo "   Терминал 2 (Фронтенд):"
echo "   cd frontend && npm run dev"
echo ""
echo "   Или запустите скрипт:"
echo "   ./run.sh"
echo ""
echo "📖 Детальные инструкции: SETUP.md"
