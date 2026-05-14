# Team Management App - Project Instructions

## Project Overview
This is a full-stack team management application with real-time collaboration features.

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Zustand
- **Backend**: Node.js, Express, WebSocket
- **Database**: PostgreSQL
- **Authentication**: JWT Tokens

## Project Structure
```
.
├── frontend/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store.ts        # Zustand state management
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── backend/           # Node.js Express backend (to be created)
    ├── src/
    └── package.json
```

## Next Steps
1. Create backend structure with Express
2. Set up PostgreSQL database with Prisma
3. Implement authentication endpoints
4. Create task and team management endpoints
5. Set up WebSocket server for real-time chat
6. Configure environment variables
7. Deploy and test
