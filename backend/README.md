# Team Management App Backend

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file** in backend directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/team_management"
   JWT_SECRET="your-secret-key-change-in-production"
   PORT=3000
   ```

3. **Set up database**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### API Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

#### Teams
- `POST /teams` - Create team
- `GET /teams/my` - Get user's team
- `POST /teams/join` - Join team by code

#### Tasks
- `GET /tasks` - Get all team tasks
- `POST /tasks` - Create new task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### WebSocket
WebSocket server runs on the same port as HTTP server
- Connect to `ws://localhost:3000/ws?token=JWT_TOKEN`
- Message types: `message`, `notification`
