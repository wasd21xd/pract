#!/bin/bash

echo "🗄️  Setting up PostgreSQL database..."

# Создание папки для миграций если её нет
mkdir -p backend/prisma/migrations

# Генерация Prisma клиента
cd backend
npx prisma generate

# Применение миграций
echo "📝 Applying migrations..."
npx prisma migrate deploy

# Если миграции не существуют, создаём новую
if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations)" ]; then
  echo "🆕 Creating initial migration..."
  npx prisma migrate dev --name init
else
  echo "✅ Database initialized successfully!"
fi

echo ""
echo "✨ Database setup complete!"
