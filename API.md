# Team Management API Examples

## 🔐 Аутентификация

### Регистрация нового пользователя
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

**Ответ:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx1y2z3a4b5c6d7e8f9g0h1",
    "email": "user@example.com",
    "name": "John Doe",
    "teamId": null
  }
}
```

### Вход пользователя
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### Получение текущего пользователя
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 👥 Управление командой

### Создание новой команды
```bash
curl -X POST http://localhost:3000/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Frontend Team"
  }'
```

**Ответ:**
```json
{
  "id": "team_id_123",
  "name": "Frontend Team",
  "code": "ABC123",
  "members": [
    {
      "id": "user_id_1",
      "email": "user@example.com",
      "name": "John Doe"
    }
  ]
}
```

### Получение команды текущего пользователя
```bash
curl -X GET http://localhost:3000/teams/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Присоединение к команде по коду
```bash
curl -X POST http://localhost:3000/teams/join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "code": "ABC123"
  }'
```

## 📋 Управление задачами

### Получение всех задач команды
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Ответ:**
```json
[
  {
    "id": "task_1",
    "title": "Implement authentication",
    "description": "Set up JWT authentication",
    "status": "in-progress",
    "assignedTo": {
      "id": "user_1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "teamId": "team_1",
    "createdAt": "2026-05-14T10:30:00Z"
  }
]
```

### Создание новой задачи
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Design homepage",
    "description": "Create responsive homepage design",
    "teamId": "team_id_123",
    "status": "todo"
  }'
```

### Обновление задачи
```bash
curl -X PATCH http://localhost:3000/tasks/task_id_123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Design homepage",
    "description": "Create responsive homepage design",
    "status": "in-progress",
    "assignedToId": "user_id_456"
  }'
```

### Удаление задачи
```bash
curl -X DELETE http://localhost:3000/tasks/task_id_123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 💬 WebSocket (Real-time Chat)

### Подключение к WebSocket
```javascript
const token = localStorage.getItem('token');
const ws = new WebSocket(`ws://localhost:3000/ws?token=${token}`);

ws.onopen = () => {
  console.log('Connected to WebSocket');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Message received:', message);
};
```

### Отправка сообщения
```javascript
const message = {
  type: 'message',
  message: {
    id: Date.now().toString(),
    taskId: 'task_123',
    userId: 'user_123',
    userName: 'John Doe',
    message: 'This is a test message',
    createdAt: new Date().toISOString()
  }
};

ws.send(JSON.stringify(message));
```

## 🧪 Тестирование с Postman/Insomnia

1. **Импортируйте коллекцию** (скопируйте запросы выше)
2. **Установите переменные**:
   - `{{base_url}}`: http://localhost:3000
   - `{{token}}`: Получите из ответа login
   - `{{team_id}}`: Получите из ответа create team
   - `{{task_id}}`: Получите из ответа create task

3. **Используйте в запросах**:
   ```
   Authorization: Bearer {{token}}
   ```

## 📊 Статус коды

| Код | Значение |
|-----|----------|
| 200 | OK - Успешный запрос |
| 201 | Created - Ресурс создан |
| 400 | Bad Request - Ошибка в запросе |
| 401 | Unauthorized - Требуется аутентификация |
| 403 | Forbidden - Недостаточно прав |
| 404 | Not Found - Ресурс не найден |
| 500 | Server Error - Ошибка сервера |

## 🔑 Заголовки запроса

Все запросы кроме `/auth/register` и `/auth/login` требуют:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## 💡 Примеры сценариев

### Сценарий 1: Новый пользователь присоединяется к команде

```bash
# 1. Регистрация
TOKEN=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "pass123",
    "name": "New User"
  }' | jq -r '.token')

# 2. Присоединение к команде (зная код)
curl -X POST http://localhost:3000/teams/join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "code": "ABC123"
  }'

# 3. Получение задач команды
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer $TOKEN"
```

### Сценарий 2: Создание и управление задачей

```bash
# 1. Создание задачи
TASK=$(curl -s -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "teamId": "team_id",
    "status": "todo"
  }')

TASK_ID=$(echo $TASK | jq -r '.id')

# 2. Обновление статуса
curl -X PATCH http://localhost:3000/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "in-progress"
  }'

# 3. Удаление задачи
curl -X DELETE http://localhost:3000/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

**Совет**: Используйте `jq` для красивого вывода JSON:
```bash
curl ... | jq '.'
```
