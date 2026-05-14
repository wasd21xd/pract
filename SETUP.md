# 🚀 Запуск Team Management App

## Требования

- **Node.js** 18+
- **PostgreSQL** 14+
- **npm** или **yarn**

## Инструкция по запуску

### Шаг 1: Установка PostgreSQL

#### macOS (с Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

#### Windows
Скачайте и установите с [postgresql.org](https://www.postgresql.org/download/windows/)

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Шаг 2: Создание базы данных

```bash
# Подключитесь к PostgreSQL
psql -U postgres

# Создайте БД
CREATE DATABASE team_management;

# Выход
\q
```

Или используйте команду одной строкой:
```bash
createdb -U postgres team_management
```

### Шаг 3: Установка зависимостей

```bash
# Перейдите в корневую папку проекта
cd practicee

# Установка зависимостей фронтенда
cd frontend
npm install
cd ..

# Установка зависимостей бэкенда
cd backend
npm install
cd ..
```

### Шаг 4: Настройка переменных окружения

Backend `.env` файл уже создан со следующими переменными:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/team_management"
JWT_SECRET="super-secret-key-change-in-production-12345"
PORT=3000
NODE_ENV=development
```

**⚠️ Важно**: Если у вас другой пароль для PostgreSQL, обновите `DATABASE_URL`.

### Шаг 5: Инициализация базы данных

```bash
cd backend

# Генерируем Prisma клиента
npx prisma generate

# Создаём таблицы в БД
npx prisma migrate dev --name init

# Проверяем БД
npx prisma studio  # (опционально) Откроет веб-интерфейс Prisma
```

### Шаг 6: Запуск приложения

#### Вариант 1: Запуск в разных терминалах (рекомендуется для разработки)

**Терминал 1 - Бэкенд:**
```bash
cd backend
npm run dev
```

Ожидается вывод:
```
Server running on http://localhost:3000
```

**Терминал 2 - Фронтенд:**
```bash
cd frontend
npm run dev
```

Ожидается вывод:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

#### Вариант 2: Запуск через скрипт (одна команда)

```bash
chmod +x run.sh
./run.sh
```

## 🎯 После запуска

1. Откройте http://localhost:5173 в браузере
2. Создайте новый аккаунт или войдите
3. Создайте команду или присоединитесь к существующей по коду
4. Начните добавлять задачи!

## 🔗 Доступные URL

- **Фронтенд**: http://localhost:5173
- **Бэкенд API**: http://localhost:3000
- **WebSocket**: ws://localhost:3000

## 📝 Основные функции

✅ Регистрация и вход  
✅ Создание команды  
✅ Приглашение членов по коду  
✅ Управление задачами (создание, редактирование, удаление)  
✅ Отслеживание статуса задач  
✅ Реал-тайм чат через WebSocket  
✅ Отслеживание активности команды  

## 🛠️ Полезные команды

### Backend
```bash
cd backend

# Разработка
npm run dev

# Сборка
npm run build

# Запуск
npm start

# Управление БД
npx prisma studio      # Веб-интерфейс
npx prisma migrate ... # Миграции
npx prisma db reset    # Сброс БД (внимание: удалит данные)
```

### Frontend
```bash
cd frontend

# Разработка
npm run dev

# Сборка
npm run build

# Просмотр собранной версии
npm run preview
```

## 🐛 Решение проблем

### Ошибка "Cannot find module"
```bash
# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

### Ошибка подключения к БД
```bash
# Проверьте что PostgreSQL запущен
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Проверьте DATABASE_URL в .env
```

### Ошибка портов (3000 или 5173 заняты)
```bash
# Найдите процесс на порту (macOS/Linux)
lsof -i :3000
lsof -i :5173

# Завершите процесс
kill -9 <PID>

# Или измените порт в .env (бэкенд) и vite.config.ts (фронтенд)
```

## 📚 Структура проекта

```
practicee/
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── store.ts       # Zustand хранилище
│   │   └── main.tsx
│   └── vite.config.ts
│
└── backend/               # Express + PostgreSQL
    ├── src/
    │   ├── routes/        # API маршруты
    │   └── index.ts       # Главный файл
    ├── prisma/
    │   └── schema.prisma  # Схема БД
    └── package.json
```

## 🔐 Безопасность

**⚠️ Для продакшена:**

1. Измените `JWT_SECRET` на надёжный ключ
2. Установите переменную окружения `NODE_ENV=production`
3. Используйте HTTPS для фронтенда
4. Настройте правильные CORS
5. Используйте переменные окружения для всех чувствительных данных

## 📞 Поддержка

При возникновении проблем:
1. Проверьте консоль браузера (F12)
2. Посмотрите логи терминала
3. Убедитесь что все сервисы запущены
4. Попробуйте пересоздать БД: `npx prisma db reset`

## 🎉 Готово!

Теперь у вас работает полнофункциональное приложение для управления командой!
