# ⚡ Quickstart

## TL;DR - Быстрый старт за 5 минут

### 1. Убедитесь что установлены требования
```bash
node -v    # Node 18+
npm -v     # npm 8+
psql -v    # PostgreSQL 14+ (или установите)
```

### 2. Подготовьте БД
```bash
# Создайте базу данных PostgreSQL
createdb -U postgres team_management

# Или в psql:
# CREATE DATABASE team_management;
```

### 3. Установите зависимости
```bash
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 4. Инициализируйте БД (бэкенд)
```bash
cd backend
npx prisma migrate dev --name init
cd ..
```

### 5. Запустите оба сервера

**Вариант A - 2 терминала:**
```bash
# Терминал 1
cd backend && npm run dev

# Терминал 2
cd frontend && npm run dev
```

**Вариант B - 1 скрипт:**
```bash
chmod +x run.sh
./run.sh
```

### 6. Откройте в браузере
```
http://localhost:5173
```

## 🎯 Готово!

**Скрин:**
- Фронтенд: http://localhost:5173 ✅
- Бэкенд: http://localhost:3000 ✅
- Тестовый аккаунт? Создайте прямо в приложении 📝

## 📱 Первые шаги в приложении

1. ✍️ **Зарегистрируйтесь** - введите email, пароль, имя
2. 👥 **Создайте команду** - дайте ей название
3. 📋 **Добавляйте задачи** - заполните название и описание
4. 👨‍💼 **Пригласите друга** - поделитесь кодом команды
5. 💬 **Общайтесь в чате** - отправляйте сообщения в реал-тайм

## 🆘 Проблемы?

### Ошибка подключения БД
```bash
# Проверьте что PostgreSQL запущен
brew services list          # macOS
sudo systemctl status postgresql  # Linux

# Проверьте .env файл в папке backend
cat backend/.env
```

### Ошибка "port already in use"
```bash
# Найдите процесс на порту
lsof -i :3000   # бэкенд
lsof -i :5173   # фронтенд

# Завершите его
kill -9 <PID>
```

### Зависимости не установились
```bash
# Полная переустановка
rm -rf frontend/node_modules backend/node_modules
npm cache clean --force
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

## 📖 Дальше изучайте:

- **SETUP.md** - детальная инструкция установки
- **API.md** - примеры всех API запросов
- **DEVELOPER.md** - архитектура и советы для разработки

---

**Вопросы?** Проверьте логи терминала или откройте консоль браузера (F12)
