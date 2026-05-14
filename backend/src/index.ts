import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import authRoutes from './routes/auth'
import teamRoutes from './routes/teams'
import taskRoutes from './routes/tasks'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware
app.use(cors())
app.use(express.json())

// Auth middleware
export interface AuthRequest extends Request {
  userId?: string
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' })
  }
}

// Routes
app.use('/auth', authRoutes)
app.use('/teams', authenticateToken, teamRoutes)
app.use('/tasks', authenticateToken, taskRoutes)

// WebSocket
wss.on('connection', (ws) => {
  console.log('WebSocket client connected')

  ws.on('message', (data: string) => {
    try {
      const message = JSON.parse(data)
      
      // Broadcast to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === 1) { // OPEN
          client.send(JSON.stringify({
            type: message.type,
            data: message
          }))
        }
      })
    } catch (err) {
      console.error('WebSocket message error:', err)
    }
  })

  ws.on('close', () => {
    console.log('WebSocket client disconnected')
  })

  ws.on('error', (err) => {
    console.error('WebSocket error:', err)
  })
})

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
