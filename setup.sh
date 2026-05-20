#!/bin/bash

# 🚀 Team Management App - Quick Start Guide
# Запустите этот скрипт для полной инициализации приложения

set -e  # Выход при ошибке

echo "🎯 Team Management App - Setup"
echo "================================"
echo ""

# Проверка зависимостей
echo "✓ Проверка зависимостей..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите его с https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL не установлен. Установите его:"
    echo "   macOS: brew install postgresql"
    echo "   Linux: sudo apt-get install postgresql"
    echo "   Windows: https://www.postgresql.org/download/windows/"
    echo ""
    echo "После установки создайте БД:"
    echo "   createdb -U postgres team_management"
fi

echo ""
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Создание .env файлов если их нет
echo "✓ Проверка конфигурации..."

if [ ! -f backend/.env ]; then
    echo "📝 Создание backend/.env..."
    cat > backend/.env << EOF
DATABASE_URL="postgresql://postgres@localhost/team_management"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="development"
PORT=3000
EOF
    echo "✅ backend/.env создан"
fi

if [ ! -f frontend/.env ]; then
    echo "📝 Создание frontend/.env..."
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3000
EOF
    echo "✅ frontend/.env создан"
fi

echo ""

# Установка зависимостей
echo "📦 Установка зависимостей..."

echo "  • frontend..."
cd frontend
npm install > /dev/null 2>&1
cd ..

echo "  • backend..."
cd backend
npm install > /dev/null 2>&1
cd ..

echo "✅ Зависимости установлены"
echo ""

# Инициализация БД
echo "🗄️  Инициализация базы данных..."

cd backend

# Создание БД если её нет
if ! psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'team_management'" | grep -q 1; then
    echo "  • Создание БД team_management..."
    createdb -U postgres team_management 2>/dev/null || true
fi

# Применение миграций
echo "  • Применение миграций..."
npx prisma migrate deploy > /dev/null 2>&1 || true

echo "✅ БД инициализирована"
cd ..

echo ""
echo "🎉 Готово к запуску!"
echo ""
echo "🚀 Запуск приложения:"
echo "   ./run.sh"
echo ""
echo "📝 Или вручную (в разных терминалах):"
echo "   Терминал 1: cd backend && npm run dev"
echo "   Терминал 2: cd frontend && npm run dev"
echo ""
echo "🌐 Откройте: http://localhost:5173"
echo ""
