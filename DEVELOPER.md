# 📚 Developer Guide - Team Management App

## Архитектура приложения

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (5173)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Auth | Dashboard | TaskBoard | TeamPanel | ChatPanel │   │
│  └──────────────────────────────────────────────────────┘   │
│                         ↓ HTTP/WS ↓                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Zustand State Management                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Node.js/Express (3000)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Auth Routes  │  Team Routes  │  Task Routes        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          WebSocket Server (ws://localhost:3000)      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Users | Teams | Tasks | ChatMessages                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Структура компонентов

### Frontend Components

```
src/
├── main.tsx              # Точка входа
├── App.tsx              # Главный компонент маршрутизации
├── index.css            # Глобальные стили
├── store.ts             # Zustand хранилище (состояние)
└── components/
    ├── Auth.tsx         # Форма регистрации/входа
    ├── Dashboard.tsx    # Главная страница (навигация)
    ├── TaskBoard.tsx    # Доска с задачами (Kanban)
    ├── TaskCard.tsx     # Карточка одной задачи
    ├── TeamPanel.tsx    # Панель управления командой
    └── ChatPanel.tsx    # Чат в реал-тайм
```

### Backend Structure

```
src/
├── index.ts             # Точка входа, Express setup
├── routes/
│   ├── auth.ts         # POST /register, /login, GET /me
│   ├── teams.ts        # POST /, GET /my, POST /join
│   └── tasks.ts        # CRUD для задач
└── prisma/
    └── schema.prisma   # Описание БД моделей
```

## 🔄 Data Flow

### Authentication Flow
```
1. User Registration
   Frontend → POST /auth/register → Backend
   Backend: Hash password → Create user → Generate JWT
   Response: {token, user}
   Frontend: Save token to localStorage

2. User Login
   Frontend → POST /auth/login → Backend
   Backend: Verify password → Generate JWT
   Response: {token, user}
   Frontend: Save token to localStorage

3. API Requests
   Frontend: Include token in Authorization header
   Backend: Verify JWT → Process request
```

### Team Creation Flow
```
1. User creates team
   Frontend → POST /teams → Backend
   Backend: Create team with unique code → Add user as member
   Response: {teamId, name, code, members}
   Frontend: Update Zustand store

2. User joins team
   Frontend → POST /teams/join {code} → Backend
   Backend: Find team by code → Add user
   Response: {teamId, name, members}
```

### Task Management Flow
```
1. Create task
   Frontend → POST /tasks → Backend
   Backend: Save to DB → Return task
   Frontend: Add to Zustand store

2. Update task status (drag-and-drop)
   Frontend → PATCH /tasks/:id {status} → Backend
   Backend: Update → WebSocket broadcast
   Frontend: Update in real-time

3. Real-time sync
   WebSocket: Broadcast changes to all team members
```

## 🗂️ Database Schema

### Users Table
```sql
id (String, PK)
email (String, UNIQUE)
name (String)
password (String, hashed)
teamId (String, FK)
createdAt (DateTime)
updatedAt (DateTime)
```

### Teams Table
```sql
id (String, PK)
name (String)
code (String, UNIQUE) -- for joining
createdAt (DateTime)
updatedAt (DateTime)
```

### Tasks Table
```sql
id (String, PK)
title (String)
description (String, nullable)
status (String) -- 'todo', 'in-progress', 'done'
teamId (String, FK)
assignedToId (String, FK, nullable)
createdAt (DateTime)
updatedAt (DateTime)
```

### ChatMessages Table
```sql
id (String, PK)
taskId (String, FK)
userId (String, FK)
message (String)
createdAt (DateTime)
```

## 🔐 Authentication & Security

### JWT Token
- **Algorithm**: HS256
- **Expiry**: 7 days
- **Secret**: Set in `.env` (JWT_SECRET)
- **Payload**: `{ id: userId }`

### Password Hashing
- **Library**: bcryptjs
- **Rounds**: 10 (default)
- **Storage**: Never store plain passwords

### CORS
- **Allowed Origins**: http://localhost:5173 (in dev)
- **Methods**: GET, POST, PATCH, DELETE
- **Headers**: Content-Type, Authorization

## 📡 WebSocket Communication

### Connection
```javascript
ws = new WebSocket('ws://localhost:3000/ws?token=JWT_TOKEN')
```

### Message Format
```json
{
  "type": "message",
  "message": {
    "id": "msg_123",
    "taskId": "task_123",
    "userId": "user_123",
    "userName": "John",
    "message": "Task content...",
    "createdAt": "2026-05-14T10:30:00Z"
  }
}
```

### Broadcasting
- Server sends to all connected clients
- All clients receive real-time updates
- UI updates without page refresh

## 🚀 Development Tips

### Frontend

#### Using Zustand Store
```typescript
import { useStore } from '../store'

// In component
const { user, tasks, addTask } = useStore()

// Add task
addTask({
  title: 'New Task',
  description: '...',
  status: 'todo',
  teamId: user.teamId
})
```

#### Making API Calls
```typescript
// With auth
const token = localStorage.getItem('token')
const res = await fetch('/api/tasks', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

#### WebSocket Communication
```typescript
const ws = new WebSocket('ws://localhost:3000/ws?token=...')

ws.send(JSON.stringify({
  type: 'message',
  message: messageObject
}))
```

### Backend

#### Creating Routes
```typescript
import express from 'express'
import { authenticateToken, AuthRequest } from '../index.js'

const router = express.Router()

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.userId // From middleware
  // Process request
  res.json({...})
})

export default router
```

#### Using Prisma
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create
const user = await prisma.user.create({
  data: { email, name, password }
})

// Read
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { team: true }
})

// Update
const user = await prisma.user.update({
  where: { id: userId },
  data: { teamId: newTeamId }
})

// Delete
await prisma.user.delete({
  where: { id: userId }
})
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Register new user
- [ ] Login existing user
- [ ] Create team
- [ ] Get team code
- [ ] Join team with code
- [ ] Create task in team
- [ ] Edit task
- [ ] Delete task
- [ ] Change task status
- [ ] Send chat message
- [ ] Receive real-time chat updates

### Testing WebSocket
```javascript
// In browser console
const ws = new WebSocket('ws://localhost:3000/ws?token=YOUR_TOKEN')
ws.onmessage = (e) => console.log(JSON.parse(e.data))
ws.send(JSON.stringify({type: 'message', message: {...}}))
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution**: 
```bash
npm install
npx prisma generate
```

### Issue: Database connection error
**Solution**: 
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Create database: createdb -U postgres team_management
```

### Issue: JWT token invalid
**Solution**: 
- Token expired? User needs to login again
- Wrong secret? Check JWT_SECRET in .env
- Check token format in Authorization header

### Issue: WebSocket connection fails
**Solution**:
- Backend must be running on port 3000
- Frontend must use correct ws:// URL
- Token must be valid JWT

## 📈 Performance Considerations

### Frontend
- Use `useCallback` for expensive operations
- Memoize large lists with `useMemo`
- Lazy load components with `React.lazy()`

### Backend
- Index frequently queried fields in DB
- Use pagination for large result sets
- Cache team data in memory (optional)
- Limit WebSocket message frequency

### Database
- Add indexes on `teamId`, `userId`
- Use `include` carefully in Prisma (N+1 queries)
- Regular backups in production

## 🔍 Debugging

### Frontend
```javascript
// Check store state
console.log(useStore.getState())

// Check API response
fetch('/api/tasks').then(r => r.json()).then(console.log)

// Check WebSocket
console.log(ws.readyState) // 0=connecting, 1=open, 2=closing, 3=closed
```

### Backend
```typescript
// Check Prisma queries
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
prisma.$on('query', (e) => console.log(e.query))
```

## 📚 Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 🚢 Deployment Checklist

- [ ] Set production JWT_SECRET
- [ ] Configure CORS for production domain
- [ ] Set NODE_ENV=production
- [ ] Set up PostgreSQL backup
- [ ] Enable HTTPS
- [ ] Set up logging
- [ ] Configure rate limiting
- [ ] Set up error monitoring
- [ ] Test all API endpoints
- [ ] Load test WebSocket connections
- [ ] Review security headers
- [ ] Set up CI/CD pipeline

---

Happy coding! 🎉
