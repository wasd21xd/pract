import express from 'express'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import authRoutes from './routes/auth'
import teamRoutes from './routes/teams'
import taskRoutes from './routes/tasks'
import chatRoutes from './routes/chat'
import { authenticateToken } from './middleware'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/teams', authenticateToken, teamRoutes)
app.use('/tasks', authenticateToken, taskRoutes)
app.use('/chat', authenticateToken, chatRoutes)

// WebSocket
wss.on('connection', (ws) => {
  console.log('WebSocket client connected')
  ws.on('message', (data: string) => {
    try {
      const message = JSON.parse(data)
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
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
